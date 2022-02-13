var i = 0;
const question = [
    "Consider the variation in acceleration due to gravity with change in altitude, and see how it effects the pressure variation.",
    "Instead of the ideal gas equation consider Van derWaal's equation as the equation of state and see how it effects the pressure variation.",
    "Instead of atmosphere made of a single type of molecule consider it as a homogenous mixture of gas molecules."
]

const hint = [
    ["What law governs the change in gravitational force with distance?",
    "Where did we assume constant g in our previous derivation?",
    "Get the modifies differential equation and solve using the widget."],
    ["Write down the equation of state connecting pressure volume and temperature",
    "Where did we assume the system as ideal gas?",
    "Get the modifies differential equation and solve using the widget."],
    ["How does total pressure of the system effected by the partial pressure?",
    "In the original derivation write pressure in terms of partial pressure",
    "Get the modifies differential equation and solve using the widget."]
]
var index = 0;
d3.select("#next").on("click", function()
{
    if(index < 2)
    {
        index++;
        i = 0;
        setQuestion();
        setHint();
        setButton();
    }
});

d3.select("#prev").on("click", function()
{
    if(index > 0)
    {
        index--;
        i = 0;
        setQuestion();
        setHint();
        setButton();
    }
});

function setQuestion()
{
    document.getElementById("head").innerHTML = "Exercise " + (index+1).toString()
    document.getElementById("question").innerHTML = question[index]
}
function setHint()
{
    document.getElementById("hint1").innerHTML = hint[index][0]
    document.getElementById("hint2").innerHTML = hint[index][1]
    document.getElementById("hint3").innerHTML = hint[index][2]
    document.getElementById("button").innerHTML = "Hint 1"
    document.getElementById("button").style.visibility = "visible";
    document.getElementById("hint1").style.visibility = "hidden";
    document.getElementById("hint2").style.visibility = "hidden";
    document.getElementById("hint3").style.visibility = "hidden";
}

function hintVisibility()
{
    i++;
    switch(i)
    {
        case 1:
            document.getElementById("hint1").style.visibility = "visible";
            document.getElementById("button").innerHTML = "Hint 2"
            break;
        case 2:
            document.getElementById("hint2").style.visibility = "visible";
            document.getElementById("button").innerHTML = "Hint 3"
            break;
        default:
            document.getElementById("hint3").style.visibility = "visible";
            document.getElementById("button").style.visibility = "hidden";
    }
}
function setButton(){
    if(index<1)
        document.getElementById("prev").className = 'btn btn-secondary';
    else if(index > 1)
        document.getElementById("next").className = 'btn btn-secondary';
   else{
    document.getElementById("prev").className = 'btn btn-primary';
    document.getElementById("next").className = 'btn btn-primary';
   }
}