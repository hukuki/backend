const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output.json')

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require("./router/user");
const queryRouter = require("./router/query");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/query", queryRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});