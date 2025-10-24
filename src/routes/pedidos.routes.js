import { Router } from 'express';
import { getPedidos, getPedidoById, postPedido, putPedido, deletePedido } from '../controladores/pedidosctrl.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// Rutas públicas (solo lectura)
router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoById);

// Rutas protegidas (requieren login)
router.post('/pedidos', verificarToken, postPedido);
router.put('/pedidos/:id', verificarToken, putPedido);
router.delete('/pedidos/:id', verificarToken, deletePedido);

export default router;
