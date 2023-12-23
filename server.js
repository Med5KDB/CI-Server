const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const options = express.json({type: 'application/json'});
app.post('/webhook', options, (req, res) => {
    res.status(202).send("Accepted");

    const githubEvent = req.headers['x-github-event'];
    console.log("Req header: " + JSON.stringify(req.headers));
    console.log("The github event: "+ githubEvent);
    if(githubEvent === "pull_request") {
        const data = req.body;
        const action = data.action;
        if (action == "opened") {
            console.log("A PR is opened");
        }
    }

})

function launchBuildProcess() {
    exec("npm install", (err, stdout, stderr) => {
        if(err) {
            console.error(`An error occured when executing npm install: ${err}`);
        }
        if(stderr) {
            console.error("npm install: " + stderr);
        }
        console.log("npm install..." + stdout);
        exec("npm build")
    })
}

app.listen(PORT, () => {
    console.log(`CI server is up and listening for events at ${PORT}`)
})
