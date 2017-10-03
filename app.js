// Aoo.js setup
var express      = require('express'),
	config       = require('./config'),
	bodyParser   = require('body-parser'),
	app          = express(),
	session      = require('express-session'),
	cookieParser = require('cookie-parser'),
	swig         = require('swig'),
	marked       = require('swig-marked')

// Import modules

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/pub'));
app.use(cookieParser());
app.use(session({
	secret: "None",
	resave: false,
	saveUnintialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view cache', false);
swig.setDefaults({cache: false});
marked.useFilter(swig);
marked.useTag(swig);
marked.configure({
	gfm: false,
	tables: false,
	breaks: false,
	pedantic: false,
	sanitize: true,
	smartLists: false,
	smartypants: false
});

app.locals = {};

app.get('*', function(req, res, next) {
	next();
});

app.get('*', function(req, res) {
	res.render('error', { title: '404 Error', code: '404', message: 'That page was not found.' });
});

app.use(function(err, req, res, next) {
	console.log(err);
	res.render('error', { title: '500 Error', code: '500', message: 'Internal server error. No further information available.' });
});

var server = app.listen(config.app.port, function() {
	console.log('[DASHBOARD] Ready (' + config.app.port + ')');
});

process.on('unhandledRejection', function(reason, p) {
	console.log('Promise Rejection at: ', p, '\nReason: ', reason);
});