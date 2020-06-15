document.addEventListener('DOMContentLoaded', () => {

    if (localStorage.location && localStorage.username) {
        window.location.pathname = '/messages/' + localStorage.location;
        localStorage.removeItem("location");
    }

    else if (localStorage.username) {
        window.location.pathname = '/channels'
    }
    
    else {
        const button = document.querySelector('#submit');

        // Let button be disabled by default
        button.disabled = true;

        // Button enabled when typing
        document.querySelector("#username").onkeypress = () => {
            if(document.querySelector("#username").value.length > 0){
                button.disabled = false;    
            }
            else {
                button.disabled = true;
            }
                    
        }

        document.querySelector("#form-username").onsubmit = () => {

            const username = document.querySelector("#username").value;
            
            localStorage.setItem('username', username);

            // Display the name on the front end
            // const li = document.createElement("li");
            // li.innerHTML = localStorage.username;
            // document.querySelector("#div-username").append(li);

            document.querySelector("#username").value = "";
            // return false;
            window.location.pathname = '/channels'
        
        }

        
    }

});