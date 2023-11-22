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
                            <td>{{ item.id }}</td>
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.encargado }}</td>
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
    </div>
</template>
  
<script>
export default {
    name: 'departments',
    data: () => ({
        departmentHeaders: [
            { text: 'ID', value: 'id' },
            { text: 'Departamento', value: 'departamento' },
            { text: 'Encargado', value: 'encargado' },
            { text: 'Acciones', value: 'actions' },
        ],
        managerHeaders: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Departamento', value: 'departamento' },
            { text: 'Rol', value: 'role' },
            { text: 'Acciones', value: 'actions' },
        ],
        departmentOptions: [],
        searchDepartment: '',
        searchManager: '',
        showAddDepartmentModal: false,
        showAddManagerModal: false,
        newDepartment: {
            name: '',
            alias: '',
        },
        newManager: {
            name: '',
            department: '',
            role: 'Jefe de Departamento',
        },
        departments: [
            { id: 1, departamento: 'Departamento 1', encargado: 'Encargado 1' },
            { id: 2, departamento: 'Departamento 2', encargado: 'Encargado 2' },
            { id: 3, departamento: 'Departamento 3', encargado: 'Encargado 3' },
            { id: 4, departamento: 'Departamento 4', encargado: 'Encargado 4' },
            { id: 5, departamento: 'Departamento 5', encargado: 'Encargado 5' },
            { id: 6, departamento: 'Departamento 6', encargado: 'Encargado 6' },
            { id: 7, departamento: 'Departamento 7', encargado: 'Encargado 7' },
            { id: 8, departamento: 'Departamento 8', encargado: 'Encargado 8' },
            { id: 9, departamento: 'Departamento 9', encargado: 'Encargado 9' },
            { id: 10, departamento: 'Departamento 10', encargado: 'Encargado 10' },
        ],
        managers: [
            { id: 1, nombre: 'Jefe 1', departamento: 'Departamento 1', role: 'Jefe de depto' },
            { id: 2, nombre: 'Jefe 2', departamento: 'Departamento 2', role: 'Jefe de depto' },
            { id: 3, nombre: 'Jefe 3', departamento: 'Departamento 3', role: 'Jefe de depto' },
            { id: 4, nombre: 'Jefe 4', departamento: 'Departamento 4', role: 'Jefe de depto' },
            { id: 5, nombre: 'Jefe 5', departamento: 'Departamento 5', role: 'Jefe de depto' },
            { id: 6, nombre: 'Jefe 6', departamento: 'Departamento 6', role: 'Jefe de Área' },
            { id: 7, nombre: 'Jefe 7', departamento: 'Departamento 7', role: 'Jefe de Área' },
            { id: 8, nombre: 'Jefe 8', departamento: 'Departamento 8', role: 'Jefe de Área' },
            { id: 9, nombre: 'Jefe 9', departamento: 'Departamento 9', role: 'Jefe de Área' },
            { id: 10, nombre: 'Jefe 10', departamento: 'Departamento 10', role: 'Jefe de Área' },
        ],
        newDepartment: { // Almacena los datos del nuevo departamento
            name: '',
            alias: '',
        },
    }),
    components: {},
    computed: {
        filteredDepartments() {
            return this.departments.filter((department) =>
                department.departamento.toLowerCase().includes(this.searchDepartment.toLowerCase())
            );
        },
        filteredManagers() {
            return this.managers.filter((manager) =>
                manager.nombre.toLowerCase().includes(this.searchManager.toLowerCase())
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
        // Agrega tus métodos para editar y eliminar departamentos y jefes de departamento según tus necesidades
    },
};
</script>
  
<style>

.v-data-table .v-table__overflow {
  overflow-x: auto; /* Agrega desplazamiento horizontal si es necesario */
}

.v-data-table th {
  padding: 16px; /* Asegúrate de que este padding coincida con el de la otra tabla */
  white-space: nowrap; /* Para prevenir saltos de línea en las cabeceras */
}

.v-data-table td {
  padding: 16px; /* Igual que el padding de los <th> */
}

/* Asegúrate de que los botones tienen el mismo margen en ambas tablas */
.v-btn {
  margin: 8px;
}

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