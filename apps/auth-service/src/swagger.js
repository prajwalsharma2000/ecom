import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Auth service api",
        description: "Automatically generated Swagger docs",
        versions: "1.0.0",
    },
    host: "localhost:6001",
    schemes: ["http"],
};

const otuputFile = "./swagger-output.json";
const endpointFiles = ["./routes/auth.router.ts"];

swaggerAutogen()(otuputFile, endpointFiles, doc);