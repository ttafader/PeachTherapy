import pyaudio
import wave
import json

# Load Twilio credentials from JSON file
with open('twiliocredentials.json', 'r') as file:
    twilio_credentials = json.load(file)

twilio_account_sid = twilio_credentials['account_sid']
twilio_auth_token = twilio_credentials['auth_token']

# Initialize Twilio client
from twilio.rest import Client
client = Client(twilio_account_sid, twilio_auth_token)

# PyAudio configuration
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 10
WAVE_OUTPUT_FILENAME = "recorded_call.wav"

audio = pyaudio.PyAudio()

# Define callback function for recording
def callback(in_data, frame_count, time_info, status):
    frames.append(in_data)
    return (in_data, pyaudio.paContinue)

# Start recording
frames = []
stream = audio.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK,
                    stream_callback=callback)

print("Recording...")

# Record for RECORD_SECONDS
stream.start_stream()
while stream.is_active():
    pass

# Stop recording
stream.stop_stream()
stream.close()
audio.terminate()

# Save recorded audio to file
with wave.open(WAVE_OUTPUT_FILENAME, 'wb') as wf:
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))

print("Recording saved as:", WAVE_OUTPUT_FILENAME)
