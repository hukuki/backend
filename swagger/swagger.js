const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Legal Research API',
    description: 'This is the backend of the Legal Reseach application and documented with Swagger',
    contact: {
      name: "Onur Eren Arpaci",
      email: "onurerenarpaci@hotmail.com",
    },
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./../index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);