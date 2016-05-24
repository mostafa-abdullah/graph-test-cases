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
var edges = [];

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
        var newNode = '<div style="left:'+xPos+'px; top:'+yPos+'px;" id="node'+i+'" class="node" draggable="true" ondragstart="drag_start(event)" node="'+i+'">'+i+'</div>';
        graph.append(newNode);
    }
});

var bound = null

$(document).on('click','.node',function(){
    if(!bound)
    {
        bound = $(this);
        $(this).css('border-color','blue');
        $(this).css('border-width','4px');
    }
    else
    {

        var node1 = bound.attr('node');
        var node2 = $(this).attr('node');
        
        var added = addOrRemoveEdge(node1,node2, bound, $(this));
            

        bound.css('border-color', 'black');
        bound.css('border-width','1px');
        bound = null;
    }
})


var addOrRemoveEdge = function(node1, node2, elem1, elem2)
{
    for(i = 0; i<edges.length; i++)
    {
        if(edges[i].node1 && edges[i].node2 && ((edges[i].node1 == node1  && edges[i].node2 == node2) || edges[i].node2 == node1  && edges[i].node1 == node2))
        {
            jsPlumb.detach(edges[i].conn);
            edges.splice(i,1);
            return false;
        }
    }

    var connection = jsPlumb.connect({source:elem1, target:elem2, connector:'Straight', anchor:'Center'});
    edges.push({node1 : node1, node2: node2, conn: connection});
    return true;
}