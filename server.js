const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const options = express.json({type: 'application/json'});
app.post('/webhook', options, (req, res) => {
    res.status(202).send("Accepted");

    const githubEvent = req.headers['x-github-event'];
    console.log(githubEvent);
    console.log(PORT);
    if(githubEvent === "pull_request") {
        const data = req.body;
        const action = data.action;
        if (action == "opened") {
            console.log("A PR is opened");
        }
    }

})

app.listen(PORT, () => {
    console.log(`CI server is up and listening on ${PORT}`)
})