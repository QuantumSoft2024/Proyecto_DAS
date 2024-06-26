const connection = require('../db/connection');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const selectQuery = `
      SELECT u.*, r.nombre AS nombre_rol
      FROM usuarios u
      INNER JOIN roles r ON u.id_rol_per = r.id_rol
    `;
    connection.query(selectQuery, (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      res.status(200).json({ usuarios: results });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.getUserByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;

    let selectQuery;
    let queryParams;

    if (cedula) {
      const searchTerm = `%${cedula}%`;
      selectQuery = `SELECT * FROM usuarios WHERE cedula LIKE ?`;
      queryParams = [searchTerm];
    } else {
      selectQuery = `SELECT * FROM usuarios`;
      queryParams = [];
    }

    connection.query(selectQuery, queryParams, (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      res.status(200).json({ usuarios: results });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { cedula, nombre, apellido, telefono, correo, contrasena, rol, estado } = req.body;

    const emailExistsQuery = `SELECT * FROM usuarios WHERE correo = ?`;
    connection.query(emailExistsQuery, [correo], (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ mensaje: 'El correo ya está en uso' });
      }

      bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        const insertQuery = `INSERT INTO usuarios (cedula, nombre, apellido, correo, telefono, contrasena, id_rol_per) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery, [cedula, nombre, apellido, correo, telefono, hash, rol, estado], (error, results) => {
          if (error) {
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
          }

          res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { cedula, nombre, apellido, telefono, correo, contrasena, rol } = req.body;

    const emailExistsQuery = `SELECT * FROM usuarios WHERE correo = ? AND id_usuario != ?`;
    connection.query(emailExistsQuery, [correo, id], (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ mensaje: 'El correo ya está en uso por otro usuario' });
      }

      const updateQuery = `UPDATE usuarios SET cedula = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, id_rol_per = ? WHERE id_usuario = ?`;
      connection.query(updateQuery, [cedula, nombre, apellido, correo, telefono, rol, id], (error, results) => {
        if (error) {
          return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }

        res.status(200).json({ mensaje: 'Información de usuario actualizada exitosamente' });
      });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { contrasena } = req.body;

    if (!contrasena) {
      return res.status(400).json({ mensaje: 'La contraseña es requerida' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const updateQuery = `UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?`;
    connection.query(updateQuery, [hashedPassword, id], (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteQuery = `DELETE FROM usuarios WHERE id_usuario = ?`;

    connection.query(deleteQuery, [userId], (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

exports.authenticateUser = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    const query = `SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?`;
    connection.query(query, [usuario, contrasena], (error, results) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const existingUser = results[0];
      if (existingUser.contrasena !== contrasena) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }
      
      res.status(200).json({ id: existingUser.id, usuario: existingUser.correo, contrasena: existingUser.contrasena });
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};