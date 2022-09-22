/** @format */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

// Dependencies for the Google Sheets API
const fs = require('fs');
const { google } = require('googleapis');
const service = google.sheets('v4');
const credentials = require('./credentials.json');

// --------------------------------------------------------------------------------------- //

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// --------------------------------------------------------------------------------- //

// Configure the Google auth client
const authClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const formData = async () => {
  console.log("sdsvdvsd")
  try {
    // Authorize the client
    const token = await authClient.authorize();

    // Set the client credentials
    authClient.setCredentials(token);

    // Get the rows
    const res = await service.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: '1k1wGKoWEnUTjkXHqWyf_7AbQMNPmcZWIr6tsrxrtyRE',
      range: 'A:E',
    });

    // An Output array to hold all data
    const Output = [];

    // Set rows to equal the rows
    const rows = res.data.values;

    // Check if we have any data and if we do, add it to our Output array
    if (rows.length) {
      // Remove the headers
      rows.shift();

      // For each row
      for (const row of rows) {
        Output.push({
          TimeStamp: row[0],
          Name: row[1],
          Email: row[2],
          InitialApplications: row[3],
          CV: row[4],
        });
      }
    } else {
      console.log('No data found.');
    }

    // Save output data to a Output.json file
    // fs.writeFileSync(
    //   'Output.json',
    //   JSON.stringify(Output, null, 2),
    //   function (err, file) {
    //     if (err) throw err;
    //     console.log('Saved!');
    //   }
    // );
    console.log()
  } catch (error) {
    console.log(error);

    // Exit the process with error
    process.exit(1);
  }
};

// formData();

// --------------------------------------------------------------------------------- //

module.exports = app;
