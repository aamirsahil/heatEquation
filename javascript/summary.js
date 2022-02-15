d3.select('#slider1').on("input",function(){

    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    setImage(length);
    setText(length);
});
var text = [
    "We started with an real life example which we needed to model to obtain relation between relevant quantities.",
    "Only the essential elements are kept and we idealized the system to study its relation.",
    "The system is then divided into smaller elements such that the governing physics is same in each division.",
    "The quantities are then described using mathematical elements.",
    "Through analytical or numerical manipulation we obtain the relationship between the physical quantities under investigation."
    ]
function setText(length)
{
    if(length < 1/5)
        document.getElementById('text').innerHTML = text[0];
    else if(length > 1/5 && length < 2/5)
        document.getElementById('text').innerHTML = text[1];
    else if(length > 2/5 && length < 3/5)
        document.getElementById('text').innerHTML = text[2];
    else if(length > 3/5 && length < 4/5)
        document.getElementById('text').innerHTML = text[3];
    else
        document.getElementById('text').innerHTML = text[4];
}

function setImage(length)
{
    if(length <= 1/5)
        document.getElementById('summary').style.backgroundImage = "url(\"images/summary/summary01.jpg\")";
    else if(length > 1/5 && length <= 2/5)
        document.getElementById('summary').style.backgroundImage = "url(\"images/summary/summary02.jpg\")";
    else if(length > 2/5 && length <= 3/5)
        document.getElementById('summary').style.backgroundImage = "url(\"images/summary/summary03.png\")";
    else if(length > 3/5 && length <= 4/5)
        document.getElementById('summary').style.backgroundImage = "url(\"images/summary/summary04.png\")";
    else
        document.getElementById('summary').style.backgroundImage = "url(\"images/summary/summary05.png\")";
}