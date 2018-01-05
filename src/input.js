import Spected from "spected";
import { isExist, isNumber, containsKey, format_errors } from "./spected";
import { which } from "shelljs";

const global_rules = {
  port: [[isExist, "Must have port."], [isNumber, "Port must be number."]],
  options: [[isExist, "Must have valid options. Nothing is valid."]]
};

const options_rules = {
  options: [
    [containsKey("git"), "Must have Git repository."],
    [containsKey("swarm"), "Must have Docker swarm."],
    [containsKey("registry"), "Must have Docker registry."],
    [containsKey("name"), "Must have name for each webhook."],
    [containsKey("password"), "Must have Git webhook password."]
  ]
};

export const format = async options => {
  if (typeof options.json !== "undefined") {
    const json = JSON.parse(options.json);
    const next_options = Array.isArray(json) ? json : [json];
    return { port: options.port, options: next_options };
  } else {
    const next_options = {
      git: options.git,
      swarm: options.swarm,
      registry: options.registry,
      name: options.name,
      password: options.password
    };
    return { port: options.port, options: [next_options] };
  }
};

export const verify = async ({ port, options }) => {
  const global_errors = format_errors(Spected(global_rules, { port }));

  const option_errors = options.reduce(
    (e, i) => [...e, ...format_errors(Spected(options_rules, { options: i }))],
    []
  );

  const errors = [...global_errors, ...option_errors];

  if (!which("git")) {
    errors.push("Git is not installed.");
  }

  if (!which("docker")) {
    errors.push("Docker is not installed.");
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return { port, options };
  }
};
