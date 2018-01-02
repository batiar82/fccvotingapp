function updateChart(chart,poll) {
    var data= {
            datasets: [{
                data: poll.votes,
                backgroundColor: getChartColors(poll),
                label: poll.question
            }],
            labels: poll.options
        };
    
    chart.data=data;
    chart.update();
}
function getChartColors(poll){
    var chartColors = ['rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
   ];
   var finalColors=[];
   poll.options.forEach(function(item,index){
      finalColors.push(chartColors[index%chartColors.length]);   
   });
   return finalColors;
    
}

function getConfig(poll){
    
    var chartId=$('#forChart');
    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: poll.votes,
                backgroundColor: getChartColors(poll),
                label: poll.question
            }],
            labels: poll.options
        },
        options: {
            responsive: true
        }
    };
    return config;
}

    

$(document).ready(function() {
    // The maximum number of options
    var voteButton=$("#submitVote");
    var addOptionButtonn=$("#addOption");
    var deleteButtonn=$("#delete");
    $(voteButton).prop("disabled",true);
    $(addOptionButtonn).prop("disabled",true);
    var MAX_OPTIONS = 5;
    var ctx;
    var chart;
    var pollId=$('#forJquery').data("id");
    var apiUrl="/poll/api/"+pollId;
    var theselect=$('#theselect');
    //voy a traer el poll
     $.get(apiUrl,function(data){
       $(".question").text(data.question);
       $.each(data.options, function (i, item) {
            theselect.append($('<option>', { 
                value: i,
                text : item 
        }));
});
       ctx = $("#chart-area").get(0).getContext("2d");
       chart = new Chart(ctx, getConfig(data));
       $(voteButton).prop("disabled",false);
       $(addOptionButtonn).prop("disabled",false);
    });
    
  //  var ctx = $("#chart-area").get(0).getContext("2d");
  //  var chart = new Chart(ctx, getConfig());
    voteButton.on('click',function(event){
        event.preventDefault();
        var voteUrl="/api/poll/vote/"+pollId;
        var optionSelected = theselect.find(":selected").val();
        $.post( voteUrl,{id: pollId, option: optionSelected},function(data){
                updateChart(chart,data);
                
            });
    });
    
    
    addOptionButtonn
       .on('click', function(event) {
            event.preventDefault();
            var optionUrl="/api/poll/addOption";
            $.post( optionUrl,{id: pollId, option: $('.theoption').val()},function(data){
                console.log("vuelve "+data);
                theselect.append($('<option>', { 
                    value: data.options.length-1,
                    text : data.options[data.options.length-1]
                }));
                updateChart(chart,data);
            });
        });
    deleteButtonn
       .on('click', function(event) {
            event.preventDefault();
            $("<div title='Delete poll?'<p><span class='ui-icon ui-icon-alert' style='float:left; margin:12px 12px 20px 0;'></span>This poll will be permanently deleted and cannot be recovered. Are you sure?</p></div>").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Confirm delete": function() {
                        var deleteUrl="/api/poll/delete";
                        $.post( deleteUrl,{id: pollId},function(data){
                            console.log(data);
                            if (data.success){
                                alert("Poll deleted");
                                window.location.replace("/mypolls");
                            }else{
                                alert("There was an error deleting the poll\n"+data.error);
                            }
                        });
                    $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
            
            
});

});