
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

  });
});