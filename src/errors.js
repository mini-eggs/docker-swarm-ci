const shell = require("shelljs");

export const collect_errors = options => {
  const errors = [];

  if (!shell.which("git")) {
    errors.push("Git is not installed.");
  }

  if (!shell.which("docker")) {
    errors.push("Docker is not installed.");
  }

  if (!options.git) {
    errors.push("No Git repository specified.");
  }

  if (!options.registry) {
    errors.push("No Docker registry specified.");
  }

  if (!options.swarm) {
    errors.push("No swarm instance specified.");
  }

  if (!options.name) {
    errors.push("No name is specified.");
  }

  if (!options.port) {
    errors.push("No port is specified.");
  }

  if (!options.password) {
    errors.push("No password is specified.");
  }

  return errors;
};
