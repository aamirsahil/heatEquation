var expanded = false;
d3.select(".expand").on("mousedown", ()=>{
    (expanded)?
    d3.select("#exp").style("visibility", "visible"):
    d3.select("#exp").style("visibility", "hidden");
    expanded = !expanded;
});