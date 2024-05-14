const connection = require('../db/connection');

const getComponentes = (req, res) => {
    try {
        const sql = 'SELECT * FROM Componentes';
        connection.query(sql, (err, data) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            } else {
                res.json(data);
            }
        });
    } catch (error) {
        console.error('Error en la función getComponentes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const createComponente = (req, res) => {
    const { nombre, marca, modelo, num_serie, codigoUTA, id_bien_per, id_proveedor_per } = req.body;
    try {
        const sql = 'INSERT INTO Componentes (nombre, marca, modelo, num_serie, codigoUTA, id_bien_per, id_proveedor_per) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [nombre, marca, modelo, num_serie, codigoUTA, id_bien_per, id_proveedor_per], (err, data) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            } else {
                res.json({ message: 'Componente creado exitosamente', id: data.insertId });
            }
        });
    } catch (error) {
        console.error('Error en la función createComponente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const getComponenteById = (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM Componentes WHERE id_componente = ?';
        connection.query(sql, [id], (err, data) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            } else {
                if (data.length === 0) {
                    res.status(404).json({ error: 'Componente no encontrado' });
                } else {
                    res.json(data[0]);
                }
            }
        });
    } catch (error) {
        console.error('Error en la función getComponenteById:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const updateComponente = (req, res) => {
    const { id } = req.params;
    const { nombre, marca, modelo, num_serie, codigoUTA, id_bien_per, id_proveedor_per } = req.body;
    try {
        const sql = 'UPDATE Componentes SET nombre = ?, marca = ?, modelo = ?, num_serie = ?, codigoUTA = ?, id_bien_per = ?, id_proveedor_per = ? WHERE id_componente = ?';
        connection.query(sql, [nombre, marca, modelo, num_serie, codigoUTA, id_bien_per, id_proveedor_per, id], (err, data) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            } else {
                res.json({ message: 'Componente actualizado exitosamente' });
            }
        });
    } catch (error) {
        console.error('Error en la función updateComponente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const deleteComponente = (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM Componentes WHERE id_componente = ?';
        connection.query(sql, [id], (err, data) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            } else {
                if (data.affectedRows === 0) {
                    res.status(404).json({ error: 'Componente no encontrado' });
                } else {
                    res.json({ message: 'Componente eliminado exitosamente' });
                }
            }
        });
    } catch (error) {
        console.error('Error en la función deleteComponente:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {
    getComponentes,
    createComponente,
    getComponenteById,
    updateComponente,
    deleteComponente
};
