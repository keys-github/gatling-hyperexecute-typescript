import express, { Request, Response } from "express";

const app = express();
const PORT = 8080;

// Equivalent of /greet/{name} endpoint - returns plain text like Java version
app.get("/greet/:name", (req: Request, res: Response) => {
  res.type("text/plain").send(`Hello ${req.params.name}`);
});

// Equivalent of /slow endpoint - random delay up to 3 seconds, returns delay as plain number
app.get("/slow", (_req: Request, res: Response) => {
  const delay = Math.floor(Math.random() * 3000);
  setTimeout(() => {
    res.type("text/plain").send(String(delay));
  }, delay);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
