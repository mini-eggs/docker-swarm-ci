import CLA from "command-line-args";
import { collect_errors } from "./errors";
import { start_server } from "./server";

/**
 * Available CLI options.
 */
const definitions = [
  { name: "git", type: String },
  { name: "registry", type: String },
  { name: "swarm", type: String },
  { name: "name", type: String },
  { name: "port", type: Number },
  { name: "password", type: String }
];

const options = CLA(definitions);
const errors = collect_errors(options);

if (errors.length > 0) {
  console.error(`\n\tErrors:\n\n${errors.map(i => `\t${i}`).join("\n")}\n`);
  process.exit(1);
}

start_server(options);
