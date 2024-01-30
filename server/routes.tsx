// const React = require("react");
// const { json, useLoaderData } = require("react-router-dom");
import { json, useLoaderData } from "react-router-dom";

const routes = [
  {
    path: "/",
    loader() {
      return json({ message: "Welcome to React Router!" });
    },
    Component() {
      const data = useLoaderData() as { message: string };
      return <h1>{data.message}</h1>;
    },
  },
];

export default routes;
