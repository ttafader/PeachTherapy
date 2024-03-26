import serial
import serial.tools.list_ports

# Function to find the correct serial port for the DSP
def find_serial_port():
    while True:
        ports = serial.tools.list_ports.comports()
        for port, desc, hwid in sorted(ports):
            print(f"Found port: {port}, Description: {desc}")  # Print port description
            if "USB" in desc:  # Adjust this condition as needed
                if not is_port_in_use(port):  # Check if port is available
                    return port
        print("No suitable serial port found. Retrying...")

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
    with serial.Serial(serial_port, 115200, timeout=0.01) as ser:  # Timeout set to 30 minutes
        print("Waiting for data...")
        
        while True:
            try:
                # Read all available incoming data at once
                data_in = ser.read_all()
                
                # If data received, print it immediately
                if data_in:
                    # Convert received bytes to string and print it
                    received_string = data_in.decode('utf-8')  # Assuming UTF-8 encoding
                    print("Received data:", received_string)
                else:
                    print("No data received from DSP. Waiting...")  # Print message for debugging
            
            except serial.SerialException:
                print("Error reading data from serial port.")
                break
            except KeyboardInterrupt:
                print("Exiting...")
                break

if __name__ == "__main__":
    main()
