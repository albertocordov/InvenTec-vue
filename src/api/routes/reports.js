const express = require('express');
const router = express.Router();
const sql = require('mssql');
const cors = require('cors');

const config = {
    user: 'userinventec',
    password: '12345678',
    server: 'DAVID-D14\\SQLEXPRESS',
    database: 'inventec',
    options: {
        encrypt: false, // Deshabilita SSL/TLS
    },
};

// Activos por departamento
router.get('/api/reportes/activosPorDepto/:depclave', async (req, res) => {
    const {
        depclave
    } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('depclave', sql.Int, depclave)
            .query(`
          SELECT 
            a.ActId, 
            a.ActCaracteristicas, 
            a.ActMarca, 
            a.ActModelo, 
            a.ActValor, 
            a.ActCabm, 
            a.ActNombre, 
            d.depdepto, 
            j.jefenombre,
            b.areanombre,
            CONVERT(DATE, a.ActFechaAlta) AS FechaAlta
          FROM 
            Activos a
            JOIN Departamentos d ON a.depclave = d.depclave
            JOIN Areas b ON a.areaid = b.areaid
            JOIN jefes j ON d.jefeid = j.jefeid
          WHERE 
            a.depclave = @depclave
          ORDER BY 
            b.areanombre;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

// Total de activos por departamento
router.get('/api/reportes/totalActivosPorDepto', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .query(`
          SELECT 
            d.depdepto, 
            COUNT(*) as activos
          FROM 
            activos a
            JOIN Departamentos d ON a.depclave = d.depclave
          GROUP BY 
            d.depdepto
          ORDER BY 
            activos DESC;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

// Inventario por departamento y fecha
router.get('/api/inventoryByDepartmentAndDate/:depclave/:selectedDate', async (req, res) => {
    const {
        depclave,
        selectedDate
    } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('depclave', sql.Int, depclave)
            .input('selectedDate', sql.VarChar, selectedDate) // Ajusta el tipo de dato según el tipo real de la columna EscFecha
            .query(`
          SELECT 
            d.areanombre, 
            COUNT(DISTINCT a.actid) AS activos, 
            COUNT(DISTINCT e.actid) AS escaneado
          FROM 
            areas d
            LEFT JOIN activos a ON a.areaid = d.areaid
            LEFT JOIN Escaneo e ON a.actid = e.actid
          WHERE 
            a.depclave = @depclave
            AND CONVERT(DATE, e.EscFecha) = @selectedDate
          GROUP BY 
            d.areanombre;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

// Nueva consulta: Impresiones por departamento
router.get('/api/reportes/impresionesPorDepto/:depclave', async (req, res) => {
    const {
        depclave
    } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('depclave', sql.Int, depclave)
            .query(`
          SELECT 
            a.ActId, 
            a.ActNombre,
            a.ActCaracteristicas, 
            d.depdepto, 
            b.areanombre,
            COUNT(i.ActId) AS CantidadImpresiones
          FROM 
            Activos a
            JOIN Departamentos d ON a.depclave = d.depclave
            JOIN Areas b ON a.areaid = b.areaid
            LEFT JOIN Impresiones i ON i.ActId = a.ActId
          WHERE 
            a.depclave = @depclave
          GROUP BY 
            a.ActId, 
            a.ActNombre,
            a.ActCaracteristicas, 
            d.depdepto, 
            b.areanombre
          ORDER BY
            b.areanombre,
            CantidadImpresiones DESC;
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error en el servidor: ${error.message}`);
    }
});

module.exports = router;