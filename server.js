/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Validate env
for (const k of ["CORRECT_CIPHERTEXT", "SECRET_TO_RESET_LEADERBOARD"]) {
    if (!process.env[k]) throw new Error(`Missing env: ${k}`);
}

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
    // Set this to true for detailed logging:
    logger: false,
    trustProxy: true //take real client ip from proxy headers (from e.g. render) for @fastify/rate-limit
});

// Setup our static files
fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
    engine: {
        handlebars: require("handlebars"),
    },
});

// Rate-Limiting
fastify.register(require("@fastify/rate-limit"), {
    max: 120,
    timeWindow: '1 minute'
})

// temporarily holds the names of all submitters
const winnerNames = new Set();
const timestampsObj = {};
let wrongSubmissionsCounter = 0;

// Health
fastify.get("/health", async () => ({ok: true}));


/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
    // params is an object we'll pass to our handlebars template
    let params = {};


    // The Handlebars code will be able to access the parameter values and build them into the page
    return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our hall-of-fame route
 */
fastify.get("/hall-of-fame", function (request, reply) {
    // params is an object we'll pass to our handlebars template
    let params = {winnerNames: winnerNames, wrongSubmissionCounter: wrongSubmissionsCounter};

    // The Handlebars code will be able to access the parameter values and build them into the page
    return reply.view("/src/pages/hall-of-fame.hbs", params);
});

/**
 * Our RESET the hall-of-fame route.
 * Comment: This is bad in multiple ways:
 *      GET routes shouldn't change states and
 *      "secrets" should not be transmitted as URL query parameters, bc they can be logged by proxies etc.
 *      But I can't be bothered rn, sorry.
 */
fastify.get("/reset", function (request, reply) {

    let params = {winnerNames: winnerNames};

    if (request.query.secret === process.env.SECRET_TO_RESET_LEADERBOARD) {
        winnerNames.clear();
        //wrongSubmissionsCounter = 0; //it's funnier if we don't reset the counter.
        params.note = "Leaderboard has been reset!";
    } else {
        params.note = "Wrong reset secret. Did not reset the Leaderboard.";
    }

    return reply.view("/src/pages/hall-of-fame.hbs", params);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
    // Build the params object to pass to the template
    let params = {};

    const agentName = String(request.body.agentName).substring(0, 25).trim();
    //const agentNameEncoded = encodeURIComponent(agentName);
    if (agentName) params.agentName = agentName;

    let submitted_ciphertext = String(request.body.ciphertext);
    submitted_ciphertext = submitted_ciphertext.toUpperCase().replace(/\s/g, "");

    if (submitted_ciphertext === process.env.CORRECT_CIPHERTEXT) {
        winnerNames.add(agentName);
        // timestampsObj[agentName]= Math.min(timestampsObj[agentName],Date.now()) //TODO: Maybe add and display a timestamp per winner
        sendTelegramMessage(`Success: Agent ${agentName}`)// fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/sendMessage?chat_id=${process.env.TELEGRAM_BOT_CHANNEL_ID}&text=Succesfull%20Agent%20${agentNameEncoded}`);
        return reply.view("/src/pages/mission-complete.hbs", params);
    } else {
        params.wrongCipherText = submitted_ciphertext;
        wrongSubmissionsCounter += 1;
        sendTelegramMessage(`Agent ${agentName} failed.`)
    }

    // The Handlebars template will use the parameter values to update the page with the chosen color
    return reply.view("/src/pages/index.hbs", params);
});

function sendTelegramMessage(messageText) {
    void fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/sendMessage?chat_id=${process.env.TELEGRAM_BOT_CHANNEL_ID}&text=${encodeURIComponent(messageText)}`).catch(err => fastify.log.error({err}, 'telegram send failed'));
    return 0;
}

// Run the server and report out to the logs
const PORT = Number(process.env.PORT) || 6942;
fastify.listen(
    {port: PORT, host: "0.0.0.0"},
    function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    }
);