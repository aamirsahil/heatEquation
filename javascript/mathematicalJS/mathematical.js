var expanded = false;
d3.select(".expand").on("mousedown", ()=>{
    (expanded)?
    d3.select("#exp").style("visibility", "visible"):
    d3.select("#exp").style("visibility", "hidden");
    expanded = !expanded;
});
d3.select(".slider").on("input",function(){
    let value = d3.select(this).property("value");
    switch(value){
        case "0":
            d3.select(".step1").style("visibility","hidden");
            d3.select(".step2").style("visibility","hidden");
            d3.select(".step3").style("visibility","hidden");
            d3.select(".heatEq").style("visibility","hidden");
            break;
        case "1":
            d3.select(".step1").style("visibility","visible");
            d3.select(".step2").style("visibility","hidden");
            d3.select(".step3").style("visibility","hidden");
            d3.select(".heatEq").style("visibility","hidden");
            break;
        case "2":
            d3.select(".step1").style("visibility","visible");
            d3.select(".step2").style("visibility","visible");
            d3.select(".step3").style("visibility","hidden");
            d3.select(".heatEq").style("visibility","hidden");
            break;
        case "3":
            d3.select(".step1").style("visibility","visible");
            d3.select(".step2").style("visibility","visible");
            d3.select(".step3").style("visibility","visible");
            d3.select(".heatEq").style("visibility","hidden");
            break;
        case "4":
            d3.select(".step1").style("visibility","visible");
            d3.select(".step2").style("visibility","visible");
            d3.select(".step3").style("visibility","visible");
            d3.select(".heatEq").style("visibility","visible");
            break;
    }
});