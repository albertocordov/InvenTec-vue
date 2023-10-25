<template>
    <div>
        <div class="container mt-2">
            <h1 class="text-center">Usuarios</h1>
            <v-dialog v-model="mostrarFormulario" max-width="500">
                <template v-slot:activator="{ on }">
                    <v-btn @click="mostrarFormulario = true" class="mb-3 green" dark>
                        <v-icon>mdi-plus</v-icon> Agregar Usuario
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        Registrar usuario
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="nuevoUsuario.nombre" label="Nombre" outlined></v-text-field>
                        <v-text-field v-model="nuevoUsuario.email" label="Correo Electrónico" outlined></v-text-field>
                        <v-switch v-model="nuevoUsuario.esAdmin" label="Administrador"></v-switch>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="green" @click="agregarElemento">Registrar</v-btn>
                        <v-btn @click="mostrarFormulario = false">Cancelar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-text-field v-model="search" label="Buscar usuario" append-icon="mdi-magnify" class="mb-3"></v-text-field>

            <v-data-table :headers="headers" :items="filteredUsuarios" class="elevation-1">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.id }}</td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.email }}</td>
                        <td>
                            <v-switch v-model="item.esAdmin"></v-switch>
                            <!-- Switch de Vuetify en la columna "Administrador" -->
                        </td>
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default {
    data: () => ({
        mostrarFormulario: false,
        nuevoUsuario: {
            nombre: '',
            email: '',
            esAdmin: false,
        },
        search: '',
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Email', value: 'email' },
            { text: 'Administrador', value: 'esAdmin' },
            { text: 'Opciones', value: 'opciones' },
        ],
        usuarios: [
            { id: 1, nombre: 'Usuario 1', email: 'usuario1@example.com', esAdmin: true },
            { id: 2, nombre: 'Usuario 2', email: 'usuario2@example.com', esAdmin: false },
            // Agrega más usuarios según sea necesario
        ],
    }),
    computed: {
        filteredUsuarios() {
            return this.usuarios.filter((usuario) =>
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
        agregarElemento() {
            // Validar el correo electrónico si es necesario
            const correoElectronico = this.nuevoUsuario.email;
            const contraseñaPorDefecto = "123456789";

            // Aquí puedes agregar la lógica para registrar el usuario en Firebase
            // Utiliza 'correoElectronico' y 'contraseñaPorDefecto'

            // Luego, cierra el modal
            // Registrar el usuario en Firebase
            const auth = getAuth();
            createUserWithEmailAndPassword(
                auth,
                correoElectronico,
                contraseñaPorDefecto
            )
                .then(userCredential => {
                    // El usuario se registró correctamente
                    const user = userCredential.user;
                    console.log("Usuario registrado con éxito:", user);

                    // Aquí puedes realizar otras acciones después del registro
                    // Por ejemplo, agregar el usuario a tu base de datos o actualizar la interfaz de usuario.

                    // Agregar el usuario a tu lista de usuarios
                    this.usuarios.push({
                        id: this.usuarios.length + 1,
                        nombre: this.nuevoUsuario.nombre,
                        email: user.email,
                        esAdmin: this.nuevoUsuario.esAdmin,
                    });

                    // Restablece los campos del formulario
                    this.nuevoUsuario = { nombre: '', email: '', esAdmin: false };
                    this.mostrarFormulario = false;

                    // Luego, cierra el modal
                    this.showToast("success", "Usuario registrado con éxito.");
                })
                .catch(error => {
                    switch (error.code) {
                        case "auth/email-already-in-use":
                            this.showToast(
                                "error",
                                "El correo electrónico ya encuentra registrado."
                            );
                            break;
                        default:
                            this.showToast(
                                "error",
                                "Ocurrió un error al registrar el usuario."
                            );
                            break;
                    }
                    //console.error("Error al registrar el usuario:", error);
                });
        },
        showToast(icono, titulo) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
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
        }
    },
};
</script>
  