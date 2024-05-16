/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {config} from "dotenv";
config();

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import express from "express";
import apiRoutes from "./routes/api.routes.js";
const app = express();

async function main() {
  app.use('', apiRoutes);

  app.use('*', (req, res) => {
    res.status(404).send("There is nothing here. 404 Not Found");
  })

  onRequest(app);
}

main()
  .then(() => {
    logger.info("Server started");
  })
  .catch((error) => {
    logger.error("Error starting server: ", error);
  });
