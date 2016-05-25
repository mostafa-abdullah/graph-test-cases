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
    jsPlumb.empty("#graph");
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
var isDirected = false;

$('#generate').click(function(){
    var graph = $('#graph');
    jsPlumb.empty("graph");
    graph.html('');




    edges = [];
    isDirected = false;
    nodes = $('#nodes').val();
    if(!nodes || nodes<=0)
        nodes = 5;

    base = $("input[type='radio'][name='base']:checked").val();

    var graphType = $("input[type='radio'][name='gtype']:checked").val();
    isDirected = graphType == 0 ? false : true;


    var start = 0;

    if(base && base == '1')
        start++;
    var end = parseInt(start) + parseInt(nodes) - 1;


    var grWidth = graph.width();
    var grHeight = graph.height();
    var radius = grWidth/2-25;
    var grX = graph.position().left;
    var grY = graph.position().top;
    var angleDiff = Math.PI*2 / nodes;
    for(i = start; i<=end; i++)
    {

        var xPos = grX + radius + Math.cos(i*angleDiff)*radius/1.4;
        var yPos = grY + radius + Math.sin(i*angleDiff)*radius/1.4;
        var newNode = '<div style="left:'+xPos+'px; top:'+yPos+'px;" id="node'+i+'" class="node" draggable="true" ondragstart="drag_start(event)" node="'+i+'">'+i+'</div>';
        graph.append(newNode);
    }
    outputTestCase();
});

var bound = null

$(document).on('click','.node',function(){
    if(!bound)
    {
        bound = $(this);
        $(this).css('border-color','blue');
        $(this).css('border-width','4px');
        $('#chooseTarget').show();
    }
    else
    {

        var node1 = bound.attr('node');
        var node2 = $(this).attr('node');

        var added = addOrRemoveEdge(node1,node2, bound, $(this));


        bound.css('border-color', 'black');
        bound.css('border-width','1px');
        bound = null;
        $('#chooseTarget').hide();
    }
})


var addOrRemoveEdge = function(node1, node2, elem1, elem2)
{

    var connector = 'Straight';
    if(node1 == node2)
    {
        if(isDirected) // self loop: (draw curve)
            connector = ['StateMachine', { curviness:20 }];
        else
            return false;
    }

    for(i = 0; i<edges.length; i++)
    {
        // if the edge exist delete edge
        if(edges[i].node1 && edges[i].node2
           && ((edges[i].node1 == node1  && edges[i].node2 == node2)
               || (!isDirected && edges[i].node1 == node2  && edges[i].node2 == node1)))
        {
            jsPlumb.detach(edges[i].conn);
            edges.splice(i,1);
            outputTestCase()();  // update the output testCases
            return false;
        }
        else if (isDirected && edges[i].node1 == node2  && edges[i].node2 == node1)
        {
            // directed graph and the edge exist in the opposite direction: (draw edge as curve)
            connector = ['StateMachine', { curviness:20 }];
        }


    }

    var connection = jsPlumb.connect({
        source:elem1,
        target:elem2,
        connector: connector,
        anchor:'Center',
        overlays: isDirected ? [["Arrow" , { width:12, length:12, location:0.67 }]] : [],
    });
    edges.push({node1 : node1, node2: node2, conn: connection});
    outputTestCase(); // update the output testCases
    return true;
}

function outputTestCase()
{
    $('#case').html('');
    $('#case').append("<h4>Input: </h4>")
    $('#case').append(nodes+" "+edges.length+"<br>");
    for(i = 0; i<edges.length; i++)
    {
        $('#case').append(edges[i].node1+" "+edges[i].node2+"<br>");
    }
}
