const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc")

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require("./router/user");
const queryRouter = require("./router/query");
const noteRouter = require("./router/note");
const spaceRouter = require("./router/space");
const bookmarkRouter = require("./router/bookmark");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Legal Research API",
      version: "0.1.0",
      description:
        "This is the backend of the Legal Reseach application and documented with Swagger",
      contact: {
        name: "Onur Eren Arpaci",
        email: "onurerenarpaci@hotmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./router/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/query", queryRouter);
app.use("/notes", noteRouter);
app.use("/spaces", spaceRouter);
app.use("/bookmarks", bookmarkRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});