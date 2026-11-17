import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs';

type Product = { id: number; category_id: number; name: string; description: string; price: number; image_url: string | null; specialty: boolean; available: boolean };
type Service = { id: number; name: string; description: string; image_url: string | null };
type Media = { id: number; page: string; kind: string; file_url: string; alt_text: string | null };
type SiteData = {
  pages: Record<string, Record<string, string>>;
  navigation: { label: string; path: string }[];
  categories: { id: number; name: string }[];
  products: Product[];
  services: Service[];
  media: Media[];
};
type CartItem = { productId: number; quantity: number };
type Order = { id: number; fulfillment: string; total: number; status: string; proof_uploaded_at: string | null; items: { product_name: string; quantity: number; unit_price: number }[] };
type User = { id: number; name: string; role: 'customer' | 'admin' };
type ChatMessage = { sender: 'user' | 'assistant'; text: string; action?: { type: string; productId: number } };

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly api = 'http://localhost:3000/api';
  data: SiteData | null = null;
  page = this.pageFromPath();
  error = '';
  notice = '';
  token = localStorage.getItem('coffeehouse_token') || '';
  user: User | null = null;
  cart: CartItem[] = this.loadCart();
  search = '';
  category = 0;
  specialtyOnly = false;
  maxPrice = 100;
  contact = { name: '', phone: '', message: '' };
  auth = { name: '', email: '', phone: '', identifier: '', password: '' };
  fulfillment: 'pickup' | 'delivery' = 'pickup';
  address = { street: '', number: '', zone: '', reference: '' };
  createdOrder: { id: number; total: number } | null = null;
  orders: Order[] = [];
  chatOpen = false;
  chatInput = '';
  chatBusy = false;
  chatMessages: ChatMessage[] = [{ sender: 'assistant', text: '¡Hola! Pregúntame por el menú, nuestros servicios o tus pedidos.' }];
  videoPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  selectedProduct: Product | null = null;
  selectedService: Service | null = null;
  productForm = { category_id: 1, name: '', description: '', price: 0, image_url: '', specialty: false, available: true };
  serviceForm = { name: '', description: '', image_url: '' };
  private refreshTimer?: number;

  ngOnInit(): void {
    this.loadContent();
    if (this.token) {
      this.http.get<{ user: User }>(`${this.api}/auth/me`, { headers: this.headers() }).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
        next: ({ user }) => this.user = user,
        error: () => this.logout(),
      });
    }
    window.addEventListener('popstate', this.onPopState);
    this.refreshTimer = window.setInterval(() => {
      if (this.user?.role === 'customer' && ['orders', 'confirmation'].includes(this.page)) this.loadOrders();
    }, 5000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.onPopState);
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  private onPopState = () => { this.page = this.pageFromPath(); this.loadPageData(); };

  private pageFromPath(): string {
    return window.location.pathname.slice(1) || 'inicio';
  }

  go(event: Event | null, path: string): void {
    event?.preventDefault();
    window.history.pushState({}, '', path);
    this.page = this.pageFromPath();
    this.error = '';
    this.notice = '';
    this.loadPageData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadPageData(): void {
    if (['orders', 'confirmation'].includes(this.page) && this.user?.role === 'customer') this.loadOrders();
  }

  loadContent(): void {
    this.error = '';
    this.http.get<SiteData>(`${this.api}/content`).pipe(timeout(8000), finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: (data) => { this.data = data; this.error = ''; },
      error: () => this.error = 'No se pudo cargar el contenido. Comprueba que la API y MySQL estén iniciados.',
    });
  }

  text(key: string, page = this.page): string {
    return this.data?.pages[page]?.[key] || '';
  }

  media(kind: string, page = this.page): Media | undefined {
    return this.data?.media.find((item) => item.page === page && item.kind === kind);
  }

  gallery(): Media[] {
    return this.data?.media.filter((item) => item.page === 'nosotros' && item.kind === 'gallery') || [];
  }

  products(): Product[] {
    const search = this.search.trim().toLocaleLowerCase('es');
    return (this.data?.products || []).filter((product) =>
      product.available && (!this.category || product.category_id === this.category) &&
      (!this.specialtyOnly || product.specialty) && product.price <= this.maxPrice &&
      (!search || `${product.name} ${product.description}`.toLocaleLowerCase('es').includes(search))
    );
  }

  specialties(): Product[] {
    return (this.data?.products || []).filter((product) => product.specialty && product.available);
  }

  categoryName(id: number): string {
    return this.data?.categories.find((category) => category.id === id)?.name || '';
  }

  private loadCart(): CartItem[] {
    try {
      const items = JSON.parse(localStorage.getItem('coffeehouse_cart') || '[]');
      return Array.isArray(items) ? items : [];
    } catch { return []; }
  }

  private saveCart(): void {
    localStorage.setItem('coffeehouse_cart', JSON.stringify(this.cart));
  }

  addToCart(product: Product): void {
    const item = this.cart.find((entry) => entry.productId === product.id);
    if (item) item.quantity++;
    else this.cart.push({ productId: product.id, quantity: 1 });
    this.saveCart();
    this.notice = `${product.name} agregado al carrito.`;
  }

  changeQuantity(productId: number, amount: number): void {
    const item = this.cart.find((entry) => entry.productId === productId);
    if (!item) return;
    item.quantity += amount;
    this.cart = this.cart.filter((entry) => entry.quantity > 0);
    this.saveCart();
  }

  cartDetails(): { product: Product; quantity: number }[] {
    return this.cart.flatMap((item) => {
      const product = this.data?.products.find((entry) => entry.id === item.productId && entry.available);
      return product ? [{ product, quantity: item.quantity }] : [];
    });
  }

  cartTotal(): number {
    return this.cartDetails().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  }

  submitContact(): void {
    this.http.post(`${this.api}/contact`, this.contact).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: () => { this.notice = 'Tu mensaje se guardó correctamente.'; this.contact = { name: '', phone: '', message: '' }; },
      error: (error) => this.error = error.error?.error || 'No se pudo enviar el mensaje.',
    });
  }

  submitAuth(): void {
    const endpoint = this.page === 'register' ? 'register' : 'login';
    this.http.post<{ token: string; user: User }>(`${this.api}/auth/${endpoint}`, this.auth).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: ({ token, user }) => {
        this.token = token;
        this.user = user;
        localStorage.setItem('coffeehouse_token', token);
        this.auth.password = '';
        this.go(null, user.role === 'admin' ? '/admin' : '/productos');
      },
      error: (error) => this.error = error.error?.error || 'No se pudo iniciar sesión.',
    });
  }

  logout(): void {
    this.token = '';
    this.user = null;
    localStorage.removeItem('coffeehouse_token');
    this.go(null, '/');
  }

  checkout(): void {
    if (!this.user || this.user.role !== 'customer') return this.go(null, '/login');
    if (!this.cartDetails().length) return;
    const body = {
      fulfillment: this.fulfillment,
      address: this.address,
      items: this.cartDetails().map(({ product, quantity }) => ({ productId: product.id, quantity })),
    };
    this.http.post<{ id: number; total: number }>(`${this.api}/orders`, body, { headers: this.headers() }).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: (order) => {
        this.createdOrder = order;
        this.cart = [];
        this.saveCart();
        this.loadOrders();
        this.go(null, '/confirmation');
      },
      error: (error) => this.error = error.error?.error || 'No se pudo crear el pedido.',
    });
  }

  loadOrders(): void {
    if (this.user?.role !== 'customer') return;
    this.http.get<Order[]>(`${this.api}/orders`, { headers: this.headers() }).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: (orders) => this.orders = orders,
    });
  }

  proofSelected(event: Event, orderId: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('proof', file);
    this.http.post(`${this.api}/orders/${orderId}/proof`, body, { headers: this.headers() }).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: () => { this.notice = 'Comprobante recibido. Pago confirmado en esta demo.'; this.loadOrders(); },
      error: (error) => this.error = error.error?.error || 'No se pudo subir el comprobante.',
    });
  }

  sendChat(): void {
    const message = this.chatInput.trim();
    if (!message || this.chatBusy) return;
    this.chatMessages.push({ sender: 'user', text: message });
    this.chatInput = '';
    this.chatBusy = true;
    this.http.post<{ reply: string; action?: { type: string; productId: number } }>(
      `${this.api}/chat`, { message, history: this.chatMessages.slice(0, -1).slice(-10) }, { headers: this.headers() }).pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
        next: (result) => {
          this.chatMessages.push({ sender: 'assistant', text: result.reply, action: result.action });
          this.chatBusy = false;
        },
        error: (error) => {
          this.chatMessages.push({ sender: 'assistant', text: error.error?.error || 'El chat no está disponible.' });
          this.chatBusy = false;
        },
      });
  }

  confirmChatAdd(message: ChatMessage): void {
    const product = this.data?.products.find((item) => item.id === message.action?.productId);
    if (product) this.addToCart(product);
    message.action = undefined;
  }

  toggleVideo(video: HTMLVideoElement): void {
    if (video.paused) video.play();
    else video.pause();
    this.videoPaused = video.paused;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.productForm = {
      category_id: product.category_id, name: product.name, description: product.description,
      price: product.price, image_url: product.image_url || '', specialty: product.specialty, available: product.available,
    };
  }

  saveProduct(): void {
    const url = this.selectedProduct ? `${this.api}/admin/products/${this.selectedProduct.id}` : `${this.api}/admin/products`;
    const request = this.selectedProduct
      ? this.http.put(url, this.productForm, { headers: this.headers() })
      : this.http.post(url, this.productForm, { headers: this.headers() });
    request.pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: () => { this.notice = 'Producto guardado.'; this.selectedProduct = null; this.loadContent(); },
      error: (error) => this.error = error.error?.error || 'No se pudo guardar el producto.',
    });
  }

  editService(service: Service): void {
    this.selectedService = service;
    this.serviceForm = { name: service.name, description: service.description, image_url: service.image_url || '' };
  }

  saveService(): void {
    const url = this.selectedService ? `${this.api}/admin/services/${this.selectedService.id}` : `${this.api}/admin/services`;
    const request = this.selectedService
      ? this.http.put(url, this.serviceForm, { headers: this.headers() })
      : this.http.post(url, this.serviceForm, { headers: this.headers() });
    request.pipe(finalize(() => this.changeDetector.markForCheck())).subscribe({
      next: () => { this.notice = 'Servicio guardado.'; this.selectedService = null; this.loadContent(); },
      error: (error) => this.error = error.error?.error || 'No se pudo guardar el servicio.',
    });
  }
}
