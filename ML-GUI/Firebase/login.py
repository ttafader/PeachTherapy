import os, re, subprocess, firebase_admin, datetime, pyrebase
from firebase_admin import credentials, db
from firebase_admin import storage

from Sidebar.mycredentials import firebase_init
from Sidebar.mycredentials import pyrebase_config as config

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

cloud_storage_bucket = storage.bucket()

# Initialize Pyrebase
firebase = pyrebase.initialize_app(config)

def login(email, password):
    try:
        user = firebase.auth().sign_in_with_email_and_password(email, password)
        print("Login successful.")
        return user['localId']
    except Exception as e:
        print("Error:", e)
        return None

def sign_up():
    email = input('Enter your email: ')
    password = input('Enter your password: ')
    try:
        user = firebase.auth().create_user_with_email_and_password(email, password)
        print("Sign up successful. Please log in.")
        return user['localId']
    except Exception as e:
        print("Error:", e)
        return None
    
def clean_patient_id(patient_id):
    # Convert patient_id to string if it's not already
    patient_id = str(patient_id)
    
    # Remove any characters that are not allowed in Firebase paths
    cleaned_id = re.sub(r'[.$#[\]/]', '', patient_id)
    return cleaned_id

def add_patient(doctor_id):
    first_name = input("Enter patient's first name: ")
    last_name = input("Enter patient's last name: ")
    birthdate = input("Enter patient's birthdate (YYYY-MM-DD): ")
    age = input("Enter patient's age: ")
    gender = input("Enter patient's gender (F/M): ")
    health_card_number = input("Enter patient's health card number: ")

    patient_data = {
        "patient_id": None,  # Placeholder for patient ID
        "first_name": first_name,
        "last_name": last_name,
        "birthdate": birthdate,
        "age": age,
        "gender": gender,
        "doctor_id": doctor_id,
        "health_card_number": health_card_number,
    }

    ref = db.reference('patients')
    patient_id = ref.push(patient_data).key

    # Update the patient data with the generated patient ID
    patient_data["patient_id"] = patient_id

    # Update the patient data in the database with the patient ID
    ref.child(patient_id).update(patient_data)

    print(f'Patient added with ID: {patient_id}')
    print("Patient data stored successfully in the database:")
    print(patient_data)

    return patient_id, patient_data

def view_patients():
    patients_ref = db.reference('patients')
    patients_data = patients_ref.get()
    if patients_data:
        sorted_patients = sorted(patients_data.values(), key=lambda x: x.get('first_name', ''))
        print("Patients:")
        for idx, patient in enumerate(sorted_patients, 1):
            first_name = patient.get('first_name', 'Unknown')
            last_name = patient.get('last_name', 'Unknown')
            birthdate = patient.get('birthdate', 'Unknown')
            age = patient.get('age', 'Unknown')
            gender = patient.get('gender', 'Unknown')
            doctor_id = patient.get('doctor_id', 'Unknown')
            health_card_number = patient.get('health_card_number', 'Unknown')
            recordings = patient.get('stored_voice_data', [])
            progress = patient.get('progress', [])
            
            print(f"{idx}. Name: {first_name} {last_name}, Birthdate: {birthdate}, Age: {age}, Gender: {gender}, "
                  f"Doctor ID: {doctor_id}, Health Card Number: {health_card_number}")
            print("Recordings:")
            for recording in recordings:
                print(f" - {recording}")
            print("Progress:")
            for idx, p in enumerate(progress, 1):
                print(f" - {idx}. {p}")
                
        return sorted_patients
    else:
        print("No patients found.")
        return []

def add_recording_and_diagnose(patient_id, recording_file):
    print("Received patient_id:", patient_id)  # Print the patient_id received
    
    # Check if the file exists
    if not os.path.isfile(recording_file):
        print("File not found:", recording_file)  # Print the file path
        return
    
    print("File found:", recording_file)  # Print the file path
    
    # Upload the recording file to the cloud storage
    cloud_storage_bucket = storage.bucket()  # Assuming you have already initialized the Cloud Storage bucket
    print("Cloud storage bucket:", cloud_storage_bucket)  # Print the cloud storage bucket
    blob = cloud_storage_bucket.blob(f'patients/{patient_id}/{os.path.basename(recording_file)}')
    print("Blob:", blob)  # Print the blob object
    blob.upload_from_filename(recording_file)

    # Get the URL of the uploaded file
    voice_data_url = blob.public_url
    print("Uploaded file URL:", voice_data_url)  # Print the uploaded file URL

    # Run diagnosis script
    try:
        result = subprocess.run(['python', 'ku_test.py', recording_file], capture_output=True, text=True, check=True)
        diagnosis_result = result.stdout.strip()  # Get the diagnosis result from the subprocess output
        print("Diagnosis completed successfully:", diagnosis_result,"%")
    except subprocess.CalledProcessError as e:
        print("Error running diagnosis script:", e)
        diagnosis_result = -99

    try:
        # Update progress record in the database
        patient_ref = db.reference(f'patients/{patient_id}')
        print("Patient reference:", patient_ref)  # Print the patient reference
        patient_data = patient_ref.get() or {}  # Retrieve current patient data or initialize as empty dictionary
        print("Patient data:", patient_data)  # Print the retrieved patient data

        if "recordings" not in patient_data:
            patient_data["recordings"] = []  # Initialize recordings field if not present
        
        recording_data = {
            "date_recorded":str(datetime.datetime.now()), # date recorded
            "progress":diagnosis_result, # diagnosis result
            "audio_url":voice_data_url, # wav file
            "csv_url":voice_data_url # csv file
        }

        patient_data["recordings"].append(recording_data) # add to recordings array
        patient_ref.update(patient_data) # save
    except Exception as e:
        print('somethings wrong!!!', e)


doctor_id = None

while True:
    print('Choose an option:')
    print('1. Login')
    print('2. Sign up')
    if doctor_id:
        print('3. Add a patient')
        print('4. View patients')
        print('5. Select patient and add recording and diagnose')
    print('6. Exit')

    choice = input('Enter your choice (1/2/3/4/5/6): ')

    if choice == '1':
        email = input('Enter your email: ')
        password = input('Enter your password: ')
        doctor_id = login(email, password)
    elif choice == '2':
        doctor_id = sign_up()
    elif choice == '3' and doctor_id:
        add_patient(doctor_id)
    elif choice == '4' and doctor_id:
        view_patients()
    elif choice == '5' and doctor_id:
        patients = view_patients()
        if patients:
            patient_idx = int(input("Select patient number to add recording and diagnose: ")) - 1
            if 0 <= patient_idx < len(patients):
                patient = patients[patient_idx]  # Access the patient dictionary
                patient_id = patient['patient_id']  # Retrieve the patient ID from the patient dictionary
                recording_file = input("Enter the path to the recording file: ")
                add_recording_and_diagnose(patient_id, recording_file)
            else:
                print("Invalid patient number.")
    elif choice == '6':
        break
    else:
        print('Invalid choice. Please choose 1, 2, 3, 4, 5, or 6.')