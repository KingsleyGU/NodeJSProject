  var changeInput = function(select){
   var comment = "";
   var feedId = "";
   var userId = "";
   var nickName = "";
   var actionType = "";
    nickName = $(select).parents(".personal-information").children(".person-time").children(".person-link").html();
    $('.source_nick').val(nickName);
    comment = $(select).parents(".comment-reply").children(".content_detail").html();
    $('.source_summary').val(comment);
    feedId = $(select).parents(".comment-reply").children(".feedId").html();
    $('.source_id').val(feedId);
    userId = $(select).parents(".comment-reply").children(".userId").html();
    $('.source_uid').val(userId);
    actionType = $(select).parents(".comment-reply").children(".actionType").html();
    $('.source_type').val(actionType);
    $(".comment-area").attr("placeholder", "回复"+nickName + ":");
    $('.comment-area').focus();
  }