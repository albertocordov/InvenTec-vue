<template>
    <div class="container mt-2 entrar">
        <h1 class="text-center">Departamentos</h1>
        <div class="row mb-3">
            <div class="col-md-6">
                <!-- Sección de departamentos -->
                <h2 class="text-center">Departamentos</h2>
                <v-btn block @click="showAddDepartmentModal = true" class="mb-3 green btnagregar" dark>
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
                                <v-btn @click="editarDepartamento(item.id)" class="ma-1 orange darken-1" fab dark small>
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
                <v-btn block @click="showAddManagerModal = true" class="mb-3 green btnagregar" dark>
                    <v-icon>mdi-plus</v-icon> Agregar jefe
                </v-btn>
                <v-text-field v-model="searchManager" label="Buscar jefe de departamento / área" append-icon="mdi-magnify"
                    class="mb-3"></v-text-field>
                <v-data-table :headers="managerHeaders" :items="filteredManagers" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ item.nombre }}</td>
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.role }}</td>
                            <td>
                                <v-btn @click="editarJefe(item.id)" class="ma-1 orange darken-1" fab dark small>
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
                <v-btn block @click="showAddAreaModal = true" class="mb-3 green btnagregar" dark>
                    <v-icon>mdi-plus</v-icon> Agregar área
                </v-btn>
                <v-text-field v-model="searchArea" label="Buscar área" append-icon="mdi-magnify"
                    class="mb-3"></v-text-field>
                <v-data-table :headers="areaHeaders" :items="filteredAreas" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.nombre }}</td>
                            <td>{{ item.encargado }}</td>
                            <td>
                                <v-btn @click="editarArea(item.id)" class="ma-1 orange darken-1" fab dark small>
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
        <v-dialog v-model="showAddDepartmentModal" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar Departamento
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="newDepartment.name" label="Nombre del Departamento"></v-text-field>
                    <v-text-field v-model="newDepartment.alias" label="Alias del Departamento"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarDepartamento">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="showAddDepartmentModal = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar jefes de departamento -->
        <v-dialog v-model="showAddManagerModal" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar jefe de departamento / área
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="newManager.name" label="Nombre del Jefe"></v-text-field>
                    <v-autocomplete v-model="newManager.department" :items="departmentOptions"
                        label="Departamento"></v-autocomplete>
                    <v-radio-group v-model="newManager.role" row>
                        <v-radio label="Jefe de Departamento" value="Jefe de Departamento"></v-radio>
                        <v-radio label="Jefe de Área" value="Jefe de Área"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarJefe">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="showAddManagerModal = false">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal para agregar áreas -->
        <v-dialog v-model="showAddAreaModal" max-width="500">
            <v-card>
                <v-card-title>
                    Agregar Área
                </v-card-title>
                <v-card-text>
                    <v-autocomplete v-model="newArea.department" :items="departmentOptions"
                        label="Seleccionar Departamento"></v-autocomplete>
                    <v-autocomplete v-model="newArea.manager" :items="managerOptions"
                        label="Seleccionar Encargado del Área"></v-autocomplete>
                    <v-text-field v-model="newArea.name" label="Nombre del Área"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue darken-1" @click="agregarArea">Agregar</v-btn>
                    <v-btn color="red darken-1" @click="showAddAreaModal = false">Cancelar</v-btn>
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
        managerHeaders: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Departamento', value: 'departamento' },
            { text: 'Rol', value: 'role' },
            { text: 'Acciones', value: 'actions' },
        ],
        areaHeaders: [
            { text: 'ID', value: 'id' },
            { text: 'Área', value: 'nombre' },
            { text: 'Encargado área', value: 'encargado' },
            { text: 'Encargado depto', value: 'encargado' },
            { text: 'Acciones', value: 'actions' },
        ],
        searchDepartment: '',
        searchManager: '',
        searchArea: '',
        showAddDepartmentModal: false,
        showAddManagerModal: false,
        showAddAreaModal: false,
        newDepartment: {
            name: '',
            alias: '',
        },
        newManager: {
            name: '',
            department: '',
            role: 'Jefe de Departamento',
        },
        newArea: {
            name: '',
            department: '',
            manager: '',
        },
        departments: [],
        managers: [
            { id: 1, nombre: 'Jefe 1', departamento: 'Departamento 1', role: 'Jefe de Departamento' },
            // Agregar más jefes de departamento según sea necesario
        ],
        areas: [
            { id: 1, departamento: 'Departamento 1', nombre: 'Área 1', encargado: 'Jefe 1' },
            // Agregar más áreas según sea necesario
        ],
        managerOptions: [],
        departmentOptions: [],
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
        filteredManagers() {
            return this.managers.filter((manager) =>
                manager.nombre.toLowerCase().includes(this.searchManager.toLowerCase())
            );
        },
        filteredAreas() {
            return this.areas.filter((area) =>
                area.nombre.toLowerCase().includes(this.searchArea.toLowerCase())
            );
        },
    },
    methods: {
        agregarDepartamento() {
            // Agregar lógica para guardar el nuevo departamento en tu lista de departamentos
            this.departments.push({
                id: this.departments.length + 1,
                departamento: this.newDepartment.name,
                encargado: this.newDepartment.alias,
            });

            // Reiniciar los datos del nuevo departamento y ocultar el modal
            this.newDepartment.name = '';
            this.newDepartment.alias = '';
            this.showAddDepartmentModal = false;
        },
        agregarJefe() {
            // Agregar lógica para guardar el nuevo jefe de departamento en tu lista de jefes
            this.managers.push({
                id: this.managers.length + 1,
                nombre: this.newManager.name,
                departamento: this.newManager.department,
                role: this.newManager.role,
            });

            // Reiniciar los datos del nuevo jefe de departamento y ocultar el modal
            this.newManager.name = '';
            this.newManager.department = '';
            this.newManager.role = 'Jefe de Departamento';
            this.showAddManagerModal = false;
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
            this.showAddAreaModal = false;
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
                console.error('Error al cargar el inventario', error);
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