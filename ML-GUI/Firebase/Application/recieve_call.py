import requests, time
import os
from flask import Flask, request
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from requests.auth import HTTPBasicAuth
import json

app = Flask(__name__)

# Load Twilio credentials from JSON file
with open('twiliocredentials.json', 'r') as file:
    twilio_credentials = json.load(file)

account_sid = twilio_credentials['account_sid']
auth_token = twilio_credentials['auth_token']

# Initialize Twilio client
from twilio.rest import Client
client = Client(account_sid, auth_token)

@app.route("/voice", methods=['GET', 'POST'])
def voice():
    """Respond to incoming phone calls with a message and record user input"""
    # Start our TwiML response
    resp = VoiceResponse()

    # Read a message aloud to the caller
    resp.say("Welcome to Peach Therapy! After the beep please say:")
    resp.say("When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow:")

    # Record the caller's input
    resp.record(timeout=10, action="/recording")

    return str(resp)

@app.route("/recording", methods=['POST'])
def recording():
    """Handle the recorded audio from the caller"""
    recording_url = request.values.get('RecordingUrl', '')
    auth_header = HTTPBasicAuth(account_sid, auth_token)

    rsc = 404
    retry=0

    while (rsc == 404):
        response = requests.request("GET", recording_url, auth=auth_header)
        rsc = response.status_code
        time.sleep(5)
        retry+=1
        if (retry == 3):
            break

    # Save the recording locally as a .wav file
    file_name = "callin_recording.wav"
    
    with open(file_name, 'wb') as f:
        f.write(response.content)

    print("Recording saved as:", file_name)

    return "", 204  # Respond with an empty 204 No Content to Twilio

if __name__ == "__main__":
    app.run(debug=True)
