<template>
  <div class="entrar">
    <div class="container mt-2">
      <h1 class="text-center">Inventario de activo fijo</h1>
      <v-dialog v-model="mostrarFormulario" max-width="500">
        <template v-slot:activator="{ on }">
          <v-btn block @click="mostrarFormulario = true" class="mb-3 green" dark>
            <v-icon>mdi-plus</v-icon> Agregar activo
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            Registrar activo
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="nuevoUsuario.idSep" label="ID SEP" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.nombre" label="Nombre" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.caracteristicas" label="Características" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.marca" label="Marca" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.modelo" label="Modelo" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.serie" label="Serie" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.valor" label="Valor" outlined></v-text-field>
            <v-text-field v-model="nuevoUsuario.camb" label="Camb" outlined></v-text-field>
            <v-select v-model="nuevoUsuario.departamento" :items="['Department 1', 'Department 2', 'Department 3']"
              label="Departamento" outlined></v-select>
            <v-select v-model="nuevoUsuario.jefeArea" :items="['Jefe Area 1', 'Jefe Area 2', 'Jefe Area 3']"
              label="Jefe de Área" outlined></v-select>
            <v-select v-model="nuevoUsuario.jefeDepto" :items="['Jefe Depto 1', 'Jefe Depto 2', 'Jefe Depto 3']"
              label="Jefe de Departamento" outlined></v-select>
            <v-textarea v-model="nuevoUsuario.observaciones" label="Observaciones" outlined></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="registrarNuevoUsuario">Registrar</v-btn>
            <v-btn @click="mostrarFormulario = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-text-field v-model="search" label="Buscar activo" append-icon="mdi-magnify" class="mb-3"></v-text-field>

      <v-data-table :headers="headers" :items="filteredUsuarios" class="elevation-1">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.prog }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.caracteristicas }}</td>
            <td>{{ item.jefe_depto }}</td>
            <td>{{ item.departamento }}</td>
            <td>
              <v-btn @click="editarUsuario(item.id)" class="ma-1 orange darken-1" fab dark small>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="eliminarUsuario(item.id)" class="ma-1 red" fab dark small>
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
export default {
  data: () => ({
    mostrarFormulario: false,
    nuevoUsuario: {
      nombre: '',
      email: '',
      esAdmin: false,
      departamento: '',
      jefeArea: '',
      jefeDepto: '',
      observaciones: '',
      idSep: '',         // Add 'ID SEP'
      caracteristicas: '', // Add 'Características'
      marca: '',          // Add 'Marca'
      modelo: '',         // Add 'Modelo'
      serie: '',          // Add 'Serie'
      valor: '',          // Add 'Valor'
      camb: '',           // Add 'Camb'
    },
    search: '',
    headers: [
      { text: 'PROG', value: 'prog' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Características', value: 'caracteristicas' },
      { text: 'Jefe depto', value: 'jefe_depto' },
      { text: 'Departamento', value: 'departamento' },
      { text: 'Opciones', value: 'opciones' },
    ],
    activos: [
      { prog: 1, nombre: 'Producto 1', caracteristicas: 'Descripción del producto 1', jefe_depto: 'Prueba', departamento: 'RECURSOS MATERIALES' },
      { prog: 2, nombre: 'Producto 2', caracteristicas: 'Descripción del producto 2', jefe_depto: 'Prueba', departamento: 'RECURSOS MATERIALES' },
      { prog: 3, nombre: 'Producto 3', caracteristicas: 'Descripción del producto 3', jefe_depto: 'Prueba', departamento: 'RECURSOS MATERIALES' },
    ],
  }),
  computed: {
    filteredUsuarios() {
      return this.activos.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    editarUsuario(id) {
      // Lógica para editar el usuario con el ID proporcionado
      console.log('Editar usuario con ID:', id);
    },
    eliminarUsuario(id) {
      // Lógica para eliminar el usuario con el ID proporcionado
      console.log('Eliminar usuario con ID:', id);
    },
    registrarNuevoUsuario() {
      // Lógica para agregar un nuevo usuario con los datos del formulario
      console.log('Registrar nuevo usuario:', this.nuevoUsuario);
      this.activos.push({ id: this.activos.length + 1, ...this.nuevoUsuario });
      this.nuevoUsuario = { nombre: '', email: '', esAdmin: false };
      this.mostrarFormulario = false;
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