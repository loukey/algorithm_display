zmq = require('zeromq')
Stream = require('node-rtsp-stream')
//rtsp://admin:admin12345@10.141.5.141/Streaming/Channels/1

var stream;
var flag = 0;
var sock = zmq.socket('rep');
sock.bindSync('tcp://127.0.0.1:3000');
console.log('Worker connected to port 3000');
sock.on('message', (msg)=>{
    msg = JSON.parse(msg)
    if(flag===0){
        flag += 1
        stream = new Stream({
            name: 'name',
            streamUrl: msg.url,
            wsPort: 9999,
            width: 345,
            height: 195,
            ffmpegOptions: { // options ffmpeg flags
                '-stats': '', // an option with no neccessary value uses a blank string
                '-r': 30, // options with required values specify the value after the key
                '-s': '480x270'
            }
        })
    }
    else{
        stream.stop()
        stream = new Stream({
            name: 'name',
            streamUrl: msg.url,
            wsPort: 9999,
            width: 480,
            height: 270,
            ffmpegOptions: { // options ffmpeg flags
                '-stats': '', // an option with no neccessary value uses a blank string
                '-r': 30, // options with required values specify the value after the key
                '-s': '480x270'
            }
        })
    }
})
