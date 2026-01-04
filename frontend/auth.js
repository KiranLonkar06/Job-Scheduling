function signup(){
    const name = document.getElementById("suName").value;
    const pass = document.getElementById("suPass").value;
    if(!name || !pass){
        alert("Fill all field");
        return ;
    }
    localStorage.setItem("user",JSON.stringify({name,pass}));
    alert("signup succesfull");
    window.location.href="login.html"

}
function login(){
    const name = document.getElementById("liName").value;
    const pass = document.getElementById("liPass").value;
    const user = JSON.parse(localStorage("user"));
    if(!user || user.name!==name || user.pass!==pass){
        alert("invalid credentials");
        return ;
    }
    localStorage.setItem("loggedIn","true");
    window.location.href = "main.html";

}
function logout(){
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";

}
function checkAuth(){
    if(localStorage.getItem("loggedIn") !== "true"){
        window .location.href = "login.html";
    }
    
}