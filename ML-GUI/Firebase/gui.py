import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QLabel, QLineEdit, QMessageBox, QInputDialog, QStackedWidget
import firebase_admin
from firebase_admin import credentials, db
import pyrebase

from Sidebar.mycredentials import firebase_init
from Sidebar.mycredentials import pyrebase_config as config

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

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

def sign_up(email, password):
    try:
        firebase.auth().create_user_with_email_and_password(email, password)
        print("Sign up successful.")
        return True
    except Exception as e:
        print("Error:", e)
        return False

def add_patient(doctor_id, first_name, last_name, birthdate):
    patient_data = {
        "first_name": first_name,
        "last_name": last_name,
        "birthdate": birthdate,
        "doctor_id": doctor_id
    }
    ref = db.reference('patients')
    patient_id = ref.push(patient_data).key
    print(f'Patient added with ID: {patient_id}')

def view_patients():
    patients_ref = db.reference('patients')
    patients_data = patients_ref.get()
    return patients_data

class PatientWidget(QWidget):
    def __init__(self, user_id):
        super().__init__()
        self.user_id = user_id
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        add_patient_button = QPushButton("Add Patient", self)
        add_patient_button.clicked.connect(self.add_patient)
        layout.addWidget(add_patient_button)

        view_patients_button = QPushButton("View Patients", self)
        view_patients_button.clicked.connect(self.view_patients)
        layout.addWidget(view_patients_button)

        self.setLayout(layout)

    def add_patient(self):
        first_name, ok = QInputDialog.getText(self, 'Add Patient', 'Enter patient\'s first name:')
        if ok:
            last_name, ok = QInputDialog.getText(self, 'Add Patient', 'Enter patient\'s last name:')
            if ok:
                birthdate, ok = QInputDialog.getText(self, 'Add Patient', 'Enter patient\'s birthdate (YYYY-MM-DD):')
                if ok:
                    add_patient(self.user_id, first_name, last_name, birthdate)
                    QMessageBox.information(self, 'Success', 'Patient added successfully.')

    def view_patients(self):
        patients_data = view_patients()
        if patients_data:
            for patient_id, patient_info in patients_data.items():
                button = QPushButton(f"{patient_info['first_name']} {patient_info['last_name']}")
                button.clicked.connect(lambda _, pid=patient_id: self.record_data(pid))
                self.layout().addWidget(button)

    def record_data(self, patient_id):
        # Add your code to record data for the selected patient here
        print(f"Recording data for patient with ID: {patient_id}")

class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Patient Management System")
        self.setGeometry(400, 400, 1000, 800)
        self.stacked_widget = QStackedWidget()
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        self.login_widget = QWidget()
        self.login_widget.setObjectName("LoginWidget")
        login_layout = QVBoxLayout()
        self.email_edit = QLineEdit()
        self.password_edit = QLineEdit()
        self.password_edit.setEchoMode(QLineEdit.Password)
        login_button = QPushButton("Login")
        login_button.clicked.connect(self.login)
        sign_up_button = QPushButton("Sign Up")
        sign_up_button.clicked.connect(self.sign_up)
        login_layout.addWidget(QLabel("Email:"))
        login_layout.addWidget(self.email_edit)
        login_layout.addWidget(QLabel("Password:"))
        login_layout.addWidget(self.password_edit)
        login_layout.addWidget(login_button)
        login_layout.addWidget(sign_up_button)
        self.login_widget.setLayout(login_layout)

        self.stacked_widget.addWidget(self.login_widget)

        layout.addWidget(self.stacked_widget)
        self.setLayout(layout)

    def login(self):
        email = self.email_edit.text()
        password = self.password_edit.text()
        user_id = login(email, password)
        if user_id:
            self.patient_widget = PatientWidget(user_id)
            self.stacked_widget.addWidget(self.patient_widget)
            self.stacked_widget.setCurrentWidget(self.patient_widget)

    def sign_up(self):
        email = self.email_edit.text()
        password = self.password_edit.text()
        if sign_up(email, password):
            QMessageBox.information(self, "Success", "Sign up successful. You can now login.")
        else:
            QMessageBox.warning(self, "Error", "Sign up failed. Please try again.")

if __name__ == "__main__":
    app = QApplication([])
    main_window = MainWindow()
    main_window.show()
    app.exec_()
