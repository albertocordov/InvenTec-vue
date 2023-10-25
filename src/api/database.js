const sql = require('mssql'); 

const config = {
  server: 'DAVID-D14\SQLEXPRESS',
  database: 'inventec',
  options: {
    trustedConnection: true, // Habilita Windows Authentication
  },
};

async function conectarBaseDeDatos() {
  try {
    await sql.connect(config);
    console.log('Conexión a la base de datos establecida.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

async function obtenerUsuarios() {
  try {
    const result = await sql.query('SELECT id, nombre, correo, tipo_usuario FROM usuarios');
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

module.exports = {
  conectarBaseDeDatos,
  obtenerUsuarios,
};
