import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

import swaggerJSDoc from "swagger-jsdoc";

const bookingSchema = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    user: {
      type: "object",
      properties: {
        id: { type: "integer", example: 123 },
        name: { type: "string", example: "John Doe" },
      },
      required: ["id", "name"],
    },
    checkInDate: {
      type: "string",
      format: "date-time",
      example: "2025-03-01T00:00:00Z",
    },
    checkOutDate: {
      type: "string",
      format: "date-time",
      example: "2025-03-05T00:00:00Z",
    },
    note: { type: "string", example: "Room near the pool" },
    status: {
      type: "integer",
      description: "0 = wait, 1 = check-in, 2 = check-out, 3 = reject",
      example: 0,
    },
    createdAt: {
      type: "string",
      format: "date-time",
      example: "2025-02-26T12:00:00Z",
    },
  },
  required: [
    "id",
    "user",
    "checkInDate",
    "checkOutDate",
    "status",
    "createdAt",
  ],
};

const bookingInputSchema = {
  type: "object",
  properties: {
    checkInDate: {
      type: "string",
      format: "date-time",
      example: "2025-03-01T00:00:00Z",
    },
    checkOutDate: {
      type: "string",
      format: "date-time",
      example: "2025-03-05T00:00:00Z",
    },
    note: { type: "string", example: "Room near the pool" },
  },
  required: ["checkInDate", "checkOutDate"],
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Api",
      version: "1.0.0",
      description: "API documentation with Booking schemas",
    },
    servers: [{ url: "http://localhost:3001" }],    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Booking: bookingSchema,
        BookingInput: bookingInputSchema,
      },
      security: [
      {
        bearerAuth: [],
      },
    ],
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs available at /api-docs");
};
