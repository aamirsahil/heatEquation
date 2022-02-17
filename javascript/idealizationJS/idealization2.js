//To calculate the profile of the graph
function u(x,t){
    return Math.exp(-Math.pow(Math.PI, 2)*t)*Math.sin(Math.PI*x) +
            Math.exp(-Math.pow(2*Math.PI, 2)*t)*Math.sin(2*Math.PI*x) +
            Math.exp(-Math.pow(3*Math.PI, 2)*t)*Math.sin(3*Math.PI*x);
}

//x=position, y=temperature, u=y(x)
var x = [...Array(101).keys()].map( d => (d*0.005));
var y = x.map( d => u(d,0));
var data = x.map( (d) => ({x: d, y: u(d,0)}));


//canvas dims
var canvasWidth = 850;
var canvasHeight = 550;
var graphOffeset = 50;
//define the entire canvas(right side)
var canvas = d3.select(".col-md-7")
                .append("svg")
                .attr("width",canvasWidth)
                .attr("height",canvasHeight)
                .style("overflow","visible");


//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth - graphOffeset]);

var heightScale = d3.scaleLinear()
                    .domain([d3.min(y),d3.max(y)])
                    .range([canvasHeight/4,0]);
//graph
var graphXOffset = 40;
var graphYOffset = 70;
var graphWidth = canvasWidth;
var graphHeight = canvasHeight/1.8;

//T and x axis

// var axisX = d3.axisBottom(widthScale)
//             .ticks(5);
// var axisT = d3.axisLeft(heightScale)
//             .ticks(5);
// canvas.append("g")
//         .attr("transform", "translate(" + graphXOffset + "," + graphYOffset + ")")
//         .attr("class", "yAxis")
//         .call(axisT);
// canvas.append("g")
//         .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/4+graphYOffset) + ")")
//         .attr("class", "xAxis")
//         .call(axisX);

//convert a set of d to correspondig set (x,y)
var line = d3.line()
            .x( d => widthScale(d.x))
            .y( d => heightScale(d.y));

var plot = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
            .selectAll(".plot")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "plot")
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .style("opacity", "0%");

// pipe
var pipeLength = widthScale(.5);
var pipeHeight = 20;
var pipeXPos = 40;
var pipeYPos = (canvasHeight/4+graphYOffset+20-pipeHeight/2);
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
// 1D pipe
var pipe1DHeight = 5;
var pipe1DYPos = (canvasHeight/4+graphYOffset+20-pipe1DHeight/2);
var pipe1D = canvas.append("g")
            .attr("transform", "translate(" + graphXOffset + "," + pipe1DYPos + ")")
            .append("rect")
            .attr("width", pipeLength)
            .attr("height", pipe1DHeight)
            .attr("fill", "url(#pipeGradient)");
//create the pipe
var pipe = canvas.append("g")
            .attr("transform", "translate(" + graphXOffset + "," + pipeYPos + ")")
            .append("rect")
            .attr("width", pipeLength)
            .attr("height", pipeHeight)
            .attr("fill", "url(#pipeGradient)");

// X Slider(triangular pointer)
var drawSlider = d3.line()
            .x( d => d.x)
            .y( d => d.y);

// var xSilderHeight = 40;
// var xSliderLength = 40;
// var xSliderData = [
//     {x:-xSliderLength/2, y:xSilderHeight},
//     {x:xSliderLength/2, y:xSilderHeight},
//     {x:0, y:0}
// ];
//create the slider
// var slider = canvas.append("g")
//                 .selectAll(".xSlider")
//                 .data([xSliderData])
//                 .enter()
//                 .append("path")
//                 .attr("class", "xSlider")
//                 .style("cursor", "w-resize")
//                 .attr("d",drawSlider)
//                 .attr("fill", "steelblue");
//place it under the pipe
// slider.attr("transform", "translate(" + pipeXPos + "," + (pipeYPos + pipeHeight) + ")");

//line(dashed)
var index = 0;
var dataLine = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
        .selectAll(".dataLine")
        .data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray",3);

//pointer(circle)
// var dataPointer = canvas.append("g")
//                 .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
//                 .append("circle")
//                 .attr("class", ".dataPointer")
//                 .attr("cx",widthScale(data[index].x)).attr("cy", heightScale(data[index].y)).attr("r", 6).attr("fill","none")
//                 .attr("stroke", "black").attr("stroke-width",5);

//value(text)
// var textXOffset = 15;
// var textYOffsetPos = 15;
// var textYOffsetTemp = 35;
// var textBckGndWidth = 70;
// var textBckGndHeight = 45;

// var textBackGround = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+5) + "," + (graphYOffset+5) + ")")
//                 .append("rect")
//                 .attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .attr("width", textBckGndWidth)
//                 .attr("height", textBckGndHeight)
//                 .attr("fill", "black")
//                 .style("opacity", "50%");

// var dataTextPos = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetPos) + ")")
//                 .append("text")
//                 .attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .attr("dy", ".35em")
//                 .text("x: " + data[index].x.toFixed(2))
//                 .style("fill", "white");

// var dataTextTemp = canvas.append("g")
//                 .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetTemp) + ")")
//                 .append("text")
//                 .attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .attr("dy", ".35em")
//                 .text("T: " + data[index].y.toFixed(2))
//                 .style("fill", "white");
//time data text
var timeTextBckGndWidth = 100;
var timeTextBckGndHeight = 30;
var timeXOffset = 0;
var timeYOffset = (canvasHeight/2+50);
var timeTextBackGround = canvas.append("g")
                .attr("transform","translate(" + timeXOffset + "," + timeYOffset + ")")
                .append("rect")
                .attr("x", widthScale(.25))
                .attr("y", heightScale(2.5))
                .attr("width", timeTextBckGndWidth)
                .attr("height", timeTextBckGndHeight)
                .attr("fill", "black").style("visibility","hidden");

var dataTextTime = canvas.append("g")
                .attr("transform","translate(" + timeXOffset + "," + timeYOffset + ")")
                .append("text")
                .attr("x", widthScale(.255))
                .attr("y", heightScale(2.2))
                .attr("dy", ".35em")
                .text("t: " + d3.select(".slider").property("value") + "s")
                .style("fill", "white").style("visibility","hidden");

var tempText =canvas.append("g")
                .attr("transform","translate(" + timeXOffset + "," + graphYOffset + ")")
                .append("text")
                .attr("x", widthScale(.3))
                .attr("y", 0)
                .attr("id","tempText")
                .attr("dy", ".35em")
                .text("Temperature")
                .style("fill", "red").style("visibility","hidden");
//DragMsg
var dragXOffset = -100;
var dragYOffset = (canvasHeight/2+200);


var dragTextTime = canvas.append("g")
                .attr("transform","translate(" + dragXOffset + "," + dragYOffset + ")")
                .append("text")
                .attr("x", widthScale(0.11))
                .attr("y", heightScale(1.9))
                .attr("dy", ".35em")
                .text("To know the variation of temperature in the rod qualitatively, drag the slider.")
                .style("fill", "rgb(73, 7, 134)").style("visibility","hidden").style("font-size","1.3rem");
//slider drag event
var bisect = d3.bisector(d => d).left;
var sliderPosToGraph = d3.scaleLinear()
            .domain([pipeXPos, (pipeXPos + pipeLength)])
            .range([d3.min(x), d3.max(x)]);
// var dragHandler = d3.drag()
//     .on("drag", function (event) {
//         d3.select(this)
//             .attr("transform", "translate(" + (event.x >= pipeXPos? ((event.x <= pipeXPos+pipeLength)?
//              event.x : pipeXPos+pipeLength): pipeXPos) +
//              "," + (pipeYPos + pipeHeight) + ")");
//         //move the line
//         let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(this).attr("transform")));

//         let index = bisect(x, sliderXPos);
//         dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
//         .attr("d",line);
//         //move the pointer
//         dataPointer.attr("cx", widthScale(data[index].x))
//                 .attr("cy", heightScale(data[index].y));
//         //move the text
//         textBackGround.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y));
//         dataTextPos.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .text("x: " + data[index].x.toFixed(2));
//         dataTextTemp.attr("x", widthScale(data[index].x))
//                 .attr("y", heightScale(data[index].y))
//                 .text("T: " + data[index].y.toFixed(2));
//     });
// dragHandler(slider);

//Time progressuon slider
var sliderYPos = (canvasHeight/2+150);

var sliderToPipeScale = d3.scaleLinear()
                            .domain([0, 5])
                            .range([0, pipeLength]);
// Slider setup
var slider = d3
    .sliderBottom()
    .min(0)
    .max(0.5)
    .width(pipeLength)
    .ticks(5)
    .default(0);
//slider
canvas.append("g").attr("class","timeSlider")
    .attr("transform", "translate(" + pipeXPos + "," + sliderYPos + ")")
    .call(slider).style("visibility", "hidden");

var tempTextScale = d3.scaleLinear().domain([0,0.5])
                        .range([0,heightScale(0)-20])
//time axis slider control
slider.on("onchange", () =>{
    dragTextTime.style("visibility", "hidden");
    let time = slider.value();
    data = x.map( (d) => ({x: d, y: u(d,time)}));

    canvas.selectAll(".plot")
        .data([data])
        .attr("d",line);

    tempText.attr("y",heightScale(data[50].y)-20);
    // //move the line
    // let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(".xSlider").attr("transform")));

    // let index = bisect(x, sliderXPos);
    // dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
    // .attr("d",line);
    // //move the pointer
    // dataPointer.attr("cx", widthScale(data[index].x))
    //         .attr("cy", heightScale(data[index].y));
    //     console.log(time);
    // //move the text
    dataTextTime.text("t: " + time.toFixed(2) + "s");
    // textBackGround.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y));
    // dataTextPos.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y))
    //         .text("x: " + data[index].x.toFixed(2));
    // dataTextTemp.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y))
    //         .text("T: " + data[index].y.toFixed(2));
});
function opacityPipe(len,min,max)
{
    if(len > max)
        return 0;
    if(len < min)
        return 100;
    let slope = -100/(max - min);
    let opacity = slope*(len - max);
    return opacity;
}
function opacityGraph(len,min,max)
{
    if(len > max)
        return 100;
    if(len < min)
        return 0;
    let slope = 100/(max - min);
    let opacity = slope*(len - min);
    return opacity;
}
function makeOneD(len){
    pipe.style("opacity", opacityPipe(len,0.2/2,1/2) + "%");
}
function turnGraphOn(len){
    plot.style("opacity", opacityGraph(len,1.2/2,1.9/2) + "%");
}
function turnText(len){
    (len > 0.2/2)? d3.select("#point1").style("visibility","visible"):d3.select("#point1").style("visibility","hidden");
    (len > 1.2/2)? d3.select("#point2").style("visibility","visible"):d3.select("#point2").style("visibility","hidden");
    (len == 1)? dragTextTime.style("visibility", "visible"):dragTextTime.style("visibility", "hidden");
    if(len > 1.9/2){
        timeTextBackGround.style("visibility","visible");
        dataTextTime.style("visibility","visible");
        d3.select(".timeSlider").style("visibility","visible");
        d3.select("#point3").style("visibility","visible");
        tempText.style("visibility","visible");
    }
    else{
        timeTextBackGround.style("visibility","hidden");
        dataTextTime.style("visibility","hidden");
        d3.select(".timeSlider").style("visibility","hidden");
        d3.select("#point3").style("visibility","hidden");
        tempText.style("visibility","hidden");
    }
}
//idelaization slider control
d3.select(".slider").on("input", () =>{
    let value = d3.select(".slider").property("value");
    let max = d3.select(".slider").property("max");
    let min = d3.select(".slider").property("min");
    let len = value/(max - min);

    makeOneD(len);
    turnGraphOn(len);
    turnText(len);

    // let y = x.map( d => u(d,time));
    // data = x.map( (d) => ({x: d, y: u(d,time)}));

    // canvas.selectAll(".plot")
    //     .data([data])
    //     .attr("d",line);

    // //move the line
    // let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(".xSlider").attr("transform")));

    // let index = bisect(x, sliderXPos);
    // dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
    // .attr("d",line);
    // //move the pointer
    // dataPointer.attr("cx", widthScale(data[index].x))
    //         .attr("cy", heightScale(data[index].y));
    //     console.log(time);
    // //move the text
    // dataTextTime.text("t: " + time + "s");
    // textBackGround.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y));
    // dataTextPos.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y))
    //         .text("x: " + data[index].x.toFixed(2));
    // dataTextTemp.attr("x", widthScale(data[index].x))
    //         .attr("y", heightScale(data[index].y))
    //         .text("T: " + data[index].y.toFixed(2));
});