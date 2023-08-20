require("dotenv").config();
require("./src/model/db");
const app = require("./src/app");
const chalk = require("chalk");

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`${chalk.green.bold.inverse(" SUCCESS ")} Server is running on port: ${chalk.bold(port)}.`);

  const log = console.log.bind({});
  global.console.log = (...arguments) => {
    log(chalk.grey.bold.inverse(" INFO "), ...arguments);
  };
});