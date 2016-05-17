var FEED_LIST_TYPE_HOT = 3;
var FEED_LIST_TYPE_HISTORY = 9;
var FEED_LIST_TYPE_RECOMMEND = 11;
var FEED_LIST_TYPE_LATEST = 6;

var current_list_type = 3;

var APP_ID_DRAW = "513819630";
var GAME_ID_DRAW = "Draw";
var OPUS_PER_PAGE = 9;

var previousPage = 0; 
var currentPage = 1; //选择哪个页面的值
var currentTabIndex = 2; //表示选择的是feedlist的哪一种type

var previousPageIndex = 0;
var currentPageIndex = 1;

var TEMPLATE = '.template-div';

var MAX_PAGE = 100;


var changetype = function(choice)
{
  switch(choice)
  {
    case 1: 
      current_list_type = FEED_LIST_TYPE_HISTORY;  
      break;
    case 2: 
      current_list_type = FEED_LIST_TYPE_HOT;  
      break;
    case 3: 
      current_list_type = FEED_LIST_TYPE_LATEST;  
      break;
    case 4: 
      current_list_type = FEED_LIST_TYPE_RECOMMEND;  
      break;
  }
  return current_list_type;
}


var getImage = function(src)
{
  return src;

  if (src == null)
    return src;

  return src.replace("_m.", ".");

}
var showLoading = function(show){
    if (show){

    }
    else{
      $('.opus-loading-div').css('display', 'none');
    }
}

var hideLoading = function(){
    showLoading(false);
}
var getTabDivIdByIndex = function(tabIndex){
  return $('.tab'+tabIndex+'-div');
}
var getPageDivIdByIndex = function(pageIndex){
  return $('.page'+pageIndex);
}

var changeTabColor = function(tabIndex, isSelect){
  var tabImageId = '#ui-id-'+ tabIndex; 
  if (isSelect){
    $(tabImageId).css('background-color','#e75621');
  }
  else{
    $(tabImageId).css('background-color','#21ab8a');
  }
}
var changeNum = function(num)
{
   $('.page1').text(parseInt($('.page1').html()) + num);
   $('.page2').text(parseInt($('.page2').html()) + num);
   $('.page3').text(parseInt($('.page3').html()) + num);
   $('.page4').text(parseInt($('.page4').html()) + num);
   $('.page5').text(parseInt($('.page5').html()) + num);
   $('.page6').text(parseInt($('.page6').html()) + num);
   $('.page7').text(parseInt($('.page7').html()) + num);
   $('.page8').text(parseInt($('.page8').html()) + num); 
   $('.page9').text(parseInt($('.page9').html()) + num);
   $('.page10').text(parseInt($('.page10').html()) + num);
}
var hidePrevious = function()
{
  if(parseInt($('.page1').html()) <= 1)
    $('page-previous').css('display','none');
}




$(document).ready(function() {
    $('.template-div').css('display', 'none');
    currentTabIndex = 0;
    clickTab(2, '.tab2-div');
});

$('.tabs-item-2').click(function() {
  $('.loading-image-div').css('display','block');
  clickTab(2, '.tab2-div');
});

$('.tabs-item-1').click(function() {
  $('.loading-image-div').css('display','block');
  clickTab(1, '.tab1-div');
  return;
});
$('.tabs-item-3').click(function() {
  $('.loading-image-div').css('display','block');
  clickTab(3, '.tab3-div');
  return;

});
$('.tabs-item-4').click(function() {
  $('.loading-image-div').css('display','block');
  clickTab(4, '.tab4-div');
  return;

});



$('.page-normal').click(function() {
$('.loading-image-div').css('display','block');
  previousPage = currentPage;
  currentPage = parseInt($(this).html()); 

  previousPageIndex = currentPageIndex;
  currentPageIndex = getIDNum($(this).attr('id'));

  gotoPage();
  return;
});

$('.page-previous').click(function() {

  if (currentPage <= 1){
    return;
  }
   changeNum(-1); 
$('.loading-image-div').css('display','block');
  previousPage = currentPage;
  currentPage = currentPage - 1;

  previousPageIndex = currentPageIndex;
  gotoPage();
  return;

});

$('.page-next').click(function() {
$('.loading-image-div').css('display','block');
  if (currentPageIndex >= MAX_PAGE){
    return;
  }
  changeNum(1);
  previousPage = currentPage;
  currentPage = currentPage + 1;

  previousPageIndex = currentPageIndex;
  gotoPage();
  return;
});

var loadFeed = function(gameId, appId, type, pageNum, divId){
       if(parseInt($('.page1').html())<=1)
         $('.page-previous').css('display','none');
       if(parseInt($('.page10').html())>=MAX_PAGE)
         $('.page-next').css('display','none');
    $.getJSON("/a/feed/"+gameId+"/"+appId+"/"+type+"/"+(pageNum-1)*OPUS_PER_PAGE)
      .fail(function(){
         $('.loading-image-div').css('display','none'); 
        })
      .done(function(data) {
        $('.page-div').css('display','block');
        $('.loading-image-div').css('display','none');
        $('.tab-div').empty();
        hideLoading();
        if (data == null){
          return;
        }
        
        // alert("comment count "+data.length);
        $.each(data, function(i, item) {
            if (i == OPUS_PER_PAGE)
              return false;
            var htmlString = $(TEMPLATE).html();

            // show blocks
            $(TEMPLATE).find('.inner-div').css('display', 'inline-block');

            $(TEMPLATE).find('.image-show').attr("src", getImage(item['opusImage']));

            var title = item.opusWord;

            $(TEMPLATE).find('.image-show').prop("title", title);
            $(TEMPLATE).find('.image-show').attr("alt", item.opusWord);
            $(TEMPLATE).find('.image-link').attr("href","/opus/"+ item['feedId']);   
            $(TEMPLATE).find('.name-link').text(item.nickName);
            $(TEMPLATE).find('.name-link').attr("href","/user_detail/"+ item['userId']);
            $(TEMPLATE).find('.icon-link').attr("href","/user_detail/"+ item['userId']);
            $(TEMPLATE).find('.info-desc-detail').text(item.opusDesc);
            $(TEMPLATE).find('.flower-number').text(getFeedFlowerTimes(item['feedTimes']));
            $(TEMPLATE).find('.comment-number').text(getFeedCommentTimes(item['feedTimes'])); 
            $(TEMPLATE).find('.pub-time').text(getTimeDisplayString(item.createDate));

            var avatar = getUserAvatar(item.avatar, item.gender);
            $(TEMPLATE).find('#icon-img').attr("src", avatar);

            var finalHtmlString = $(TEMPLATE).html();
            $(divId).append(finalHtmlString);

        })
  ;
            var parentHeight = $('.main-tabs-div').height();
            $('.loading-image-div').height(0.93*parentHeight);
        // reset template status
        $(TEMPLATE).find('.inner-div').css('display', 'none');

      });  
}

var loadDrawFeed = function(type, pageNum, divId){
  loadFeed(GAME_ID_DRAW, APP_ID_DRAW, type, pageNum, divId);
}

var updatePageIndex = function(){ // page start from 1 to 10

  // clear previous page color
  if (previousPage > 0){
    $('.page' + previousPageIndex).css({'color':'#1b1714','background-color':'#ffd02c'});
  }

  // set current page color
  $('.page' + currentPageIndex).css({'color':'#ffd02c','background-color':'#1b1714'});
  
  if (currentPage == 1){
    $('.page-previous').css('display', 'none');
  }     
  else{
    $('.page-previous').css('display', 'inline-block');
  }

  if (currentPage == MAX_PAGE){
    $('.page-next').css('display', 'none');
  }
  else{
    $('.page-next').css('display', 'inline-block');    
  }

}
var gotoPage = function(){
  hidePrevious();
  updatePageIndex();

  var divId = getTabDivIdByIndex(currentTabIndex);
  loadDrawFeed(changetype(currentTabIndex), currentPage, divId);
}

var clickTab = function(tabIndex, divId){
  if (currentTabIndex == tabIndex){
    $('.loading-image-div').css('display','none');
  }
  else{
    // reset previous page and current page
    changeNum(-currentPage);
    previousPage = currentPage;
    currentPage = 1;
    previousPageIndex = currentPageIndex;
    currentPageIndex = 1;
    updatePageIndex();
    changeNum(1-parseInt($('.page1').html()))
    // select tab
    changeTabColor(currentTabIndex, false);
    currentTabIndex = tabIndex;
    changeTabColor(currentTabIndex, true);
    
    // load data
    loadDrawFeed(changetype(currentTabIndex), currentPage, divId);
  }
}
var getIDNum = function(IDname)
{
  var IDS = IDname.split('page');
  return parseInt(IDS[1]);
} 

//poster
$(document).ready(function() {
  var temp = 1;
  var title_draw = "下载小吉画画";
  var title_voice = "下载小吉大舌头";
  var time_interval = 5000;
  var fadeToTime =1000;
  $('.drawing-button-div').css('background-color', '#000000');
    var myInterval = setInterval(function(){changebcakground()}, time_interval);
  $('.drawing-button-div').mouseover(function() {
    temp = 1;
    window.clearInterval(myInterval);
    $('.poster-div').css('background-image', 'url(../img/drawing-poster.jpg)');
    $('.drawing-button-div').css('background-color', '#000000');
    $('.singing-button-div').css('background-color', '#FFFFFF');
  });
  $('.drawing-button-div').mouseout(function(){
    myInterval=setInterval(function(){changebcakground()}, time_interval);
  });
  $('.singing-button-div').mouseover(function() {
    temp = 2;
    window.clearInterval(myInterval);
    $('.poster-div').css('background-image', 'url(../img/singing-poster.jpg)');
    $('.singing-button-div').css('background-color', '#000000')
    $('.drawing-button-div').css('background-color', '#FFFFFF')
  });
  $('.singing-button-div').mouseout(function(){
    myInterval=setInterval(function(){changebcakground()}, time_interval);
  });
  var changebcakground = function() {
    if (temp == 1) {
      temp = 2;
      $('.app-store-link').attr('href','https://itunes.apple.com/cn/app/xiao-ji-da-she-tou/id660557448?mt=8');
      $('.app-store-link').prop('title', title_voice);
      $('.poster-div').prop('title', title_voice);
      $('.poster-div').delay("slow").fadeTo("slow", 0, function() {
        $(this).css('background-image', 'url(../img/singing-poster.jpg)');

      }).fadeTo(fadeToTime, 1);
      $('.singing-button-div').css('background-color', '#000000');
      $('.drawing-button-div').css('background-color', '#FFFFFF');
    } else if (temp == 2) {
      temp = 1;
            $('.app-store-link').attr('href','https://itunes.apple.com/cn/app/draw-lively/id513819630?mt=8');
      $('.app-store-link').prop('title', title_draw);
      $('.poster-div').prop('title', title_draw);
      $('.poster-div').delay("slow").fadeTo("slow", 0, function() {
        $(this).css('background-image', 'url(../img/drawing-poster.jpg)');
      }).fadeTo(fadeToTime, 1);
      $('.drawing-button-div').css('background-color', '#000000');
      $('.singing-button-div').css('background-color', '#FFFFFF');
    }
  }
       $(".poster-div").click(function(){
        if(temp == 1)
              window.open("https://itunes.apple.com/cn/app/draw-lively/id513819630?mt=8");
            else
              window.open("https://itunes.apple.com/cn/app/xiao-ji-da-she-tou/id660557448?mt=8"); 
        });

});