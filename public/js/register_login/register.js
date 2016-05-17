$(document).ready(function(){
	 var window_height = $(window).height();	
	 var Height =  $(".register-form-div ").height();
     var Half_height = - (Height/2) +30;  	
	  if(window_height>800)
	 {

       setFormBlock('.register-form-div');
	   setFooter();
	   $('.register-form-div').css({'margin-left':'-125px','margin-top':Half_height});	   
     }

  });