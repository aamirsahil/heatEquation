// Canvas dimensions
var canvasWidth = 1000;
var canvasHeight = 450;
// Create canvas to put svg elements
var canvas = d3.select(".col-md-7")
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
var sliderToPipeScale = d3.scaleLinear()
                            .domain([0, 5])
                            .range([0, pipeLength]);

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
    .attr("width",sliderToPipeScale(1))
    .attr("height",pipeHeight)
    .attr("fill","url(#heatGradient)");

// Slider
var sliderWidth = pipeLength;
// Slider scale



// Slider setup
var slider = d3
    .sliderBottom()
    .min(0)
    .max(5)
    .width(pipeLength)
    .ticks(5)
    .default(1)
    .on("onchange", (d)=>{
        heat.attr("width", sliderToPipeScale(d));
        // heat.attr("fill", heatMap(lenToheat(d)));
    });
// Attatching slider
canvas.append("g").attr("class","slider")
    .attr("transform", "translate(100,50)")
    .call(slider);

d3.select('.slider').on("input",function(){
    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    setImage(length);
    turnOneD(length);
    setText(length);
});

function opacity(len,min,max)
{
    if(len > max)
        return 0;
    if(len < min)
        return 100;
    let slope = -100/(max - min);
    let opacity = slope*(len - max);
    return opacity;
}
function pipeThinning(len,min,max){
    if(len < min)
        return pipeHeight;
    let slope = (20 - pipeHeight)/(max - min);
    let height = slope*(len - max) + 20;
    return height;
}

function setImage(length){
    let opacReality = opacity(length, 0.3/4, 1/4);
    let opacBckGrnd = opacity(length, 1.3/4, 2/4);
    let opacBurner = opacity(length, 2.3/4, 3/4);

    d3.select("#reality").style("opacity", opacReality + "%");
    (length > 1/4)? d3.select("#reality").style("z-index", -3):d3.select("#reality").style("z-index", 1);
    d3.select("#backGrnd").style("opacity", opacBckGrnd + "%");
    d3.select("#burner").style("opacity", opacBurner + "%");
}

function turnOneD(length){
    let height = pipeThinning(length, 3.2/4, 1);
    console.log(height);
    pipe.attr("height", height);
    heat.attr("height", height);
}

function setText(len){
    if(len == 1){
        d3.select("#idealize").style("visibility", "visible");
    }
    else{
        d3.select("#idealize").style("visibility", "hidden");
    }
}
// function setImage(length)
// {
//     document.getElementById("idealize01").style.opacity = opacity(length,.1/5,1/5).toString() + "%";
//     document.getElementById("idealize02").style.opacity = opacity(length,1/5,2/5).toString() + "%";
//     document.getElementById("idealize03").style.opacity = opacity(length,2/5,3/5).toString() + "%";
//     document.getElementById("idealize04").style.opacity = opacity(length,3/5,4/5).toString() + "%";
//     document.getElementById("idealize05").style.opacity = opacity(length,4/5,5/5).toString() + "%";
//     document.getElementById("idealize06").style.opacity = opacity(length,4/5,1).toString() + "%";
// }


// function setText(length)
// {
//     if(length < (1/6)){
//         document.getElementById("idealExp").innerHTML = "We need to make approximations.";
//     }
//     else if(length > (1/6) && length < (2/6)){
//         document.getElementById("marker2").style.fill = "#5999e3";
//         document.getElementById("idealExp").innerHTML = "Rotation of the Earth discarded";
//     }
//     else if(length > (2/6) && length < (3/6)){
//         document.getElementById("marker3").style.fill = "#5999e3";
//         document.getElementById("idealExp").innerHTML = "Curvature of the earth discarded";
//         setZoomCurve(length);
//     }
//     else if(length > (3/6) && length < (4/6)){
//         document.getElementById("marker4").style.fill = "#5999e3";
//         document.getElementById("idealExp").innerHTML = "No heat source or sink present";
//     }
//     else if(length > (4/6) && length < (5/6)){
//         document.getElementById("marker5").style.fill = "#5999e3";
//         document.getElementById("idealExp").innerHTML = "We need gravity because it is essential";
//     }
//     else if(length >= (5/6) && length < (5.9/6)){
//         document.getElementById("marker6").style.fill = "#5999e3";
//         document.getElementById("idealExp").innerHTML = "Atmosphere is assumed to be homogenous";
//     }
//     else if(length >= (5.7/6)){
//         document.getElementById("idealExp").innerHTML = "Now we can consider the system as a column of air";
//     }
// }

// function setZoomCurve(length)
// {
//     let len = (length - 2/6) * 6;
//     let top = len * 90 - 3;
//     let radius = -180*length + 110;
// //    let zoom = 5400*length - 700;
//     let dim = 300 * len + 100;
//     let left = -150*len;
//     let zoom = 2400 * len + 1100;

//     document.getElementById("earth").style.backgroundSize = zoom.toString() + "px";
//     document.getElementById("earth").style.height = dim.toString() + "%";
//     document.getElementById("earth").style.width = dim.toString() + "%";
//     document.getElementById("earthContainer").style.borderRadius = radius.toString() + "%";
//     document.getElementById("earth").style.top = top.toString() + "%";
//     document.getElementById("earth").style.left = left.toString() + "%";
//     document.getElementById("space").style.borderRadius = radius.toString() + "%";
//     document.getElementById("cloud").style.borderRadius = radius.toString() + "%";
//     document.getElementById("atmos1").style.borderRadius = radius.toString() + "%";
//     document.getElementById("atmos2").style.borderRadius = radius.toString() + "%";
//     document.getElementById("atmos3").style.borderRadius = radius.toString() + "%";
//     document.getElementById("atmos4").style.borderRadius = radius.toString() + "%";
// }
// function setBtn(length)
// {
//     if(length < (1/6)){
//         resetButton(-1);
//     }
//     else if(length > (1/6) && length < (2/6)){
//         document.getElementById("rotBt").setAttribute("class","btn btn-secondary");
//         resetButton(0);
//     }
//     else if(length > (2/6) && length < (3/6)){
//         document.getElementById("curBt").setAttribute("class","btn btn-secondary");
//         resetButton(1);
//     }
//     else if(length > (3/6) && length < (4/6)){
//         document.getElementById("htBt").setAttribute("class","btn btn-secondary");
//         resetButton(2);
//     }
//     else if(length > (4/6) && length < (5/6)){
//         resetButton(3);
//     }
//     else if(length >= (5/6) && length < (5.9/6)){
//         document.getElementById("airBt").setAttribute("class","btn btn-secondary");
//         resetButton(4);
//     }
// }

// var btnId = ["rotBt", "curBt", "htBt", "grBt", "airBt"];

// function resetButton(i)
// {
//     for(let j = 0; j < 5; j++)
//     {
//         if(j <= i)
//         {
//             continue;
//         }
//         document.getElementById(btnId[j]).setAttribute("class","btn btn-primary");
//     }
// }

// d3.select('#selection').on("mouseover",function(){
//     this.style.backgroundColor = "#466999";
// })

// d3.select('#selection').on("mouseout",function(){
//     this.style.backgroundColor = "";
// })






























//d3.select('#myRange03').on("input",function(){
//
//    let check = true;
//    let value = d3.select(this).property("value");
//    let max = d3.select(this).property("max");
//    let min = d3.select(this).property("min");
//    let length = value/(max - min);
//
//    document.getElementById("img04").style.opacity = (100 * (1 - length)).toString() + "%";
//    document.getElementById("img05").style.opacity = (100 * (1 - length)).toString() + "%";
//
//    if(length > 0.5){
//        document.getElementById("desc").innerHTML = "For this we need to look at the atmosphere it self at first and idealize it to a " +
//                                    "column of air.";
//    }
//    else if(length <= 0.5){
//        document.getElementById("desc").innerHTML = "Both these systems require us to find the atmosphere pressure at the given altitude " +
//                "so that the difference in internal and external pressure can be calculated.";
//    }
//})