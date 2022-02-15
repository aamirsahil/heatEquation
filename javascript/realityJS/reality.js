// Canvas dimensions
var canvasWidth = 1000;
var canvasHeight = 450;
// Create canvas to put svg elements
var canvas = d3.select(".col-md-8")
                .append("svg")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("padding", "20px");
// Pipe dimension
var pipeLength = 600;
var pipeHeight = 100;
//pipe color
var silverColor = "rgb(138,138,138)";
var silverColorCenter = "rgb(237,237,237)";
var pipeGradient = canvas.append("defs").append("linearGradient")
            .attr("id", "pipeGradient")
            .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
pipeGradient.append("stop")
        .attr("offset", "0%").style("stop-color", silverColor).style("stop-opacity", "1")
pipeGradient.append("stop")
        .attr("offset", "50%").style("stop-color", silverColorCenter).style("stop-opacity", "1");
pipeGradient.append("stop")
        .attr("offset", "100%").style("stop-color", silverColor).style("stop-opacity", "1");
// Creating pipe element
var pipe = canvas
    .append("g").attr("class", "pipe")
    .attr("transform", "translate(100, 100)")
    .append("rect")
    .attr("width",pipeLength)
    .attr("height",pipeHeight)
    .attr("fill","url(#pipeGradient)");
// Creating heat element
//heat gradient
var heatGradient = canvas.append("defs").append("linearGradient")
            .attr("id", "heatGradient")
            .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
heatGradient.append("stop")
        .attr("offset", "0%").style("stop-color", "rgb(255,255,0)").style("stop-opacity", "0.9")
heatGradient.append("stop")
        .attr("offset", "100%").style("stop-color", "rgb(255,0,0)").style("stop-opacity", "0.01");

var heat = canvas
    .append("g").attr("class", "heat")
    .attr("transform", "translate(100, 100)")
    .append("rect")
    .attr("width",0)
    .attr("height",pipeHeight)
    .attr("fill","url(#heatGradient)");
// Slider
var sliderWidth = pipeLength;
// Slider scale
var sliderToPipeScale = d3.scaleLinear()
                            .domain([0, 5])
                            .range([0, pipeLength]);


// Slider setup
var slider = d3
    .sliderBottom()
    .min(0)
    .max(5)
    .width(pipeLength)
    .ticks(5)
    .default(0)
    .on("onchange", (d)=>{
        heat.attr("width", sliderToPipeScale(d));
        // heat.attr("fill", heatMap(lenToheat(d)));
    });
// Attatching slider
canvas.append("g").attr("class","slider")
    .attr("transform", "translate(100,50)")
    .call(slider);
// Fire
canvas.append("defs").append("pattern")
        .attr("id", "fireImage")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("height", 400).attr("width", 300)
        .append("image")
        .attr("x", -100).attr("y", -100).attr("href", "images/reality/fireImage.gif")
        .attr("height", 400).attr("width", 300);

var fireWidth = 100;
var fireHeight = 300;
var buttonHeight = 30;
var fire = canvas.append("g").attr("class","fire")
                .attr("transform", "translate(100, 300)")
                .append("rect")
                .attr("width", fireWidth)
                .attr("height", 0)
                .attr("fill", "url(#fireImage)");
// Button
var fireOn = false;
var button = canvas.append("g").attr("class","fireBtn")
                    .attr("transform", "translate(100, 355)")
                    .append("rect")
                    .attr("width", fireWidth)
                    .attr("height", buttonHeight)
                    .attr("fill", "grey")
                    .attr("stroke", "black")
                    .attr("stroke-width", "3px")
                    .on("mousedown", ()=>{
                        if(!fireOn){
                            fire.transition().attr("height", fireHeight);
                            d3.select(".fire").transition().attr("transform", "translate(100, 100)");
                            fireOn = true;
                        }else{
                            fire.transition().attr("height", 0);
                            d3.select(".fire").transition().attr("transform", "translate(100, 300)");
                            fireOn = false;
                        }
                    });

//Handles what need be turned visible
function turnVisible(i)
{
    i++;
    if(i >= 6){
        // Whenever go is pressed takes care of all the animation
        let idealize = document.getElementById("idealize");
        let nextPrev = document.getElementById("next0" + (i-1).toString());

        idealize.style.visibility = "visible";
        nextPrev.style.visibility = "hidden";

        setAnimation();
        return;

    }
    //takes care of 
    let img = document.getElementById("img0" + i.toString());
    let text = document.getElementById("text0" + i.toString());
    let nextCurr = document.getElementById("next0" + i.toString());
    let nextPrev = document.getElementById("next0" + (i-1).toString());

    nextCurr.style.visibility = "visible";
    nextPrev.style.visibility = "hidden";
    img.style.visibility = "visible";
    text.style.visibility = "visible";
}

function setAnimation(){
    moveImage();
    enlargeImage();
    disapperText();
    appearText();
}

function moveImage(){
    let img01 = document.getElementById("img01");
    let img02 = document.getElementById("img02");
    let img04 = document.getElementById("img04");
    let img05 = document.getElementById("img05");

    img01.style.animationName = "moveLeft";
    img02.style.animationName = "moveLeft";
    img04.style.animationName = "moveRight";
    img05.style.animationName = "moveRight";

    img01.style.animationFillMode = "forwards";
    img02.style.animationFillMode = "forwards";
    img04.style.animationFillMode = "forwards";
    img05.style.animationFillMode = "forwards";

    img01.style.animationDuration = "4s";
    img02.style.animationDuration = "4s";
    img04.style.animationDuration = "4s";
    img05.style.animationDuration = "4s";
}

function enlargeImage(){
    let img = document.getElementById("img03");

    img.style.animationName = "enlargeImage";
    img.style.animationFillMode = "forwards";
    img.style.animationDuration = "5s";
}

function disapperText(){
    let text01 = document.getElementById("text01");
    let text02 = document.getElementById("text02");
    let text03 = document.getElementById("text03");
    let text04 = document.getElementById("text04");
    let text05 = document.getElementById("text05");

    text01.style.animationName = "collapse";
    text02.style.animationName = "collapse";
    text03.style.animationName = "collapse";
    text04.style.animationName = "collapse";
    text05.style.animationName = "collapse";

    text01.style.animationFillMode = "forwards";
    text02.style.animationFillMode = "forwards";
    text03.style.animationFillMode = "forwards";
    text04.style.animationFillMode = "forwards";
    text05.style.animationFillMode = "forwards";

    text01.style.animationDuration = "1s";
    text02.style.animationDuration = "1s";
    text03.style.animationDuration = "1s";
    text04.style.animationDuration = "1s";
    text05.style.animationDuration = "1s";

}

function appearText(){
    let text = document.getElementById("idealize");

    text.style.animationName = "appear";

    text.style.animationFillMode = "forwards";

    text.style.animationDuration = "3s";
}