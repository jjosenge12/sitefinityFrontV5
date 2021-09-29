window.onload = function() {
  function encrypt() {
  var pass = document.getElementById("pass").value;
  var user = document.getElementById("user").value;
  var fail = document.getElementById("fail").value;
  var ok = document.getElementById("ok").value;
  var pass_enc = window.btoa(pass);
  var user_enc = window.btoa(user);
  var fail_enc = window.btoa(fail);
  var ok_enc = window.btoa(ok);
  document.getElementById("pass").value = pass_enc; 
  document.getElementById("user").value = user_enc; 
  document.getElementById("fail").value = fail_enc; 
  document.getElementById("ok").value = ok_enc; 
  alert(pass_enc);
 } 
 function showPassword() {
    var x = document.getElementById("pass");
    if (x.type === "password") {
      x.type = "text";
    } 
    else {
      x.type = "password";
    }
}
};
