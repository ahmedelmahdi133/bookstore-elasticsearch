import app from "../src/app.js";

export default function handler(req, res) {
  app.handle(req, res);
}
