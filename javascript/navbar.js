var desc = ["Reality", "Idealization", "Discretization", "Geometric", "Mathematical"];
for(let i = 1; i < 6; i++)
{
    let text = document.getElementById("text" + i.toString());
    text.innerHTML = desc[i-1];
}
document.getElementById('track').setAttribute('stroke','#007a85')

window.addEventListener("load", ()=>{
    let link = [
        "/02_reality.html",
        "/03_idealization.html",
        "/04_descretization.html",
        "/05_geometry.html",
        "/06_mathematical.html",
    ];
    
    let loc = window.location.pathname.replace("/heatEquation", "");
    let i = link.indexOf(loc);
    let width = d3.select(".svgNav").style("width").replace("px","");
    let xStart = parseInt(width/6);
    let xOffset = 20;
    let xEnd = (i+1)*xStart + xOffset;
    xOffset = 80;
    xStart += xOffset;
    

    d3.select("#track").attr("d", "M " +  xStart + " 15 H " + xEnd);
})