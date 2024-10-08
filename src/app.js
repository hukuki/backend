const express = require("express");
const cors = require("cors");

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger/swagger-output.json')

const app = express();

const userRouter = require("./router/user");
const queryRouter = require("./router/query");
const noteRouter = require("./router/note");
const spaceRouter = require("./router/space");
const bookmarkRouter = require("./router/bookmark");
const documentRouter = require("./router/document");
const feedbackRouter = require("./router/feedback");

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile)
);

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/query", queryRouter);
//app.use("/notes", noteRouter);
app.use("/spaces", spaceRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/documents", documentRouter);
app.use("/feedback", feedbackRouter);

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      type: err.type,
      message: err.error.toString()
    })
  } else {
    res.status(500).send(err)
  }
});

module.exports = app;