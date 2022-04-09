import { setCookie, getCookie } from "./utilities.js"
setCookie("username", "")
console.log(getCookie("dataUser"))
$("#signUp").click(function () {
     let username = $("#username").val();
     let password = $("#password").val();
     let repassword = $("#repassword").val();
     if (password == repassword) {
          let acc = { username, password }
          $.ajax('/signUp', {
               method: 'PUT',
               data: acc,
               complete: function () {
                    setCookie("username", acc.username)
                    location.assign("./");
               }
          })
     }
     else
          alert("Repassword ERR")
     
})