/**
 * Created by za on 2019/10/11.
 */


var zmq = require('zeromq')
    , sock = zmq.socket('push');

sock.bindSync('tcp://127.0.0.1:3000');
console.log('Producer bound to port 3000');

setInterval(function(){
    console.log('sending work');
    sock.send('some work');
}, 500);