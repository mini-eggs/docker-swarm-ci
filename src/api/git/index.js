import { Router } from "express";
import Verify from "verify-github-webhook";
import Shell from "shelljs";
import PKG from "../../../package.json";

/**
 * ShellJS async wrapper
 */
const exec = i =>
  new Promise((resolve, reject) => {
    Shell.exec(i, (code, data, err) => {
      if (code !== 0) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const app = new Router();

app.post("/", async (req, res) => {
  /**
   * Ensure secure.
   */
  const sig = req.headers["x-hub-signature"];
  const body = JSON.stringify(req.body);
  const password = req.instance_options.password;
  const status = Verify(sig, body, password);

  if (!status) {
    res.fail({ message: "Non-secure request." });
    return;
  }

  /**
   * Get data for shell commands.
   * Return message to request and run.
   */
  const { git, swarm, registry, name } = req.instance_options;
  const image = `${PKG.name}_${name}_${new Date().getTime()}`;
  const full_image = `${registry}/${image}`;
  const dir = `/tmp/${image}`;
  res.success({ message: "Updating swarm." });

  /**
   * Main work. Run shell commands.
   * Log if error.
   */
  try {
    await exec(`git clone ${git} ${dir}`);
    await exec(`cd ${dir} && docker build -t ${image} .`);
    await exec(`docker tag ${image} ${full_image}`);
    await exec(`docker push ${full_image}`);
    exec(`docker service update --image ${full_image} ${swarm}`); // Note: no need await here, seems to never complete in shell.
  } catch (e) {
    console.log("\nSomething went wrong.\n");
    console.log(e);
  }
});

export default app;
