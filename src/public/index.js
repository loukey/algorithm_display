function initUI(){
    windowHeight = document.body.clientHeight;
    // console.log(windowHeight);
    setNavBoxHeight();
}
function setNavBoxHeight(){
    let navBox=document.getElementById("navigation").getElementsByTagName("td");
    // console.log(navBox[0].clientWidth);
    for(let i=0;i<navBox.length;i++){
        navBox[i].style.height=0.8*navBox[i].clientWidth+"px";
    }
    document.getElementById("navigation").style.height = 4*document.getElementById("navigation").clientWidth+"px";
}
