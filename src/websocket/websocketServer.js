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
        if(head==="rtsp_connect"){
            console.log(data.url)
            rtsp_connect(data.url)
            setTimeout(()=>{
                wsocket.send("connect successful");
                wsocket.close();
            }, 500);
        }
        else if(head==="camera_register"){
            camera_register(data)
            wsocket.close()
        }
        else if(head==="get_camera"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data));
            sock.on('message', (msg)=>{
                camera_list = JSON.parse(msg)["camera_list"];
                for(let camera of camera_list){
                    console.log(camera)
                    wsocket.send(camera.toString())
                }
            });
        }
        else if(head==="delete_camera"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data))
        }
        else if(head==="get_ip"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data))
            sock.on('message', (msg)=>{
                ip_lists = JSON.parse(msg)["ip_lists"]
                console.log(ip_lists)
                for(let ip_list of ip_lists){
                    wsocket.send(ip_list.toString())
                }
            })
        }
        else if(head==="change_ip"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data))
        }
        else if(head==="get_people"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data));
            sock.on('message', (msg)=>{
                let people_list = JSON.parse(msg)["people_list"];
                console.log(people_list);
                for(let person of people_list){
                    wsocket.send(person.toString())
                }
            })
        }
        else if(head==="add_person"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data))
        }
        else if(head==="delete_person"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data))
        }
        else if(head==="capture_log"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data));
            sock.on('message', (msg)=>{
                let logs = JSON.parse(msg)["capture_log"];
                console.log(logs);
                for(let log of logs){
                    wsocket.send(log.toString())
                }
            })
        }
        else if(head==="get_state"){
            const zmq = require('zeromq');
            let sock = zmq.socket('req');
            sock.connect('tcp://127.0.0.1:3001');
            sock.send(JSON.stringify(data));
            sock.on('message', (msg)=>{
                msg = JSON.parse(msg);
                console.log(msg);
                const length = msg["length"];
                for(let i=1; i<length+1; i++){
                    console.log(i)
                    console.log(msg["camera" + i.toString()])
                    let name = msg["camera" + i.toString()]["name"];
                    let position = msg["camera" + i.toString()]["position"];
                    let open = msg["camera" + i.toString()]["open"];
                    wsocket.send(name + "," + position + "," + open)
                }
            })
        }
        else if(head==="disconnect"){
            wsocket.on("close",()=>{
                console.log("server close");
            })
        }
    });
    wsocket.on("close", ()=>{
        console.log("close")
    })
}

function rtsp_connect(url){
    const zmq = require('zeromq');
    let sock = zmq.socket('req');
    sock.connect('tcp://127.0.0.1:3000');
    sock.send(JSON.stringify({
        "head": "camera",
        "url": url.toString()
    }));
}

function camera_register(data) {
    const zmq = require('zeromq');
    let sock = zmq.socket('req');
    sock.connect('tcp://127.0.0.1:3001');
    sock.send(JSON.stringify(data))
}
