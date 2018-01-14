import { Router } from "express";
import Verify from "verify-github-webhook";
import Shell from "shelljs";
import PKG from "../package.json";

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

const run_update = async ({ git, swarm, registry, name }) => {
  const image = `${PKG.name}_${name}_${new Date().getTime()}`;
  const full_image = `${registry}/${image}`;
  const dir = `/tmp/${image}`;

  try {
    await exec(`git clone ${git} ${dir}`);
    await exec(`cd ${dir} && docker build -t ${image} .`);
    await exec(`docker tag ${image} ${full_image}`);
    await exec(`docker push ${full_image}`);
    await exec(`rm -rf ${dir}`);
    await exec(`docker service update -d --image ${full_image} ${swarm}`);
    return console.log(`\n\t${swarm} has been updated.\n`);
  } catch (e) {
    throw e;
  }
};

const verify = async (req, password) => {
  const sig = req.headers["x-hub-signature"];
  const input = JSON.stringify(req.body);
  const status = Verify(sig, input, password);

  if (status) {
    return status;
  } else {
    throw "Not secure.";
  }
};

export default ({ git, swarm, registry, name, password }) => {
  const app = new Router();

  app.post(`/${swarm}`, (req, res) => {
    verify(req, password)
      .then(async () => {
        res.success({ message: "Updating swarm." });
        run_update({ git, swarm, registry, name, password }).catch(e => {
          console.log("\n\tError occurred while attempting to update swarm.\n");
          console.error(`\t${e}`);
        });
      })
      .catch(e => {
        console.log(e);
        res.fail({ message: "Non-secure request." });
      });
  });

  return app;
};
