import sys, os, re, subprocess, firebase_admin, datetime, pyrebase
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QDialog, QApplication, QMessageBox
from PyQt5.uic import loadUi
from peach_therapy import Ui_MainWindow
from firebase_admin import credentials, db, storage
from mycredentials import pyrebase_config as config
from mycredentials import firebase_init

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

cloud_storage_bucket = storage.bucket()

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

class Login(QDialog):
    def __init__(self):
        super(Login, self).__init__()
        loadUi("login.ui", self)
        self.loginbutton.clicked.connect(self.loginfunction)
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        self.createaccbutton.clicked.connect(self.gotocreate)
        self.invalid.setVisible(False)

    def loginfunction(self):
        email = self.email.text()
        password = self.password.text()
        try:
            auth.sign_in_with_email_and_password(email, password)
            self.accept()  # Close the login dialog if login successful
            window.set_doctor_name()  # Call set_doctor_name method in MainWindow
        except:
            self.invalid.setVisible(True)

    def gotocreate(self):
        createacc = CreateAcc()
        if createacc.exec_() == QtWidgets.QDialog.Accepted:
            self.accept()  # Close the login dialog if account creation successful
            window.set_doctor_name()  # Call set_doctor_name method in MainWindow

class CreateAcc(QDialog):
    def __init__(self):
        super(CreateAcc, self).__init__()
        loadUi("createacc.ui", self)
        self.signupbutton.clicked.connect(self.createaccfunction)
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        self.confirmpass.setEchoMode(QtWidgets.QLineEdit.Password)
        self.emailinvalid.setVisible(False)
        self.failed.setVisible(False)

    def createaccfunction(self):
        email = self.email.text()
        first_name = self.firstname.text()
        last_name = self.lastname.text()
        job_desc = self.jobdesc.text()

        if self.password.text() == self.confirmpass.text():
            password = self.password.text()
            try:
                auth_data = auth.create_user_with_email_and_password(email, password)
                user_id = auth_data['localId']  # Extract the user ID from the authentication data

                # Write user info to the 'doctors' node in Firebase
                doctor_ref = db.reference('doctors').child(user_id)
                doctor_ref.set({
                    "first_name": first_name,
                    "last_name": last_name,
                    "job_desc": job_desc,
                    "email": email
                })

                self.accept()  # Close the dialog if account creation successful
            except HTTPError as e:
                error_message = e.args[0].response.json()['error']['message']
                if error_message == "EMAIL_EXISTS":
                    self.emailinvalid.setVisible(True)
                else:
                    self.failed.setVisible(True)
            except Exception as e:
                self.failed.setVisible(True)

class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        # Get and set doctor's name
        self.set_doctor_name()
    
    def set_doctor_name(self):
        user = auth.current_user
        if user:
            user_id = user['localId']
            doctor_ref = db.reference('doctors').child(user_id)
            doctor_data = doctor_ref.get()
            if doctor_data:
                first_name = doctor_data.get('first_name', '')
                last_name = doctor_data.get('last_name', '')
                job_desc = doctor_data.get('job_desc', '')  # Get doctor's job description
                full_name = f"{first_name} {last_name}"
                self.ui.dr_name.setText(full_name)
                self.ui.dr_desc.setText(job_desc)  # Set doctor's description

    def view_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(0)
        self.populate_patient_profiles()

    def add_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(1)

    def apt_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(2)

    def settings_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(3)

    def populate_patient_profiles(self):
        # Retrieve patient data from Firebase
        patients_data = view_patients()
        # Clear existing patient profiles
        for i in reversed(range(self.patient_profiles_layout.count())):
            widget = self.patient_profiles_layout.itemAt(i).widget()
            if widget is not None:
                widget.deleteLater()
        # Populate patient profiles
        for patient_id, patient_data in patients_data:
            patient_profile = PatientProfile(patient_id, patient_data)
            self.patient_profiles_layout.addWidget(patient_profile)

    def show_patient_details(self, patient_id):
        self.ui.stackedWidget.setCurrentIndex(1)
        self.details_layout.clear()
        patient_data = view_patients()
        for key, value in patient_data[patient_id].items():
            label = QtWidgets.QLabel(f"{key}: {value}")
            self.details_layout.addWidget(label)

def view_patients():
    # Retrieve patient data from Firebase
    db_ref = db.reference("patients")
    patients_data = db_ref.get()
    patients = []
    if patients_data:
        for patient_id, patient in patients_data.items():
            patients.append((patient_id, patient))
    return patients

if __name__ == "__main__":
    app = QApplication(sys.argv)
    login = Login()
    if login.exec_() == QDialog.Accepted:  # Only show main window if login successful
        window = MainWindow()
        window.show()
        sys.exit(app.exec())