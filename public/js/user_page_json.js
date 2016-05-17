
var USER_OPUS_LIST = 1;
var USER_COMPETION_LIST = 2;

var OPUS_BLOCK = ".opus-body-div";
var COMPETION_BLOCK = ".collection-body-div";
var OPUS_LOADING_BLOCK =".opus-loading-div";
var COMPETION_LOADING_BLOCK = ".collection-loading-div";
var OPUS_MORE = ".opus-more";
var COLLECTION_MORE = ".collection-more";
var OPUS_NO_MORE = ".opus_more_div";
var COLLECTION_NO_MORE = ".collection_more_div";

var OPUS_HINT = "没有更多作品";
var COLLECTION_HINT = "没有更多收藏";

var OPUS_OFFSET = 0;
var OPUS_LIMIT = 9;
var COLLECTION_OFFSET = 0;
var COLLECTION_LIMIT = 6;


var loadOpusList = function(type)
{
     var json_address = "/a/user_opus_list/"+userId+"/" + OPUS_OFFSET;
     if(type == USER_COMPETION_LIST)
       json_address = "/a/user_favorite_list/" +userId+"/" + COLLECTION_OFFSET;

     var currentMotherBlock = OPUS_BLOCK;
     if(type == USER_COMPETION_LIST)
        currentMotherBlock = COMPETION_BLOCK;

     var currentLoadingBlock = OPUS_LOADING_BLOCK;
     if(type == USER_COMPETION_LIST)
         currentLoadingBlock = COMPETION_LOADING_BLOCK;
     var  listNumber ;
     $.getJSON(json_address)
      .done(function(data) {
        if(data == "")
          $(getNoMoreDiv(type)).css('display','block');
        $(getMoreDiv(type)).css('display','none');
        $(currentLoadingBlock).css('display', 'none');
        $.each(data, function(i, item) {
          var htmlString = $('.template-div').html();
          var title = item.opusWord;
            if (item.opusDesc != null){
              title = title + "\n\n" + item.opusDesc;
            }

            $('.template-div').find('.image-show').prop("title", title);
            $('.template-div').find('.image-show').attr("alt", item.opusWord);
          $('.template-div').find('.inner-div').css('display', 'inline-block');
          $('.template-div').find('.image-show').attr("src", item['opusImage'])
          $('.template-div').find('#icon-img').attr("src", getUserAvatar(item.avatar,item.gender));
          $('.template-div').find('.name-link').text(item.nickName);
          $('.template-div').find('.info-desc-detail').text(item.signature);
          $('.template-div').find('.pub-time').text(getTimeDisplayString(item.createDate));
          $('.template-div').find('.flower_times_span').text(getFeedFlowerTimes(item['feedTimes']));
          $('.template-div').find('.comment_times_span').text(getFeedCommentTimes(item['feedTimes'])); 
          $('.template-div').find('.image-link').attr("href","/opus/"+ item['feedId']); 

           listNumber = i;
            var finalHtmlString = $('.template-div').html();
            $(currentMotherBlock).append(finalHtmlString);
        });
        if(listNumber ==(getLimit(type)-1))
            $(getMoreDiv(type)).css('display','block');
        else
         { $(getNoMoreDiv(type)).text(getHint(type)); }
      });
}
$(document).ready(function(){
  var ownerGender = parseInt($('.ownerGender').html());
  if(ownerGender == 1)
  {
    $('.male-img').attr("src",'../img/remember-click.png');
    $('.female-img').attr("src",'../img/remember.png');
    $('.gender-selected').val('m');
  }
   var DivHeight = $('.user-description').height();
   $('.follow-button-span').css('padding-top',DivHeight/2);
    $(getMoreDiv(USER_OPUS_LIST)).css('display','none');
    $(getMoreDiv(USER_COMPETION_LIST)).css('display','none');
     $.getJSON("/a/user_opus_count/" + userId)
      .done(function(data) {
          $('.opus-title-name').text('作品'+'('+data['cnt']+')');
      });
      $.getJSON("/a/user_fans_count/" + userId)
      .done(function(data) {
          $('.fans-span').text('粉丝'+' '+data['rfac']);
      });
    $('.template-div').css('display', 'none');
     loadOpusList(USER_OPUS_LIST);
     loadOpusList(USER_COMPETION_LIST);
   });
$('.opus-more').click(function(){
  OPUS_OFFSET = OPUS_OFFSET + OPUS_LIMIT;
  loadOpusList(USER_OPUS_LIST);
});
$('.collection-more').click(function(){
  COLLECTION_OFFSET = COLLECTION_OFFSET + COLLECTION_LIMIT;
  loadOpusList(USER_COMPETION_LIST);
});
var getMoreDiv = function (type)
{
  switch(type)
  {
    case USER_OPUS_LIST : return OPUS_MORE ; break;
    case USER_COMPETION_LIST : return COLLECTION_MORE ; break;
  }
}
var getNoMoreDiv = function (type)
{
  switch(type)
  {
    case USER_OPUS_LIST : return OPUS_NO_MORE; break;
    case USER_COMPETION_LIST : return COLLECTION_NO_MORE ; break;
  }
}
var getLimit = function (type)
{
  switch(type)
  {
    case USER_OPUS_LIST : return OPUS_LIMIT ; break;
    case USER_COMPETION_LIST : return COLLECTION_LIMIT ; break;
  }
}

var getHint = function (type)
{
  switch(type)
  {
    case USER_OPUS_LIST : return OPUS_HINT ; break;
    case USER_COMPETION_LIST : return COLLECTION_HINT ; break;
  }
}
$('.modify_information').click(function(){
    $('.user-icon').css('display','none');
    $('.user-description').css('display','none');
    $('.division-break').css('display','none');
    $('.modify-personal-information').css('display','block');

});
$('.cancel-modify_information').click(function(){
    showInformation();
});
/*$('.submit-modify_information').click(function(){
  var filePath =  filename;
  if(filePath != "")
  { 
      var length = filePath.length;
      var extension = filePath.substring(length - 3, length)
      if (extension != "jpg" && extension != "png") {
        $('.avatar-message').text("文件格式不正确");
        $('.avatar-message').addClass("alert-msg");
      }
  }
});*/
$('.upload-avatar').click(function(){
     $('.avatar-message').text("");
     $('.avatar-message').removeClass("alert-msg");
});
$(".female-img").click(function(){
     $(this).attr("src",'../img/remember-click.png');
     $('.gender-selected').val('f');
     $('.male-img').attr("src",'../img/remember.png');
});
$(".male-img").click(function(){
     $(this).attr("src",'../img/remember-click.png');
     $('.gender-selected').val('m');
     $('.female-img').attr("src",'../img/remember.png');
});
$( ".submit-modify_information" ).click(function() {

 var Modify_Nick= $( ".modify-username" ).val();
 var Modify_Gender = $( ".gender-selected" ).val();
 var Modify_Status= $( ".user-status" ).val();

 var getting = $.get( "/a/user/update", { nickName: Modify_Nick, signature: Modify_Status,gender:Modify_Gender } );
/* var getAvatar = $.post( "/a/avatar" );*/

  getting.done(function() {    
      $('.statement').text(Modify_Status);
      $('.nick-span').text(Modify_Nick);   
      $('.nav-user-link').text(Modify_Nick);  
      $('.user-information-span').text(showGender(Modify_Gender));
      showInformation();

  });
  $( ".avatar-form" ).submit();
/*   var  displayImage = $('.upload-avatar').val().replace("C:\\fakepath\\", "");
   alert(displayImage);
  $.post( "/a/avatar", {displayImage : displayImage } ,function( data ) {
  alert( "Data Loaded: " + data );
      });*/
});
/*$( ".avatar-form" ).submit(function( event ) {
  alert( "Handler for .submit() called." );
  event.preventDefault();
});*/
 $(".avatar-form").submit(function (event) {

        //disable the default form submission
        event.preventDefault();
        //grab all form data  
        var formData = new FormData($(this)[0]);
        $.ajax({
            url: '/a/avatar',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                var temp_avatar = data['url'];   
                if(data['code'] == 0)
                {
  /*                $('#upload-div').css({'background-image':'url(temp_avatar)'});*/
                  $('.user-icon').attr('src',temp_avatar);
                }
            },
            error: function(){
                alert("error in ajax form submission");
            }
        });

        return false;
    });
var showGender = function(Gen)
{
  switch(Gen)
  {
    case "f" : return "女"; break;
    case "m" : return "男"; break;
  }
}
var showInformation = function()
{
    $('.user-icon').css('display','block');
    $('.user-description').css('display','inline-block');
    $('.division-break').css('display','static');
    $('.modify-personal-information').css('display','none');

}
$( ".upload-avatar" ).click(function() {
  $( '#upload-div' ).css('border','5px solid #4edec2');
});
$( ".upload-avatar" ).mouseout(function() {
  $( '#upload-div' ).css('border','5px solid #e2e2e2');
});