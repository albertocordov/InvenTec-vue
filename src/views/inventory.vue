<template>
  <div class="entrar">
    <div class="container mt-2">
      <h1 class="text-center">Inventario de activo fijo</h1>
      <v-dialog v-model="mostrarFormulario" max-width="500">

        <!-- Botón para mostrar el formulario de registro de un nuevo activo -->
        <template v-slot:activator="{ on }">
          <v-btn @click="registraActivo" class="mb-3 green" dark>
            <v-icon>mdi-plus</v-icon> Agregar activo
          </v-btn>
        </template>

        <!-- Modal para agregar/editar un activo -->
        <v-card>
          <v-card-title>
            {{ edicionActiva ? 'Editar activo' : 'Registrar activo' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="nuevoUsuario.idSep" label="ID SEP" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.noInv" label="No. Inventario" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.nombre" label="Nombre*" outlined
              :error="nuevoUsuarioErrores.nombre"></v-text-field>
            <v-text-field v-model="nuevoUsuario.caracteristicas" label="Características*" outlined
              :error="nuevoUsuarioErrores.caracteristicas"></v-text-field>
            <v-text-field v-model="nuevoUsuario.marca" label="Marca" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.modelo" label="Modelo" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.serie" label="Serie" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.valor" label="Valor" outlined
              :error="nuevoUsuarioErrores.valor"></v-text-field>
            <v-text-field v-model="nuevoUsuario.camb" label="Camb" outlined></v-text-field>
            <v-select v-model="nuevoUsuario.departamento" :items="departamentos" label="Departamento*" outlined
              :error="nuevoUsuarioErrores.departamento" item-text="depdepto" item-value="depclave"></v-select>
            <v-select v-model="nuevoUsuario.area" :items="areasPorDepartamento" label="Área*" outlined
              :error="nuevoUsuarioErrores.area" item-text="areanombre" item-value="areaid"></v-select>
            <v-textarea v-model="nuevoUsuario.observaciones" label="Observaciones" outlined></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="edicionActiva ? guardarCambios() : registrarNuevoActivo()">
              {{ edicionActiva ? 'Guardar cambios' : 'Registrar' }}
            </v-btn>
            <v-btn @click="cancelarEdicion()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal para confirmar la eliminación de un activo -->
      <v-dialog v-model="mostrarConfirmacionEliminar" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirmar eliminación</v-card-title>
          <v-card-text>
            <div v-if="activoAEliminar">
              ¿Estás seguro de que deseas eliminar el activo con el nombre "{{ activoAEliminar.ActNombre }}"?
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cancelarEliminacion">Cancelar</v-btn>
            <v-btn @click="eliminarActivo" color="red" dark>Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- DataTable de activos -->
      <v-text-field v-model="search" label="Buscar activo" append-icon="mdi-magnify" class="mb-3"></v-text-field>
      <v-data-table :headers="headers" :items="filteredActivos" class="elevation-1">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.ActId }}</td>
            <td>{{ item.ActNombre }}</td>
            <td>{{ item.ActCaracteristicas }}</td>
            <td>{{ item.JefeDepartamento }}</td>
            <td>{{ item.NombreDepartamento }}</td>
            <td>
              <v-btn @click="editarUsuario(item.ActId)" class="ma-1 orange darken-1" fab dark small>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="confirmaEliminarActivo(item.ActId)" class="ma-1 red" fab dark small>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from "sweetalert2";

export default {
  data: () => ({
    headers: [
      { text: 'PROG', value: 'ActId' },
      { text: 'Nombre', value: 'ActNombre' },
      { text: 'Características', value: 'ActCaracteristicas' },
      { text: 'Jefe depto', value: 'JefeDepartamento' },
      { text: 'Departamento', value: 'NombreDepartamento' },
      { text: 'Opciones', value: 'opciones' },
    ],
    inventario: [],
    departamentos: [],
    areas: [],
    areasPorDepartamento: [],
    search: '',
    mostrarFormulario: false,
    edicionActiva: false,
    idActivoAEditar: null,
    mostrarConfirmacionEliminar: false,
    activoAEliminar: null,
    nuevoUsuario: {
      ActId: '',
      idSep: '',
      noInv: '',
      nombre: '',
      caracteristicas: '',
      marca: '',
      modelo: '',
      serie: '',
      valor: '',
      camb: '',
      departamento: '',
      area: '',
      observaciones: '',
    },
    nuevoUsuarioErrores: {
      nombre: false,
      caracteristicas: false,
      departamento: false,
      valor: false,
    },
  }),
  watch: {
    'nuevoUsuario.departamento': 'actualizarAreas',
  },
  computed: {
    // Búsqueda de activos por todas sus columnas.
    filteredActivos() {
      return this.inventario.filter((usuario) => {
        const searchTerm = this.search.toLowerCase();
        for (const key in usuario) {
          if (usuario[key] && usuario[key].toString().toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
        return false;
      });
    },
  },
  created() {

    // Obtener la lista de todas las áreas
    axios.get('http://localhost:3000/api/combo/areas')
      .then(response => {
        this.areas = response.data;
      })
      .catch(error => {
        console.error('Error al cargar la lista de áreas', error);
      });

    // Obtener la lista de departamentos
    axios.get('http://localhost:3000/api/combo/departments')
      .then(response => {
        this.departamentos = response.data;
      })
      .catch(error => {
        console.error('Error al cargar la lista de departamentos', error);
      });

    // Obtener la lista de activos
    axios.get('http://localhost:3000/api/inventory')
      .then(response => {
        this.inventario = response.data;
      })
      .catch(error => {
        console.error('Error al cargar el inventario', error);
      });
  },
  methods: {
    alertaToast(icono, titulo) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-start",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: icono,
        title: titulo
      });
    },

    // Carga los datos de los activos
    cargarActivos() {
      axios
        .get('http://localhost:3000/api/inventory')
        .then((response) => {
          this.inventario = response.data;
        })
        .catch((error) => {
          console.error('Error al cargar el inventario', error);
        });
    },

    // Consulta activo por su ActId
    cargarDatosActivoPorId(ActId) {
      axios
        .get(`http://localhost:3000/api/inventory/${ActId}`)
        .then((response) => {

          // Carga los datos del activo en el formulario
          this.nuevoUsuario.idSep = response.data[0].ActIdSep;
          this.nuevoUsuario.noInv = response.data[0].ActNoInv;
          this.nuevoUsuario.nombre = response.data[0].ActNombre;
          this.nuevoUsuario.caracteristicas = response.data[0].ActCaracteristicas;
          this.nuevoUsuario.marca = response.data[0].ActMarca;
          this.nuevoUsuario.modelo = response.data[0].ActModelo;
          this.nuevoUsuario.serie = response.data[0].ActSerie;
          this.nuevoUsuario.valor = response.data[0].ActValor;
          this.nuevoUsuario.camb = response.data[0].ActCabm;
          this.nuevoUsuario.departamento = response.data[0].depclave;
          this.nuevoUsuario.area = response.data[0].AreaId;
          this.nuevoUsuario.observaciones = response.data[0].ActObser;

          // Activa el modo de edición y muestra el formulario
          this.edicionActiva = true;
          this.mostrarFormulario = true;
        })
        .catch((error) => {
          console.error('Error al cargar los datos del activo:', error);
        });
    },
    actualizarAreas() {
      if (this.nuevoUsuario.departamento) {
        // Filtra las áreas según el departamento seleccionado
        this.areasPorDepartamento = this.areas.filter(
          (area) => area.depclave === this.nuevoUsuario.departamento
        );
        // Restablece el valor del área si ya no es válido
        if (!this.areasPorDepartamento.find((a) => a.areaid === this.nuevoUsuario.area)) {
          this.nuevoUsuario.area = '';
        }
      } else {
        // Si no se ha seleccionado un departamento, reinicia las áreas
        this.areasPorDepartamento = [];
        this.nuevoUsuario.area = '';
      }
    },
    // Actualiza los datos de un activo
    guardarCambios() {
      axios
        .put(`http://localhost:3000/api/inventory/actualizar/${this.idActivoAEditar}`, this.nuevoUsuario)
        .then((response) => {
          // Actualiza el activo en la lista
          const index = this.inventario.findIndex((item) => item.ActId === this.idActivoAEditar);
          if (index !== -1) {
            this.inventario[index] = this.nuevoUsuario;
          }
          this.alertaToast("success", "Activo modificado correctamente.");
          this.cargarActivos();
          this.cancelarEdicion();
        })
        .catch((error) => {
          console.error('Error al actualizar el activo:', error);
        });
    },
    cancelarEdicion() {
      this.edicionActiva = false;
      this.idActivoAEditar = null;

      this.nuevoUsuario = {
        idSep: '',
        noInv: '',
        nombre: '',
        caracteristicas: '',
        marca: '',
        modelo: '',
        serie: '',
        valor: '',
        camb: '',
        departamento: '',
        area: '',
        observaciones: '',
      };

      this.nuevoUsuarioErrores = {
        nombre: false,
        caracteristicas: false,
        departamento: false,
        valor: false,
      };

      this.mostrarFormulario = false;
    },
    registraActivo() {
      this.nuevoUsuario = {
        idSep: '',
        noInv: '',
        nombre: '',
        caracteristicas: '',
        marca: '',
        modelo: '',
        serie: '',
        valor: '',
        camb: '',
        departamento: '',
        area: '',
        observaciones: '',
      };

      this.edicionActiva = false;
      this.mostrarFormulario = true;
    },
    editarUsuario(id) {
      this.cargarDatosActivoPorId(id);

      this.edicionActiva = id !== null;
      this.idActivoAEditar = id;
      this.mostrarFormulario = true;
    },
    confirmaEliminarActivo(id) {
      // Obtén el activo a eliminar por su ActId
      const activoAEliminar = this.inventario.find((activo) => activo.ActId === id);
      if (activoAEliminar) {
        this.activoAEliminar = activoAEliminar;
        this.mostrarConfirmacionEliminar = true; // Muestra el cuadro de diálogo de confirmación
      }
    },
    cancelarEliminacion() {
      this.activoAEliminar = null;
      this.mostrarConfirmacionEliminar = false; // Oculta el cuadro de diálogo de confirmación
    },
    eliminarActivo() {
      if (this.activoAEliminar) {
        axios
          .delete(`http://localhost:3000/api/inventory/eliminar/${this.activoAEliminar.ActId}`)
          .then((response) => {
            // Elimina el activo de la lista
            const index = this.inventario.findIndex((item) => item.ActId === this.activoAEliminar.ActId);
            if (index !== -1) {
              this.inventario.splice(index, 1);
            }
            this.alertaToast("success", "Activo eliminado correctamente.");
            this.mostrarConfirmacionEliminar = false;
          })
          .catch((error) => {
            console.error('Error al eliminar el activo:', error);
          });
      }
    },
    registrarNuevoActivo() {
      // Reestablece los errores del formulario
      this.nuevoUsuarioErrores = {
        nombre: false,
        caracteristicas: false,
        departamento: false,
        area: false,
        valor: false,
      };

      // Verifica que los campos requeridos tengan información
      if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.caracteristicas || !this.nuevoUsuario.departamento || !this.nuevoUsuario.area) {

        // Establece errores en los campos requeridos
        if (!this.nuevoUsuario.nombre) {
          this.nuevoUsuarioErrores.nombre = true;
        }
        if (!this.nuevoUsuario.caracteristicas) {
          this.nuevoUsuarioErrores.caracteristicas = true;
        }
        if (!this.nuevoUsuario.departamento) {
          this.nuevoUsuarioErrores.departamento = true;
        }
        if (!this.nuevoUsuario.area) {
          this.nuevoUsuarioErrores.area = true;
        }
        return;
      }

      // Valida que el campo 'valor' sea un número, no es obligatorio que tenga un valor.
      if (this.nuevoUsuario.valor) {
        const valor = parseFloat(this.nuevoUsuario.valor);
        if (isNaN(valor)) {
          this.nuevoUsuarioErrores.valor = true;
          return;
        }
      } else {
        this.nuevoUsuario.valor = 0;
      }

      axios
        .post('http://localhost:3000/api/inventory/registra', this.nuevoUsuario)
        .then((response) => {
          this.inventario.push(this.nuevoUsuario);
          this.nuevoUsuario = {
            idSep: '',
            noInv: '',
            nombre: '',
            caracteristicas: '',
            marca: '',
            modelo: '',
            serie: '',
            valor: '',
            camb: '',
            departamento: '',
            area: '',
            observaciones: '',
            idSep: '',
          };
          this.alertaToast("success", "Activo registrado correctamente.");
          this.cargarActivos();
          this.mostrarFormulario = false;
        })
        .catch((error) => {
          console.error('Error al registrar el activo:', error);
        });
    },
  },
};
</script>

<style>
.entrar {
  animation: entrada 0.7s ease;
}

@keyframes entrada {
  from {
    opacity: 0;
  }

  to {
    opacity: 100%;
  }
}
</style>
