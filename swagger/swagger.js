const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
    info: {
        title: "Legal Research API",
        description:
        "This is the backend of the Legal Reseach application and documented with Swagger",
        contact: {
        name: "Onur Eren Arpaci",
        email: "onurerenarpaci@hotmail.com",
        },
    },
    host: "localhost:8080",
    schemes: ["http"],
    components: {
        "@schemas": {
        QueryRequest: {
            title: "QueryRequest",
            required: ["query"],
            type: "object",
            properties: {
            query: {
                title: "Query",
                type: "string",
            },
            params: {
                title: "Params",
                type: "object",
            },
            debug: {
                title: "Debug",
                type: "boolean",
                default: false,
            },
            },
            additionalProperties: false,
        },
        },
    },
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};

const outputFile = "./swagger/swagger-output.json";
const endpointsFiles = ["./index.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);
