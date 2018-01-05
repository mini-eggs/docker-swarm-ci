import Express from "express";
import { json } from "body-parser";
import CreateGitWebhook from "./git";

const cors = () => (_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // May want to set this to just GitHub.
  next();
};

const hooks = () => (_, res, next) => {
  res.success = i => res.json({ success: true, ...i });
  res.fail = i => res.json({ success: false, ...i });
  next();
};

export const start_server = ({ port, options }) => {
  const app = new Express();

  app.use(json());
  app.use(cors());
  app.use(hooks());
  options.forEach(i => app.use(CreateGitWebhook(i)));
  app.all("*", (_, res) => res.fail({ message: "Not found." }));

  app.listen(port, () => {
    const webhooks = options.map(i => `\t/${i.swarm}`).join("\n");
    console.log(`\n\tProcess has started on port ${port}\n`);
    console.log(`\tWebhooks created:\n\n${webhooks}\n`);
  });
};
