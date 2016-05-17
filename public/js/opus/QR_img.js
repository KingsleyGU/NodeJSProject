$(document).ready(function(){
    $( "#tabs" ).tabs( "disable", 3 );

     var window_height = $(window).height(); 
     var place_position = 900;
     $(window).scroll(function(){
       var windowpos = $(window).scrollTop();
        if(window_height+windowpos >place_position)
        {
             $(".QR_code_div").removeClass('QR_absolute_div');
            if(window_height>place_position)
              $(".QR_code_div").css({position:"fixed",top:"656px"});
            else
              $(".QR_code_div").addClass('QR_fixed_div'); 
        }
        else
        {
            $(".QR_code_div").removeClass('QR_fixed_div');
          $(".QR_code_div").addClass('QR_absolute_div'); 
        }
     });
     var s = $('.desc-span').html();
     $('.desc-span').html(br2nl(s));
});
function br2nl(str) {
    return str.replace(/\n\r|\n|\r/gm, '<br>');
}
