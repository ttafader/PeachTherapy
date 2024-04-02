import sys
from PyQt5 import QtWidgets, QtCore, QtGui, uic
from PyQt5.QtWidgets import QDialog, QApplication, QMessageBox, QVBoxLayout, QWidget, QPushButton, QFileDialog, QHBoxLayout
from PyQt5.QtCore import QUrl, QTimer, QPropertyAnimation, QEasingCurve
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.uic import loadUi
from peach_therapy import Ui_MainWindow

import numpy as np

import pyqtgraph as pg
from scipy.io import wavfile

import os, re, subprocess, firebase_admin, datetime, pyrebase
from firebase_admin import credentials, db
from firebase_admin import storage

from mycredentials import firebase_init
from mycredentials import pyrebase_config as config

# cd C:\Users\tajmi\OneDrive\Documents\PeachTherapy\ML-GUI\Firebase\Sidebar
# pyuic5.exe .\peach_therapy.ui -o .\peach_therapy.py

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

cloud_storage_bucket = storage.bucket()

# Initialize Pyrebase
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
            self.open_main_window()  # Open main window after successful login
        except:
            self.invalid.setVisible(True)

    def open_main_window(self):
        self.main_window = MainWindow()
        self.main_window.show()

    def gotocreate(self):
        createacc = CreateAcc()
        if createacc.exec_() == QtWidgets.QDialog.Accepted:
            self.invalid.setVisible(False)  # Reset invalid message if shown

class CreateAcc(QDialog):
    account_created = QtCore.pyqtSignal()

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
        clinic = self.clinic.text()

        if self.password.text() == self.confirmpass.text():
            password = self.password.text()
            try:
                auth_data = auth.create_user_with_email_and_password(email, password)
                user_id = auth_data['localId']  # Extract the user ID from the authentication data

                # Write user info to the 'doctors -> profile' node in Firebase
                doctor_ref = db.reference('doctors').child(user_id).child('profile')
                doctor_ref.set({
                    "first_name": first_name,
                    "last_name": last_name,
                    "clinic": clinic,
                    "email": email,
                    "user_type" : 1
                })

                self.accept()  # Close the dialog if account creation successful
                self.account_created.emit()  # Emit the signal
            except Exception as e:
                self.failed.setVisible(True)
                print(e)

class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.ui.view_btn.clicked.connect(self.view_btn_toggled)
        self.ui.add_btn.clicked.connect(self.add_btn_toggled)
        self.ui.apt_btn.clicked.connect(self.apt_btn_toggled)
        self.ui.settings_btn.clicked.connect(self.settings_btn_toggled)
        self.ui.exit_btn.clicked.connect(self.exit_btn_toggled)

        self.ui.menuWidget.setCurrentIndex(0)
        self.ui.view_btn.setChecked(True)

        self.ui.createprofile.clicked.connect(self.add_patients)
        self.ui.profilesuccess.setVisible(False)

        self.profilecard_template = self.ui.profilecard  # Get the profilecard widget as template
        self.ui.save_btn.clicked.connect(self.add_record)

        self.view_btn_toggled()
        # Get and set doctor's name
        self.set_doctor_name()

    def set_doctor_name(self):
        user = auth.current_user
        if user:
            user_id = user['localId']
            doctor_ref = db.reference('doctors').child(user_id).child('profile')
            doctor_data = doctor_ref.get()
            if doctor_data:
                first_name = doctor_data.get('first_name', '')
                last_name = doctor_data.get('last_name', '')
                full_name = f"{first_name} {last_name}"
                clinic = doctor_data.get('clinic')
                self.ui.dr_desc.setText(clinic)
                self.ui.dr_name.setText(full_name)

    def get_patient_name(self, patient_id):
        # Fetch the patient data from the database and return the full name
        # You need to implement this method based on your database structure
        # For example:
        patient_data = db.reference('patients').child(patient_id).child('profile').get()
        if patient_data:
            first_name = patient_data.get('first_name', '')
            last_name = patient_data.get('last_name', '')
            return f"{first_name} {last_name}"
        else:
            return "Unknown"  # Return a default value if patient data is not found

#--------------------------VIEW PATIENTS--------------------------#
    def view_btn_toggled(self):
        self.ui.menuWidget.setCurrentIndex(0)
        self.ui.viewWidget.setCurrentIndex(0)  # Assuming viewWidget is the current widget in menuWidget
        self.ui.profilecard.setVisible(False)
        self.populate_patient_profiles()  # Populate patient profiles
        print("Current Index of viewWidget:", self.ui.viewWidget.currentIndex())

    def populate_patient_profiles(self):
        # Retrieve patient data from Firebase
        user = auth.current_user
        if user:
            user_id = user['localId']
            doctor_patients_ref = db.reference('doctors').child(user_id).child('patients')
            patient_ids = doctor_patients_ref.get()

            # Clear existing patient profiles
            view_widget = self.ui.menuWidget.currentWidget()  # Assuming viewWidget is the current widget in menuWidget
            first_page_layout = self.ui.viewWidget.widget(0).layout()  # Get the layout of the first page

            if first_page_layout is None:
                first_page_layout = QtWidgets.QGridLayout()  # Use QGridLayout for a 3x3 grid
                self.ui.viewWidget.widget(0).setLayout(first_page_layout)

            for idx, patient_id in enumerate(patient_ids):
                row = idx // 3
                col = idx % 3

                patient_data_ref = db.reference('patients').child(patient_id).child('profile')
                patient_data = patient_data_ref.get()
                if patient_data:
                    # Construct patient's full name
                    full_name = f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}"

                    # Create a profile card widget for the patient
                    profile_card = self.create_profile_card(full_name, patient_id)

                    # Add the profile card to the layout of the first page
                    first_page_layout.addWidget(profile_card, row, col)
                else:
                    print(f"No data found for patient ID {patient_id} in the 'patients' node.")
        else:
            print("No user is currently logged in.")
    
    def create_profile_card(self, full_name, patient_id):
        # Create a new instance of the profile card template
        profile_card = QtWidgets.QWidget()

        # Copy properties from the template widget
        profile_card.setObjectName(self.profilecard_template.objectName())
        profile_card.setGeometry(self.profilecard_template.geometry())

        # Apply custom styling
        profile_card.setStyleSheet(
            """
            QWidget {
                background-color: rgb(255, 188, 167);
                border-radius: 10px;
                margin: 40px;  /* Apply margin */
            }
            QPushButton {
                font-family: Montserrat Extrabold ;
                font-size: 20px;
                font-weight: 800;  /* Extrabold */
                color: white;  /* White color for text */
            }
            """
        )

        # Create a layout for the profile card
        card_layout = QtWidgets.QVBoxLayout(profile_card)

        # Create a QLabel for the image
        image_label = QtWidgets.QLabel()
        image_label.setPixmap(QtGui.QPixmap(":/icons/icons/logo.png"))
        image_label.setAlignment(QtCore.Qt.AlignCenter)  # Center align the image
        card_layout.addWidget(image_label)
        image_label.setContentsMargins(0, 70, 0, 0)

        card_layout.setContentsMargins(0, 0, 0, 40)

        # Copy children widgets from the template widget
        for child in self.profilecard_template.children():
            if isinstance(child, QtWidgets.QPushButton):
                # If it's a QPushButton (name button), create a new button and set its text and signal
                name_btn = QtWidgets.QPushButton(full_name)
                name_btn.clicked.connect(lambda: self.patient_overview(patient_id))  # Connect to patient_overview method with patient_id
                card_layout.addWidget(name_btn)
            elif isinstance(child, QtWidgets.QLabel):
                # If it's a QLabel (picture label), you can set other properties if needed
                pass
            else:
                # For other types of child widgets, you can create instances and set properties accordingly
                pass

        return profile_card

# patient_data_ref = db.reference('patients').child(patient_id).child('profile')
#----------------------PATIENT OVERVIEW------------------------#
    def patient_overview(self, patient_id, action):
        if action == "view":
            # Move to the second page of viewwidget
            self.ui.viewWidget.setCurrentIndex(1)
            print("Current Index of viewWidget:", self.ui.viewWidget.currentIndex())
            print(patient_id)

            patient_data_ref = db.reference('patients').child(patient_id).child('profile')
            patient_data = patient_data_ref.get()
            # Assuming labels exist in the second page with the names patientinfo_name, patientinfo_birthday, and patientinfo_sex
            # Get patient information from patient_data node
            first_name = patient_data.get('first_name', '')
            last_name = patient_data.get('last_name', '')
            name = f"{first_name} {last_name}"

            patient_birthday = patient_data.get('birthday', '')
            patient_sex = patient_data.get('sex', '')

            # Update labels with patient information
            self.ui.overview_title.setText(f"{first_name}'s Overview")
            self.ui.name_ov.setText(f"Name: {name}")
            self.ui.birthday_ov.setText(f"Birthday: {patient_birthday}")
            self.ui.sex_ov.setText(f"Sex: {patient_sex}")

            # Connect viewrec_btn to record_history function
            self.ui.viewrec_btn.clicked.connect(lambda: self.record_history(patient_id))
            self.ui.addrec_btn.clicked.connect(lambda: self.add_record(patient_id))
        elif action == "add":
            # Move to the third page of viewwidget
            self.ui.viewWidget.setCurrentIndex(3)

            # Get current date
            current_date = QtCore.QDate.currentDate().toString(QtCore.Qt.ISODate)

            # Update labels with patient information
            patient_data_ref = db.reference('patients').child(patient_id).child('profile')
            patient_data = patient_data_ref.get()

            if not patient_data:
                print(f"Error: No data found for patient ID {patient_id}.")
                return

            first_name = patient_data.get('first_name', '')
            last_name = patient_data.get('last_name', '')
            name = f"{first_name} {last_name}"
            self.ui.rec_patient.setText(name)
            self.ui.rec_date.setText(current_date)

            phrase = self.ui.recphrase.text()
            notes = self.ui.recnotes.text()

            user = auth.current_user
            if user:
                user_id = user['localId']
                # Get a reference to the 'patients -> patient_id -> recordings -> current_date' path in Firebase
                recordings_ref = db.reference('patients').child(patient_id).child('recordings').child(current_date)

                # Assuming recording_url contains the URL of the recording to be stored
                recording_url = 'https://example.com/recording.wav'  # Replace this with the actual recording URL

                # Generate a unique key for the recording under 'patients -> patient_id -> recordings -> current_date'
                new_recording_ref = recordings_ref.push()

                # Store the recording URL under the unique key
                new_recording_ref.set({
                    "url": recording_url,
                    "phrase": phrase,
                    "doctor_note": notes
                })
            else:
                print("No user is currently logged in.")
        else:
            print("Invalid action:", action)


    def add_record_pg(self):
        # Switch to the recording interface
        self.ui.viewWidget.setCurrentIndex(3)
        
#---------------------------RECORD HISTORY----------------------#
    def record_history(self, patient_id):
        self.ui.viewWidget.setCurrentIndex(2)  # Move to the third page of viewwidget


#--------------------------ADD PATIENTS--------------------------#
    def add_btn_toggled(self):
        self.ui.menuWidget.setCurrentIndex(1)

    def add_patients(self):
        email_patient = self.ui.email_patient.text()
        first_name_patient = self.ui.firstname_patient.text()
        last_name_patient = self.ui.lastname_patient.text()
        
        # Get the selected birthday from the QDateEdit widget
        birthday = self.ui.birthday.date().toString(QtCore.Qt.ISODate)
        
        selected_sex_index = self.ui.patientdropdown.currentIndex()
        sex = self.ui.patientdropdown.itemData(selected_sex_index)

        user = auth.current_user
        if user:
            user_id = user['localId']
            # Get a reference to the 'doctors -> patients' node in Firebase
            doctor_ref = db.reference('doctors').child(user_id).child('patients')

            # Generate a new unique key for the patient under 'doctors -> patients'
            new_patient_ref = doctor_ref.push()

            # Get the unique key generated by push()
            patient_id = new_patient_ref.key

            # Store the patient data under the unique patient ID in 'patients' node
            patient_data_ref = db.reference('patients').child(patient_id).child('profile')
            patient_data_ref.set({
                "first_name": first_name_patient,
                "last_name": last_name_patient,
                "birthday": birthday,
                "email": email_patient,
                "sex": sex,
                "user_type": 2
            })

        self.ui.profilesuccess.setVisible(True)
        default_date = QtCore.QDate(2000, 1, 1)

        # Clear inputted data from the text boxes
        self.ui.email_patient.clear()
        self.ui.firstname_patient.clear()
        self.ui.lastname_patient.clear()
        self.ui.patientdropdown.setCurrentIndex(0)  # Assuming index 0 is the default option
        self.ui.birthday.setSelectedDate(default_date)

        # Schedule hiding of the success message after 3 seconds
        QTimer.singleShot(3000, self.hide_success_message)

    def hide_success_message(self):
        self.ui.profilesuccess.setVisible(False)

#--------------------------APPOINTMENTS--------------------------#
    def apt_btn_toggled(self):
        self.ui.menuWidget.setCurrentIndex(2)
        self.ui.calendar.show() # Display the calendar
        self.populate_upcoming_appointments() # Populate the table with upcoming appointments
        self.populate_patient_dropdown() # Populate the patient dropdown with the list of patients
        self.ui.booknow_btn.clicked.connect(self.book_appointment) # Connect the booknow_btn to the book_appointment method
        self.ui.calendar.clicked.connect(self.update_aptdatesel) # Connect the clicked signal of the calendar to update the aptdatesel
        self.ui.aptdatesel.setDate(QtCore.QDate.currentDate()) # Set Date to default to today's date
        self.ui.aptsuccess.setVisible(False) # Set Apt Success msg to invisible 

    def update_aptdatesel(self, date):
        self.ui.aptdatesel.setDate(date) # Update the date in aptdatesel whenever a date is clicked on the calendar

    def populate_upcoming_appointments(self):
        # Clear existing items in the appointment table
        self.ui.apttable.clearContents()
        self.ui.apttable.setColumnWidth(0, 100)
        self.ui.apttable.setColumnWidth(1, 100)
        self.ui.apttable.setColumnWidth(2, 350)
        self.ui.apttable.setColumnWidth(3, 400)

        user = auth.current_user
        if user:
            user_id = user['localId']
            apt_ref = db.reference('appointments')

            # Fetch all appointments
            query = apt_ref.order_by_key().get()

            # Get current date
            current_date = QtCore.QDate.currentDate()

            # Iterate through fetched appointments
            row = 0
            for apt_id, apt_data in query.items():
                doctor_id = apt_data.get('doctor_id')

                # Check if the doctor ID matches the current user ID
                if doctor_id == user_id:
                    # Get appointment data using the appointment ID (apt_id)
                    date = apt_data.get('date')
                    time = apt_data.get('time')
                    patient_id = apt_data.get('patient_id')
                    note = apt_data.get('note')

                    # Convert date string to QDate object for comparison
                    apt_date = QtCore.QDate.fromString(date, QtCore.Qt.ISODate)

                    # Only add the appointment if its date is after the current date
                    if apt_date >= current_date:
                        # Get patient name using the patient ID
                        patient_name = self.get_patient_name(patient_id)

                        self.ui.apttable.setRowCount(row + 1)

                        # Populate the table with appointment data
                        self.ui.apttable.setItem(row, 0, QtWidgets.QTableWidgetItem(date))
                        self.ui.apttable.setItem(row, 1, QtWidgets.QTableWidgetItem(time))
                        self.ui.apttable.setItem(row, 2, QtWidgets.QTableWidgetItem(patient_name))
                        self.ui.apttable.setItem(row, 3, QtWidgets.QTableWidgetItem(note))

                        # Move to the next row in the table
                        row += 1


    def populate_patient_dropdown(self):
        # Clear existing items in the patient dropdown
        self.ui.patientdropdown.clear()

        user = auth.current_user
        if user:
            user_id = user['localId']
            # Get a reference to the 'doctors -> patients' node in Firebase
            doctor_patients_ref = db.reference('doctors').child(user_id).child('patients')

            # Retrieve the list of patient IDs under 'doctors -> patients'
            patient_ids = doctor_patients_ref.get()
            if patient_ids:
                # Iterate over the patient IDs
                for patient_id in patient_ids:
                    # Get the patient data from the 'patients' node using the patient ID
                    patient_data_ref = db.reference('patients').child(patient_id).child('profile')
                    patient_data = patient_data_ref.get()
                    if patient_data:
                        first_name = patient_data.get('first_name', '')
                        last_name = patient_data.get('last_name', '')
                        # Extract patient information
                        full_name = f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}"
                        # Add patient to the dropdown
                        self.ui.patientdropdown.addItem(full_name, patient_id)
                    else:
                        print(f"No data found for patient ID {patient_id} in the 'patients' node.")
            else:
                print("No patient IDs found under 'doctors -> patients' node.")
        else:
            print("No user authenticated.")

    def book_appointment(self):
        # Get the selected patient, date, and appointment note
        selected_patient_index = self.ui.patientdropdown.currentIndex()
        selected_patient_id = self.ui.patientdropdown.itemData(selected_patient_index)
        selected_date = self.ui.calendar.selectedDate().toString(QtCore.Qt.ISODate)

        # Get the selected time from the datetime widget
        selected_time = self.ui.aptdatesel.time().toString(QtCore.Qt.ISODate)
        # Combine date and time to create the full datetime string
        selected_datetime = f"{selected_date}T{selected_time}"
        apt_note = self.ui.aptnote.text()

        user = auth.current_user
        if user:
            user_id = user['localId']
            apt_ref = db.reference('appointments')

            # Get the current count of appointments
            current_count = len(apt_ref.get() or {})

            # Increment the count to generate the next 3-digit number
            next_apt_id = f"{current_count + 1:03}"

            # Store the appointment data with the generated ID
            apt_ref.child(next_apt_id).set({
                "date": selected_date,
                "time": selected_time, 
                "date_time": selected_datetime,
                "doctor_id": user_id,
                "note": apt_note,
                "patient_id": selected_patient_id,
            })

        self.ui.aptsuccess.setVisible(True)

        self.ui.patientdropdown.setCurrentIndex(0)  # Assuming index 0 is the default option
        self.ui.calendar.setSelectedDate(QtCore.QDate.currentDate())
        self.ui.aptnote.clear()

        # Schedule hiding of the success message after 3 seconds
        QTimer.singleShot(3000, self.hide_success_message_apt)

    def hide_success_message_apt(self):
        self.ui.aptsuccess.setVisible(False)

#--------------------------SETTINGS--------------------------#
    def settings_btn_toggled(self):
        self.ui.menuWidget.setCurrentIndex(3)


#--------------------------EXIT------------------------------#
    def exit_btn_toggled(self):
        QApplication.quit()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    login = Login()
    login.show()
    

    sys.exit(app.exec())
