
/**
 * Module dependencies.
 */

var express = require('express');
var sys = require("sys");

var app = module.exports = express.createServer();
var GitHubApi = require("./support/node-github/lib/github").GitHubApi;
var github = new GitHubApi(true);

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

app.post('/languages', function(req, res){
  var langs = JSON.parse(req.body.languages);
  var langObj = {};
  
  var counter = 0
  
  langs.forEach(function(lang) {
    github.getRepoApi().getRepoLanguages(req.body.username, lang, function(err, languages){
      langObj[lang] = languages;
      counter += 1
      if (counter === langs.length) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write(JSON.stringify(langObj));
        res.end()
      }
    });
  })
});


app.post('/analyze', function(req, res){
  github.getRepoApi().getUserRepos(req.body.username, function(err, repos) {
    var repoList = [];
    var langList = [];
    for (var i=0;i<repos.length;i++){
      if (!repos[i].fork){
        repoList.push(repos[i]);
      }
    }
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(JSON.stringify(repoList));
    res.end();
  });
  //github.getUserApi().getFollowers(req.body.username, function(err, followers) { sys.puts(followers.join('\n')); });
  //res.send('Crup');
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
