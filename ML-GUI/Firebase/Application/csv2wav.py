import csv
import numpy as np
import wave

# Function to read CSV file and extract numerical data
def read_csv(filename):
    data = []
    with open(filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        for row in csvreader:
            data.append(row)
    return data

# Function to convert numerical data to audio samples
def convert_to_audio(data):
    # Assuming the data contains integers representing audio samples
    # You may need to adjust this based on the actual format of your data
    audio_samples = np.array(data, dtype=np.int16)
    return audio_samples

# Function to save audio samples to a WAV file
def save_wav(filename, audio_samples, sample_rate):
    with wave.open(filename, 'w') as wavfile:
        wavfile.setnchannels(1)  # Mono audio
        wavfile.setsampwidth(2)   # 16-bit audio
        wavfile.setframerate(sample_rate)
        wavfile.writeframes(audio_samples.tobytes())

# Main function to convert CSV to WAV
def convert_csv_to_wav(csv_filename, wav_filename, sample_rate=44100):
    # Read CSV file
    data = read_csv(csv_filename)
    
    # Convert data to audio samples
    audio_samples = convert_to_audio(data)
    
    # Save audio samples to WAV file
    save_wav(wav_filename, audio_samples, sample_rate)
    print("WAV file saved successfully.")

if __name__ == "__main__":
    csv_filename = input("Enter CSV file name: ")
    wav_filename = input("Enter WAV file name: ")
    convert_csv_to_wav(csv_filename, wav_filename)
