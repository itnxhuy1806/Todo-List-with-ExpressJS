import { setCookie, getCookie } from "./utilities.js"

setCookie("username", "", 30);
console.log(getCookie("dataUser"))

$("#login").click(function () {
    let username = $("#username").val();
    let password = $("#password").val();
    let acc = { username, password }
    $.ajax('/login', {
        method: 'PUT',
        data: acc,
        complete: function () {
            setCookie("username", acc.username)
            location.assign("./");
        },
    })
})
