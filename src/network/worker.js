/**
 * Created by za on 2019/10/11.
 */

var zmq = require('zeromq')
    , sock = zmq.socket('pull');

sock.connect('tcp://127.0.0.1:3000');
console.log('Worker connected to port 3000');

sock.on('message', function(msg){
    console.log('work: %s', msg.toString());
});