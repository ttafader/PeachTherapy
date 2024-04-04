import csv
import numpy as np
import wave
import serial
import serial.tools.list_ports
import sys

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

# Function to find the correct serial port for the DSP
def find_serial_port():
    ports = serial.tools.list_ports.comports()
    for port, desc, hwid in sorted(ports):
        print(f"Found port: {port}, Description: {desc}")  # Print port description
        if "FT232R USB UART - FT232R USB UART" in desc:  # Updated condition
            if not is_port_in_use(port):  # Check if port is available
                return port
    print("No suitable serial port found. Exiting...")
    sys.exit()

# Function to check if serial port is in use
def is_port_in_use(port):
    try:
        ser = serial.Serial(port)
        ser.close()
        return False
    except serial.SerialException:
        return True

# Main function to open the virtual COM port and listen for incoming data
def main():
    serial_port = find_serial_port()
    print(f"Using serial port: {serial_port}")

    # Initialize serial port
    with serial.Serial(serial_port, 115200, timeout=10) as ser:  # Timeout set to 10 seconds
        print("Waiting for data...")
        
        # Open a CSV file in write mode to save received data
        with open("received_data.csv", "w") as file:
            while True:
                try:
                    # Read data until '\r' is received
                    data = b''
                    while True:
                        char = ser.read(1)
                        if char == b'\r':
                            break
                        data += char
                    
                    # Decode the received bytes as utf-8 and strip any leading/trailing whitespace
                    line = data.decode('utf-8').strip()
                    
                    # Split the line by commas to get individual numbers
                    numbers = line.split(',')
                    
                    # If data received, print it and write to file
                    if numbers:
                        print("Received numbers:", numbers)
                        # Write numbers to file as CSV
                        file.write(','.join(numbers) + "\n")
                    else:
                        print("No data received from DSP. Waiting...")  # Print message for debugging
                
                except serial.SerialException:
                    print("Error reading data from serial port.")
                    break
                except KeyboardInterrupt:
                    print("Exiting...")
                    # Convert the received CSV file to WAV
                    convert_csv_to_wav("received_data.csv", "dsp_recording.wav")
                    break

if __name__ == "__main__":
    main()
