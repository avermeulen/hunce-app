var express = require('express');
var expressHandlebars = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static('public'));

//setup handlebars
app.engine('hbs', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

var hunches = require('./routes/hunch.js');

app.get('/', hunches.getHunces);

app.get('/hunch', function(req, res){
    res.render('hunce');
});

app.get('/hunch/edit/:id', hunches.editHunce);

app.post('/hunch/edit/:id', hunches.updateHunce);

app.get('/hunch/delete/:id', hunches.deleteHunce);

app.post('/hunch/new', hunches.saveHunce);

app.post('/proposal/new', function(req, res){
    res.redirect('/');
});

app.get("/search/hunches", hunches.searchHunces);

app.get('/*', function(req, res){
    res.redirect('/');
});

app.post('/*', function(req, res){
    res.redirect('/');
});

var port = process.env.port || 3007;
app.listen(port, function(){
    console.log('running at port :' , port);
});
