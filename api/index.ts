// api/index.ts
import serverless from "serverless-http";
import { IncomingMessage, ServerResponse } from "http";
import { app } from "../server/app";         // adjust path only if your app.ts is somewhere else
import { registerRoutes } from "../server/routes";

let inited = false;
let serverlessHandler: ReturnType<typeof serverless> | null = null;

async function init() {
  if (inited) return;
  // registerRoutes may set up DB or other async work — run it
  await registerRoutes(app);
  serverlessHandler = serverless(app);
  inited = true;
}

// Vercel expects a default export (req, res)
export default async function (req: IncomingMessage & { url?: string }, res: ServerResponse) {
  await init();
  if (!serverlessHandler) {
    res.statusCode = 500;
    res.end("Server initialization failed");
    return;
  }
  // @ts-ignore - serverless handler signature matches
  return serverlessHandler(req, res);
}
