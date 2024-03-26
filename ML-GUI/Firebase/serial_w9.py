import serial
import serial.tools.list_ports
import numpy as np
import time

# Function to find the correct serial port for the DSP
def find_serial_port():
    while True:
        ports = serial.tools.list_ports.comports()
        for port, desc, hwid in sorted(ports):
            if "USB" in desc:  # Adjust this condition as needed
                return port
        print("No suitable serial port found. Retrying...")
        time.sleep(1)  # Adjust the delay time as needed

# Main function to open the virtual COM port and listen for incoming data
def main():
    while True:
        try:
            serial_port = find_serial_port()
            print(f"Using serial port: {serial_port}")

            # Initialize serial port
            with serial.Serial(serial_port, 115200, timeout=1) as ser:
                print("Waiting for data...")
                
                # Buffer to hold incoming data
                incoming_data_buffer = bytearray()
                
                while True:
                    # Read all available incoming data at once
                    data_in = ser.read(ser.in_waiting)
                    
                    # If data received, process it
                    if data_in:
                        # Append received data to the buffer
                        incoming_data_buffer.extend(data_in)
                        
                        # Check if we received the end-of-message marker ('\n')
                        if b'\n' in incoming_data_buffer:
                            # Split the buffer by the end-of-message marker
                            messages = incoming_data_buffer.split(b'\n')
                            
                            # Process each message
                            for message in messages[:-1]:  # Skip the last element (incomplete message)
                                # Convert received bytes to numpy array of float32
                                received_array = np.frombuffer(message, dtype=np.float32)
                                
                                # Print received data
                                print("Received data:", received_array)
                            
                            # Clear the buffer to receive the next message
                            incoming_data_buffer = messages[-1]
                        
                        # Optional: add a condition to break out of the loop if needed, e.g., specific command received
        
        except serial.SerialException:
            print("Serial port not available. Retrying...")
            continue
        except KeyboardInterrupt:
            print("Exiting...")
            break

if __name__ == "__main__":
    main()
