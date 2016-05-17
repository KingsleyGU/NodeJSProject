
var CommentTypeNO = 0;
var CommentTypeGuess = 2;
var CommentTypeComment = 3;
var CommentTypeFlower = 6;
var CommentTypeTomato = 7;
var CommentTypeSave = 8;
var CommentTypeContestComment = 105;
var comment_offset = 0;
var flower_offset = 0;
var guess_offset = 0;
var comment_link = $('.tab1_link').html();
var guess_link = $('.tab2_link').html();
var flower_link = $('.tab3_link').html();
var comment_temp1 = comment_link.split('(')[1];
var guess_temp1 = guess_link.split('(')[1];
var flower_temp1 = flower_link.split('(')[1];
var comment_temp2 = comment_temp1.split(')')[0];
var guess_temp2 = guess_temp1.split(')')[0];
var flower_temp2 = flower_temp1.split(')')[0];
var comment_num = getCommentNum();
var guess_num = getGuessNum();
var flower_num = getFlowerNum();

var parentName = ".discuss-list";
var timeBlock = ".time-detail";
var userIDBlock = ".userId";
var actionTypeBlock = ".actionType";
var personLinkBlock = ".person-link";
var feedIDBlock = ".feedId";
var iconImageBlock = ".icon-image";
var iconImageLinkBlock = ".icon-image-link";
var modifyOffset = function(type)
{
  switch(type)
  {
    case CommentTypeComment: comment_offset = comment_offset + 10; break;
    case CommentTypeFlower: flower_offset = flower_offset + 10; break;
    case CommentTypeGuess: guess_offset = guess_offset +10; break;
  }
}
var hideLoadingImg = function(type)
{
   switch(type)
  {
    case CommentTypeComment:  $('.comment-loading-div').css('display', 'none'); break;
    case CommentTypeFlower: $('.flower-loading-div').css('display', 'none'); break;
    case CommentTypeGuess: $('.guess-loading-div').css('display', 'none'); break;
  }
}
var changeTagValue = function(createDate,userId,feedId,actionType,personLink,avatar,gender)
{
          $(parentName).find(timeBlock).text(getTimeDisplayString(createDate));

          $(parentName).find(userIDBlock).text(userId);
          $(parentName).find(iconImageLinkBlock).attr("href","/user_detail/"+ userId);
          $(parentName).find(iconImageBlock).attr("alt",personLink+"的头像");
          $(parentName).find(personLinkBlock).attr("href","/user_detail/"+ userId);
          $(parentName).find(feedIDBlock).text(feedId);
          $(parentName).find(actionTypeBlock).text(actionType); 
          $(parentName).find(personLinkBlock).text(personLink);
          $(parentName).find(iconImageBlock).attr("src", getUserAvatar(avatar,gender));
          
}
var loadCommentList = function()
{ 
      $.getJSON("/a/opus_action/" + opusId + "/" + CommentTypeComment + "/" + comment_offset)
      .done(function(data) {
         $('.comment-page-div').css('display', 'none');
        modifyOffset(CommentTypeComment);
        hideLoadingImg(CommentTypeComment);
        // alert("comment count "+data.length);
        $.each(data, function(i, item) {
          var htmlString = $('.discuss-list').html();
          $('.discuss-list').find('.discuss-item').css('display', 'inline');
           
          if (item.commentInfo!=null && item.commentInfo.actionId != opusId) {
           $('.discuss-list').find('.reply-words').css('display','inline');

            $('.discuss-list').find('.reply-words').text('回复' + item.commentInfo.actionNickName+":"); 
            $('.discuss-list').find('.content_detail').text(item.comment); 
          } else {
            $('.discuss-list').find('.reply-words').css('display','none');
            $('.discuss-list').find('.content_detail').text(item.comment);
          }
          changeTagValue(item.createDate,item.userId,item.feedId,item.actionType,item.nickName,item.avatar,item.gender);
          
            var finalHtmlString = $('.discuss-list').html();
            $('#comment-list').append(finalHtmlString);
        });
        if (comment_num -1> comment_offset)
          $('.comment-page-div').css('display', 'block');
      })
      .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("AJAX request failed: " + err);
      });
}
var loadGuessList = function()
{
       $.getJSON("/a/opus_action/" + opusId + "/" + CommentTypeGuess + "/" + guess_offset)
        .done(function(data) {
        modifyOffset(CommentTypeGuess);
        hideLoadingImg(CommentTypeGuess);
          $.each(data, function(i, item) {
            $('.guess-page-div').css('display', 'none');
            var htmlString = $('.discuss-list').html();
            $('.discuss-list').find('.discuss-item').css('display', 'inline');
             $('.discuss-list').find('.reply-words').css('display','none');
            if (item.isCorrect == true) {
              $('.discuss-list').find('.content_detail').text("猜对了");
            } else {
              var errHtml = "";
              for (var i = 0; i < item.guessWords.length; i++) {
                errHtml = errHtml + item.guessWords[i];
                if (i != item.guessWords.length - 1) {
                  errHtml = errHtml + '、';
                }
              }
              $('.discuss-list').find('.content_detail').text('猜画的是: ' + errHtml);
            }
            changeTagValue(item.createDate,item.userId,item.feedId,item.actionType,item.nickName,item.avatar,item.gender);           
           var finalHtmlString = $('.discuss-list').html();
            $('#guess-list').append(finalHtmlString);
          });
          if (guess_num - 1 > guess_offset)
            $('.guess-page-div').css('display', 'block');
        });
}
var loadFlowerList = function()
{
        $.getJSON("/a/opus_action/" + opusId + "/" + CommentTypeFlower + "/" + flower_offset)
        .done(function(data) {
        modifyOffset(CommentTypeFlower);
        hideLoadingImg(CommentTypeFlower);
          $.each(data, function(i, item) {
             $('.flower-page-div').css('display', 'none');
            var htmlString = $('.discuss-list').html();
            $('.discuss-list').find('.discuss-item').css('display', 'inline');
            changeTagValue(item.createDate,item.userId,item.feedId,item.actionType,item.nickName,item.avatar,item.gender);
             $('.discuss-list').find('.reply-words').css('display','none');
            $('.discuss-list').find('.content_detail').text('给作者赠送了一朵鲜花！');
            //      $('.discuss-list').find('.time-detail').text(item['time']);
           var finalHtmlString = $('.discuss-list').html();
            $('#flower-list').append(finalHtmlString);
          });
          if (flower_num - 1 > flower_offset)
            $('.flower-page-div').css('display', 'block');
        });
}


$(document).ready(function(){
    $('.comment-page-div').css('display', 'none');
     loadCommentList();

    $.getJSON("/a/user_fans_count/" + userId)
      .done(function(data) {
          $('#followers-number').text(data['rfac']+' 粉丝');
      });
    $.getJSON("/a/user_opus_count/" + userId)
      .done(function(data) {
          $('#workpiece-number').text(data['cnt']+' 作品');
      });


    $.getJSON("/a/user_opus_list/"+ userId +"/0")
      .done(function(data) {
        $('.workshop-loading-div').css('display', 'none');
        var count = 0;
        $.each(data, function(i, item) {
          if(count<6 && item['feedId']!= opusId)
          {
          var htmlString = $('.workshop-link-list').html();
          $('.workshop-link-list').find('.workshop-link-item').css('display', 'inline');
          $('.workshop-link-list').find('.workshop-img').attr("src", item['opusImage']);
          $('.workshop-link-list').find('.workshop-img-link').attr("href","/opus/"+ item['feedId']);
          $('.workshop-link-list').find('.workshop-img').attr("alt",item['opusWord']);
          $('#workshop-list').append(htmlString);
          count = count + 1;
        }
          
        });
        htmlString = $('.workshop-link-list').html();
        $(htmlString).appendTo('#workshop-list');
      });

});
    $('.tab_li1').click(function() {
      $('#comment-list').empty();
      comment_offset = 0;
      $('.comment-page-div').css('display', 'none');
      $('.comment-loading-div').css('display', 'block');
      loadCommentList();

    });

    $('.tab_li2').click(function() {
      $('#guess-list').empty();
      guess_offset = 0;
      $('.guess-page-div').css('display', 'none');
      $('.guess-loading-div').css('display', 'block');
      loadGuessList();

    });
    $('.tab_li3').click(function() {
      flower_offset = 0;
      $('#flower-list').empty();
      $('.flower-page-div').css('display', 'none');
      $('.flower-loading-div').css('display', 'block');
       loadFlowerList();
    });
    $('.comment-more').click(function() {
      loadCommentList();
    });
    $('.guess-more').click(function() {
      loadGuessList();
    });
    $('.flower-more').click(function() {
       loadFlowerList();
    });


$( ".text-send" ).click(function() {

 var userid = $( "input.userId" ).val();
 var category = $( "input.category" ).val();
 var opusWord= $( "input.opusWord" ).val();
 var source_summary = $( "input.source_summary" ).val();
 var source_id = $( "input.source_id" ).val();//the feedid of the message
 var source_uid = $( "input.source_uid" ).val();// userid of message
 var source_nick = $( "input.source_nick" ).val(); //the nickname of message
 var source_type = $( "input.source_type" ).val(); //the actiontype 
 var comment_content = $( ".comment-area" ).val(); //the content of replying
 var actionURL = '/a/' + userid + '/opus/' + opusId+'/'+ category + '/comment';

var posting = $.post( actionURL, 
  { source_id: source_nick,
    source_summary : source_summary,
    source_uid : source_uid,
    source_type : source_type,
    source_nick : source_nick,
    content: comment_content
    } );

  posting.done(function( data ) {
    if(data['code'] == 0)
{   
    var content = "评论" +"("+ (getCommentNum() + 1) +")"; 
    $('.tab1_link').html(content);
   $('.comment-area').val('');
        $('#comment-list').empty();
      comment_offset = 0;
      $('.comment-page-div').css('display', 'none');
      $('.comment-loading-div').css('display', 'block');
      loadCommentList();
}
  });
});

$(document).ready(function(){

    $.getJSON('/a/opus/' + opusId+"/favored")
    .done(function(data) {
    if(data['code'] == 1)
     { 
      $('.storage-img').attr('src','../img/storage_after.png');
      $('.storage').attr("disabled", true);
      $('.storage').css('cursor','default');
     }
    });
   /* /a/opus/:opus_id/overFlower*/
    $.getJSON('/a/opus/' + opusId+"/overFlower")
    .done(function(data) {
    if(data['code'] == 1)
     { 
      $('.flower-img').attr('src','../img/send_flower_after.png');
      $('.sending-flower').attr("disabled", true);
      $('.sending-flower').css('cursor','default');
     }
    });
});
$('.storage').click(function(){
  //'/a/opus/:cate/:opus_id/favor'
    $.getJSON('/a/opus/' + category + "/" + opusId+"/favor")
    .done(function(data) {
    if(data['code'] == 0)
     { 
      var content = "收藏" +"("+ (getStorageNum() + 1) +")"; 
      $('.tab4_link').html(content);
      $('.storage-img').attr('src','../img/storage_after.png');
      $('.storage').attr("disabled", true);
      $('.storage').css('cursor','default');
     }
    });
  });
$('.sending-flower').click(function(){
var ownerId = $('.ownerId').html();
var ownerNick = $('.ownerNick').html();
var ownerAvatar = $('.ownerAvatar').html();
var ownerGender = parseInt($('.ownerGender').html());
$('.sending-flower').attr("disabled", true);
    
    $.getJSON('/a/'+userId+'/opus/'+opusId+'/' + category +"/flower")
    .done(function(data) {
    if(data['code'] == 10000004)
     { 
      $('.flower-img').attr('src','../img/send_flower_after.png');
      $('.sending-flower').attr("disabled", true);
      $('.sending-flower').css('cursor','default');
     }
    else if(data['code'] == 0)
    {
      var ts = Math.round((new Date()).getTime() / 1000);
      var content = "鲜花" +"("+ (getFlowerNum() + 1) +")"; 
      $('.tab3_link').html(content);
      var htmlString = $('.discuss-list').html();
      $('.discuss-list').find('.discuss-item').css('display', 'inline');
      changeTagValue(ts,userId,opusId,'6',ownerNick,ownerAvatar,ownerGender);
       $('.discuss-list').find('.reply-words').css('display','none');
      $('.discuss-list').find('.content_detail').text('给作者赠送了一朵鲜花！');
      //      $('.discuss-list').find('.time-detail').text(item['time']);
     var finalHtmlString = $('.discuss-list').html();
      $('#flower-list').prepend(finalHtmlString);   
      $('.sending-flower').attr("disabled", false);
    }
    });
  });
