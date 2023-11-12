<template>
    <div class="entrar">
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
                        <td>{{ item.UsrId }}</td>
                        <td>{{ item.UsrNombre }}</td>
                        <td>{{ item.UsrCorreo }}</td>
                        <td>
                            <v-switch v-model="item.UsrTipo" @change="actualizarTipoUsuario(item)"></v-switch>
                        </td>
                        <td>
                            <v-btn @click="mostrarConfirmacionEliminar = true; usuarioAEliminar = item" class="ma-1 red" fab
                                dark small>
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <v-dialog v-model="mostrarConfirmacionEliminar" max-width="400">
                <v-card>
                    <v-card-title class="headline">Confirmar eliminación</v-card-title>
                    <v-card-text>
                        <div v-if="usuarioAEliminar">
                            ¿Estás seguro de que deseas eliminar al usuario "{{ usuarioAEliminar.UsrNombre }}"?
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="cancelarEliminacion">Cancelar</v-btn>
                        <v-btn @click="eliminarUsuario" color="red" dark>Eliminar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default {
    data: () => ({
        mostrarFormulario: false,
        mostrarConfirmacionEliminar: false,
        usuarioAEliminar: null,
        nuevoUsuario: {
            idUser: '',
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
            return this.usuarios.filter((usuario) => {
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
        axios.get('http://localhost:3000/api/users')
            .then(response => {
                this.usuarios = response.data;
            })
            .catch(error => {
                console.error('Error al cargar el inventario', error);
            });
    },
    methods: {
        cancelarEliminacion() {
            this.mostrarConfirmacionEliminar = false;
            this.usuarioAEliminar = null;
        },
        eliminarUsuario() {
            const userId = this.usuarioAEliminar.UsrId;

            axios.delete(`http://localhost:3000/api/users/eliminarUsuario/${userId}`)
                .then((response) => {
                    console.log('Usuario eliminado con éxito:', response.data);
                    this.cargarDatosTabla();
                    this.mostrarConfirmacionEliminar = false;
                    this.showToast("success", "Usuario eliminado con éxito.");
                })
                .catch((error) => {
                    console.error('Error al eliminar usuario:', error);
                    this.mostrarConfirmacionEliminar = false;
                    this.showToast("error", "Error al eliminar usuario.");
                });
        },
        actualizarTipoUsuario(usuario) {
            axios
                .put(`http://localhost:3000/api/users/actualizaTipoUsuario/${usuario.UsrId}`, {
                    UsrTipo: usuario.UsrTipo
                })
                .then(response => {
                    console.log('Tipo de usuario actualizado con éxito en la base de datos:', response.data);
                })
                .catch(error => {
                    console.error('Error al actualizar el tipo de usuario en la base de datos:', error);
                });
        },
        cargarDatosTabla() {
            axios
                .get('http://localhost:3000/api/users')
                .then((response) => {
                    this.usuarios = response.data;
                })
                .catch((error) => {
                    console.error('Error al cargar usuarios', error);
                });
        },

        agregarElemento() {
            // Validar el correo electrónico si es necesario
            const correoElectronico = this.nuevoUsuario.email;
            const contraseñaPorDefecto = "123456789";

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
                    console.log("Agregando usuario a la base de datos SQL Server...");
                    axios
                        .post('http://localhost:3000/api/users/registraUsuario', this.nuevoUsuario)
                        .then((response) => {
                            console.log('Usuario registrado en SQL con éxito:', response.data);
                            this.nuevoUsuario = {
                                nombre: '',
                                email: '',
                                esAdmin: '',
                            };
                            this.cargarDatosTabla();
                            this.mostrarFormulario = false;
                        })
                        .catch((error) => {
                            console.log('Error al registrar el usuario en SQL:', error);
                            console.error('Error al registrar el usuario en SQL:', error);
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
                                "Ocurrió un error al registrar el usuario." + error
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