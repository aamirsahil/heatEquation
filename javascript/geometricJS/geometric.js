//To calculate the profile of the graph
function u(x,t){
    return Math.exp(-Math.pow(Math.PI, 2)*t)*Math.sin(Math.PI*x) +
            Math.exp(-Math.pow(2*Math.PI, 2)*t)*Math.sin(2*Math.PI*x) +
            Math.exp(-Math.pow(3*Math.PI, 2)*t)*Math.sin(3*Math.PI*x);
}
function getXtranslatePos(ogString){
    let newString = (ogString.replace("translate(", "")).replace(")", "");
    return newString.split(",")[0];
}
function getYtranslatePos(string){
    let newString = (ogString.replace("translate(", "")).replace(")", "");
    return newString.split(",")[1];
}
//x=position, y=temperature, u=y(x)
var x = [...Array(101).keys()].map( d => (d*0.02));
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
                    .range([canvasHeight/2,0]);
//graph
var graphXOffset = 40;
var graphYOffset = 70;
var graphWidth = canvasWidth;
var graphHeight = canvasHeight/1.8;
var graphBckGrnd = canvas.append("g")
                .attr("transform","translate(0" + "," + (graphYOffset-10) + ")")
                .append("rect")
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr("fill", "aliceblue")
                .attr("stroke", "black")
                .attr("stroke-width", "3px");
//T and x axis

var axisX = d3.axisBottom(widthScale)
            .ticks(5);
var axisT = d3.axisLeft(heightScale)
            .ticks(5);
canvas.append("g")
        .attr("transform", "translate(" + graphXOffset + "," + graphYOffset + ")")
        .attr("class", "yAxis")
        .call(axisT);
canvas.append("g")
        .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/4+graphYOffset) + ")")
        .attr("class", "xAxis")
        .call(axisX);

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
            .attr("stroke-width", 5);

// pipe
var pipeLength = canvasWidth/1.3;
var pipeHeight = canvasHeight/6;
var pipeXPos = 80;
var pipeYPos = (canvasHeight/2+100);
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
//create the pipe
var pipe = canvas.append("g")
            .attr("transform", "translate(" + pipeXPos + "," + pipeYPos + ")")
            .append("rect")
            .attr("width", pipeLength)
            .attr("height", pipeHeight)
            .attr("fill", "url(#pipeGradient)");

// X Slider(triangular pointer)
var drawSlider = d3.line()
            .x( d => d.x)
            .y( d => d.y);

var xSilderHeight = 40;
var xSliderLength = 40;
var xSliderData = [
    {x:-xSliderLength/2, y:xSilderHeight},
    {x:xSliderLength/2, y:xSilderHeight},
    {x:0, y:0}
];
//create the slider
var slider = canvas.append("g")
                .selectAll(".xSlider")
                .data([xSliderData])
                .enter()
                .append("path")
                .attr("class", "xSlider")
                .style("cursor", "w-resize")
                .attr("d",drawSlider)
                .attr("fill", "steelblue");
//place it under the pipe
slider.attr("transform", "translate(" + pipeXPos + "," + (pipeYPos + pipeHeight) + ")");

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
var dataPointer = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("circle")
                .attr("class", ".dataPointer")
                .attr("cx",widthScale(data[index].x)).attr("cy", heightScale(data[index].y)).attr("r", 6).attr("fill","none")
                .attr("stroke", "black").attr("stroke-width",5);

//value(text)
var textXOffset = 15;
var textYOffsetPos = 15;
var textYOffsetTemp = 35;
var textBckGndWidth = 70;
var textBckGndHeight = 45;

var textBackGround = canvas.append("g")
                .attr("transform","translate(" + (graphXOffset+5) + "," + (graphYOffset+5) + ")")
                .append("rect")
                .attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y))
                .attr("width", textBckGndWidth)
                .attr("height", textBckGndHeight)
                .attr("fill", "black")
                .style("opacity", "50%");

var dataTextPos = canvas.append("g")
                .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetPos) + ")")
                .append("text")
                .attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y))
                .attr("dy", ".35em")
                .text("x: " + data[index].x.toFixed(2))
                .style("fill", "white");

var dataTextTemp = canvas.append("g")
                .attr("transform","translate(" + (graphXOffset+textXOffset) + "," + (graphYOffset+textYOffsetTemp) + ")")
                .append("text")
                .attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y))
                .attr("dy", ".35em")
                .text("T: " + data[index].y.toFixed(2))
                .style("fill", "white");


//slider drag event
var bisect = d3.bisector(d => d).left;
var sliderPosToGraph = d3.scaleLinear()
            .domain([pipeXPos, (pipeXPos + pipeLength)])
            .range([d3.min(x), d3.max(x)]);
var dragHandler = d3.drag()
    .on("drag", function (event) {
        d3.select(this)
            .attr("transform", "translate(" + (event.x >= 80? ((event.x <= pipeXPos+pipeLength)?
             event.x : pipeXPos+pipeLength): pipeXPos) +
             "," + (pipeYPos + pipeHeight) + ")");
        //move the line
        let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(this).attr("transform")));

        let index = bisect(x, sliderXPos);
        dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
        .attr("d",line);
        //move the pointer
        dataPointer.attr("cx", widthScale(data[index].x))
                .attr("cy", heightScale(data[index].y));
        //move the text
        textBackGround.attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y));
        dataTextPos.attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y))
                .text("x: " + data[index].x.toFixed(2));
        dataTextTemp.attr("x", widthScale(data[index].x))
                .attr("y", heightScale(data[index].y))
                .text("T: " + data[index].y.toFixed(2));
    });
dragHandler(slider);

//time axis slider control
d3.select(".slider").on("input", () =>{
    let time = d3.select(".slider").property("value");
    let y = x.map( d => u(d,time));
    data = x.map( (d) => ({x: d, y: u(d,time)}));

    canvas.selectAll(".plot")
        .data([data])
        .attr("d",line);

    //move the line
    let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(".xSlider").attr("transform")));

    let index = bisect(x, sliderXPos);
    dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
    .attr("d",line);
    //move the pointer
    dataPointer.attr("cx", widthScale(data[index].x))
            .attr("cy", heightScale(data[index].y));
    //move the text
    textBackGround.attr("x", widthScale(data[index].x))
            .attr("y", heightScale(data[index].y));
    dataTextPos.attr("x", widthScale(data[index].x))
            .attr("y", heightScale(data[index].y))
            .text("x: " + data[index].x.toFixed(2));
    dataTextTemp.attr("x", widthScale(data[index].x))
            .attr("y", heightScale(data[index].y))
            .text("T: " + data[index].y.toFixed(2));
});
