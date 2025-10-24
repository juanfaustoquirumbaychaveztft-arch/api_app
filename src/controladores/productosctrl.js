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
export const postProducto=async(req,res)=>{
    try {
        const {prod_codigo,prod_nombre,prod_stock,prod_precio,prod_activo}=req.body;
        const prod_imagen=req.file?`/uploads/${req.file.filename}`:null;
        //console.log(req.body)
        const [result]= await conmysql.query(
        'insert into productos(prod_codigo,prod_nombre,prod_stock,prod_precio,prod_activo,prod_imagen) values(?,?,?,?,?,?)',
        [prod_codigo,prod_nombre,prod_stock,prod_precio,prod_activo,prod_imagen]
        )
        res.send({prod_id:result.insertId}) 
    } catch (error) {
        return res.status(500).json({message:"ERROR EN EL SERVER !!!!"})
    }
}

//funcion para modificar 
export const putProducto=async(req,res)=>{
    try {
        const{id}=req.params
        const {prod_codigo,prod_nombre,prod_stock,prod_precio,prod_activo}=req.body;
        let prod_imagen=req.file?`/uploads/${req.file.filename}`:null;
        //console.log(req.body)
        if  (!req.file){
            const[rows]= await conmysql.query(
                'SELECT prod_imagen FROM productos WHERE prod_id = ?',
                [id]
            );
            //Si el producto existe,conservar su imagen actual
            if(rows && rows.length > 0){
                prod_imagen = rows[0].prod_imagen;
            }else{
                return res.status(404).json({message: 'PRODUCTO NO ENCONTRADO'})
            }
        }
        const [result]= await conmysql.query(
            'update productos set prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? where prod_id=?',
            [prod_codigo,prod_nombre,prod_stock,prod_precio,prod_activo,prod_imagen,id]
        )
        if(result.affectedRows<=0)return res.status(404).json({
            message: "AHHHH PRODUCTO NO ENCONTRADO!!!!!!"
        })
        
        const [fila]=await conmysql.query(' select * from productos where prod_id=?',[id])
        res.json(fila[0])

    } catch (error) {
        return res.status(500).json({message:"ERROR EN EL SERVER !!!!"})
    }
}

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