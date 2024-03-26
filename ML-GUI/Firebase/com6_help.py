import serial.tools.list_ports
import time

# Function to find a suitable serial port
def find_serial_port():
    while True:
        ports = serial.tools.list_ports.comports()
        for port, desc, hwid in sorted(ports):
            print(f"Found port: {port}, Description: {desc}")  # Print port description
            if "USB" in desc:  # Check if description contains "USB"
                if not is_port_in_use(port):  # Check if port is available
                    return port
        print("No suitable serial port found. Retrying...")
        time.sleep(1)  # Adjust the delay time as needed

# Function to check if serial port is in use
def is_port_in_use(port):
    try:
        ser = serial.Serial(port)
        ser.close()
        return False
    except serial.SerialException:
        return True

# Main function to open the serial port and listen for incoming text data
def main():
    while True:
        try:
            serial_port = find_serial_port()
            print(f"Using serial port: {serial_port}")

            # Initialize serial port
            with serial.Serial(serial_port, 115200, timeout=1) as ser:
                print("Waiting for data...")
                
                while True:
                    # Read a line of text from the serial port
                    data_in = ser.readline().decode().strip()
                    
                    # If data received, print it
                    if data_in:
                        print("Received data:", data_in)
        
        except serial.SerialException:
            print("Serial port not available. Retrying...")
            continue
        except KeyboardInterrupt:
            print("Exiting...")
            break

if __name__ == "__main__":
    main()
