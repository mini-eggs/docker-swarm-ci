import Commands from "command-line-args";
import { verify, format } from "./input";
import { start_server } from "./server";

/**
 * Available CLI options.
 */
const input = Commands([
  { name: "git", type: String },
  { name: "registry", type: String },
  { name: "swarm", type: String },
  { name: "name", type: String },
  { name: "port", type: Number },
  { name: "password", type: String },
  { name: "json", type: String }
]);

const fail = errors => {
  const message = errors.map(i => `\t${i}`).join("\n");
  console.error(`\n\tErrors:\n\n${message}\n`);
  process.exit(1);
};

format(input)
  .then(i => verify(i))
  .then(i => start_server(i))
  .catch(i => fail(i));
