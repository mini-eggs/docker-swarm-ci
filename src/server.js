import Express from "express";
import { json } from "body-parser";
import API from "./api";

const cors = () => (_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
};

const pass_props = i => (req, _, next) => {
  req.instance_options = i;
  next();
};

const hooks = () => (_, res, next) => {
  res.success = i => res.json({ success: true, ...i });
  res.fail = i => res.json({ success: false, ...i });
  next();
};

export const start_server = options => {
  const app = new Express();

  app.use(json());
  app.use(cors());
  app.use(pass_props(options));
  app.use(hooks());
  app.use("/api", API);

  app.all("*", (_, res) => {
    res.success({ message: "Not found." });
  });

  app.listen(options.port, () => {
    console.log(`\n\tProcess has started on port ${options.port}\n`);
  });
};
