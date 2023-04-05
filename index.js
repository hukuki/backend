const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./model/db");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output.json')

const app = express();
const port = process.env.PORT || 8080;

const userRouter = require("./router/user");
const queryRouter = require("./router/query");
const noteRouter = require("./router/note");
const spaceRouter = require("./router/space");
const bookmarkRouter = require("./router/bookmark");

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile)
);

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/query", queryRouter);
app.use("/notes", noteRouter);
app.use("/spaces", spaceRouter);
app.use("/bookmarks", bookmarkRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}.`);
});