$(document).ready(function(){
	 var window_height = $(window).height();
	 var Height =  $(".login-form-div ").height();
     var Half_height = - (Height/2) +30;
	 if(window_height>600)
	 {
	   setFormBlock('.login-form-div');
	   setFooter();
	   $('.login-form-div').css({'margin-left':'-125px','margin-top':Half_height});	  	
    }

  });