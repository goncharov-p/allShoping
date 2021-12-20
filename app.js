const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const { header } = require('express/lib/request');
const app = express();
require("dotenv").config();

const apiRoutes = require('./src/modules/routes/routes')

const url = process.env.URL;
mongoose.connect(url, { useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use("/",apiRoutes);

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});