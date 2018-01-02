function getConfig(){
    var chartId=$('#forChart');
    var votes= chartId.data("votes").split(",");
	var options= chartId.data("options").split(",");
    var question=chartId.data("question");
    var chartColors = ['rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
   ];
   var finalColors=[];
   options.forEach(function(item,index){
      finalColors.push(chartColors[index%chartColors.length]);   
   });
   
     

   var randomScalingFactor = function() {
        return Math.round(Math.random() * 100);
    };
   var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: votes,
                backgroundColor: finalColors,
                label: question
            }],
            labels: options
        },
        options: {
            responsive: true
        }
    };
    return config;
}

    

$(document).ready(function() {
    // The maximum number of options
    var MAX_OPTIONS = 5;
    //chart stuff
    console.log("Config "+getConfig());
    var ctx = $("#chart-area").get(0).getContext("2d");
    var chart = new Chart(ctx, getConfig());
    
    $('.thesubmit')
       .on('click', function(event) {
           event.preventDefault();
            console.log("Click en submit");
            $.post( "/api/poll/addOption",{id: $('.thesubmit').data("id"), option: $('.theoption').val()},function(data){
                console.log("vuelve "+data);
                votes=data.votes;
                options=data.options;
                window.myDoughnut.update();
                
            });
        });
});