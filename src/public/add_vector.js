
function file_upload() {
    var file = document.getElementById('file-upload').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            let txt = event.target.result;
            document.getElementById("image-display").src = txt;
        };
    }
    reader.readAsDataURL(file);
}

function contentLoaded() {
    document.getElementById('file-upload').addEventListener('change',
        file_upload, false);
}

window.addEventListener("DOMContentLoaded", contentLoaded, false);