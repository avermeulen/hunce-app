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

var hunches = require('./routes/hunches.js');

app.get('/', hunches.getHunches);

app.get('/hunch', function(req, res){
    res.render('hunch');
});

app.get('/hunch/edit/:id', hunches.editHunch);

app.post('/hunch/edit/:id', hunches.updateHunch);

app.get('/hunch/delete/:id', hunches.deleteHunch);

app.post('/hunch/new', hunches.saveHunch);

app.post('/proposal/new', function(req, res){
    res.redirect('/');
});

app.get("/search/hunches", hunches.searchHunches);

app.get('/*', function(req, res){
    res.redirect('/');
});

app.post('/*', function(req, res){
    res.redirect('/');
});

var port = process.env.port || 3007;
app.listen(port, function(){
    console.log("running at port :" , port);
    console.log(new Date());
});
