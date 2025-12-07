let users = JSON.parse(localStorage.getItem("users")) || [];

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");


if(signupBtn){
    signupBtn.addEventListener("click",() => {
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        if(!username || !password){
            alert("Please fill in all fields");
            return;
        }

        const userExists = users.some(user => user.username === username);
        if(userExists){
            alert("User already exists");
            return;
        }

        users.push({username, password});
        fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => { /* handle success / error */ });

        alert("Sign up successful");
        window.location.href = "login.html";
    })
}

if (loginBtn){
    loginBtn.addEventListener("click", ()=>{
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      const user = users.find(user => user.username === username && user.password === password);
      if(!user){
        alert("Invalid username or password");
        return;
      }

      localStorage.setItem("loggedInUser", username);
      
      alert("Login Successful");
      window.location.href = "index.html";
    })
   
    }


function protectPage() {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "login.html";
    }
}


