$('.follow-button').click(function(){
     $.getJSON("/a/follow/" + userId)
      .done(function(data) {
          if(data['code'] == 0)
           { 
            changeFollow();
           }
      }); 
});
$(document).ready(function(){
    $.getJSON("/a/user_detail/" + userId)
    .done(function(data) {
	  if(isFanOrNot(data['userRelation']))
	   { 
	    changeFollow();
	   }
    });
});
var isFanOrNot = function(num)
{
	switch(num)
	{
		case 1: return true; break;
		case 2: return true; break;
		case 3: return true; break;
	}
	return false;
}
var changeFollow = function()
{
		$('.follow-button').text('已关注');
	    $('.follow-button').attr("disabled", true);
	    $('.follow-button').css('background-color','#ada6a6');
	    $('.follow-button').css('cursor','default');

}