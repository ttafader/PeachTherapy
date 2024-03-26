import serial
import tempfile
import time
import serial.tools.list_ports
import csv
import io
import pandas as pd

# Function to send command to DSP
def send_command(ser, command):
    ser.write(command.encode())
    ser.flush()

# Function to receive data from DSP
def receive_data(ser):
    return ser.readline().decode().strip()

# Function to find all connected serial ports and their descriptions
def find_all_serial_ports():
    ports = serial.tools.list_ports.comports()
    port_list = []
    for port, desc, hwid in sorted(ports):
        port_list.append((port, desc))
    return port_list

# Function to find the correct serial port for the DSP
def find_serial_port():
    for port, desc in find_all_serial_ports():
        if "USB" in desc:  # Modify this condition according to your DSP
            return port, desc
    raise Exception("No suitable serial port found")

# Function to deserialize CSV data from the DSP
def deserialize_data(data):
    try:
        # Create a file-like object to read CSV data
        csv_data = io.StringIO(data)
        # Parse CSV data using csv.reader
        csv_reader = csv.reader(csv_data)
        # Convert CSV data to a list of lists
        csv_list = list(csv_reader)
        # Optionally, convert the list of lists to a pandas DataFrame
        df = pd.DataFrame(csv_list)
        return df
    except Exception as e:
        print("Error:", e)
        return None

# Main function
def main():
    # Print all connected devices
    print("Connected devices:")
    for port, desc in find_all_serial_ports():
        print(f"  {desc} on {port}")

    # Find the serial port dynamically
    serial_port, device_name = find_serial_port()
    print("\nFound serial port:", serial_port)
    print("Device connected:", device_name)

    # Serial port configuration
    ser = serial.Serial(serial_port, 9600, timeout=1)

    recording = False
    while True:
        print("\nOptions:")
        print("1. Start recording")
        print("2. Stop recording")
        print("3. End connection")
        choice = input("Enter your choice: ")

        if choice == "1":
            if not recording:
                print("Start recording...")
                send_command(ser, "START_RECORDING\n")
                recording = True
            else:
                print("Already recording...")
        elif choice == "2":
            if recording:
                print("Stop recording...")
                send_command(ser, "STOP_RECORDING\n")
                recording = False
            else:
                print("Not recording...")
        elif choice == "3":
            print("Ending connection...")
            break
        else:
            print("Invalid choice. Please enter a valid option.")

        # Check if DSP wants to send data
        if ser.in_waiting > 0:
            data = receive_data(ser)
            deserialized_data = deserialize_data(data)
            if deserialized_data is not None:
                print("Received data:")
                print(deserialized_data)

    ser.close()

if __name__ == "__main__":
    main()
