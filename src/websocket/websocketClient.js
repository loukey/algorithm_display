
function connect() {
    var wsocket = new WebSocket("ws://127.0.0.1:7999");
    wsocket.onopen = ()=>{
        alert("open")
        let url = document.getElementById("camera-url").value
        let send_message = {
            "head": "rtsp_connect",
            "url":url,
        }
        wsocket.send(JSON.stringify(send_message))
    }
    wsocket.onmessage = (ev)=>{
        alert(ev.data)
    }
    wsocket.onclose = ()=>{
        alert("close")
    }
    wsocket.onerror = ()=>{
        alert("error")
    }
}
