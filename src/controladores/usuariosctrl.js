import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SECRET_KEY } from '../config.js';

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

    // Encriptar la clave antes de guardarla
    const hashPassword = await bcrypt.hash(usr_clave, 10);

    await conmysql.query(
      'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)',
      [usr_usuario, hashPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
    );

    res.json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Login de usuario

export const loginUsuario = async (req, res) => {
  try {
    const { usr_usuario, usr_clave } = req.body;

    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_activo = 1',
      [usr_usuario]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado o inactivo' });

    const usuario = rows[0];

    const coincide = await bcrypt.compare(usr_clave, usuario.usr_clave);

    if (!coincide)
      return res.status(401).json({ message: 'Contraseña incorrecta' });

     // Crear token con 1 hora de duración
    const token = jwt.sign(
      {
        id: usuario.usr_id,
        usuario: usuario.usr_usuario,
        nombre: usuario.usr_nombre
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
