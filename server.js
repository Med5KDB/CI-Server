const express = require("express");
const { exec } = require("child_process");
const SmeeClient = require("smee-client");

const app = express();
const PORT = process.env.PORT || 3000;

const options = express.json({ type: "application/json" });
app.post("/webhook", options, (req, res) => {
  res.status(202).send("Accepted");

  const githubEvent = req.headers["x-github-event"];
  const data = req.body;
  const action = data.action;

  console.log("Req header: " + JSON.stringify(req.headers));
  console.log("The github event: " + githubEvent);
  console.log("The action" + action);

  if (
    (githubEvent === "push" && data["ref"] === "refs/heads/main") ||
    (githubEvent === "pull_request" && action == "opened")
  ) {
    console.log("New push");
    console.log("Starting build process...");
    launchBuildProcess();
  }
});
app.post("/events", options, (req, res) => {
  res.status(200).send("Event well received");
  const eventPayload = JSON.stringify(req.body);
  console.log("The event payload: " + eventPayload);
  console.log("The ref branch" + data.req);
  console.log("The ref branch" + data["req"]);
  console.log("Req header: " + JSON.stringify(req.headers));
});

function launchBuildProcess() {
  exec("npm install", (err, stdout, stderr) => {
    if (err) {
      console.error(`An error occured when executing npm install: ${err}`);
    }
    if (stderr) {
      console.error("npm install: " + stderr);
    }
    console.log("npm install..." + stdout);
    exec("npm test", (testErr, testStderr, testStdout) => {
      if (testErr) {
        console.error(`Tests failed: ${testErr}`);
      }
      if (testStderr) {
        console.error("npm test: " + testStderr);
      }
      console.log("npm test..." + testStdout);
      console.log("Tests passed");
    });
    exec("npm build", (buildErr, buildSterr, buildStout) => {
      if (buildErr) {
        console.error(`Build failed: ${buildErr}`);
      }
      if (buildSterr) {
        console.error("npm build: " + buildSterr);
      }
      console.log("npm build..." + buildStout);
      console.log("Build passed");
    });
  });
}

app.listen(PORT, () => {
  console.log(`CI server is up and listening for events at ${PORT}`);
});

const smee = new SmeeClient({
  source: "https://smee.io/NCLblu2qxIE7C0i",
  target: "http://localhost:3000/events",
  logger: console,
});
const events = smee.start();

process.on("SIGINT", () => {
  console.log("Stopping event forwarding and shutting down server...");
  events.close();
  server.close();
});
