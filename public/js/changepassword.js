// check change password
// console.log(sessionStorage.getItem("passwordChanged") && sessionStorage.getItem("passwordChanged") == "false")
if (sessionStorage.getItem("passwordChanged") && sessionStorage.getItem("passwordChanged") == "false") {
    // console.log(window.location.href.split('/').slice(-1) == 'changepassword')
    if (window.location.href.split('/').slice(-1) != 'changepassword') {
        window.location.href = '/changepassword';
    }
}