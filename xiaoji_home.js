
/**
 * Module dependencies.
 */

// test

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');



var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/xiaoji.log', 
      maxLogSize: 51200,
      backups:5,
      category: 'XIAOJI' 
    }
  ]
  // ,replaceConsole: true

});
var logger = log4js.getLogger('XIAOJI');
logger.setLevel('INFO');


var app = express();


var flashify = require('flashify');





// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon("public/img/favicon.ico"));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir: __dirname + '/public/tmp'}));
app.use(express.methodOverride());
 

var redis_port = 6380;
if (process.argv[2] == 'debug') {
	redis_port = 6379;
} 

//add session handler
var useMemmoryForSession = false;
if (useMemmoryForSession){
	var MemStore = express.session.MemoryStore;
	app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard dog", store:new MemStore({reapInterval: 60000 * 10}) }));
}
else{
	var RedisStore = require('connect-redis')(express);
	app.use(express.cookieParser());
	app.use(express.session({
	    store: new RedisStore({
		host: 'localhost',
		port: redis_port
	    }),
	    secret: 'xiaoji2014',
	    cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
    	    }
	}));
}


app.use(flashify);



// protection
//app.use(express.csrf());

// add log4js
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// this MUST be put after the session and cookie parser
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// put all routes in routes/index.js,
// if you want to add one, add it in that file plz.
routes(app);

app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Xiaoji home web server listening on port ' + app.get('port'));
});
