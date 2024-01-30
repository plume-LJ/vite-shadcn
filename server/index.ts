// const express = require("express");
import express from 'express'
import { createStaticHandler } from "react-router-dom/server";
// const {
//   createStaticHandler,
// } = require("react-router-dom/server");

import createFetchRequest from "./request";
import routes from "./routes";
import { AddressInfo } from 'net';

const app = express();

const handler = createStaticHandler(routes);

app.get("*", async (req, res) => {
  const fetchRequest = createFetchRequest(req);
  const context = await handler.query(fetchRequest);
  console.log(context, res)

  // We'll tackle rendering next...
});

const listener = app.listen(3000, () => {
  const { port } = listener.address() as AddressInfo;
  console.log(`Listening on port ${port}`);
});