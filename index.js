//inisialisasi express modul
const express = require("express");
const multer = require("multer");

const cors = require("cors");

//use express in app variable
const app = express();

const router = require("./src/routes");

//define the server port
const port = process.env.PORT || 5000;

//use body parser atau express bawaan sehingga kita bisa mengiirm data dari json
app.use(express.json());

app.use(cors());

// require("dotenv").config();

app.use("/uploads", express.static("uploads"));

app.use("/api/v1", router);

app.listen(port, () => console.log(`Listening on port ${port} !!!`));

//get = get data from data source
//post = store some data to data source
//put = update data secara masal
//patch = update data secara spesifik
//delete = hapus
