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
        "/03_idealization2.html",
        "/04_descretization.html",
        "/05_geometric.html",
        "/05_geometric2.html",
        "/06_mathematical.html",
    ];
    
    let loc = window.location.pathname.replace("/heatEquation", "");
    let i =0;
    
    switch(loc){
        case link[0]:
            break;
        case link[1]:
        case link[2]:
            i=1;
            break;
        case link[3]:
            i=2;
            break;
        case link[4]:
        case link[5]:
            i=3;
            break;
        case link[6]:
            i=4;
            break;
    }
    let width = d3.select(".svgNav").style("width").replace("px","");
    let xStart = parseInt(width/6);
    let xOffset = 20;
    let xEnd = (i+1)*xStart + xOffset;
    xOffset = 80;
    xStart += xOffset;
    

    d3.select("#track").attr("d", "M " +  xStart + " 15 H " + xEnd);
});
var link = [
    "/heatEquation/01_overview.html",
    "/heatEquation/02_reality.html",
    "/heatEquation/03_idealization.html",
    "/heatEquation/03_idealization2.html",
    "/heatEquation/04_descretization.html",
    "/heatEquation/05_geometric.html",
    "/heatEquation/05_geometric2.html",
    "/heatEquation/06_mathematical.html",
    "/heatEquation/07_summary.html"
];
var loc = window.location.pathname;
var linkIndex = link.indexOf(loc);
console.log(loc);
console.log(linkIndex);
d3.select("#nextBtn").on("mousedown", ()=>{
    window.location = link[linkIndex+1];
});
d3.select("#prevBtn").on("mousedown", ()=>{
    window.location = link[linkIndex-1];
});
