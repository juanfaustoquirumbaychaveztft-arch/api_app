import app from './app.js'
import { PORT } from './config.js'

// Usa el puerto dinámico que da Railway o el definido localmente
const port = process.env.PORT || PORT || 3000;

// Inicia el servidor
app.listen(port, () => {
  console.log(`✅ El servidor está escuchando por el puerto: ${port}`);
});
