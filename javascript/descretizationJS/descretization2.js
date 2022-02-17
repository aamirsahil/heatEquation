//creating small balls
for(let i=0; i<50;i++){
    let x = 120 + i*(25);//x and y are the center of circle
    if(x>(800-10)) break;
    d3.select(".balls").append("use")
    .attr("href", "#ball").attr("class", "ball").attr("fill","url(#smallBallcolor)")
    .attr("x", x).attr("y", 260);
}

class SVG{
    constructor(){
        this.pipe = d3.select("#pipe");
        this.selectedBall = [
            d3.select("#selectedball1"),
            d3.select("#selectedball2"),
            d3.select("#selectedball3")
        ];
        this.setPipeColor();
        for(let i = 0;i<3;i++)
            this.setBallColor(i);
    }
}
//set the color of the pipe
SVG.prototype.setPipeColor = function(){
    //pipe color
    let silverColor = "rgb(138,138,138)";
    let silverColorCenter = "rgb(237,237,237)";
    let pipeGradient = d3.select("#system").append("defs").append("linearGradient")
                .attr("id", "pipeGradient")
                .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    pipeGradient.append("stop")
            .attr("offset", "0%").style("stop-color", silverColor).style("stop-opacity", "1")
    pipeGradient.append("stop")
            .attr("offset", "50%").style("stop-color", silverColorCenter).style("stop-opacity", "1");
    pipeGradient.append("stop")
            .attr("offset", "100%").style("stop-color", silverColor).style("stop-opacity", "1");

    this.pipe.attr("fill", "url(#pipeGradient)");
}
//set color of selected balls
SVG.prototype.setBallColor = function(i){
    let silverColor = "rgb(209, 208, 208)";
    let silverColorOut = "rgb(73, 73, 73)";
    let bigBallcolor = d3.select("#system").append("defs").append("radialGradient")
        .attr("id", "bigBallcolor" + i)
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%").attr("fx", "50%").attr("fy", "50%");
    bigBallcolor.append("stop").attr("class", "bigBallcolorcen" + i)
        .attr("offset", "0%").style("stop-color", silverColor).style("stop-opacity", "1")
    bigBallcolor.append("stop").attr("class", "bigBallcolorout" + i)
        .attr("offset", "100%").style("stop-color", silverColorOut).style("stop-opacity", "1");

    this.selectedBall[i].attr("fill", "url(#bigBallcolor" + i + ")")
        .attr("stroke", "black").attr("stroke-width", "1px");
    this.changeText(50,i);
}
//shrink pipe width on slider movement
SVG.prototype.shrinkPipe = function(len){
    len = 700*len;
    this.pipe.attr("x", 100 + len);
    this.pipe.attr("width", 700 - len);
}
//change color of 3 adjacent balls
SVG.prototype.changeColor = function(len,i){
    let colorCen = heatMap(lenToheat(len));
    let colorOut = heatMap(lenToheat(len - bigBallcolorOffset));
    d3.select(".bigBallcolorcen" + i).style("stop-color", colorCen);
    d3.select(".bigBallcolorout" + i).style("stop-color", colorOut);
}
//display the value of the temperature
SVG.prototype.changeText = function(len, i){
    $("#temp" + (i+1).toString()).text(len.toString());
}
//create 3 sliders(range input) and corresponding label
function heatTransfer(t, T0, k, A){

    let T = math.multiply( T0, math.expm(math.multiply(k*t, A)) );
    let newT = T._data.map( d => Math.round(d));

    for(let i = 0; i<3; i++){
        sliders[i].value(newT[i]); 
    }
    return newT;
}

function startTransfer(){
    clearInterval(intervalId);

    let t = 0
    let k = slider4.value();
    let A = [[-1, 1, 0],
             [1, -2, 1],
             [0, 1, -1]];
    let T0 = [slider1.value(),
            slider2.value(),
            slider3.value()];
    
    let tempDifferent = T0[0] != T0[1] || T0[1] != T0[2];

    if(tempDifferent)
        intervalId = window.setInterval(function(){
            t += 0.1;
            let T = heatTransfer(t, T0, k, A);
            let tempisDifferent = T[0] != T[1] || T[1] != T[2];
            if(!tempisDifferent) clearInterval(intervalId);
          }, 200);
}

var intervalId = null;
var sliderWidth = 150;
var sliderSpace = 100;
var slider1 = d3.sliderBottom()
    .min(0).max(255).width(sliderWidth).step(1)
    .ticks(0).default(50).on("onchange", (value)=>{
        svg.changeColor(value, 0);
        svg.changeText(value, 0);
    }).on("end",()=>{
        startTransfer();
    });
var slider2 = d3.sliderBottom()
    .min(0).max(255).width(sliderWidth).step(1)
    .ticks(0).default(50).on("onchange", (value)=>{
        svg.changeColor(value, 1);
        svg.changeText(value, 1);
    }).on("end",()=>{
        startTransfer();
    });
var slider3 = d3.sliderBottom()
    .min(0).max(255).width(sliderWidth).step(1)
    .ticks(0).default(50).on("onchange", (value)=>{
        svg.changeColor(value, 2);
        svg.changeText(value, 2);
    }).on("end",()=>{
        startTransfer();
    });

var slider4 = d3.sliderBottom()
    .min(1).max(10).width(sliderWidth).step(1)
    .ticks(0).default(1).on("end",()=>{
        startTransfer();
    });

var sliders = [slider1, slider2, slider3]
for(let i=0; i<3; i++){
    d3.select("#system").append("g")
        .attr("class", "tempSlider").style("visibility","hidden")
        .attr("transform", "translate(" + (75 + i*(sliderWidth + sliderSpace)) + ",50)")
        .call(sliders[i]);
}
d3.select("#system").append("g")
    .attr("class", "conSlider").style("visibility","hidden")
    .attr("transform", "translate(300,350)")
    .call(slider4);
// d3.select("#system").append("g").attr("class","slider")
//     .attr("id", "slider1")
//     .attr("transform", "translate(75,50)")
//     .call(slider);
    // .on("onchange", (d)=>{
    //     heat.attr("width", sliderToPipeScale(d));
    //     // heat.attr("fill", heatMap(lenToheat(d)));
    // });
//event Listeners

var clicked = false;
d3.selectAll(".ball").on("mousedown", function() {
    // if(d3.select("#pipe").attr("width").value) return;
    if(d3.select("#pipe").attr("width") < 0 && !clicked){
        let xPosBall = d3.select(this)._groups[0][0].x.animVal.value;
        let zoomPath = [{x: 0,y: 400},
                        {x:800,y:400},
                        {x:xPosBall,y:600-35},
                        {x: 0,y: 400}];
        clicked = true;
        d3.select(this).attr("stroke", "black").attr("stroke-width", "5px");
        d3.select(".balls").transition().attr("transform","translate(0,300)");
        createZoomEffect(zoomPath);
        makeVisible();
        turnSliderOff();
    }
});

function createZoomEffect(zoomPath){
    let line = d3.line()
            .x( d => d.x)
            .y( d => d.y);
    d3.select("#system")
            .selectAll("#zoomEffect")
            .data([zoomPath])
            .enter()
            .append("path")
            .attr("id", "zoomEffect")
            .attr("d",line)
            .attr("fill","black")
            .attr("stroke", "black")
            .attr("stroke-width", 5);
}

function makeVisible(){
    d3.selectAll(".bigBall").transition().delay(500).style("visibility", "visible");
    d3.selectAll(".bigBallText").transition().delay(500).style("visibility", "visible");
    d3.selectAll(".tempSlider").transition().delay(500).style("visibility", "visible");
    d3.selectAll(".conSlider").transition().delay(500).style("visibility", "visible");
    d3.select("#backGround").transition().delay(500).style("visibility", "visible");
    d3.select("#zoomEffect").transition().delay(500).style("visibility", "visible");
}
function turnSliderOff(){
    d3.select("#myRange").attr("disabled", true);
}

d3.select("#myRange").on("input", function(){
    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    svg.shrinkPipe(length);
    console.log(length);
    (length >= 1.0)?d3.select(".instruct").
        html("Click on a mass point to know more !"):
        d3.select(".instruct").
        html("Drag the slider to discretize !");
});

var bigBallcolorOffset = 50;
const heatMap = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,100]);
var lenToheat = d3.scaleLinear()
                .range([bigBallcolorOffset,100])
                .domain([0,255]);

var svg = new SVG();

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')



