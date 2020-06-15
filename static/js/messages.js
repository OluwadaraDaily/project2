document.addEventListener("DOMContentLoaded", () => {

	// Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	//Make sure button is disabled by default
	document.querySelector("#submit").disabled = true;

	//Button is abled when typing
	document.querySelector("#message").onkeyup = () => {
		if(document.querySelector("#message").value.length > 0){
			document.querySelector("#submit").disabled = false;
		}
		
		else{
			document.querySelector("#submit").disabled = true;
		}	
	}

    // When connected, configure message button
    socket.on('connect', () => {
    	
    	window.onload = () => {
    		
    		//Get channel name
			const channel = document.querySelector("#message").dataset.channel;

            localStorage.setItem("location", channel);
    		
    		//Get messages from the backend immmediately after reload
    		socket.emit('get messages', {'channel':channel});	
    	};
    	
        // Each button should emit an "add message" event
        document.querySelector('#submit').onclick = () => {
        		
        		//Get channel name and message
				const channel = document.querySelector("#message").dataset.channel;
                const message = document.querySelector("#message").value;
                
                document.querySelector("#message").value = "";
                document.querySelector("#submit").disabled = true;
                socket.emit('add message', {'message': message, "channel": channel, "user":localStorage.username});
            };
        });

    const post_template = Handlebars.compile(document.querySelector('#post').innerHTML);
    // Announce message
    socket.on('announce message', message => {
        const post = post_template({'contents': message[0],});

        document.querySelector('#messages').innerHTML += post;
    });

    socket.on("show messages", data => {

        if(data["messages"].length > 0){
            for (i = 0; i < data["messages"].length; i++) {
        
                const post = post_template({
                    'contents': data["messages"][i]
                });

                document.querySelector('#messages').innerHTML += post;
            }    
        }
        
    });

    socket.on("no messages", data => {});

    //Delete a post that the delete button is clicked
    // document.addEventListener('click', event => {
    //     const element = event.target;
    //     if (element.className === 'delete') {
    //         element.parentElement.style.animationPlayState = 'running';
    //         element.parentElement.addEventListener('animationend', () =>  {
    //             element.parentElement.remove();
    //     });
    //     }
    // }); 

    socket.on("message deleted", data => {
        console.log(data);
    });

});