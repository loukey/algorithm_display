function init_state() {
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "get_state",
        }
        const select = document.getElementById("u18_input");
        for(let i=1; i<select.options.length; i++){
            values = select.options[i].value.split(" | ")
            send_message["camera" + i.toString()] = {
                "ip": values[3],
                "name": values[0],
                "position": values[1],
            }
            send_message["length"] = select.options.length-1
            const name = values[0]
        }
        wsocket.send(JSON.stringify(send_message))
    }
    wsocket.onmessage = (msg)=>{
        msg = msg.data.split(",");
        let name = msg[0];
        let position = msg[1];
        let open = msg[2];
        state_color = open==="false"?"red":"green";
        state = open==="false"?"异常":"正常";
        tr = document.createElement("tr");
        tb = document.getElementById("camera-state");
        tr.innerHTML = "<td style='color: #FFFFFF'>" + name + "</td><td style='color: #FFFFFF'>" + position +
                        "</td><td style='color: " + state_color + "'>" + state + "</td>";
        tb.appendChild(tr)
    }
}

function delete_option() {
    const select = document.getElementById("u18_input");
    const index = select.selectedIndex;
    let option = select.options[index].value;
    options = option.split(" | ");
    select.remove(index);
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "delete_camera",
            "ip": options[3],
        };
        wsocket.send(JSON.stringify(send_message))
    };
}

function register() {
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        const predict_types = document.getElementsByName("predict-type");
        let predict_type = "face"; //0:face 1:person-reid
        for(let i = 0; i<predict_types.length; i++){
            if(predict_types[i].checked){
                predict_type = predict_types[i].value
            }
        }
        let camera_ip = document.getElementById("u176_input").value;
        let camera_name = document.getElementById("u179_input").value;
        let camera_position = document.getElementById("u182_input").value;
        let send_message = {
            "head": "camera_register",
            "camera_ip": camera_ip,
            "camera_name": camera_name,
            "camera_position": camera_position,
            "predict_type": predict_type,
        };
        wsocket.send(JSON.stringify(send_message));
        // add table
        let tb = document.getElementById("camera_list");
        let tr = document.createElement("tr");
        const predict_type_name = predict_type==="0"?"人脸识别":"行人重识别";
        tr.innerHTML = "<td style=\"width: 40%;\">" + camera_ip + "</td><td style=\"width: 20%;\">" + camera_name
            + "</td><td style=\"width: 15%;\">" + camera_position + "</td>" + "</td><td style=\"width: 25%;\">" + predict_type_name + "</td>";
        tb.appendChild(tr)
    };
    wsocket.onmessage = (recieve_msg)=>{
        alert(recieve_msg.data)
    };
}

function get_camera(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "get_camera"
        };
        wsocket.send(JSON.stringify(send_message))
    };
    wsocket.onmessage = (msg)=>{
        camera_list = msg.data.split(",");
        const camera_ip = camera_list[0];
        const camera_name = camera_list[1];
        const camera_position = camera_list[2];
        const camera_type = camera_list[3];
        let tb = document.getElementById("camera_list");
        let tr = document.createElement("tr");
        const predict_type_name = camera_type==="0"?"人脸识别":"行人重识别";
        tr.innerHTML = "<td  style=\"width: 40%;\">" + camera_ip + "</td><td  style=\"width: 20%;\">" + camera_name
            + "</td><td  style=\"width: 15%;\">" + camera_position + "</td>" + "</td><td  style=\"width: 25%;\">" + predict_type_name + "</td>";
        tb.appendChild(tr)
    };
}

function init_index(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "get_camera"
        };
        wsocket.send(JSON.stringify(send_message))
    };
    wsocket.onmessage = (msg)=> {
        camera_list = msg.data.split(",");
        const camera_ip = camera_list[0];
        const camera_name = camera_list[1];
        const camera_position = camera_list[2];
        const camera_type = camera_list[3];
        const select = document.getElementById("u18_input");
        const new_option = new Option();
        new_option.text = camera_name + " | " + camera_position + " | " + camera_type + " | " + camera_ip
        select.add(new_option)
    }
}

function preview() {
    var wsocket = new WebSocket("ws://127.0.0.1:7999");
    wsocket.onopen = ()=>{
        const select = document.getElementById("u18_input");
        const index = select.selectedIndex;
        let option = select.options[index].value;
        camera_info = option.split(" | ")
        ip = camera_info[3]
        let send_message = {
            "head": "rtsp_connect",
            "url": "rtsp://admin:admin12345@" + ip + "/Streaming/Channels/1",
        };
        wsocket.send(JSON.stringify(send_message))
    };
    wsocket.onmessage = (msg)=>{
        alert(msg.data)
        var canvas = document.getElementById('video-canvas');
        var url = 'ws://'+document.location.hostname+':9999/';
        new JSMpeg.Player(url, {canvas: canvas});
    }
}

function init_ip(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "get_ip"
        };
        wsocket.send(JSON.stringify(send_message))
    };
    wsocket.onmessage = (msg)=>{
        ip_list = msg.data.split(",");
        const type = ip_list[0];
        const ip = ip_list[1];
        const port = ip_list[2];
        if (type==="face"){
            document.getElementById("face-ip").innerHTML = ip
            document.getElementById("face-port").innerHTML = port
        }
        else{
            document.getElementById("reid-ip").innerHTML = ip
            document.getElementById("reid-port").innerHTML = port
        }
    }
}

function change_ip(){
    const reid_ip = document.getElementById("u253_input").value
    const reid_port = document.getElementById("u255_input").value
    const face_ip = document.getElementById("u252_input").value
    const face_port = document.getElementById("u254_input").value
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "change_ip",
            "reid": {
                "ip": reid_ip,
                "port": reid_port,
            },
            "face": {
                "ip": face_ip,
                "port": face_port,
            }
        };
        wsocket.send(JSON.stringify(send_message))
    };
    document.getElementById("face-ip").innerHTML = face_ip
    document.getElementById("face-port").innerHTML = face_port
    document.getElementById("reid-ip").innerHTML = reid_ip
    document.getElementById("reid-port").innerHTML = reid_port
}

function init_people(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "get_people"
        };
        wsocket.send(JSON.stringify(send_message))
    };
    wsocket.onmessage = (msg)=>{
        const person = msg.data.split(",");
        const name = person[0];
        const sex = person[1];
        const department = person[2];
        let tr = document.createElement("tr");
        tr.innerHTML = "<td>" + name + "<td/>" + "<td>" + department + "<td/>" + "<td>" + sex + "<td/>"
        tr.addEventListener('click', ()=>{
            document.getElementById("image-display-face").src = "./img/upload_img/face/" + name + "_" + sex + "_" + department + ".jpg"
            document.getElementById("image-display-reid").src = "./img/upload_img/reid/" + name + "_" + sex + "_" + department + ".jpg"
        }, false);
        tb = document.getElementById("person_list");
        tb.appendChild(tr);
        const select = document.getElementById("people-display");
        let new_option = new Option();
        new_option.text = name + " | " + sex + " | " + department
        select.add(new_option)
    }
}

function add_person(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "add_person",
            "name": document.getElementById("u341_input").value,
            "sex": document.getElementById("u344_input").value,
            "department": document.getElementById("u347_input").value,
        };
        wsocket.send(JSON.stringify(send_message))
    };
}

function delete_person(){
    const select = document.getElementById("people-display");
    const index = select.selectedIndex;
    let option = select.options[index].value;
    options = option.split("|");
    select.remove(index);
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "delete_person",
            "name": options[0],
        }
        wsocket.send(JSON.stringify(send_message))
    }
    setTimeout(()=>{
        window.location.reload()
    }, 100)
}

function face_upload() {
    sp = document.getElementById("face_path")
    sp.innerHTML = document.getElementById('face-upload').value
    var file = document.getElementById('face-upload').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = function (event) {
            document.getElementById("image-display-face").src = event.target.result;
        };
    };
    reader.readAsDataURL(file);
}

function reid_upload() {
    sp = document.getElementById("reid_path")
    sp.innerHTML = document.getElementById('reid-upload').value
    var file = document.getElementById('reid-upload').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = function (event) {
            document.getElementById("image-display-reid").src = event.target.result;
        };
    }
    reader.readAsDataURL(file);
}

function capture_log(){
    const wsocket = new WebSocket('ws://127.0.0.1:7999');
    wsocket.onopen = ()=>{
        let send_message = {
            "head": "capture_log",
        }
        wsocket.send(JSON.stringify(send_message))
    }
    wsocket.onmessage = (msg)=>{
        console.log(msg)
        let log = msg.data.split(",");
        let time = log[0];
        let position = log[1];
        let department = log[2];
        let person = log[3];
        let ip = log[4];
        tr = document.createElement("tr");
        tr.innerHTML = "<td style='width: 40%'>" + time + "</td><td style='width: 30%'>" +  position + "</td><td style='width: 30%'>" + person + "</td>"
        tb = document.getElementById("person_list");
        tb.appendChild(tr);
        tr.addEventListener('click', ()=>{
            document.getElementById("u142_img").src = "./img/predict_result/" + ip + "/" + time + "-" + person + ".jpg"
        }, false)
    }
}

function display_camera() {
    const select = document.getElementById("u18_input");
    const index = select.selectedIndex;
    let option = select.options[index].value;
    options = option.split(" | ");
    const name = options[0];
    const position = options[1];
    const type = options[2];
    const ip = options[3];
    document.getElementById("name").innerHTML = name;
    document.getElementById("position").innerHTML = position;
    document.getElementById("type").innerHTML = type
    document.getElementById("ip").innerHTML = ip
}
