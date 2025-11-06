import {conmysql} from '../db.js'

export const prueba=(req,res)=>{
    res.send(' PRUEBA CON ÉXITO!!!');
}

export const getProductos=async(req,res)=>{
    try{
        const [result]=await conmysql.query(' select * from productos')
        res.json({
            cant:result.length,
            data:result
        })
    }catch(error){
        return res.status(500).json({message:"error en el servidor"})
    }
}

export const getProductosxId=async(req,res)=>{
    try{
        const [result]=await conmysql.query(' select * from productos where prod_id=?',[req.params.id])
        if(result.length<=0)return res.json({
            cant:0,
            message: "AHHHH PRODUCTO NO ENCONTRADO!!!!!!"
        })
        res.json({
            cant:result.length,
            data:result[0]
        })
    }catch(error){
        return res.status(500).json({message:"error en el serVidor"})
    }
}

//funcion para insertar 
export const postProducto = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
    const prod_activo = req.body.prod_activo === 'true' || req.body.prod_activo === '1' ? 1 : 0;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, imagen]
    );

    res.json({ prod_id: result.insertId, mensaje: 'Producto agregado', prod_imagen: imagen });
  } catch (error) {
    console.error('Error en postProducto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error });
  }
};

//funcion para modificar 
export const putProducto = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio } = req.body;
    const prod_activo = req.body.prod_activo === 'true' || req.body.prod_activo === '1' ? 1 : 0;
    let imagen = req.body.prod_imagen;
    if (req.file) {
      imagen = `/uploads/${req.file.filename}`;
    }

    await conmysql.query(
      'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, imagen, req.params.id]
    );

    res.json({ mensaje: 'Producto actualizado correctamente', prod_imagen: imagen });
  } catch (error) {
    console.error('Error en putProducto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error });
  }
};

//funcion para eliminar
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query(
      'DELETE FROM productos WHERE prod_id = ?',
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    // Respuesta exitosa NO OLVIDAR
    res.json({
      message: "Producto eliminado correctamente",
      prod_id: id
    });

  } catch (error) {
    return res.status(500).json({ message: "ERROR EN EL SERVER !!!!" });
  }
};