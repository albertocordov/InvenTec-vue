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

router.get('/api/combo/departments', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT depclave, depdepto FROM departamentos;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});


router.get('/api/combo/jefes', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT jefeid, jefenombre, depclave FROM jefes;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

module.exports = router;

  
  
