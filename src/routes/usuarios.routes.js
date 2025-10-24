import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controladores/usuariosctrl.js';

const router = Router();

// Ruta para registrar un usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

export default router;
