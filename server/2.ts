import { register } from "node:module";
import { pathToFileURL } from "node:url";
register("ts-node/esm", pathToFileURL("./"));
console.log(2);
const s = 3;

export default s;
