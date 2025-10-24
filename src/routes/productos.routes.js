import {Router} from 'express'
import upload from '../middlewares/upload.js'
//importar las funciones
import { prueba,getProductos,getProductosxId, postProducto, putProducto, deleteProducto } from '../controladores/productosctrl.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();
//armar nuestras rutas
// Rutas públicas
router.get('/productos',getProductos)
router.get('/productos/:id',getProductosxId)

// Rutas protegidas
//router.post('/productos', verificarToken, postProducto)
router.post('/productos',upload.single('imagen'), verificarToken, postProducto)
router.put('/productos/:id',upload.single('imagen'), verificarToken, putProducto)
router.delete('/productos/:id', verificarToken, deleteProducto)


export default router;