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
                <v-text-field
                  label="UNIDAD RESPONSABLE"
                  v-model="unidadResponsable"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="FECHA"
                  v-model="fecha"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="ÁREA"
                  v-model="area"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="CENTRO DE TRABAJO"
                  v-model="centroTrabajo"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="DATOS DEL SERVIDOR PÚBLICO"
                  v-model="datosServidorPublico"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  :items="bienesAsignados"
                  :headers="headers"
                  class="elevation-1"
                ></v-data-table>
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
import jsPDF from 'jspdf';

export default {
  data() {
    return {
      unidadResponsable: "",
      fecha: "",
      area: "",
      centroTrabajo: "",
      datosServidorPublico: "",
      bienesAsignados: [],
      headers: [
        "Cantidad",
        "Característica",
        "Usuario",
      ],
    };
  },
  methods: {
    getBienesAsignados() {
      return this.bienesAsignados;
    },
    imprimirPDF() {
      const data = {
        unidadResponsable: this.unidadResponsable,
        fecha: this.fecha,
        area: this.area,
        centroTrabajo: this.centroTrabajo,
        datosServidorPublico: this.datosServidorPublico,
        bienesAsignados: this.bienesAsignados,
      };

      
      const doc = new jsPDF();

      doc.text("SEP", 105, 20, "center");
      doc.text("VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES", 105, 30, "center");
      doc.text("Unidad responsable: " + data.unidadResponsable, 20, 60);
      doc.text("Fecha: " + data.fecha, 20, 70);
      doc.text("Área: " + data.area, 20, 80);
      doc.text("Centro de trabajo: " + data.centroTrabajo, 20, 90);
      doc.text("Datos del servidor público: " + data.datosServidorPublico, 20, 100);
    
     
      doc.text("Otro dato: Otro valor", 20, 110);

      // Guarda o muestra el PDF según tus necesidades
      doc.save("Vale_de_Resguardo.pdf"); // Guarda el PDF con un nombre específico
      // Opción para mostrar el PDF en una nueva ventana
      
    },
  },
};
</script>
