<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h3>VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES</h3>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field label="UNIDAD RESPONSABLE" v-model="unidadResponsable"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="FECHA" v-model="fecha"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="ÁREA" v-model="area"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="CENTRO DE TRABAJO" v-model="centroTrabajo"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="DATOS DEL SERVIDOR PÚBLICO" v-model="datosServidorPublico"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="NOMRBE" v-model="datosServidorPublico"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="CURP" v-model="datosServidorPublico"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="FECHA ELABORACION" v-model="datosServidorPublico"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-list>
                  <v-list-item v-for="(item, index) in activosSeleccionados" :key="index">
                    <v-list-item-content>
                      <!-- Utiliza v-chip para mostrar cada elemento seleccionado -->
                      <v-chip>
                        {{ item.cant }} - {{ item.caracteristica.noInventario }} - {{ item.usuario }}
                        <v-btn icon @click="quitarActivo(index)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-chip>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-data-table :items="activos" :headers="headers" class="elevation-1">
                  <template v-slot:item.agregar="props">
                    <v-btn icon @click="agregarActivo(props.item)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn color="primary" @click="imprimirPDF">Imprimir</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "ValeResguardoBienes",
  data() {
    return {
      unidadResponsable: "",
      fecha: "",
      area: "",
      centroTrabajo: "",
      datosServidorPublico: "",
      activosSeleccionados: [],
      headers: [
        { text: 'Cantidad', value: 'cant' },
        { text: 'Número de Inventario', value: 'caracteristica.noInventario' },
        { text: 'Marca', value: 'caracteristica.marca' },
        { text: 'Nombre', value: 'caracteristica.nombre' },
        { text: 'Modelo', value: 'caracteristica.modelo' },
        { text: 'Serie', value: 'caracteristica.serie' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Agregar', value: 'agregar', sortable: false }
      ],
      activos: [
        {
          cant: 1,
          caracteristica: {
            noInventario: 1,
            marca: "Marca 1",
            nombre: "Nombre 1",
            modelo: "Modelo 1",
            serie: "Serie 1"
          },
          usuario: "Usuario 1"
        },
        {
          cant: 2,
          caracteristica: {
            noInventario: 2,
            marca: "Marca 2",
            nombre: "Nombre 2",
            modelo: "Modelo 2",
            serie: "Serie 2"
          },
          usuario: "Usuario 2"
        },
        {
          cant: 3,
          caracteristica: {
            noInventario: 3,
            marca: "Marca 3",
            nombre: "Nombre 3",
            modelo: "Modelo 3",
            serie: "Serie 3"
          },
          usuario: "Usuario 3"
        }
      ]
    };
  },
  methods: {
    agregarActivo(bien) {
      this.activosSeleccionados.push(bien);
    }, quitarActivo(index) {
      // Método para quitar un bien de la lista de seleccionados
      this.activosSeleccionados.splice(index, 1);
    },
    imprimirPDF() {
      const data = {
        unidadResponsable: this.unidadResponsable,
        fecha: this.fecha,
        area: this.area,
        centroTrabajo: this.centroTrabajo,
        datosServidorPublico: this.datosServidorPublico,
        activosSeleccionados: this.activosSeleccionados
      };

      const doc = new jsPDF();

      doc.text("SEP", 105, 20, "center");
      doc.text("VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES", 105, 30, "center");
      doc.text("Unidad responsable: " + data.unidadResponsable, 20, 60);
      doc.text("Fecha: " + data.fecha, 20, 70);
      doc.text("Área: " + data.area, 20, 80);
      doc.text("Centro de trabajo: " + data.centroTrabajo, 20, 90);
      doc.text("Datos del servidor público: " + data.datosServidorPublico, 20, 100);

      const rows = data.activosSeleccionados.map(bien => [
        bien.cant,
        `${bien.caracteristica.noInventario}, ${bien.caracteristica.marca}, ${bien.caracteristica.nombre}, ${bien.caracteristica.modelo}, ${bien.caracteristica.serie}`,
        bien.usuario
      ]);

      doc.autoTable({
        head: [["Cant.", "Característica", "Usuario"]],
        body: rows,
        startY: 110,
        theme: "grid"
      });
      doc.save("informe.pdf");
    }
  }
};
</script>