/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import express from "express";
import apiRoutes from "./routes/api.routes.js";
const app = express();

async function main() {
  app.use('', apiRoutes);

  app.all('*', (req, res) => {
    res.status(404).json({message: "There is nothing here. 404 Not Found"});
  })
}

main()
  .then(() => {
    logger.info("Server started");
  })
  .catch((error) => {
    logger.error("Error starting server: ", error);
  });

export const api = onRequest({ maxInstances: 3, timeoutSeconds: 60, memory: '1GiB', cors: ['https://bulaw-gpa.web.app', 'http://localhost:4200'] }, app);
