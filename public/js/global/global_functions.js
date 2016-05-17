var FeedTimesTypeComment = 4;
var FeedTimesTypeFlower = 5;


var getTimeDisplayString = function(timeInterval) {
  var displayString = "";
  var t = Math.round(((new Date).getTime()) / 1000);
  var interval = t - timeInterval;
  if (interval < 60) {
    displayString = interval.toString() + "秒前";
  } else if (interval < 3600) {
    displayString = Math.floor(interval / 60).toString() + "分钟前";
  } else if (interval < 3600 * 24) {
    displayString = Math.floor(interval / 3600).toString() + "小时前";
  } else if (interval < 3600 * 24 * 7) {
    displayString = Math.floor(interval / (3600 * 24)).toString() + "天前";
  } else {
    timeStamp = new Date(timeInterval*1000);
    /*displayString = moment.unix(timeInterval).format("YYYY-MM-DD");*/
    displayString =timeStamp.getFullYear() + "-" +(timeStamp.getMonth() + 1 )+ "-" + timeStamp.getDate();
  }
  return displayString;
}
var getDefaultUserAvatar = function(gender){
  if (gender){
    return "../img/man@2x.png";
  }
  else{
    return "../img/female@2x.png"; 
  }
}
var getUserAvatar = function(avatar, gender){
    if (avatar != null && avatar.length >= 4){ // 4 is file suffix
      var length = avatar.length;
      var extension = avatar.substring(length - 3, length)
      if (extension == "jpg" || extension == "png") {
        return avatar;
      }
     
      return getDefaultUserAvatar(gender);
    }
    else{
      return getDefaultUserAvatar(gender);
    }
}

var htmlEncode = function(value) {
    return value;
}
 
var htmlDecode = function(value) {
    return $('<div/>').html(value).text();
}
var getFeedTimes = function(feedTimesList, type){

    var value = 0;
    if (feedTimesList == null)
        return 0;

    for (var i=0; i<feedTimesList.length; i++)
    {
//        console.log("<getFeedTimes> type="+feedTimesList[i].type+", value="+feedTimesList[i].value);
        if (feedTimesList[i] == null)
            continue;

        if(feedTimesList[i].type == type)
        {
            value = feedTimesList[i].value;
            break;
        }
    }

    return value;
}


var getFeedFlowerTimes = function(feedTimesList){
    return getFeedTimes(feedTimesList, FeedTimesTypeFlower);
}

var getFeedCommentTimes = function(feedTimesList){
    return getFeedTimes(feedTimesList, FeedTimesTypeComment);
}
var getCurrentTime = function()
{
      var milliseconds = Math.round((new Date).getTime()/1000);
      return milliseconds;
}
var getFlowerNum = function()
{
  var flowerContent = $('.tab3_link').html();
  var flowerNum = ((flowerContent.split('鲜花')[1]).split('(')[1]).split(')')[0];
    
  return parseInt(flowerNum);
}
var getCommentNum = function()
{
  var commentContent = $('.tab1_link').html();
  var commentNum = ((commentContent.split('评论')[1]).split('(')[1]).split(')')[0];
  return parseInt(commentNum);
}
var getGuessNum = function()
{
  var guessContent = $('.tab2_link').html();
  var guessNum = ((guessContent.split('猜画')[1]).split('(')[1]).split(')')[0];
  return parseInt(guessNum);
}
var getStorageNum = function()
{
  var storageContent = $('.tab4_link').html();
  var storageNum = ((storageContent.split('收藏')[1]).split('(')[1]).split(')')[0];
  return parseInt(storageNum);
}
//nav pointer
var textFlower = "赠送鲜花功能正在开发中，敬请期待";
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
$('.sending-flower').click(function(){
   $( "#dialog" ).text(textFlower);
   $( "#dialog" ).dialog( "open" );
     setTimeout(function(){
        $('#dialog').dialog('close');                
    }, 3000);
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


//image process

  function load_big_size(selector) {
    if ((selector).height > (selector).width) {
      (selector).style.width = "290px";
      (selector).style.height = "";
    } else {
      (selector).style.height = "290px";
      (selector).style.width = "";
    }
  }

  function searchDisapper(){
    document.getElementById('search-img').style.display="none";
  }
  function searchBack()
  {
        document.getElementById('search-img').style.display="block";
  }
  function load_size(selector) {
    if ((selector).height > (selector).width) {
      (selector).style.width = "66px";
      (selector).style.height = "";
    } else {
      (selector).style.height = "66px";
      (selector).style.width = "";
    }
  }