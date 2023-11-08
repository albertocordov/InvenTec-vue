const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const config = {
  user: 'userinventec',
  password: '12345678',
  server: 'DAVID-D14\\SQLEXPRESS',
  database: 'inventec',
  options: {
    encrypt: false, // Deshabilita SSL/TLS
  },
};

// Llena dataTable de activos en vista inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT 
                    A.ActId,
                    A.ActNombre,
                    A.ActCaracteristicas,
                    J.JefeNombre AS JefeDepartamento,
                    D.DepAlias AS NombreDepartamento
                FROM Activos AS A
                INNER JOIN Areas AS AR ON A.AreaId = AR.AreaId
                INNER JOIN Departamentos AS D ON AR.Depclave = D.Depclave
                LEFT JOIN Jefes AS J ON D.JefeId = J.JefeId;
                ;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Inserta un nuevo activo en la base de datos
app.post('/api/inventory/registra', async (req, res) => {
  const nuevoActivo = req.body;

  console.log('Nuevo activo recibido:', nuevoActivo);

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('ActIdSep', sql.VarChar, nuevoActivo.idSep)
      .input('ActNoInv', sql.VarChar, nuevoActivo.noInv)
      .input('ActNombre', sql.NVarChar, nuevoActivo.nombre)
      .input('ActCaracteristicas', sql.NVarChar, nuevoActivo.caracteristicas)
      .input('ActMarca', sql.NVarChar, nuevoActivo.marca)
      .input('ActModelo', sql.NVarChar, nuevoActivo.modelo)
      .input('ActSerie', sql.NVarChar, nuevoActivo.serie)
      .input('ActValor', sql.Decimal, nuevoActivo.valor)
      .input('ActCabm', sql.NVarChar, nuevoActivo.camb)
      .input('depclave', sql.Int, nuevoActivo.departamento)
      .input('AreaId', sql.Int, nuevoActivo.area)
      .input('ActObser', sql.NVarChar, nuevoActivo.observaciones)
      .query(`
        INSERT INTO Activos (ActIdSep, ActNoInv, ActNombre, ActCaracteristicas, ActMarca, ActModelo, ActSerie,
        ActValor, ActCabm, depclave, AreaId, ActObser)
        VALUES (@ActIdSep, @ActNoInv, @ActNombre, @ActCaracteristicas, @ActMarca, @ActModelo, @ActSerie,
        @ActValor, @ActCabm, @depclave, @AreaId, @ActObser);
      `);

    console.log('Resultado de la inserción:', result);

    res.json(result);
  } catch (error) {
    console.error(error);
    console.error('Error al registrar el activo:', error);
    res.status(500).send(`Error al registrar el activo: ${error.message}`);
  }
});

// Llena dataTable de departamentos en vista departments
app.get('/api/departments', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT
            CAST(D.Depclave AS VARCHAR) AS ID, -- Aquí realizamos la conversión a texto (VARCHAR)
            D.Depdepto AS Departamento,
          COALESCE(J.JefeNombre, 'SIN ENCARGADO') AS NombreEncargado
      FROM Departamentos AS D
      LEFT JOIN Jefes AS J ON D.JefeId = J.JefeId;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Trae los departamentos para el comboBox  
app.get('/api/combo/departments', async (req, res) => {
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

// Trae las áreas para el comboBox  
app.get('/api/combo/areas', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT areaid, areanombre, depclave FROM areas;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});


const port = 3000; // El puerto en el que se ejecutará el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
