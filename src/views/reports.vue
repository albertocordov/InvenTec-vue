<template>
  <div class="text-center entrar">
    <h1>Reportes</h1>
    <!-- Primer Row: Títulos 1 y 2 -->
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="5">
        <div class="report-box">
          <h2>Título 1</h2>
          <v-select label="Seleccionar" :items="opciones"></v-select>
          <v-btn @click="generarPDF(1)" color="red lighten-1">
            <v-icon left color="white">mdi-file-pdf-box</v-icon>
            Generar PDF
          </v-btn>
          <v-btn @click="generarXLS(1)" color="green lighten-1">
            <v-icon left color="white">mdi-file-excel</v-icon>
            Generar XLS
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <div class="report-box">
          <h2>Título 2</h2>
          <v-select label="Seleccionar" :items="opciones"></v-select>
          <v-btn @click="generarPDF(2)" color="red lighten-1">
            <v-icon left color="white">mdi-file-pdf-box</v-icon>
            Generar PDF
          </v-btn>
          <v-btn @click="generarXLS(2)" color="green lighten-1">
            <v-icon left color="white">mdi-file-excel</v-icon>
            Generar XLS
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Segundo Row: Títulos 3 y 4 -->
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="5">
        <div class="report-box">
          <h2>Título 3</h2>
          <v-select label="Seleccionar" :items="opciones"></v-select>
          <v-btn @click="generarPDF(3)" color="red lighten-1">
            <v-icon left color="white">mdi-file-pdf-box</v-icon>
            Generar PDF
          </v-btn>
          <v-btn @click="generarXLS(3)" color="green lighten-1">
            <v-icon left color="white">mdi-file-excel</v-icon>
            Generar XLS
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="6" lg="5">
        <div class="report-box">
          <h2>Título 4</h2>
          <v-select label="Seleccionar" :items="opciones"></v-select>
          <v-btn @click="generarPDF(4)" color="red lighten-1">
            <v-icon left color="white">mdi-file-pdf-box</v-icon>
            Generar PDF
          </v-btn>
          <v-btn @click="generarXLS(4)" color="green lighten-1">
            <v-icon left color="white">mdi-file-excel</v-icon>
            Generar XLS
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'reports',
  data: () => ({
    opciones: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
  }),
  methods: {
    generarPDF(numero) {
      // Lógica para generar PDF en función del cuadro número
      console.log('Generar PDF para Cuadro ' + numero);
    },
    generarXLS(numero) {
      // Lógica para generar XLS en función del cuadro número
      console.log('Generar XLS para Cuadro ' + numero);
    },
  },
};
</script>

<style>
.report-box {
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  margin: 10px;
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
