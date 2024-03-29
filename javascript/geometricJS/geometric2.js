//To calculate the profile of the graph
function u(x,t){
        x += 0.6;
        x /= 2;
        return 25*(Math.exp(-Math.pow(Math.PI, 2)*t)*Math.sin(Math.PI*x) +
                Math.exp(-Math.pow(2*Math.PI, 2)*t)*Math.sin(2*Math.PI*x) +
                Math.exp(-Math.pow(3*Math.PI, 2)*t)*Math.sin(3*Math.PI*x))+20;
    }
function getXtranslatePos(ogString){
        let newString = (ogString.replace("translate(", "")).replace(")", "");
        return newString.split(",")[0];
    }
function getYtranslatePos(string){
        let newString = (ogString.replace("translate(", "")).replace(")", "");
        return newString.split(",")[1];
    }
// function getYtranslatePos(ogString){
//     let newString = (ogString.replace("translate(", "")).replace(")", "");
//     return newString.split(",")[1];
// }
//x=position, y=temperature, u=y(x)
var x = [...Array(101).keys()].map( d => (d*0.005));
var y = x.map( d => u(d,0));
var data = x.map( (d) => ({x: d, y: u(d,0)}));


//canvas dims
var canvasWidth = 750;
var canvasHeight = 550;
var graphOffeset = 50;
//define the entire canvas(right side)
var canvas = d3.select("#Graph")
        .attr("width",canvasWidth)
        .attr("height",canvasHeight)
        .style("overflow","visible");
//width and height scale inside graph
var widthScale = d3.scaleLinear()
                    .domain([d3.min(x), d3.max(x)])
                    .range([0, canvasWidth - graphOffeset]);

var heightScale = d3.scaleLinear()
                    .domain([0,d3.max(y)])
                    .range([canvasHeight/2,0]);
//graph
var graphXOffset = 60;
var graphYOffset = 40;
var graphWidth = canvasWidth;
var graphHeight = canvasHeight/1.5;
var graphBckGrnd = canvas.append("g")
                .attr("transform","translate("+20 + "," + (graphYOffset-10) + ")")
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
        .attr("transform", "translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .attr("class", "yAxis")
        .call(axisT);
canvas.append("g")
        .attr("transform","translate(" + graphXOffset +"," + (canvasHeight/2+graphYOffset+40) + ")")
        .attr("class", "xAxis")
        .call(axisX);
canvas.append("text")
        .attr("text-anchor", "end")
        .attr("x", canvasWidth - graphOffeset/2)
        .attr("y", (canvasHeight/2+graphYOffset+40) - 10)
        .text("Position(m)");
canvas.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", graphXOffset/2 + 5)
    .attr("x", -graphYOffset-40)
    .text("Temperature(C)");

//convert a set of d to correspondig set (x,y)
var line = d3.line()
            .x( d => widthScale(d.x))
            .y( d => heightScale(d.y));

var plot = canvas.append("g")
            .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
            .selectAll(".plot")
            .data([data])
            .enter()
            .append("path")
            .attr("class", "plot")
            .attr("d",line)
            .attr("fill","none")
            .attr("stroke", "red")
            .attr("stroke-width", 1);

// pipe
var pipeLength = canvasWidth/1.3;
var pipeHeight = 10;
var pipeXPos = 80;
var pipeYPos = (canvasHeight/2+200);
// pipe color
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
// create the pipe
var pipe = canvas.append("g")
            .attr("transform", "translate(" + pipeXPos + "," + pipeYPos + ")")
            .append("rect")
            .attr("width", pipeLength)
            .attr("height", pipeHeight)
            .attr("fill", "url(#pipeGradient)");
//drag prompt
var dragTextTime = canvas.append("g")
            .attr("transform","translate(" + pipeXPos + "," + (pipeYPos-40) + ")")
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", ".35em")
            .text("Drag slider to select different x.")
            .style("fill", "rgb(73, 7, 134)").style("font-size","1.1rem");
// X Slider(triangular pointer)
var drawSlider = d3.line()
            .x( d => d.x)
            .y( d => d.y);

var xSilderHeight = 30;
var xSliderLength = 30;
var xSliderData = [
    {x:-xSliderLength/2, y:-xSilderHeight},
    {x:xSliderLength/2, y:-xSilderHeight},
    {x:0, y:0}
];
// create the slider
var slider = canvas.append("g")
                .selectAll(".xSlider")
                .data([xSliderData])
                .enter()
                .append("path")
                .attr("class", "xSlider")
                .attr("d",drawSlider)
                .attr("fill", "steelblue");
// place it under the pipe
slider.attr("transform", "translate(" + (pipeXPos+parseInt(pipeLength/33)*7) + "," + (pipeYPos + pipeHeight) + ")");

//line(dashed)
var index = 7;
var dataLinePrev = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .selectAll(".dataLine")
        .data([[{x: data[3*(index-1)].x, y: 0},{x: data[3*(index-1)].x, y: data[3*(index-1)].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("id","Tprev")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray",3);
var dataLineCurr = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .selectAll(".dataLine")
        .data([[{x: data[3*index].x, y: 0},{x: data[3*index].x, y: data[3*index].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("id","Tcurr")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray",3);
        
var dataLineCurrX = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .selectAll(".dataLine")
        .data([[{x: data[3*index].x, y: data[3*index].y},{x: 0, y: data[3*index].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("id","Xcurr")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray",3);
var dataLineNext = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .selectAll(".dataLine")
        .data([[{x: data[3*(index+1)].x, y: 0},{x: data[3*(index+1)].x, y: data[3*(index+1)].y}]])
        .enter()
        .append("path")
        .attr("class", "dataLine")
        .attr("id","Tnext")
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray",3);
//graph indicators
// current X
var Xcurr = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .append("text").attr("id","Xcurr")
        .attr("x",widthScale(data[3*(index)].x/2)).attr("y",heightScale(data[3*(index)].y)-5)
        .text("x");
// current T
var Tcurr = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .append("text").attr("id","Tcurr").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x",-heightScale(data[3*(index)].y)-10).attr("y",widthScale(data[3*(index)].x) - 5)
        .text("T(x)");
// Prev T
var Tprev = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .append("text").attr("id","Tprev").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)").attr("fill","red")
        .attr("x",-heightScale(data[3*(index-1)].y)-10).attr("y",widthScale(data[3*(index-1)].x) - 5)
        .text("T(x - dx)");
// Next T
var Tnext = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .append("text").attr("id","Tnext").attr("text-anchor", "end")
        .attr("transform", "rotate(-90)").attr("fill","blue")
        .attr("x",-heightScale(data[3*(index+1)].y)-10).attr("y",widthScale(data[3*(index+1)].x) - 5)
        .text("T(x + dx)");
// dx
var dx = canvas.append("g")
        .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
        .append("text").attr("id","dx")
        .attr("x",widthScale(data[3*(index)].x)+5).attr("y",heightScale(0)+15)
        .text("dx");
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
var TextBckGndWidth = 260;
var TextBckGndHeight = 90;
var TextBackGround = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("rect")
                .attr("x", widthScale(.35))
                .attr("y", heightScale(d3.max(y)))
                .attr("width", TextBckGndWidth)
                .attr("height", TextBckGndHeight)
                .attr("fill", "black");

var dataTextCurr = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("text")
                .attr("x", widthScale(.355))
                .attr("y", heightScale(d3.max(y)-4))
                .attr("dy", ".35em")
                .text("T(x): " + data[3*index].y.toFixed(2) + "C")
                .style("fill", "white");
var dataTextPrev = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("text")
                .attr("x", widthScale(.355))
                .attr("y", heightScale(d3.max(y)-4))
                .attr("dy", "1.65em")
                .text("T(x-dx): " + data[3*(index-1)].y.toFixed(2) + "C")
                .style("fill", "white");
var dataTextNext = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("text")
                .attr("x", widthScale(.355))
                .attr("y", heightScale(d3.max(y)-4))
                .attr("dy", "2.95em")
                .text("T(x+dx): " + data[3*(index+1)].y.toFixed(2) + "C")
                .style("fill", "white");
let derivative = data[3*(index)+1].y-2*data[3*(index)].y+data[3*(index)-1].y;
var dataTextDer = canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + graphYOffset + ")")
                .append("text")
                .attr("x", widthScale(.355))
                .attr("y", heightScale(d3.max(y)-4))
                .attr("dy", "4.25em")
                .text("Derivative: " + derivative.toFixed(5) + "C/s")
                .style("fill", "white");
//slider drag event
var bisect = d3.bisector(d => d).left;
var sliderPosToGraph = d3.scaleLinear()
            .domain([pipeXPos, (pipeXPos + pipeLength)])
            .range([d3.min(x), d3.max(x)]);

function step(mousePos){
        let stepValue = parseInt(pipeLength/33);
        let index = parseInt((mousePos-pipeXPos)/stepValue);
        let dragPos = index*stepValue + pipeXPos;
        return dragPos;
}
function stepId(mousePos){
        let stepValue = parseInt(pipeLength/33);
        let index = parseInt((mousePos-pipeXPos)/stepValue);
        return index;
}
var dragHandler = d3.drag()
    .on("drag", function (event) {
        document.body.style.cursor='grabbing';
        let mousePos = step(event.x);
        let currId = stepId(event.x);
        if(currId>0 && currId<34)
                d3.select(this)
                .attr("transform", "translate(" + (event.x >= pipeXPos? ((event.x <= pipeXPos+pipeLength)?
                mousePos : pipeXPos+parseInt(pipeLength/33)*33): pipeXPos+parseInt(pipeLength/33)) +
                "," + (pipeYPos + pipeHeight) + ")");
        currId = (currId>32)?32:currId;
        currId = (currId<1)?1:currId;
        //move the line
        // let index = bisect(x, sliderXPos);
        // selectedId = index;
        // console.log(index);
        let prevId = currId - 1;
        let nextId = currId + 1;
        dataLinePrev.data([[{x: data[3*prevId].x, y: 0},{x: data[3*prevId].x, y: data[3*prevId].y}]])
        .attr("d",line);
        dataLineCurr.data([[{x: data[3*currId].x, y: 0},{x: data[3*currId].x, y: data[3*currId].y}]])
        .attr("d",line);
        dataLineCurrX.data([[{x: data[3*currId].x, y: data[3*currId].y},{x: 0, y: data[3*currId].y}]])
        .attr("d",line);
        dataLineNext.data([[{x: data[3*nextId].x, y: 0},{x: data[3*nextId].x, y: data[3*nextId].y}]])
        .attr("d",line);
    
        let index = currId;
        selectedId = currId;
        Xcurr.attr("x",widthScale(data[3*(index)].x/2)).attr("y",heightScale(data[3*(index)].y)-5);
        Tcurr.attr("x",-heightScale(data[3*(index)].y)-10).attr("y",widthScale(data[3*(index)].x) - 5);
        dx.attr("x",widthScale(data[3*(index)].x)+5).attr("y",heightScale(0)+15);
        Tprev.attr("x",-heightScale(data[3*(index-1)].y)-10).attr("y",widthScale(data[3*(index-1)].x) - 5);
        Tnext.attr("x",-heightScale(data[3*(index+1)].y)-10).attr("y",widthScale(data[3*(index+1)].x) - 5);
        //change temp data
        dataTextCurr.text("T(x): " + data[3*(index)].y.toFixed(2) + "C");
        dataTextPrev.text("T(x-dx): " + data[3*(index-1)].y.toFixed(2) + "C");
        dataTextNext.text("T(x+dx): " + data[3*(index+1)].y.toFixed(2) + "C");
        let derivative = data[3*(index)+1].y-2*data[3*(index)].y+data[3*(index)-1].y;
        dataTextDer.text("Derivative: " + derivative.toFixed(5) + "C/s");
        // dataLine.data([[{x: data[index].x, y: 0},{x: data[index].x, y: data[index].y},{x: 0, y: data[index].y}]])
        // .attr("d",line);
        // //move the pointer
        // dataPointer.attr("cx", widthScale(data[index].x))
        //         .attr("cy", heightScale(data[index].y));
        // //move the text
        // textBackGround.attr("x", widthScale(data[index].x))
        //         .attr("y", heightScale(data[index].y));
        // dataTextPos.attr("x", widthScale(data[index].x))
        //         .attr("y", heightScale(data[index].y))
        //         .text("x: " + data[index].x.toFixed(2));
        // dataTextTemp.attr("x", widthScale(data[index].x))
        //         .attr("y", heightScale(data[index].y))
        //         .text("T: " + data[index].y.toFixed(2));
    }).on("end",()=>document.body.style.cursor='default');
dragHandler(slider);

//time axis slider control
d3.select(".slider").on("input", () =>{
    let time = d3.select(".slider").property("value");
    data = x.map( (d) => ({x: d, y: u(d,time)}));

    canvas.selectAll(".plot")
        .data([data])
        .attr("d",line);

//     move the line
//     let sliderXPos = sliderPosToGraph(getXtranslatePos(d3.select(".xSlider").attr("transform")));

    let index = selectedId;
    dataLinePrev.data([[{x: data[3*(index-1)].x, y: 0},{x: data[3*(index-1)].x, y: data[3*(index-1)].y}]])
    .attr("d",line);
    dataLineCurr.data([[{x: data[3*index].x, y: 0},{x: data[3*index].x, y: data[3*index].y}]])
    .attr("d",line);
    dataLineCurrX.data([[{x: data[3*index].x, y: data[3*index].y},{x: 0, y: data[3*index].y}]])
    .attr("d",line);
    dataLineNext.data([[{x: data[3*(index+1)].x, y: 0},{x: data[3*(index+1)].x, y: data[3*(index+1)].y}]])
    .attr("d",line);

    Xcurr.attr("x",widthScale(data[3*(index)].x/2)).attr("y",heightScale(data[3*(index)].y)-5);
    Tcurr.attr("x",-heightScale(data[3*(index)].y)-10).attr("y",widthScale(data[3*(index)].x) - 5);
    Tprev.attr("x",-heightScale(data[3*(index-1)].y)-10).attr("y",widthScale(data[3*(index-1)].x) - 5);
    Tnext.attr("x",-heightScale(data[3*(index+1)].y)-10).attr("y",widthScale(data[3*(index+1)].x) - 5);
    dx.attr("x",widthScale(data[3*(index)].x)+5).attr("y",heightScale(0)+15);
    //change temp data
    dataTextCurr.text("T(x): " + data[3*(index)].y.toFixed(2) + "C");
    dataTextPrev.text("T(x-dx): " + data[3*(index-1)].y.toFixed(2) + "C");
    dataTextNext.text("T(x+dx): " + data[3*(index+1)].y.toFixed(2) + "C");
    let derivative = data[3*(index)+1].y-2*data[3*(index)].y+data[3*(index)-1].y;
    dataTextDer.text("Derivative: " + derivative.toFixed(5) + "C/s");
    //move the pointer
//     dataPointer.attr("cx", widthScale(data[index].x))
//             .attr("cy", heightScale(data[index].y));
//         console.log(time);
//     //move the text
//     dataTextTime.text("t: " + time + "s");
//     textBackGround.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y));
//     dataTextPos.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y))
//             .text("x: " + data[index].x.toFixed(2));
//     dataTextTemp.attr("x", widthScale(data[index].x))
//             .attr("y", heightScale(data[index].y))
//             .text("T: " + data[index].y.toFixed(2));
});
//create discretized pipe
for(let i = 0; i<34; i++){
        canvas.append("g")
                .attr("transform","translate(" + graphXOffset + "," + (graphYOffset+40) + ")")
                .append("circle")
                .attr("class", "pointPipe").attr("id","p"+i)
                .attr("cx",widthScale(data[3*i].x)).attr("cy", heightScale(0)).attr("r", 6).attr("fill","green")
                .on("mousedown", function (){
                        if(d3.select(this).property("id")=="p33" || d3.select(this).property("id")=="p0") return;
                        d3.selectAll(".pointPipe").attr("stroke", "none");
                        d3.select(this).attr("stroke", "black").attr("stroke-width", "2px");
                        let currId = getCurrId(d3.select(this).property("id"));
                        let nextId = getNextId(currId);
                        let prevId = getPrevId(currId);

                        drawLines(currId,nextId,prevId);
                });
}
var selectedId = index;
function drawLines(currId,nextId,prevId){
    dataLinePrev.data([[{x: data[3*prevId].x, y: 0},{x: data[3*prevId].x, y: data[3*prevId].y}]])
    .attr("d",line);
    dataLineCurr.data([[{x: data[3*currId].x, y: 0},{x: data[3*currId].x, y: data[3*currId].y}]])
    .attr("d",line);
    dataLineCurrX.data([[{x: data[3*currId].x, y: data[3*currId].y},{x: 0, y: data[3*currId].y}]])
    .attr("d",line);
    dataLineNext.data([[{x: data[3*nextId].x, y: 0},{x: data[3*nextId].x, y: data[3*nextId].y}]])
    .attr("d",line);

    let index = currId;
    Xcurr.attr("x",widthScale(data[3*(index)].x/2)).attr("y",heightScale(data[3*(index)].y)-5);
    Tcurr.attr("x",-heightScale(data[3*(index)].y)-10).attr("y",widthScale(data[3*(index)].x) - 5);
    dx.attr("x",widthScale(data[3*(index)].x)+5).attr("y",heightScale(0)+15);
    Tprev.attr("x",-heightScale(data[3*(index-1)].y)-10).attr("y",widthScale(data[3*(index-1)].x) - 5);
    Tnext.attr("x",-heightScale(data[3*(index+1)].y)-10).attr("y",widthScale(data[3*(index+1)].x) - 5);

        //change temp data
        dataTextCurr.text("T(x): " + data[3*(index)].y.toFixed(2) + "C");
        dataTextPrev.text("T(x-dx): " + data[3*(index-1)].y.toFixed(2) + "C");
        dataTextNext.text("T(x+dx): " + data[3*(index+1)].y.toFixed(2) + "C");
        let derivative = data[3*(index)+1].y-2*data[3*(index)].y+data[3*(index)-1].y;
        dataTextDer.text("Derivative: " + derivative.toFixed(5) + "C/s");
    
}
function getCurrId(id){
        id = parseInt(id.replace("p", ""));
        selectedId = id;
        return id;
}
function getNextId(id){;
    return ++id;
}

function getPrevId(id){;
        return --id;
}
