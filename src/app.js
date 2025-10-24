import express from 'express'
import cors from 'cors'
//importar las rutas OJO
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js'; // esta linea se agrego 
import pedidosRoutes from './routes/pedidos.routes.js';

const app=express();
app.use(express.json());
const corsOptions={
    origin:'*',
    methods:['GET','POST','PUT','PATCH','DELETE'],
    credetentials: true
}
app.use(cors(corsOptions));

//indicar las rutas a utilizar OJO
app.use('/api',clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', usuariosRoutes); //esta linea tambien se agrego 
app.use('/api', pedidosRoutes);

app.use((req,resp,next)=>{
    resp.status(400).json({
        message:'Endpoint not fount'
    })
})

export default app;
