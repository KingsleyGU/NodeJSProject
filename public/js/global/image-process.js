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