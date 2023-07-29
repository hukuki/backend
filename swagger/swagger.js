const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
require('dotenv').config();

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
    host: (process.env.PUBLIC_IP || "localhost") + ":8080",
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
        QueryFeedbackRequest: {
            title: "QueryFeedbackRequest",
            required: ["query", "resultId", "thumbsUp"],
            type: "object",
            properties: {
            query: {
                title: "Query",
                type: "string",
            },
            resultId: {
                title: "Result Id",
                type: "string",
            },
            thumbsUp: {
                title: "Thumbs Up",
                type: "boolean",
            },
            },
        },
        PostNoteRequest: {
            title: "PostNoteRequest",
            required: ["from", "to", "content"],
            type: "object",
            properties: {
            document: {
                title: "Document Id",
                type: "string",
                default: "documentId"
            },
            from: {
                title: "From",
                type: "number",
            },
            to: {
                title: "To",
                type: "number",
            },
            content: {
                title: "Content",
                type: "string",
            },
            },
        },
        PatchNoteRequest: {
            title: "PatchNoteRequest",
            required: ["from", "to", "content"],
            type: "object",
            properties: {
            from: {
                title: "From",
                type: "number",
            },
            to: {
                title: "To",
                type: "number",
            },
            content: {
                title: "Content",
                type: "string",
            },
            },
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
