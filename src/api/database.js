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

const port = 3000; // El puerto en el que se ejecutará el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
