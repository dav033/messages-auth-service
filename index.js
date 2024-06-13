const express = require("express");
const app = express();
const PORT = 3004;
require('dotenv').config(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
