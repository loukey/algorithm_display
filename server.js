const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.static('./'));

let upload = multer({dest:'./img/upload_img'});

app.post('/', upload.fields([{name:'face', maxCount: 4}, {name:'reid', maxCount: 4}]), function (req, res) {
    const name = req.body.name;
    const sex = req.body.sex;
    const department = req.body.department;
    console.log(name)
    const face_name = "./img/upload_img/face/" + name + "_" + sex + "_" + department + ".jpg";
    const reid_name = "./img/upload_img/reid/" + name + "_" + sex + "_" + department + ".jpg";
    fs.rename(req.files['face'][0].path, face_name, (err)=>{
        if(err){
            console.log("error");
        }else{
            console.log("success");
        }
    });
    fs.rename(req.files['reid'][0].path, reid_name, (err)=>{
        if(err){
            console.log("error");
        }else{
            console.log("success");
        }
    });
    res.redirect("./04.html")
})

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});