require("dotenv").config({ quiet: true });

const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const app = express();

const port = 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
