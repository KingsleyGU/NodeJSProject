var textStorage = "作品收藏功能正在开发中，敬请期待";
var textVoice = "小吉大舌头模块正在开发中，敬请期待";

$(document).ready(function(){

	var ori_left= $(".triangle-img").position().left;
  $(".nav-ui-link1").mouseenter(function(){
    $(".triangle-img").animate({left:'165px'},100);
  });

     $(".nav-ui-link2").mouseenter(function(){
    $(".triangle-img").animate({left:'260px'},100);
  });

    $(".nav-ui-link3").mouseenter(function(){
    $(".triangle-img").animate({left:'377px'},100);
  });
    $(".nav-arrangement").mouseleave(function(){
    $(".triangle-img").animate({left: ori_left},0);
  });
    $( "#dialog" ).dialog({
      autoOpen: false
    });
});

$('.nav-ui-link3').click(function(){
      $( "#dialog" ).text(textVoice);
   $( "#dialog" ).dialog( "open" );
     setTimeout(function(){
        $('#dialog').dialog('close');                
    }, 3000);
  });
$('.nav-ui-link2').click(function(){

   $( ".tri-img-1" ).css({left:'260px'});
  });
$('.nav-ui-link1').click(function(){

   $( ".tri-img-1" ).css({left:'165px'});
  });