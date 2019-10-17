
function rtsp_request (){
    var canvas = document.getElementById('video-canvas');
    var url = 'ws://'+document.location.hostname+':9999/';
    var player = new JSMpeg.Player(url, {canvas: canvas});
}
