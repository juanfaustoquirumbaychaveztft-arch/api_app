import { conmysql } from '../db.js';

// 🧩 Obtener todos los pedidos con datos del cliente y usuario
export const getPedidos = async (req, res) => {
  try {
    const [result] = await conmysql.query(`
      SELECT p.ped_id, p.ped_fecha, p.ped_estado, 
             c.cli_nombre AS cliente, 
             u.usr_nombre AS usuario
      FROM pedidos p
      INNER JOIN clientes c ON p.cli_id = c.cli_id
      INNER JOIN usuarios u ON p.usr_id = u.usr_id
      ORDER BY p.ped_fecha DESC
    `);
    res.json({ cant: result.length, data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🧩 Obtener pedido por ID con sus detalles
export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [pedido] = await conmysql.query(
      `SELECT * FROM pedidos WHERE ped_id = ?`,
      [id]
    );
    if (pedido.length === 0)
      return res.status(404).json({ message: 'Pedido no encontrado' });

    const [detalles] = await conmysql.query(
      `SELECT d.det_id, d.prod_id, p.prod_nombre, d.det_cantidad, d.det_precio
       FROM pedidos_detalle d
       INNER JOIN productos p ON d.prod_id = p.prod_id
       WHERE d.ped_id = ?`,
      [id]
    );

    res.json({
      pedido: pedido[0],
      detalles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🧩 Insertar nuevo pedido con sus detalles
export const postPedido = async (req, res) => {
  const connection = await conmysql.getConnection();
  try {
    const { cli_id, usr_id, ped_estado, detalles } = req.body; 
    // detalles es un array [{prod_id, det_cantidad, det_precio}, ...]

    await connection.beginTransaction();

    const [pedidoResult] = await connection.query(
      'INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, NOW(), ?, ?)',
      [cli_id, usr_id, ped_estado]
    );

    const ped_id = pedidoResult.insertId;

    // Insertar los detalles
    for (const item of detalles) {
      const [prod] = await connection.query(
        'SELECT prod_stock, prod_nombre FROM productos WHERE prod_id = ?',
        [item.prod_id]
      );

      if (prod.length === 0) {
        throw new Error(`Producto con ID ${item.prod_id} no existe`);
      }

      const stockActual = prod[0].prod_stock;

      // ❌ Si no hay stock suficiente, cancelar
      if (stockActual < item.det_cantidad) {
        throw new Error(
          `Stock insuficiente para "${prod[0].prod_nombre}". Disponible: ${stockActual}, solicitado: ${item.det_cantidad}`
        );
      }


      await connection.query(
        `INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio)
         VALUES (?, ?, ?, ?)`,
        [item.prod_id, ped_id, item.det_cantidad, item.det_precio]
      );

      // (Opcional) Restar stock
      await connection.query(
        `UPDATE productos SET prod_stock = prod_stock - ? WHERE prod_id = ?`,
        [item.det_cantidad, item.prod_id]
      );
    }

    await connection.commit();

    res.json({ message: 'Pedido registrado con éxito', ped_id });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar el pedido' });
  } finally {
    connection.release();
  }
};

// 🧩 Actualizar el estado del pedido
export const putPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { ped_estado } = req.body;

    const [result] = await conmysql.query(
      `UPDATE pedidos SET ped_estado = ? WHERE ped_id = ?`,
      [ped_estado, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Pedido no encontrado' });

    res.json({ message: 'Pedido actualizado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🧩 Eliminar un pedido (y sus detalles)
export const deletePedido = async (req, res) => {
  const connection = await conmysql.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    await connection.query('DELETE FROM pedidos_detalle WHERE ped_id = ?', [id]);
    const [result] = await connection.query('DELETE FROM pedidos WHERE ped_id = ?', [id]);

    if (result.affectedRows <= 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    await connection.commit();
    res.json({ message: 'Pedido eliminado correctamente', ped_id: id });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    connection.release();
  }
};
