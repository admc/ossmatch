
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
  console.log(typeof langs);
  console.log(langs[0]);
  for (var i=0;i<langs.length;i++){
    console.log(langs[i]);
    github.getRepoApi().getRepoLanguages(req.body.username, langs[i], function(err, languages) { 
      console.log(languages);
    }); 
  }
  res.send('Crup');
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
    res.end(JSON.stringify(repoList));
  });
  //github.getUserApi().getFollowers(req.body.username, function(err, followers) { sys.puts(followers.join('\n')); });
  //res.send('Crup');
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
