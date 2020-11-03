var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var routes = require('./routes/routes');

var app = express();
app.set('port', (process.env.PORT || 5000));

//view Engine. Serve the index from the angular main folder
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static folder for angular stuff
app.use(express.static(path.join(__dirname, 'dist/ccl-frontend')));

// Body Parser Middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/api', routes);


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

