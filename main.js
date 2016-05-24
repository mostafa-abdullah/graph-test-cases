 function drag_start(event) 
{
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY)+ ',' + event.target.id;
    event.dataTransfer.setData("Text",str);
} 

function drop(event) 
{
    var offset = event.dataTransfer.getData("Text").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}

function drag_over(event)
{
    event.preventDefault();
    return false;
} 


var nodes = 5;
var base = 0;

$('#generate').click(function(){
    var graph = $('#graph');
    graph.html('');

    nodes = $('#nodes').val();
    if(!nodes || nodes<=0)
        nodes = 5;

    base = $("input[type='radio'][name='base']:checked").val();
    

    var start = 0;
    
    if(base && base == '1')
        start++;
    var end = parseInt(start) + parseInt(nodes) - 1;
     
    
    var grWidth = graph.width();
    var grHeight = graph.height();
    var radius = grWidth/2-25;

    var angleDiff = Math.PI*2 / nodes;
    for(i = start; i<=end; i++)
    {

        var xPos = radius + Math.cos(i*angleDiff)*radius/1.4;
        var yPos = radius + Math.sin(i*angleDiff)*radius/1.4;
        var newNode = '<div style="left:'+xPos+'px; top:'+yPos+'px;" id="node'+i+'" class="node" draggable="true" ondragstart="drag_start(event)">'+i+'</div>';
        graph.append(newNode);
    }
});