// server/app.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const controller = require("./controller");

app.use(bodyParser.json());

app.post("/imprimirPDF", (req, res) => {
  controller.imprimirPDF(res);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
