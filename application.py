import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

c = dict()
c_list = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/channels")
def channels():
	return render_template("channels.html")

@app.route("/messages/<string:channel_id>")
def messages(channel_id):
	return render_template("messages.html", channel_id=channel_id)

@socketio.on("add message")
def message(data):
	# Create an array to be sent to the front end
	m = []

	# Add message and user who sent the message to the array
	m.append(data["message"])
	m.append(data["user"])
	
	# Store the message and user on the backend
	c.setdefault(data['channel'], []).append(data['message'])
	c.setdefault(data['message'], []).append(data['user']) 
	
	# Emit the event
	emit("announce message", m, broadcast=True)

@socketio.on("get messages")
def message(data):
	try:
		res = dict()
		res.update({'messages':[]})
		res.update({'users': []})
		
		# Get channel from the front end & Get the messages from the back end
		res['messages'] = c[data['channel']]

		# Get the users that sent each message from the back end in an array
		for i in res['messages']:
			res["users"].append(c[i])
		emit("show messages", res, broadcast=True)
	except KeyError:
		res = ("No messages yet!")
		emit("no messages", res, broadcast=True)

@socketio.on("add channel")
def add_channel(data):
	c_list.append(data["channel"])
	emit("channel added", list(set(c_list)), broadcast=True)

@socketio.on("get all channels")
def get_all_channels():
	emit("all channels sent", list(set(c_list)), broadcast=True)

@socketio.on("delete all channels")
def delete_all_channels():
	c_list.clear()
	emit("channels deleted", c_list, broadcast=True)