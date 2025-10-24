import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const verificarToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header)
    return res.status(403).json({ message: 'Token no proporcionado' });

  const token = header.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded; // Guarda los datos del usuario logueado
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
