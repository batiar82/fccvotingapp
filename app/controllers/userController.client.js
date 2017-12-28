'use strict';


   function updateHtmlElement (data, element, userProperty) {
      element.text(data[userProperty]);
   }

   $( document ).ready(function() {
      
    console.log( "ready!" );
    var displayName = $('#display-name');
   var navBar = $('.isLoggedIn');
   var apiUrl = '/api/:id';
   
    $.get(apiUrl,function(data){
       if (data.displayName !== null) 
         displayName.text(data.displayName);
      else
         displayName.text(data.username);
    });
});