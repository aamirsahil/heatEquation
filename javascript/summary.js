//To calculate the profile of the graph
function u(x,t){
    x += 0.6;
    x /= 2;
    return Math.exp(-Math.pow(Math.PI, 2)*t)*Math.sin(Math.PI*x) +
            Math.exp(-Math.pow(2*Math.PI, 2)*t)*Math.sin(2*Math.PI*x) +
            Math.exp(-Math.pow(3*Math.PI, 2)*t)*Math.sin(3*Math.PI*x);
}
//x=position, y=temperature, u=y(x)
var x = [...Array(101).keys()].map( d => (d*0.005));
var y = x.map( d => u(d,0));
var data = x.map( (d) => ({x: d, y: u(d,0)}));

//create svg elements
var canvas = d3.select("#summary")
                .append("svg")
                .attr("width","100%")
                .attr("height","100%");

var backGrndGradient = canvas.append("defs").append("linearGradient")
            .attr("id", "backGrndGradient")
            .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
backGrndGradient.append("stop")
        .attr("offset", "0%").style("stop-color", "#def0ff").style("stop-opacity", "1")
backGrndGradient.append("stop")
        .attr("offset", "50%").style("stop-color", "#96d0ff").style("stop-opacity", "1");
backGrndGradient.append("stop")
        .attr("offset", "100%").style("stop-color", "#def0ff").style("stop-opacity", "1");
var backGrnd = canvas.append("rect").attr("x",0).attr("y",0)
                .attr("width","100%").attr("height","100%")
                .attr("fill","url(#backGrndGradient)");

// Pipe dimension
var pipeLength = 350;
var pipeHeight = 20;
// Creating pipe element
var pipeXOffset = 50;
var pipeYoffset = 200;
var pipe1DHeight = 6;
var pipe1DYoffset = pipeYoffset + pipeHeight/2 - pipe1DHeight/2;
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
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, pipeLength]);

var heightScale = d3.scaleLinear()
                    .domain([d3.min(y),d3.max(y)])
                    .range([100,0]);
//graph
var graphXOffset = pipeXOffset;
var graphYOffset = 50;
var graphWidth = pipeLength+20;
var graphHeight = 200;
var graphBckGrnd = canvas.append("g")
                .attr("transform","translate(" + (graphXOffset-10) + "," + (graphYOffset) + ")")
                .append("rect")
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr("fill", "aliceblue")
                .attr("stroke", "black")
                .attr("stroke-width", "3px")
                .style("opacity","0%");
// T and x axis
var axisX = d3.axisBottom(widthScale)
            .ticks(0);
var axisT = d3.axisLeft(heightScale)
            .ticks(0);
canvas.append("g")
        .attr("transform", "translate(" + graphXOffset + "," + 110 + ")")
        .attr("id","Taxis")
        .attr("class", "yAxis")
        .call(axisT).style("opacity","0%");
canvas.append("g")
        .attr("transform","translate(" + graphXOffset +"," + pipe1DYoffset + ")")
        .attr("id","Xaxis")
        .attr("class", "xAxis")
        .call(axisX).style("opacity","0%");
canvas.append("text")
        .attr("class","label")
        .attr("text-anchor", "end")
        .attr("x", graphWidth + 30)
        .attr("y", pipe1DYoffset - 10)
        .text("Position").style("opacity","0%");
canvas.append("text")
    .attr("class","label")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", graphXOffset+15)
    .attr("x", -graphYOffset-12)
    .text("Temperature").style("opacity","0%");
//convert a set of d to correspondig set (x,y)
var line = d3.line()
    .x( d => widthScale(d.x))
    .y( d => heightScale(d.y) + 20);
    
// dash line
var dataLine = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (pipe1DYoffset-120) + ")")
        .selectAll(".dataLine")
        .data([[{x: data[20].x, y: 0},{x: data[20].x, y: data[20].y},{x: 0, y: data[20].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray",3).style("opacity","0%");
//discrete pipe
for(let i = 0; i<26; i++){
    canvas.append("g")
            .attr("transform","translate(" + pipeXOffset + "," + (pipe1DYoffset+3) + ")")
            .append("circle")
            .attr("class", "pointPipe").attr("id","p"+i)
            .attr("cx",widthScale(data[4*i].x)).attr("cy", 0).attr("r", 3).attr("fill","green");
}
// 1D pipe
var pipe1D = canvas.append("g")
            .attr("transform", "translate(" + pipeXOffset + "," + pipe1DYoffset + ")")
            .append("rect")
            .attr("width", pipeLength)
            .attr("height", pipe1DHeight)
            .attr("fill", "url(#pipeGradient)");
// normal pipe
var pipe = canvas
    .append("g").attr("class", "pipe")
    .attr("transform", "translate(" + pipeXOffset + ", " + pipeYoffset + ")")
    .append("rect")
    .attr("width",pipeLength)
    .attr("height",pipeHeight)
    .attr("fill","url(#pipeGradient)");

//heat gradient
var sliderToPipeScale = d3.scaleLinear()
                            .domain([1/4, 2/4])
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
    .attr("transform", "translate(" + pipeXOffset + ", " + pipeYoffset + ")")
    .append("rect")
    .attr("width",0)
    .attr("height",pipeHeight)
    .attr("fill","url(#heatGradient)");

var plot = canvas.append("g")
    .attr("transform","translate(" + pipeXOffset + "," + (pipe1DYoffset-120) + ")")
    .selectAll(".plot")
    .data([data])
    .enter()
    .append("path")
    .attr("class", "plot")
    .attr("d",line)
    .attr("fill","none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .style("visibility", "hidden");

canvas.append("g")
    .attr("transform","translate(" + pipeXOffset + "," + (pipe1DYoffset-120) + ")")
    .append("text")
    .attr("x", widthScale(.3))
    .attr("y", 0)
    .attr("id","tempText")
    .attr("dy", ".35em")
    .text("Temperature")
    .style("fill", "red").style("visibility","hidden");


d3.select('#slider1').on("input",function(){

    let value = d3.select(this).property("value");
    let max = d3.select(this).property("max");
    let min = d3.select(this).property("min");
    let length = value/(max - min);

    setText(length);
    setCanvas(length);
});

var text = [
    "We started with an real life example which we needed to model to understand how temperature changes in a material.",
    "Only the essential elements are kept and we idealized the system to study its relation.",
    "The system is then divided into smaller elements such that the governing physics is same in each division.",
    "The entire system is then placed in a geometric grid and we define necessary metrics to describe the system.",
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

function setCanvas(length)
{
    if(length <= 1/5){
        let len = (length-0)/(1/5 - 0);
        resetCanvas(1);
        d3.select(".instruct").text("Reality").style("font-size","1.1rem");
        setReality(len);
    }
    else if(length > 1/5 && length <= 2/5){
        resetCanvas(2);
        let len = (length-1/5)/(2/5 - 1/5);
        d3.select(".instruct").text("Idealiztion").style("font-size","1.1rem");
        setIdealization(len);
    }
    else if(length > 2/5 && length <= 3/5){
        resetCanvas(3);
        let len = (length-2/5)/(3/5 - 2/5);
        d3.select(".instruct").text("Discretization").style("font-size","1.1rem");
        setDiscretization(len);
    }
    else if(length > 3/5 && length <= 4/5){
        resetCanvas(4);
        let len = (length-3/5)/(4/5 - 3/5);
        d3.select(".instruct").text("Geometry").style("font-size","1.1rem");
        setGeomerty(len);
    }
    else{
        resetCanvas(5);
        let len = (length-4/5)/(5/5 - 4/5);
        d3.select(".instruct").text("Algebra").style("font-size","1.1rem");
        setMathematical(len);
    }
}
function setReality(len){
    d3.select("#reality").style("opacity",opacity(len,0,1) + "%");
}
function setIdealization(len){
    d3.select("#burner").style("opacity",opacity(len,0,1/4) + "%");
    setHeat(len);
    pipe.style("opacity",opacity(len,2/4,3/4) + "%");
    heat.style("opacity",opacity(len,2/4,3/4) + "%");
    (len>0.95)?plot.style("visibility","visible"):plot.style("visibility","hidden");
    (len>0.95)?d3.select("#tempText").style("visibility","visible"):d3.select("#tempText").style("visibility","hidden");
}
function setDiscretization(len){
    shrinkPipe(len);  
}
function setGeomerty(len){
    graphVisibility(len);
    graphAnimation(len);
}
function setMathematical(len){
    equationAppear(len);
}
//idealization
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
function setHeat(len){
    if(len < 1/4 || len > 2/4)
        return;
    heat.attr("width", sliderToPipeScale(len));
}
//discretization
function shrinkPipe(len){
    (len>0.95)?pipe1D.style("opacity","0%"):pipe1D.style("opacity","100%");
    len = pipeLength*len;
    pipe1D.attr("x", (len-10));
    pipe1D.attr("width", pipeLength - len + 10);
}
function graphVisibility(len){
    let opacityReverse = Math.abs(opacity(len,0,1/3) - 100);
    graphBckGrnd.style("opacity",opacityReverse + "%");
    d3.select("#Xaxis").style("opacity",opacityReverse + "%");
    d3.select("#Taxis").style("opacity",opacityReverse + "%");
    d3.selectAll(".label").style("opacity",opacityReverse + "%");
    dataLine.style("opacity",opacityReverse + "%");
    d3.select("#tempText").style("opacity",opacity(len,0,1/3) + "%");
}
var lentoTime = d3.scaleLinear().range([0,0.4]).domain([1/3,1]);
function graphAnimation(len){
    if(len < 1/3){
        let time = lentoTime(1/3);
        data = x.map( (d) => ({x: d, y: u(d,time)}));
    
        canvas.selectAll(".plot")
            .data([data])
            .attr("d",line);
        dataLine.data([[{x: data[20].x, y: 0},{x: data[20].x, y: data[20].y},{x: 0, y: data[20].y}]])
        .attr("d",line);
        return;
    }
    let time = lentoTime(len);
    data = x.map( (d) => ({x: d, y: u(d,time)}));

    canvas.selectAll(".plot")
        .data([data])
        .attr("d",line);
    dataLine.data([[{x: data[20].x, y: 0},{x: data[20].x, y: data[20].y},{x: 0, y: data[20].y}]])
    .attr("d",line);
}
function equationAppear(len){
    ((len > 0) && (len < 1/2))?d3.select("#eq01").style("visibility","visible"):d3.select("#eq01").style("visibility","hidden");
    (len > 1/2)?d3.select("#eq02").style("visibility","visible"):d3.select("#eq02").style("visibility","hidden");
}
d3.select("#nextBtn").on("mousedown", function() {window.location = "08_exercise.html";});
d3.select("#prevBtn").on("mousedown", function() {window.location = "06_mathematical.html";});

function resetCanvas(i){
    switch(i){
        case 1:
            graphBckGrnd.style("opacity","0%");
            d3.select("#Xaxis").style("opacity","0%");
            d3.select("#Taxis").style("opacity","0%");
            d3.selectAll(".label").style("opacity","0%");
            dataLine.style("opacity","0%");
            d3.select("#eq01").style("visibility","hidden");
            d3.select("#eq02").style("visibility","hidden");
            break;
        case 2:
            graphBckGrnd.style("opacity","0%");
            d3.select("#Xaxis").style("opacity","0%");
            d3.select("#Taxis").style("opacity","0%");
            d3.selectAll(".label").style("opacity","0%");
            dataLine.style("opacity","0%");
            d3.select("#reality").style("opacity","0%");
            d3.select("#eq01").style("visibility","hidden");
            d3.select("#eq02").style("visibility","hidden");
            break;
        case 3:
            d3.select("#burner").style("opacity","0%");
            plot.style("visibility","visible");
            graphBckGrnd.style("opacity","0%");
            d3.select("#Xaxis").style("opacity","0%");
            d3.select("#Taxis").style("opacity","0%");
            d3.selectAll(".label").style("opacity","0%");
            dataLine.style("opacity","0%");
            d3.select("#reality").style("opacity","0%");
            d3.select("#eq01").style("visibility","hidden");
            d3.select("#eq02").style("visibility","hidden");
            break;
        case 4:
            d3.select("#burner").style("opacity","0%");
            plot.style("visibility","visible");
            d3.select("#reality").style("opacity","0%");            
            d3.select("#eq01").style("visibility","hidden");
            d3.select("#eq02").style("visibility","hidden");
            break;
        case 5:
            d3.select("#burner").style("opacity","0%");
            plot.style("visibility","visible");
            d3.select("#reality").style("opacity","0%");
            break;
    }
}