var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');

var connection = require('./connection.js');
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
 
  console.log('The solution is: ', rows[0].solution);
});
 
connection.end();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

//setup handlebars
app.engine('hbs', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.get('/', function(req, res){
    res.render('hunces');
});

app.post('/proposal', function(req, res){
    console.log(req.body);
    res.redirect('/');
});

app.get('/hunce', function(req, res){
    //console.log(req.body);
    res.render('hunce');
});

var port = process.env.port || 3007;
app.listen(port, function(){
    console.log('running at port :' , port);
});
