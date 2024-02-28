import firebase_admin
from firebase_admin import credentials, db
from Sidebar.mycredentials import firebase_init

cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)



def initialize_doctors_node():
    # Initialize Firebase Admin SDK with the correct databaseURL
    
    # Create a sample doctor entry
    sample_doctor_data = {
        "license_id": "DOC1",
        "email": "ttafader@torontomu.ca"
    }

    # Assume your doctor data is stored under the 'doctors' node in the database
    ref = db.reference('doctors')
    ref.child('doctor_id').set(sample_doctor_data)

    print('Doctors node initialized with a entry.')

if __name__ == "__main__":
    initialize_doctors_node()
