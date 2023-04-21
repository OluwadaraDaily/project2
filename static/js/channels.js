document.addEventListener("DOMContentLoaded", () => {

	// Connect to websocket
    var socket = io.connect(`${location.origin}`);

	//Welcome message
	const h1 = document.createElement("h1")
	h1.innerHTML = "Welcome, " + localStorage.username;
	document.querySelector("#welcome").append(h1);

	// Let button be disabled by default
	const button = document.querySelector("#submit")
	button.disabled = true;

	//Get channels from the backend
	socket.emit("get all channels");

	socket.on("all channels sent", channels => {

		final_channels = channels.sort();
		
		for(i = 0; i < final_channels.length; i++ ) {
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.textContent = channels[i];
			a.setAttribute('href', "/messages/"+ a.textContent);
			// li.innerHTML = channels[i];
			li.appendChild(a);
			// li.dataset.link = li.innerHTML;
			document.querySelector("#channels").innerHTML += li.outerHTML;
		}

	});
	

	document.querySelector("#channel").onkeyup = () => {
		
		// Button be active only when something is in the input field
		if(document.querySelector("#channel").value.length > 0){
			button.disabled = false;	
		}
		else {
			button.disabled = true;	
		}
		
	}

	document.querySelector("#form").onsubmit = () => {
		
		// Get the data submitted to the form
		let channel = document.querySelector("#channel").value;

		//Emit a socketIO event to the backend to add the channel
		socket.emit('add channel', {"channel": channel});

		// // Clear the input field and don't submit
		document.querySelector("#channel").value = "";
		button.disabled = true;

		return false;
	}

	//When channel is added, display on frontend
	socket.on("channel added", channels => {
		const myNode = document.querySelector("#channels");
		while(myNode.firstChild) {
			myNode.removeChild(myNode.lastChild);
		}

		final_channels = channels.sort();
		
		for(i = 0; i < final_channels.length; i++) {
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.textContent = channels[i];
			a.setAttribute('href', "/messages/"+ a.textContent);
			li.appendChild(a);
			document.querySelector("#channels").appendChild(li)
		}			
	
	});

	// Delete all channels by clicking on the button
	document.querySelector("#delete_channels").onclick = () => {
		console.log()
		socket.emit("delete all channels");
	}

	socket.on("channels deleted", data => {
		alert("All Channels Deleted");
		location.reload();
	});

	//Clicking on each li takes you to the particular channel's page
	document.querySelector("#channels").querySelectorAll("li").forEach( li => {
		li.onclick = () => {
			window.location.pathname = "/messages/" + li.innerHTML;
		}
	});

	document.querySelector("#changeUsername").onclick = () => {
		localStorage.removeItem("username");
		localStorage.removeItem("location");
		window.location.pathname = '/';
	}

	
});