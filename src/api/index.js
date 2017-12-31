import { Router } from "express";
import GIT from "./git";

const app = new Router();
app.use("/git", GIT);

export default app;
