<template>
    <div class="container mt-2 entrar">
        <h1 class="text-center">Departamentos</h1>
        <div class="row mb-3">
            <div class="col-md-6">
                <!-- Sección de departamentos -->
                <h2 class="text-center">Departamentos</h2>
                <v-btn block @click="showAddDepartmentModal = true" class="mb-3 green btnagregar btnagregardepart" dark>
                    <v-icon>mdi-plus</v-icon> Agregar departamento
                </v-btn>
                <v-text-field v-model="searchDepartment" label="Buscar departamento" append-icon="mdi-magnify"
                    class="mb-3"></v-text-field>
                <v-data-table :headers="departmentHeaders" :items="filteredDepartments" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.ID }}</td>
                            <td>{{ item.Departamento }}</td>
                            <td>{{ item.NombreEncargado }}</td>
                            <td>
                                <v-btn @click="editarDepartamento(item.ID)" class="ma-1 orange darken-1" fab dark small>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn @click="eliminarDepartamento(item.id)" class="ma-1 red" fab dark small>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            <div class="col-md-6">
                <!-- Sección de jefes de departamento -->
                <h2 class="text-center">Jefes de departamento / área</h2>
                <v-btn block @click="mostrarModalDepto = true" class="mb-3 green btnagregar" dark>
                    <v-icon>mdi-plus</v-icon> Agregar jefe
                </v-btn>
                <v-text-field v-model="searchJefe" label="Buscar jefe de departamento / área" append-icon="mdi-magnify"
                    class="mb-3"></v-text-field>
                <v-data-table :headers="JefesHeaders" :items="filteredJefes" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.jefeid }}</td>
                            <td>{{ item.jefenombre }}</td>
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.jefetipo_desc }}</td>
                            <td>
                                <v-btn @click="editarJefe(item.jefeid)" class="ma-1 orange darken-1" fab dark small>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn @click="eliminarJefe(item.id)" class="ma-1 red" fab dark small>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <h2 class="text-center">Áreas</h2>
                <v-btn block @click="mostrarModalAreas = true" class="mb-3 green btnagregar" dark>
                    <v-icon>mdi-plus</v-icon> Agregar área
                </v-btn>
                <v-text-field v-model="searchArea" label="Buscar área" append-icon="mdi-magnify"
                    class="mb-3"></v-text-field>
                <v-data-table :headers="areaHeaders" :items="filteredAreas" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.areaid }}</td>
                            <td>{{ item.areanombre }}</td>
                            <td>{{ item.jefenombre }}</td>
                            <td>{{ item.depdepto }}</td>
                            <td>
                                <v-btn @click="editarArea(item.areaid)" class="ma-1 orange darken-1" fab dark small>
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn @click="eliminarArea(item.id)" class="ma-1 red" fab dark small>
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </div>

        <!-- Modal para agregar departamentos -->
        <v-dialog v-model="mostrarModalDepto" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar Departamento
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="nuevoDepartamento.depdepto" label="Departamento"></v-text-field>
                    <v-text-field v-model="nuevoDepartamento.depalias" label="Alias del Departamento"></v-text-field>
                    <v-text-field v-model="nuevoDepartamento.nombreEncargado" label="Nombre encargado"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarDepartamento">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="showAddDepartmentModal = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar jefes de departamento -->
        <v-dialog v-model="mostrarModalJefes" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar jefe de departamento / área
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="nuevoJefe.jefenombre" label="Nombre del Jefe"></v-text-field>
                    <v-autocomplete v-model="nuevoJefe.departamento" :items="departamentos" label="Departamento"
                        item-text="depdepto" item-value="depclave"></v-autocomplete>
                    <v-radio-group v-model="nuevoJefe.jefetipo_desc" row>
                        <v-radio label="Jefe de Departamento" :value="true"></v-radio>
                        <v-radio label="Jefe de Área" :value="false"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarJefe">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="mostrarModalDepto = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar áreas -->
        <v-dialog v-model="mostrarModalAreas" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar Área
                </v-card-title>
                <v-card-text>
                    <v-autocomplete v-model="nuevaArea.depdepto" :items="departamentos" label="Seleccionar Departamento"
                        item-text="depdepto" item-value="depclave"></v-autocomplete>
                    <v-autocomplete v-model="nuevaArea.jefenombre" :items="jefes" label="Seleccionar Encargado del Área"
                        item-text="jefenombre" item-value="jefeid"></v-autocomplete>
                    <v-text-field v-model="nuevaArea.areanombre" label="Nombre del Área"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarArea">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="mostrarModalAreas = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'departments',
    data: () => ({
        departmentHeaders: [
            { text: 'ID', value: 'ID' },
            { text: 'Departamento', value: 'Departamento' },
            { text: 'Encargado', value: 'NombreEncargado' },
            { text: 'Acciones', value: 'actions' },
        ],
        JefesHeaders: [
            { text: 'ID', value: 'jefeid' },
            { text: 'Nombre', value: 'jefenombre' },
            { text: 'Departamento', value: 'departamento' },
            { text: 'Rol', value: 'jefetipo_desc' },
            { text: 'Acciones', value: 'actions' },
        ],
        areaHeaders: [
            { text: 'ID', value: 'areaid' },
            { text: 'Área', value: 'areanombre' },
            { text: 'Encargado área', value: 'jefenombre' },
            { text: 'Departamento', value: 'depdepto' },
            { text: 'Acciones', value: 'actions' },
        ],
        searchDepartment: '',
        searchJefe: '',
        searchArea: '',
        mostrarModalDepto: false,
        mostrarModalJefes: false,
        mostrarModalAreas: false,
        nuevoDepartamento: {
            depdepto: '',
            depalias: '',
            nombreEncargado: '',
        },
        nuevoJefe: {
            jefeid: '',
            jefenombre: '',
            departamento: '',
            jefetipo_desc: '',
        },
        nuevaArea: {
            areaid: '',
            areanombre: '',
            jefenombre: '',
            depdepto: '',
        },
        departments: [],
        departamentos: [],
        jefes: [],
        areas: [],
        jefesPorDepartamento: [],
        managerOptions: [],
        departmentOptions: [],
        edicionActivaDepto: false,
        nuevoDeptoErrores: {
            nombre: false,
            caracteristicas: false,
            departamento: false,
            valor: false,
        },
    }),
    computed: {
        filteredDepartments() {
            return this.departments.filter((department) => {
                const searchTerm = this.searchDepartment.toLowerCase();
                for (const key in department) {
                    if (department[key] && department[key].toString().toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
                return false;
            });
        },
        filteredJefes() {
            return this.jefes.filter((jefe) => {
                const searchTerm = this.searchJefes ? this.searchJefes.toLowerCase() : '';  // Agrega un chequeo para evitar 'undefined'
                for (const key in jefe) {
                    if (jefe[key] && jefe[key].toString().toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
                return false;
            });
        },
        filteredAreas() {
            return this.areas.filter((area) => {
                const searchTerm = this.searchAreas ? this.searchAreas.toLowerCase() : '';
                for (const key in area) {
                    if (area[key] && area[key].toString().toLowerCase().includes(searchTerm)) {
                        return true;
                    }
                }
                return false;
            });
        },
    },
    methods: {

        actualizarJefes() {
            // if (this.nuevoUsuario.departamento) {
            //     // Filtra las áreas según el departamento seleccionado
            //     this.jefesPorDepartamento = this.jefes.filter(
            //         (jefe) => jefe.jefeid === this.nuevoJefe.jefeid
            //     );
            //     // Restablece el valor del área si ya no es válido
            //     if (!this.jefesPorDepartamento.find((a) => a.jefeid === this.nuevoUsuario.jefeid)) {
            //         this.nuevoJefe.jefenombre = '';
            //     }
            // } else {
            //     // Si no se ha seleccionado un departamento, reinicia las áreas
            //     this.jefesPorDepartamento = [];
            //     this.nuevoJefe.jefenombre = '';
            // }
        },
        editarArea(id) {
            console.log(id)
            this.cargarAreaPorId(id);

            this.edicionActiva = id !== null;
            //this.idActivoAEditar = id;
            this.mostrarModalAreas = true;
        },
        editarJefe(id) {
            console.log(id)
            this.cargarJefePorId(id);

            //this.edicionActiva = id !== null;
            //this.idActivoAEditar = id;
            this.mostrarModalJefes = true;
        },
        editarDepartamento(id) {
            console.log(id)
            this.cargarDepartamentoPorId(id);

            //this.edicionActiva = id !== null;
            //this.idActivoAEditar = id;
            this.mostrarModalDepto = true;
        },
        cargarDepartamentoPorId(depClave) {
            console.log(depClave)
            axios
                .get(`http://localhost:3000/api/departments/${depClave}`)
                .then((response) => {
                    console.log('Datos del depto:', response.data);
                    // Carga los datos del activo en el formulario
                    this.nuevoDepartamento.depdepto = response.data[0].Depdepto;
                    this.nuevoDepartamento.depalias = response.data[0].Depalias;
                    this.nuevoDepartamento.nombreEncargado = response.data[0].nombreEncargado;

                    // Activa el modo de edición y muestra el formulario
                    this.edicionActiva = true;
                    this.mostrarFormulario = true;
                })
                .catch((error) => {
                    console.error('Error al cargar los datos del activo:', error);
                });
        },
        cargarJefePorId(jefeid) {
            console.log(jefeid)
            axios
                .get(`http://localhost:3000/api/jefes/${jefeid}`)
                .then((response) => {
                    console.log('Datos del jefe:', response.data);
                    // Carga los datos del activo en el formulario
                    this.nuevoJefe.jefeid = response.data[0].jefeid;
                    this.nuevoJefe.jefenombre = response.data[0].jefenombre;
                    this.nuevoJefe.jefetipo_desc = response.data[0].jefetipo;

                    // Buscar el departamento correspondiente en la lista de departamentos
                    const departamentoSeleccionado = this.departamentos.find(
                        (departamento) => departamento.depclave === response.data[0].depclave
                    );

                    this.nuevoJefe.departamento = departamentoSeleccionado || null;

                    // Activa el modo de edición y muestra el formulario
                    this.edicionActiva = true;
                    this.mostrarFormulario = true;
                })
                .catch((error) => {
                    console.error('Error al cargar los datos del activo:', error);
                });
        },
        cargarAreaPorId(depClave) {
            console.log(depClave)
            axios
                .get(`http://localhost:3000/api/areas/${depClave}`)
                .then((response) => {
                    console.log('Datos del depto:', response.data);
                    // Carga los datos del activo en el formulario
                    this.nuevaArea.areaid = response.data[0].areaid;
                    this.nuevaArea.areanombre = response.data[0].areanombre;
                    this.nuevaArea.jefenombre = response.data[0].jefenombre;

                    // Buscar el departamento correspondiente en la lista de departamentos
                    const departamentoSeleccionado = this.departamentos.find(
                        (departamento) => departamento.depclave === response.data[0].depclave
                    );

                    this.nuevaArea.depdepto = departamentoSeleccionado || null;

                    // Activa el modo de edición y muestra el formulario
                    this.edicionActiva = true;
                    this.mostrarFormulario = true;
                })
                .catch((error) => {
                    console.error('Error al cargar los datos del activo:', error);
                });
        },
        agregarDepartamento() {
            // Agregar lógica para guardar el nuevo departamento en tu lista de departamentos
            this.departments.push({
                id: this.departments.length + 1,
                departamento: this.nuevoDepartamento.name,
                encargado: this.nuevoDepartamento.alias,
            });

            // Reiniciar los datos del nuevo departamento y ocultar el modal
            this.nuevoDepartamento.name = '';
            this.nuevoDepartamento.alias = '';
            this.showAddDepartmentModal = false;
        },
        agregarJefe() {
            // Agregar lógica para guardar el nuevo jefe de departamento en tu lista de jefes
            this.jefes.push({
                id: this.jefes.length + 1,
                nombre: this.nuevoJefe.name,
                departamento: this.nuevoJefe.department,
                role: this.nuevoJefe.role,
            });

            // Reiniciar los datos del nuevo jefe de departamento y ocultar el modal
            this.nuevoJefe.name = '';
            this.nuevoJefe.department = '';
            this.nuevoJefe.role = 'Jefe de Departamento';
            this.mostrarModalDepto = false;
        },
        agregarArea() {
            // Agregar lógica para guardar la nueva área en tu lista de áreas
            this.areas.push({
                id: this.areas.length + 1,
                departamento: this.newArea.department,
                nombre: this.newArea.name,
                encargado: this.newArea.manager,
            });

            // Reiniciar los datos del nuevo área y ocultar el modal
            this.newArea.name = '';
            this.newArea.department = '';
            this.newArea.manager = '';
            this.mostrarModalAreas = false;
        },
        // Agrega tus métodos para editar y eliminar departamentos y jefes de departamento según tus necesidades
    },
    created() {
        axios.get('http://localhost:3000/api/departments')
            .then(response => {
                console.log(response.data)
                this.departments = response.data;
            })
            .catch(error => {
                console.error('Error al cargar departments', error);
            });

        axios.get('http://localhost:3000/api/jefes')
            .then(response => {
                console.log(response.data)
                this.jefes = response.data;
            })
            .catch(error => {
                console.error('Error al cargar jefes', error);
            });

        axios.get('http://localhost:3000/api/areas')
            .then(response => {
                console.log(response.data)
                this.areas = response.data;
            })
            .catch(error => {
                console.error('Error al cargar areas', error);
            });

        axios.get('http://localhost:3000/api/combo/departments')
            .then(response => {
                this.departamentos = response.data;
            })
            .catch(error => {
                console.error('Error al cargar la lista de departamentos', error);
            });

        axios.get('http://localhost:3000/api/combo/jefes')
            .then(response => {
                this.jefes = response.data;
            })
            .catch(error => {
                console.error('Error al cargar la lista de jefes', error);
            });
    },
};
</script>
  
<style>

.btnagregar{
margin-top: 15px;

}

.entrar {
    animation: entrada 0.7s ease;
}

@media (max-width: 960px) {

.btnagregardepart {
    margin-top: 53.5px;
}
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