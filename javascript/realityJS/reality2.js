// Canvas dimensions
var canvasWidth = "70%";
var canvasHeight = "70%";
// Create canvas to put svg elements
var canvas = d3.select(".col-md-7")
                .append("svg")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("padding", "20px");
// Pipe dimension
var pipeLength = 600;
var pipeHeight = 20;
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
var pipeXOffset = 25;
var pipeYOffset = 100;
// Creating pipe element
var pipe = canvas
    .append("g").attr("class", "pipe")
    .attr("transform", "translate("+pipeXOffset+", 100)")
    .append("rect")
    .attr("width",pipeLength)
    .attr("height",pipeHeight)
    .attr("fill","url(#pipeGradient)");
// Creating heat element
//heat gradient
var sliderToPipeScale = d3.scaleLinear()
                            .domain([1/3, 1])
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
    .attr("transform", "translate("+pipeXOffset+", 100)")
    .append("rect")
    .attr("width",sliderToPipeScale(1/3))
    .attr("height",pipeHeight)
    .attr("fill","url(#heatGradient)");

// Slider
// var sliderWidth = pipeLength;
// Slider scale



// Slider setup
// var slider = d3
//     .sliderBottom()
//     .min(0)
//     .max(5)
//     .width(pipeLength)
//     .ticks(5)
//     .default(1)
//     .on("onchange", (d)=>{
//         heat.attr("width", sliderToPipeScale(d));
        // heat.attr("fill", heatMap(lenToheat(d)));
    // });
// Attatching slider
// canvas.append("g").attr("class","slider")
//     .attr("transform", "translate(100,50)")
//     .call(slider);

d3.select('.slider').on("input",function(){
    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    setImage(length);
    setText(length);
    setHeat(length);
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
    let opacReality = opacity(length, 0.3/3, 1/3);
    let opacBurner = opacity(length, 1.3/3, 2/3);

    d3.select("#reality").style("opacity", opacReality + "%");
    (length > 1/4)? d3.select("#reality").style("z-index", -3):d3.select("#reality").style("z-index", 1);
    d3.select("#burner").style("opacity", opacBurner + "%");
}

function setText(len){
    if(len<0.5/3){
        d3.select("#point1").style("visibility","hidden");
        d3.select("#point2").style("visibility","hidden");
    }else if(len<1.5/3 && len>0.5/3){
        d3.select("#point1").style("visibility","visible");
        d3.select("#point2").style("visibility","hidden");
    }else{
        d3.select("#point1").style("visibility","visible");
        d3.select("#point2").style("visibility","visible");
    }
    if(len == 1){
        d3.select("#idealize").style("visibility", "visible");
    }
    else{
        d3.select("#idealize").style("visibility", "hidden");
    }
}
function setHeat(len){
    if(len < 1/3)
        return;
    heat.attr("width", sliderToPipeScale(len));
}