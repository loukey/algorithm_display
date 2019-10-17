Stream = require('node-rtsp-stream')
//rtsp://admin:admin12345@10.141.5.141/Streaming/Channels/1
function rtsp_response(Url){
    stream = new Stream({
        name: 'name',
        streamUrl: Url,
        wsPort: 9999,
        width: 320,
        height: 180,
        ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30, // options with required values specify the value after the key
            '-s': '320x180'
        }
    })
}

module.exports = rtsp_response;
