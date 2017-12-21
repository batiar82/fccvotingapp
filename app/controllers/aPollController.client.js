'use strict';

(function () {
   var chartId=document.getElementById('forChart');
   var votes= chartId.dataset.votes.split(",");
	var options= chartId.dataset.options.split(",");
   var question= chartId.dataset.question;
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
   window.onload = function(){
      var ctx = document.getElementById("chart-area").getContext("2d");
        window.myDoughnut = new Chart(ctx, config);
   };
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
    
})();
