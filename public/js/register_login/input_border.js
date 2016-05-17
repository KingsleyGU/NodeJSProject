  var USER_INPUT = "请输入电子邮箱 ";
  var NICKNAME = "请输入昵称 ";
  var FIRST_PSW_INPUT = "请输入密码 ";
  var SECOND_PSW_INPUT = "请再一次确认密码 ";
  var USER_ID = "请输入小吉号/电子邮箱 ";

  var WARN_USER_INPUT = ["电子邮箱地址不能为空","电子邮箱地址格式不正确"];
  var WARN_NICKNAME = ["昵称不能为空","昵称格式不正确，长度必须小于16个字符"];
  var WARN_REG_PWD_INPUT =["密码不能为空","密码格式不正确，密码长度不许是6-24个字符"];
  var WARN_CONFIRM_PWD_INPUT =["确认密码不能为空","密码不匹配"];
  var WARN_USER_ID = ["用户账号不能为空","用户账号格式不正确"];
  var WARN_LOG_PWD_INPUT = ["密码不能为空","密码格式不正确"];

  var IsPassword = true;
  var NotPassword = false;

  var userInputBlock = '.user-input' ;
  var userIDBlock = '.user-id';
  var nicknameBlock = '.nickname';
  var logPasswordBlock = '.log_psw-input';
  var regPasswordBlock = '.first_psw-input';
  var confirmPasswordBlock = '.second_psw-input';

  var userInputNum = 1;
  var userIdNum = 2;
  var nicknameNum = 3;
  var logPwdNum = 4;
  var regPwdNum = 5;
  var confirmPwdNum = 6;

$(document).ready(function(){
  var NotRemember = 0;
  var Remember = 1;
  $('.warning_div').css('display','none');
/*  if(!checkRegisterform())
  {
    $('.reg-submit-input').attr("disabled", true);
    $('.reg-submit-input').click(function(){
    $('.warning-reg-submit').css('display','block');
  });
  }
  if(!checkLoginform())
  {
    $('.log-submit-input').attr("disabled", true);
    $('.log-submit-input').click(function(){
       $('.warning-log-submit').css('display','block');
    })
  }*/

  if($(userInputBlock).val()!=USER_INPUT)
     changeFontColor(userInputBlock,NotPassword);
  if($(nicknameBlock).val()!=NICKNAME)
     changeFontColor(nicknameBlock,NotPassword);
  if($(regPasswordBlock).val()!=FIRST_PSW_INPUT)
     changeFontColor(regPasswordBlock,IsPassword);
  if($(confirmPasswordBlock).val()!=SECOND_PSW_INPUT)
     changeFontColor(confirmPasswordBlock,IsPassword);
  if($(userIDBlock).val()!=USER_ID)
     changeFontColor(userIDBlock,NotPassword);
  if($(logPasswordBlock).val()!=FIRST_PSW_INPUT)
     changeFontColor(logPasswordBlock,IsPassword);

   $(userIDBlock).focusin(function(){
     focusInFunction(userIdNum);
   });
  $(userInputBlock).focusin(function(){
     focusInFunction(userInputNum);
   });
    $(logPasswordBlock).focusin(function(){
     focusInFunction(logPwdNum);
   });
   $(nicknameBlock).focusin(function(){
     focusInFunction(nicknameNum);
   });
   $(regPasswordBlock).focusin(function(){
     focusInFunction(regPwdNum);
   });
   $(confirmPasswordBlock).focusin(function(){
     focusInFunction(confirmPwdNum);
   });
   $(userIDBlock).focusout(function(){  
      focusoutGeneral(userIdNum);
   });
   $(userInputBlock).focusout(function(){
      focusoutGeneral(userInputNum);
   });
  $(nicknameBlock).focusout(function(){
      focusoutGeneral(nicknameNum);
   });
  $(logPasswordBlock).focusout(function(){
      focusoutGeneral(logPwdNum);
   });
  $(regPasswordBlock).focusout(function(){
      focusoutGeneral(regPwdNum);
   });
   $(confirmPasswordBlock).focusout(function(){
      focusoutGeneral(confirmPwdNum);
   });
 /* $('input').focusout(function(){

  	$(this).css('border','5px solid #e2e2e2');
  	if($(this).val() == "")
  	{	
  		$(this).css('color','#cac3b9');
  	   if($(this).attr('id') == "reg_password")
  	   {
  		$(this).prop('type', 'text');
  		$(this).val(FIRST_PSW_INPUT);
     $('.warning-first_psw').css('display','block');
      $('.warning-first_psw').text('密码不能为空');
  	   }
       else if($(this).attr('id') == "log_password")
       {

      $(this).prop('type', 'text');
      $(this).val(FIRST_PSW_INPUT);
      $('.warning-log_psw').css('display','block');
      $('.warning-log_psw').text('密码不能为空');
       }
  	   else if($(this).attr('id') == "confirm-password")
  	   {
  		$(this).prop('type', 'text');
  		$(this).val(SECOND_PSW_INPUT);
       $('.warning-confirm-password').css('display','block');
       $('.warning-confirm-password').text('确认密码不能为空');
  	   }
  	   else if($(this).attr('id') == "user-input")
  	   {

  		 $(this).val(USER_INPUT);
       $('.warning-user-input').css('display','block');
       $('.warning-user-input').text('电子邮箱地址不能为空');
  	   }
  	   else if($(this).attr('id') == "nickname")
  	   {
  		$(this).val(NICKNAME);
       $('.warning-nickname').css('display','block');
       $('.warning-nickname').text('昵称不能为空');
  	   }
  	   else if($(this).attr('id') == "user-id")
  	   {
  	   	 $(this).val(USER_ID);
       $('.warning-user-id').css('display','block');
       $('.warning-user-id').text('用户账号不能为空');
  	   }
  	}
    else if($(this).attr('id') == "user-input"&&!isValidEmailAddress($(this).val()))
    {
       $('.warning-user-input').css('display','block');
       $('.warning-user-input').text('电子邮箱地址格式不正确');
    }

  });*/
  $('.remember').click(function(){
  	if($(this).attr('src') == '../img/remember.png')
  	{
  		$(this).attr('src','../img/remember-click.png');
      $('.rememberOrNot').val(Remember)
  	}
  	else if($(this).attr('src') == '../img/remember-click.png')
  	{
  		$(this).attr('src','../img/remember.png');
      $('.rememberOrNot').val(NotRemember);
  	}
  });
    
});
var isValidEmailAddress = function(emailAddress) {
    var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return pattern.test(emailAddress);
};
var checkRegisterform = function()
{
  if($('.user-input').val()==USER_INPUT||isValidEmailAddress($('.user-input').val()))
   { return false;}
  else if($('.nickname').val()==NICKNAME)
    return false;
  else if($('.first_psw-input').val()==FIRST_PSW_INPUT)
    return false;
  else if($('.second_psw-input').val()==SECOND_PSW_INPUT)
    return false;
  return true;
}
var checkLoginform = function()
{
   if($('.log_psw-input').val()==FIRST_PSW_INPUT)
     return false;
   else if($('.user-id').val()==USER_ID)
     return false;
   return true;
}
var changeFontColor = function(DivID,isPwd)
{  
  if(isPwd)
     $(DivID).prop('type', 'password');
   $(DivID).css('color','#343333');
}
var getInputDiv = function(InputNum)
{
    switch(InputNum)
    {
      case userIdNum :return userIDBlock; break;
      case userInputNum : return userInputBlock; break;
      case nicknameNum : return nicknameBlock; break;
      case logPwdNum : return logPasswordBlock; break;
      case regPwdNum : return regPasswordBlock; break;
      case confirmPwdNum : return confirmPasswordBlock; break;
    }
}
var IsPasswordDiv = function(InputNum)
{
    switch(InputNum)
    {
      case userIdNum :return false; break;
      case userInputNum : return false; break;
      case nicknameNum : return false; break;
      case logPwdNum : return true; break;
      case regPwdNum : return true; break;
      case confirmPwdNum : return true; break;
    }
}
var getOrginalValue = function(InputNum)
{
    switch(InputNum)
    {
      case userIdNum :return USER_ID; break;
      case userInputNum : return USER_INPUT; break;
      case nicknameNum : return NICKNAME; break;
      case logPwdNum : return FIRST_PSW_INPUT; break;
      case regPwdNum : return FIRST_PSW_INPUT; break;
      case confirmPwdNum : return SECOND_PSW_INPUT; break;
    }
}
var focusInFunction = function(currentInputNum)
{
   var DivName = getInputDiv(currentInputNum);
    $(DivName).parents(".parent_div ").children('.warning_div').css('display','none');
    $(DivName).css({'border':'5px solid #00dad6','color':'#343333'});
    var currentValue = getOrginalValue(currentInputNum);
    if($(DivName).val()== currentValue)
       $(DivName).val("");
    $('.warning_get_div').css('display','none');
    if(IsPasswordDiv(currentInputNum))
    {
      $(DivName).prop('type', 'password');
    }
}
var getWarnMessage = function(InputNum,type)
{
    switch(InputNum)
    {
      case userIdNum :return WARN_USER_ID[type]; break;
      case userInputNum : return WARN_USER_INPUT[type]; break;
      case nicknameNum : return WARN_NICKNAME[type]; break;
      case logPwdNum : return WARN_LOG_PWD_INPUT[type]; break;
      case regPwdNum : return WARN_REG_PWD_INPUT[type]; break;
      case confirmPwdNum : return WARN_CONFIRM_PWD_INPUT[type]; break;
    }
}
var focusOutFunction = function(currentInputNum)
{

     var DivName = getInputDiv(currentInputNum);

      $(DivName).css('color','#cac3b9');
      if(IsPasswordDiv(currentInputNum))
         $(DivName).prop('type', 'text');

      var currentValue = getOrginalValue(currentInputNum);

      $(DivName).val(currentValue);

      showWarning(currentInputNum,0)


}
var checkValidation = function(InputNum)
{
    switch(InputNum)
    {
      case userIdNum :
      {
        var checknum = checkIsANum($(getInputDiv(userIdNum)).val());
        var checkEmail = isValidEmailAddress($(getInputDiv(userIdNum)).val());
        if(!checknum&&!checkEmail)
          {
            return false; 

          }
       break;
      }
      case userInputNum : 
      {
        if(!isValidEmailAddress($(getInputDiv(userInputNum)).val()))
          return false; break;
      }
      case nicknameNum :
      {
        if(($(getInputDiv(nicknameNum)).val()).length>16)
          return false; break;
      } 
      case logPwdNum : 
      {
        if(($(getInputDiv(logPwdNum)).val()).length<6||($(getInputDiv(logPwdNum)).val()).length>26)
          return false; break;
      } 
      case regPwdNum : 
      {
        if(($(getInputDiv(regPwdNum)).val()).length<6||($(getInputDiv(regPwdNum)).val()).length>26)
          return false; break; 
      }
      case confirmPwdNum : 
      {
        if(($(getInputDiv(confirmPwdNum)).val())!=($(getInputDiv(regPwdNum)).val()))
          return false; break; 
      }
    }
      return true;
}
var showWarning =function(currentInputNum,type)
{
  var DivName = getInputDiv(currentInputNum);
  $(DivName).parents(".parent_div ").children('.warning_div').css('display','block');
  $(DivName).parents(".parent_div ").children('.warning_div').text(getWarnMessage(currentInputNum,type));
}
var focusoutGeneral = function(currentInputNum)
{
  var DivName = getInputDiv(currentInputNum);
     $(DivName).css('border','5px solid #e2e2e2');
     if($(DivName).val() == "")
    {
      
      focusOutFunction(currentInputNum);

    }
    else if(!checkValidation(currentInputNum))
    {
      showWarning(currentInputNum,1);
    }

}
var checkIsANum = function(str)
{
  if(str == null)
    return false;
  for(i=0; i<str.length; i++)
  {

    if(str[i]<'0'||str[i]>'9')
      {
        return false;
      }

  }
  return true;
}