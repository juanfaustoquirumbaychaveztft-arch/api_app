import {Router} from 'express'
//importar las funciones
import { prueba,getClientes,getClientesxId, postCliente, putCliente, deleteCliente , getClienteByIdentificacion} from '../controladores/clientesctrl.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// Rutas públicas
//armar nuestras rutas
//router.get('/clientes',prueba)
router.get('/clientes',getClientes)
router.get('/clientes/:id',getClientesxId)

// Rutas protegidas
router.post('/clientes', verificarToken, postCliente);
router.put('/clientes/:id', verificarToken, putCliente);
router.delete('/clientes/:id', verificarToken, deleteCliente);


router.get('/identificacion/:id', getClienteByIdentificacion);

export default router;