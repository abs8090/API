
require('./includes.js');

// SETUP WINSTON
// =============================================================================
// Sets up the winston logger instance.

var log = console.log;
var logger = new (winston.Logger)({transports: [new (winston.transports.Console)({colorize: true}), new (winston.transports.File)({filename: 'app.log', colorize: true}), new (winston.transports.File)({name: 'file#error', filename: 'error.log', colorize: true, level : 'error'})]
});

console.log = function hijacked_log(level) {
    if (arguments.length > 1 && level in this) {
        log.apply(this, arguments);
    }
    else {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('debug');
        log.apply(this, args);
    }
}

logger.extend(console);


// SETUP ROUTER
// =============================================================================
// Sets up the app's router.

var router = express.Router();

router.use(function(req, res, next) {
    console.info(' ');
    console.info(' ');
    console.info(req.method + ' request on: ' + req.originalUrl);
    next();
});

router.use(function (req, res, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
        return;
    }
    // Pass to next layer of middleware
    next();
});

// SETUP APP
// =============================================================================
// Sets up the express app using the above includes.

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('jsonp callback name', 'callback');
app.use(bodyParser.urlencoded({ 'extended': false }));
app.use(bodyParser.json({ 'type': 'application/vnd.api+json'}));
app.use(express.static(__dirname + '/public'));

busboy.extend(app, { upload: true, path: __dirname + '/public/uploads/tmp' });

// SETUP MONGODB CONNECTION
// =============================================================================
// Sets up the mongo db connection handlers.

var options = {
server:  {
poolSize: 5,
    auto_reconnect : true,
socketOptions: { keepAlive: 1 }
},
    replset : {socketOptions : { keepAlive: 1 }}
};

mongoose.connection.on('error', function(ref) { console.info('Mongo connection error')});
mongoose.connection.on('reconnect', function(ref) { console.info('Mongo reconnecting'); });
mongoose.connection.on('connecting', function(ref) { console.info('Mongo connecting');});
mongoose.connection.on('connected', function(ref) { console.info('Mongo connected');});
mongoose.connection.on('open', function(ref) { console.info('Mongo connection open');});
mongoose.connection.on('disconnecting', function(ref) { console.info('Mongo disconnecting');});
mongoose.connection.on('disconnected', function(ref) { console.info('Mongo disconnected');});
mongoose.connection.on('close', function(ref) { console.info('Mongo connection closed');});
mongoose.connection.on('reconnected', function(ref) { console.info('Mongo reconnected');});
mongoose.connection.on('fullsetup', function(ref) { console.info('Mongo full setup');});
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/aziz', options);

// START THE SERVER
// =============================================================================
//  Finally, get the server started. Before using the router, prefix all
//  endpoints with '/api'.

var obj = (require('./routes.js'))
obj(router);
app.use('/', router);

console.info('Listening on http');
var server = http.Server(app);

// listen on port and display
server.listen(8080);
console.info('Server started');
console.info('Currently accepting connections on port 8080');


