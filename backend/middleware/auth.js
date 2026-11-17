import jwt from 'jsonwebtoken';

function tokenFrom(request) {
  const header = request.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

export function optionalUser(request, _response, next) {
  try {
    const token = tokenFrom(request);
    request.user = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
  } catch {
    request.user = null;
  }
  next();
}

export function requireUser(request, response, next) {
  if (!request.user || request.user.role !== 'customer') {
    return response.status(401).json({ error: 'Inicia sesión como cliente.' });
  }
  next();
}

export function requireAdmin(request, response, next) {
  if (!request.user || request.user.role !== 'admin') {
    return response.status(403).json({ error: 'Acceso de administración requerido.' });
  }
  next();
}
