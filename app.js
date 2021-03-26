const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const db = require('./server/models');
const cors = require('cors')
// This will be our application entry. We'll setup our server here.
const http = require('http');


// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));
app.use(cors());

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth',require('./Routers/Auth.router'))
app.use('/api/upload',require('./Routers/uploads.router'))

// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
//   message: 'Welcome to the beginning of nothingness.',
// }));

db.sequelize.sync({
    force : false
})
.then(async () => {

    console.info(`✔️ Database Connected`);
})
.catch(err => {
    console.log(err);
})


const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const path = require('path');
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.resolve('./uploads')));

const server = http.createServer(app);
server.listen(port);

module.exports = app;