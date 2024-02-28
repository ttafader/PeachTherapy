import serial
import tempfile
import time

# Function to send command to DSP
def send_command(ser, command):
    ser.write(command.encode())
    ser.flush()

# Function to receive data from DSP
def receive_data(ser):
    return ser.readline().decode().strip()

# Main function
def main():
    # Serial port configuration
    ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)

    # Temporary file creation
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
        file_path = temp_file.name

        # Send start recording command to DSP
        send_command(ser, "START_RECORDING\n")
        print("Recording started...")

        # Simulate recording for 5 seconds
        time.sleep(5)

        # Send stop recording command to DSP
        send_command(ser, "STOP_RECORDING\n")
        print("Recording stopped...")

        # Receive and store data from DSP
        while True:
            data = receive_data(ser)
            if data == "END_OF_DATA":
                break
            temp_file.write(data + "\n")

    # Temporary file closed
    print(f"Data stored in temporary file: {file_path}")
    ser.close()

if __name__ == "__main__":
    main()
