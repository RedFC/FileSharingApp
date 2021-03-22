const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./server/models');
// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth',require('./Routers/Auth.router'))

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

db.sequelize.sync({
    force : false
})
.then(async () => {

    console.info(`✔️ Database Connected`);
})
.catch(err => {
    console.log(err);
})

module.exports = app;