setEq();
function setEq(){
// Row and Column div
    let divRow = document.createElement('div');
    let divCol1 = document.createElement('div');
    let divCol2 = document.createElement('div');
    divRow.setAttribute('class', 'row');
    divRow.setAttribute('id', 'row');
    divCol1.setAttribute('class', 'col-md-11');
    divCol1.setAttribute('id', 'col1');
    divCol2.setAttribute('class', 'col-md-1');
    divCol2.setAttribute('id', 'col2');
// Heading and lists
    let head = document.createElement('h1');
    let step1 = document.createElement('p');
    let step2 = document.createElement('p');
    let step3 = document.createElement('p');
    let step4 = document.createElement('p');
    step1.setAttribute('id', 'step1');
    step2.setAttribute('id', 'step2');
    step3.setAttribute('id', 'step3');
    step4.setAttribute('id', 'step4');
// Derivation steps
    let text1 = "We start with, $$ dP = -\\rho gdz $$";
    let text2 = "Using the Ideal Gas equation, $$ \\rho(P) = \\frac{PM}{RT} $$";
    let text3 = "Thus we have, $$ dP = -\\frac{PM}{RT}gdz $$";
    let text4 ="On integrating, $$ P(z) = P_0e^{-\\frac{Mg}{RT}z} $$";
// The Slider
    let slider = document.createElement('input');
    slider.setAttribute('id', 'mySlider');
    slider.setAttribute('type','range');
    slider.setAttribute('min','0');
    slider.setAttribute('max','100');
    slider.setAttribute('value','0');
    slider.setAttribute('class','slider');
    slider.style.transform = "rotate(90deg)";
    slider.style.margin = "-100px";
// Setting the inner html
    head.innerHTML = "Analytical treatment";
    step1.innerHTML = text1;
    step2.innerHTML = text2;
    step3.innerHTML = text3;
    step4.innerHTML = text4;
    step2.style.visibility = "hidden";
    step3.style.visibility = "hidden";
    step4.style.visibility = "hidden";
// Properly adding to desired parent
    $('#exp').prepend(head);
    $('#exp').append(divRow);
    $('#row').append(divCol1);
    $('#row').append(divCol2);
    $('#col1').append(step1);
    $('#col1').append(step2);
    $('#col1').append(step3);
    $('#col1').append(step4);
    $('#col2').append(slider);
//Navigation Button
    sliderReady();
    createButton2();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
function sliderReady()
{
    d3.select("#mySlider").on("input", function()
    {
        let value = d3.select(this).property("value");
        let max = d3.select(this).property("max");
        let min = d3.select(this).property("min");
        let button = document.getElementById("button02");
        let exercise = document.getElementById("exercise");
        let length = value/(max - min);

        if(length < 1/4)
        {
            step2.style.visibility = "hidden";
            step3.style.visibility = "hidden";
            step4.style.visibility = "hidden";
        }
        else if(length > 1/4 && length < 2/4)
        {
            step2.style.visibility = "visible";
            step3.style.visibility = "hidden";
            step4.style.visibility = "hidden";
        }
        else if(length > 2/4 && length < 3/4)
        {
            step2.style.visibility = "visible";
            step3.style.visibility = "visible";
            step4.style.visibility = "hidden";
        }
        else if(length > 3/5)
        {
            button.style.visibility = "visible";
            step2.style.visibility = "visible";
            step3.style.visibility = "visible";
            step4.style.visibility = "visible";
            exercise.style.visibility = "visible";
        }
    });
}
function createButton2()
{
    let button = document.createElement('button');
    button.setAttribute('id','button02');
    button.setAttribute('type','button');
    button .innerHTML = "Go to Exercises"
    button.setAttribute('class','btn btn-success');
    button.style.float = "right";
    button.style.visibility = "hidden";
    $('#exp').append(button);
    button2Ready();
}
function button2Ready()
{
    d3.select("#button02").on("click", function()
    {
        window.location = '06_exercise.html';
    });
}