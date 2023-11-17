<template>
    <div class="container mt-2 entrar">
        <h1 class="text-center">Departamentos</h1>
        <div class="row mb-3">
            <div class="col-md-6">
                <!-- Sección de departamentos -->
                <h2 class="text-center">Departamentos</h2>
                <v-btn block @click="mostrarModalDepto = true" class="mb-3 green btnagregar" dark>
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
                <v-btn block @click="mostrarModalJefes = true" class="mb-3 green btnagregar" dark>
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
                    <v-text-field v-model="nuevoDepartamento.depdepto" label="Departamento*" outlined
                        :error="nuevoDepartamentoErrores.depdepto"></v-text-field>
                    <v-text-field v-model="nuevoDepartamento.depalias" label="Alias del Departamento*" outlined
                        :error="nuevoDepartamentoErrores.depalias"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarDepartamento">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="mostrarModalDepto = false">Cancelar</v-btn>
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
                    <v-text-field v-model="nuevoJefe.jefenombre" label="Nombre del Jefe" outlined
                        :error="nuevoJefeErrores.jefenombre"></v-text-field>
                    <v-autocomplete v-model="nuevoJefe.departamento" :items="departamentos" label="Departamento"
                        item-text="depdepto" item-value="depclave" outlined
                        :error="nuevoJefeErrores.departamento"></v-autocomplete>
                    <v-radio-group v-model="nuevoJefe.jefetipo_desc" row :error="nuevoJefeErrores.jefetipo_desc">
                        <v-radio label="Jefe de Departamento" :value="true"></v-radio>
                        <v-radio label="Jefe de Área" :value="false"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarJefe">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="mostrarModalJefes = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar áreas -->
        <v-dialog v-model="mostrarModalAreas" max-width="500">
            <v-card>
                <v-card-title>
                    {{ modoEdicion ? 'Editar Área' : 'Agregar Área' }}
                </v-card-title>
                <v-card-text>
                    <v-autocomplete v-model="nuevaArea.depdepto" :items="departamentos" label="Seleccionar Departamento"
                        item-text="depdepto" item-value="depclave" outlined :error="nuevaAreaErrores.depdepto"
                        @input="filtrarEncargadosPorDepartamento"></v-autocomplete>
                    <v-autocomplete v-model="nuevaArea.jefenombre" :items="managerOptions"
                        label="Seleccionar Encargado del Área" item-text="jefenombre" item-value="jefeid" outlined
                        :error="nuevaAreaErrores.jefenombre"></v-autocomplete>
                    <v-text-field v-model="nuevaArea.areanombre" label="Nombre del Área" outlined
                        :error="nuevaAreaErrores.areanombre"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="modoEdicion ? editarArea() : agregarArea">
                        {{ modoEdicion ? 'Guardar cambios' : 'Agregar' }}
                    </v-btn>
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
        nuevoDepartamentoErrores: {
            depdepto: false,
            depalias: false,
        },
        nuevoJefe: {
            jefenombre: '',
            departamento: '',
            jefetipo_desc: '',
        },
        nuevoJefeErrores: {
            jefenombre: false,
            departamento: false,
            jefetipo_desc: false,
        },
        nuevaArea: {
            areaid: '',
            areanombre: '',
            jefenombre: '',
            depdepto: '',
        },
        nuevaAreaErrores: {
            areaid: false,
            areanombre: false,
            jefenombre: false,
            depdepto: false,
        },
        departments: [],
        departamentos: [],
        jefes: [],
        jefesCombo: [],
        areas: [],
        jefesPorDepartamento: [],
        managerOptions: [],
        departmentOptions: [],
        edicionActivaDepto: false,
        modoEdicion: false,

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
                const searchTerm = this.searchJefes ? this.searchJefes.toLowerCase() : '';

                // Log para depurar
                console.log('Jefe:', jefe);

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
        filtrarEncargadosPorDepartamento() {
            // Filtra los jefes por el departamento seleccionado
            console.log('Departamento seleccionado:', this.nuevaArea.depdepto);
            if (this.nuevaArea.depdepto) {
                this.managerOptions = this.jefesCombo.filter(jefe => jefe.depclave === this.nuevaArea.depdepto);
            } else {
                // Si no hay departamento seleccionado, muestra todos los encargados
                this.managerOptions = this.jefesCombo;
            }
        },

        editarArea(id) {
            console.log(id)
            this.cargarAreaPorId(id);

            this.edicionActiva = id !== null;
            this.modoEdicion = true;
            this.mostrarModalAreas = true;
        },
        editarJefe(id) {
            console.log(id)
            this.cargarJefePorId(id);

            this.modoEdicion = true;
            this.mostrarModalJefes = true;
        },
        editarDepartamento(id) {
            console.log(id)
            this.cargarDepartamentoPorId(id);

            this.modoEdicion = true;
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
                    this.nuevoJefe.departamento = response.data[0].departamento;
                    this.nuevoJefe.jefetipo_desc = response.data[0].jefetipo_desc;

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
            this.nuevoDepartamentoErrores = {
                depdepto: false,
                depalias: false
            };

            if (!this.nuevoDepartamento.depdepto || !this.nuevoDepartamento.depalias) {
                if (!this.nuevoDepartamento.depdepto) {
                    this.nuevoDepartamentoErrores.depdepto = true;
                }

                if (!this.nuevoDepartamento.depalias) {
                    this.nuevoDepartamentoErrores.depalias = true;
                }
                return;
            }

            axios
                .post('http://localhost:3000/api/departments/registraDepto', this.nuevoDepartamento)
                .then((response) => {
                    console.log('Usuario registrado en SQL con éxito:', response.data);
                    this.nuevoDepartamento = {
                        depdepto: '',
                        depalias: ''
                    };
                    //this.cargarDatosTabla();
                })
                .catch((error) => {
                    console.log('Error al registrar el depto en SQL:', error);
                });
            this.nuevoDepartamento.depdepto = '';
            this.nuevoDepartamento.depalias = '';
            this.mostrarModalDepto = false;
        },

        agregarJefe() {
            this.nuevoJefeErrores = {
                jefeNombre: false,
                jefetipo_desc: false,
                departamento: false
            };

            if (!this.nuevoJefe.jefenombre || !this.nuevoJefe.departamento) {

                if (!this.nuevoJefe.jefenombre) {
                    this.nuevoJefeErrores.jefenombre = true;
                }

                if (!this.nuevoJefe.departamento) {
                    this.nuevoJefeErrores.departamento = true;
                }
                return;
            }

            axios
                .post('http://localhost:3000/api/jefes/registraJefe', this.nuevoJefe)
                .then((response) => {
                    console.log('jefe registrado en SQL con éxito:', response.data);
                    this.nuevoJefe = {
                        jefeNombre: '',
                        jefetipo_desc: '',
                        departamento: ''
                    };
                })
                .catch((error) => {
                    console.log('Error al registrar el jefe en SQL:', error);
                });

            this.nuevoJefe.jefenombre = '';
            this.nuevoJefe.departamento = '';
            this.mostrarModalJefes = false;
        },

        agregarArea() {
            this.nuevaAreaErrores = {
                areaid: false,
                areanombre: false,
                jefenombre: false,
                depdepto: false,
            };

            if (!this.nuevaArea.areanombre || !this.nuevaArea.jefenombre || !this.nuevaArea.depdepto) {

                if (!this.nuevaArea.areanombre) {
                    this.nuevaAreaErrores.areanombre = true;
                }

                if (!this.nuevaArea.jefenombre) {
                    this.nuevaAreaErrores.jefenombre = true;
                }

                if (!this.nuevaArea.depdepto) {
                    this.nuevaAreaErrores.depdepto = true;
                }

                return;
            }

            axios
                .post('http://localhost:3000/api/areas/registraArea', this.nuevaArea)
                .then((response) => {
                    console.log('Area registrada en SQL con éxito:', response.data);
                    this.nuevaArea = {
                        areaid: '',
                        areanombre: '',
                        jefenombre: '',
                        depdepto: '',
                    };
                })
                .catch((error) => {
                    console.log('Error al registrar el depto en SQL:', error);
                });

            this.managerOptions = this.jefesCombo;
            this.nuevaArea.areanombre = '';
            this.nuevaArea.jefenombre = '';
            this.nuevaArea.depdepto = '';
            this.mostrarModalAreas = false;
        },
    },
    created() {
        this.nuevoJefe.jefetipo_desc = false;

        // DataTable de departamentos
        axios.get('http://localhost:3000/api/departments')
            .then(response => {
                console.log(response.data)
                this.departments = response.data;
            })
            .catch(error => {
                console.error('Error al cargar departments', error);
            });

        // DataTable de jefes
        axios.get('http://localhost:3000/api/jefes')
            .then(response => {
                console.log(response.data)
                this.jefes = response.data.map(jefe => ({
                    jefeid: jefe.jefeid,
                    jefenombre: jefe.jefenombre,
                    departamento: jefe.departamento,
                    jefetipo_desc: jefe.jefetipo_desc,
                }));
            })
            .catch(error => {
                console.error('Error al cargar jefes', error);
            });

        // DataTable de areas
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

        // Combo de jefes
        axios.get('http://localhost:3000/api/combo/jefes')
            .then(response => {
                this.jefesCombo = response.data;
            })
            .catch(error => {
                console.error('Error al cargar la lista de jefes', error);
            });
    },
};
</script>
  
<style>
.btnagregar {
    margin-top: 15px;

}

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