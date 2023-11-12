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

// Consulta datos de un activo por su ActId
app.get('/api/inventory/:ActId', async (req, res) => {
  const {
    ActId
  } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('ActId', sql.Int, ActId)
      .query(`
        SELECT 
            ActIdSep,
            ActNoInv,
            ActNombre,
            ActCaracteristicas,
            ActMarca,
            ActModelo,
            ActSerie,
            ActValor,
            ActCabm,
            depclave,
            AreaId,
            ActObser
        FROM Activos
        WHERE ActId = @ActId;
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Actualiza el activo seleccionado
app.put('/api/inventory/actualizar/:ActId', async (req, res) => {
  const {
    ActId
  } = req.params;
  const nuevoActivo = req.body;

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
      .input('ActId', sql.Int, ActId)
      .query(`
        UPDATE Activos
        SET
          ActIdSep = @ActIdSep,
          ActNoInv = @ActNoInv,
          ActNombre = @ActNombre,
          ActCaracteristicas = @ActCaracteristicas,
          ActMarca = @ActMarca,
          ActModelo = @ActModelo,
          ActSerie = @ActSerie,
          ActValor = @ActValor,
          ActCabm = @ActCabm,
          depclave = @depclave,
          AreaId = @AreaId,
          ActObser = @ActObser
        WHERE ActId = @ActId;
      `);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al actualizar el activo: ${error.message}`);
  }
});

// Elimina activos por su ActId
app.delete('/api/inventory/eliminar/:ActId', async (req, res) => {
  const {
    ActId
  } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('ActId', sql.Int, ActId)
      .query('DELETE FROM Activos WHERE ActId = @ActId');

    console.log(`Activo eliminado con éxito. ActId: ${ActId}`);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al eliminar el activo: ${error.message}`);
  }
});

// Departments --------------------------------------------------------------------
// Llena dataTable de departamentos en vista departments
app.get('/api/departments', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT
            CAST(D.Depclave AS VARCHAR) AS ID,
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

// Consulta datos de un departamento por depclave
app.get('/api/departments/:depClave', async (req, res) => {
  const {
    depClave
  } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('depClave', sql.Int, depClave)
      .query(`
      SELECT
            CAST(D.Depclave AS VARCHAR) AS Depclave,
            D.Depdepto,
            D.Depalias,
          COALESCE(J.JefeNombre, 'SIN ENCARGADO') AS nombreEncargado
      FROM Departamentos AS D
      LEFT JOIN Jefes AS J ON D.JefeId = J.JefeId
      WHERE D.Depclave = @depclave;
      `);

      console.log('Resultado de la consulta:', result);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Consulta datos de un jefe por su jefeid
app.get('/api/jefes/:jefeid', async (req, res) => {
  const {
    jefeid
  } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jefeid', sql.Int, jefeid)
      .query(`
      SELECT 
        J.jefeid,
        J.jefenombre,
        J.jefetipo,
        D.Depdepto AS departamento,
        D.depclave
      FROM jefes J
      JOIN departamentos D ON J.depclave = D.depclave
      WHERE J.jefeid = @jefeid;
      `);
      console.log('Resultado de la consulta:', result);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Consulta datos de un área por areaid
app.get('/api/areas/:areaid', async (req, res) => {
  const {
    areaid
  } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('areaid', sql.Int, areaid)
      .query(`
      SELECT 
        A.areaid,
        A.areanombre,
        J.jefenombre,
        D.depdepto,
        D.depclave
      FROM areas A
      JOIN jefes J ON A.jefeid = J.jefeid
      JOIN departamentos D ON A.depclave = D.depclave
      WHERE areaid = @areaid;
      `);

      console.log('Resultado de la consulta:', result);

    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

// Usuarios --------------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT UsrId, UsrNombre, UsrCorreo, UsrTipo FROM usuarios;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

app.put('/api/users/actualizaTipoUsuario/:userId', async (req, res) => {
  const userId = req.params.userId;
  const nuevoTipo = req.body.UsrTipo;

  try {
    await sql.connect(config);

    const result = await sql.query`
      UPDATE usuarios
      SET UsrTipo = ${nuevoTipo}
      WHERE UsrId = ${userId};
    `;

    await sql.close();

    res.status(200).json({ success: true, message: 'Tipo de usuario actualizado en SQL Server.' });
  } catch (error) {
    console.error('Error al actualizar el tipo de usuario en SQL Server:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el tipo de usuario en SQL Server.' });
  }
});

app.delete('/api/users/eliminarUsuario/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const pool = await sql.connect(config);
      const result = await pool
          .request()
          .input('UserId', sql.Int, userId)
          .query('DELETE FROM usuarios WHERE UsrId = @UserId');

      res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
      console.error('Error al eliminar el usuario en SQL Server:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el usuario en SQL Server.' });
  }
});



app.post('/api/users/registraUsuario', async (req, res) => {
  const nuevoUsuario = req.body;

  console.log('Nuevo usuario recibido:', nuevoUsuario);

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('nombre', sql.NVarChar, nuevoUsuario.nombre)
      .input('email', sql.VarChar, nuevoUsuario.email)
      .input('esAdmin', sql.Int, nuevoUsuario.esAdmin ? 1 : 0)
      .query(`
        INSERT INTO usuarios (UsrNombre, UsrCorreo, UsrTipo)
        VALUES (@nombre, @email, @esAdmin);
      `);

    console.log('Resultado de la inserción:', result);

    res.status(200).json({ success: true, message: 'Usuario guardado en SQL Server.' });
  } catch (error) {
    console.error('Error al guardar el usuario en SQL Server:', error);
    res.status(500).json({ success: false, message: 'Error al guardar el usuario en SQL Server.' });
  }
});

// Combos --------------------------------------------------------------------
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

app.get('/api/combo/jefes', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`SELECT jefeid, jefenombre FROM jefes;`);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

app.get('/api/jefes', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`
      SELECT 
      CAST(J.jefeid AS VARCHAR) as jefeid,
        J.jefenombre,
        CASE 
          WHEN J.jefetipo = 1 THEN 'Jefe departamento'
          ELSE 'Jefe área'
        END AS jefetipo_desc,
        D.Depdepto AS departamento
      FROM jefes J
      JOIN departamentos D ON J.depclave = D.depclave;
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error en el servidor: ${error.message}`);
  }
});

app.get('/api/areas', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`
        SELECT 
          A.areaid,
          A.areanombre,
          J.jefenombre,
          D.depdepto
        FROM areas A
        JOIN jefes J ON A.jefeid = J.jefeid
        JOIN departamentos D ON A.depclave = D.depclave;
      `);
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