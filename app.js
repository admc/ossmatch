
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});

app.set('view options', {
  layout: false
});

// Routes

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.post('/analyze', function(req, res){
    console.log(req);
    console.log(res);
    res.send('Crup');
});

// Only listen on $ node app.js

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port)
}
