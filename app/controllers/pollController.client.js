'use strict';

(function () {

   var pollsTable = document.querySelector('#polls-table');
   var apiUrl = appUrl + '/api/:id/polls';
   var pollUrl = appUrl + '/poll/';
   
   function showPolls (data) {
      var pollsObject = JSON.parse(data);
      var polls="";
      pollsObject.forEach(function(item,index){
         polls+="<li><a href='"+pollUrl+item._id+"'>"+item.question+"</a></li>";});
      var elhtml="<ul>"+polls+"</ul>";
      pollsTable.innerHTML = elhtml;
   }
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showPolls));

})();
