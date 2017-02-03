var http=require('http');
var express= require('express.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');
var server=express();
server.http().io();


server.configure(function(){
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded());
    server.use(cookieParser());
});




server.io.route('join', function(req) {
    var data=req.data;
    req.io.broadcast('joined',data);
    req.io.emit('join_me',data);

});


server.io.route('logout', function(req) {
    var data=req.data;
    req.io.broadcast('leave',data);
    req.io.emit('leave_me',data);

});

server.io.route('emit_message', function(req) {
    var data=req.data;
    req.io.broadcast('capture_message',data);
});


server.io.route('otra', function (req) {
    var options={
         host: 'localhost',
         port: '8000',
         path: '/otra'
    };

    http.get(options, function(res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(data) {
            body += data;
            });
            res.on('end', function() {
                var parsed = JSON.parse(body);
                req.io.emit('talk', {'message':parsed.sms})
            });
        });
    });


server.listen('3000');