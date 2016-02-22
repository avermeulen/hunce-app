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
var tags = require("./routes/tags.js")

var isLogged_in = function(req, res, next){
	return next();
}

app.get('/login', isLogged_in, function(req, res){
	res.render('login');
});

app.get('/', isLogged_in, hunches.getHunches);

app.get('/hunch/new', isLogged_in, hunches.newHunch);

app.post('/hunch/new', isLogged_in, hunches.saveHunch);

app.get('/hunch/edit/:id', isLogged_in, hunches.editHunch);

app.post('/hunch/edit/:id', isLogged_in, hunches.updateHunch);

app.get('/hunch/delete/:id', isLogged_in, hunches.deleteHunch);

app.post('/proposal/new', isLogged_in, function(req, res){
    res.redirect('/');
});

app.get("/search/hunches", isLogged_in, hunches.searchHunches);

app.post("/tags/add", isLogged_in, tags.saveTag);


app.get('/*', isLogged_in, function(req, res){
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
