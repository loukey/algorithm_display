const ws = require('ws')
const port = 7999
//rtsp://admin:admin12345@10.141.5.141/Streaming/Channels/1

const wsServer = new ws.Server({
    host: "127.0.0.1",
    port: port
})

console.log("WebSocket server is listening at port " + port)

wsServer.on("connection", add_listener)

function add_listener(wsocket) {
    wsocket.on("message", (data)=>{
        console.log("request data: " + data);
        data = JSON.parse(data)
        const head = data.head
        console.log(head)
        if(head==="rtsp_connect"){
            console.log(data.url)
            rtsp_connect(data.url)
            setTimeout(()=>{
                wsocket.send("connect successful");
                wsocket.close();
            }, 1000);
        }
        if(head==="disconnect"){
            wsocket.on("close",()=>{
                console.log("server close");
            })
            flag=false
        }
    })
}

function rtsp_connect(url){
    const zmq = require('zeromq');
    let sock = zmq.socket('push');
    sock.bindSync('tcp://127.0.0.1:3000');
    sock.send(JSON.stringify({
        "head": "camera",
        "url":url.toString()
    }));
}

