<template>
  <div class="cuerpo">
    <!-- Área del perfil -->
    <div class="perfil">
      <div class="usuario">
        <div class="imagen-container">
          <v-img :src="require('@/assets/jorge.jpg')" class="shrink mr-2 iusuario" width="300" height="300" />
        </div>
        <v-divider :thickness="20" class="border-opacity-100"></v-divider>
        <span class="font-weight-medium text-h5">Jorge Luis Rodriguez Romo</span>
        <v-btn @click="abrirDialogEditar" block
          class="v-btn v-btn--elevated v-theme--dark bg-secondary v-btn--density-default v-btn--size-default v-btn--variant-elevated">Editar
          Perfil</v-btn>
      </div>
      <v-dialog v-model="dialogEditar" max-width="600">
        <v-card>
          <v-card-title>
            Editar Perfil
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Usuario" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Contraseña" type="password" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Correo" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialogEditar = false">Cancelar</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="guardarCambios">Guardar Cambios</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- Tabla -->
    <div class="tabla">
      <h2>Últimas Actualizaciones en el Sistema de Inventario</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Departamento</th>
            <th>Artículo</th>
            <th>Descripción del Artículo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2023-11-01</td>
            <td>Industrial</td>
            <td>Producto A</td>
            <td>Actualización de stock</td>
            <td>
              <v-btn block rounded="xl" class="v-btn v-btn--elevated v-theme--dark bg-success v-btn--density-default">Ver Detalle</v-btn>
            </td>
          </tr>
          <tr>
            <td>2023-10-28</td>
            <td>Bioquímica</td>
            <td>Producto B</td>
            <td>Nueva adición</td>
            <td>
              <v-btn block rounded="xl" class="v-btn v-btn--elevated v-theme--dark bg-success v-btn--density-default" >Ver Detalle</v-btn>
            </td>
          </tr>
          <!-- Puedes agregar más filas según tus datos -->
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      dialogEditar: false,
    };
  },
  methods: {
    abrirDialogEditar() {
      this.dialogEditar = true;
    },
    cerrarDialogEditar() {
      // Lógica para guardar los cambios del formulario (si es necesario)
      this.dialogEditar = false;
    },
    verDetalle() {
      // Lógica para ver el detalle (puedes implementar esta función)
    },
  },
};
</script>
  
<style>
.cuerpo {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 110%;
}

.perfil {
  max-width: 400px;
  margin-bottom: 80px;
  /* Margen inferior para dejar espacio antes del pie de la página */
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  /* Añade un efecto de sombra al perfil */
  border-radius: 10px;
  /* Añade esquinas redondeadas */
}

.tabla {
  /* Estilos para el área de la tabla */
  padding: 20px;
  padding-right: 160px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #333;
  color: #fff;
}

th:first-child,
td:first-child {
  /* Estilo para la primera columna (Fecha) */
  min-width: 100px;
}

.usuario {
  max-width: 400px;
  max-height: 400px;
  padding-left: 50px;
}

.imagen-container {
  padding-top: 30px;
  text-align: center;
  /* Centra horizontalmente */
  display: flex;
  align-items: center;
  /* Centra verticalmente */
  justify-content: center;
  /* Centra horizontalmente */
}

.iusuario {
  width: 100%;
  /* Ajusta el ancho al 100% del contenedor */
  max-width: 400px;
  /* Establece un ancho máximo para la imagen */
  border-radius: 100%;
}
</style>
