import sys
from PyQt5 import QtWidgets, QtCore, QtGui, uic
import PyQt5.QtWidgets as QtWidgets
from PyQt5.QtWidgets import QLabel, QDialog, QApplication, QScrollArea, QVBoxLayout, QWidget, QPushButton, QFileDialog, QHBoxLayout
from PyQt5.QtCore import QUrl, QTimer, QPropertyAnimation, QEasingCurve, Qt
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.uic import loadUi

import numpy as np
import speech_recognition as sr
import io
import json

import pyqtgraph as pg
from scipy.io import wavfile
from scipy.io.wavfile import read

# Firebase Imports
import os, re, subprocess, firebase_admin, datetime, pyrebase
from firebase_admin import credentials, db, storage
from mycredentials import firebase_init
from mycredentials import pyrebase_config as config
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebasecredentials.json'

# Other Python Files
from peach_therapy import Ui_MainWindow
from audio import AudioWidget
from progress_graph import ProgressCircle
from bargraph import BarGraph
from boundariesplot import DecisionBoundaryPlot

# cd C:\Users\tajmi\OneDrive\Documents\PeachTherapy\ML-GUI\Firebase\Application
# pyuic5.exe .\peach_therapy.ui -o .\peach_therapy.py
# pyuic5.exe .\peach_therapy.ui -o .\peach_therapy.py
# pyrcc5.exe .\resource.qrc -o .\resource_rc.py

# pip install urllib3==1.26.15 requests-toolbelt==0.10.1

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

# cloud_storage_bucket = storage.bucket()

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
        self.setWindowTitle("Peach Therapy")

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
        self.setWindowTitle("Peach Therapy")

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
                img_path = "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"

                # Write user info to the 'doctors -> profile' node in Firebase
                doctor_ref = db.reference('doctors').child(user_id).child('profile')
                doctor_ref.set({
                    "first_name": first_name,
                    "last_name": last_name,
                    "clinic": clinic,
                    "email": email,
                    "user_type" : 1,
                    "img_url": img_path
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
        self.setWindowTitle("Peach Therapy")

        self.ui.view_btn.clicked.connect(self.view_btn_toggled)
        self.ui.add_btn.clicked.connect(self.add_btn_toggled)
        self.ui.apt_btn.clicked.connect(self.apt_btn_toggled)
        self.ui.settings_btn.clicked.connect(self.settings_btn_toggled)
        self.ui.exit_btn.clicked.connect(self.exit_btn_toggled)

        self.ui.menuWidget.setCurrentIndex(0)
        self.ui.view_btn.setChecked(True)

        self.ui.createprofile.clicked.connect(self.add_patients)
        self.ui.profilesuccess.setVisible(False)
        self.ui.nopatients.setVisible(False)
        self.ui.failed_patient.setVisible(False)
        self.ui.loading.setVisible(False)
        self.ui.savesuccess.setVisible(False)
        self.ui.savefail.setVisible(False)
        self.ui.norec.setVisible(False)

        self.profilecard_template = self.ui.profilecard  # Get the profilecard widget as template

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
            
    def convert_wav_to_text(self, wav_file):
            # Read audio file
            sample_rate, sample = read(wav_file)
            
            # Calculate indices for even spacing
            num_samples = len(sample)
            indices = np.linspace(0, num_samples - 1, num=50, dtype=int)
            sample = sample[indices]

            # Generate a random array with the same length as the sample
            myArray = np.random.randn(len(sample), 1)

            # Format array values
            array_str = ', '.join(f'{x[0]:0.4f}' for x in myArray)

            # Write array values to a file-like object
            output = io.StringIO()
            output.write('[')
            output.write(array_str)
            output.write(']')
            output.seek(0)  # Move cursor to the beginning of the "file"

            # Get the content of the "file" as a string
            text_data = output.getvalue()

            # Close the "file-like" object
            output.close()

            # Return the content of the text file
            return text_data

    def upload_recording(self, filename, patient_id, file_url, text_data):
        bucket = storage.bucket('peach-therapy.appspot.com')

        wavblob = bucket.blob("patients/"+str(patient_id)+"/recordings/"+str(filename)+".wav")
        wavblob.upload_from_filename(file_url)
        wav_url = f"gs://{bucket.name}/{wavblob.name}"
        
        textblob = bucket.blob("patients/"+str(patient_id)+"/recordings/"+str(filename)+".txt")
        textblob.upload_from_string(text_data)
        txt_url=f"gs://{bucket.name}/{textblob.name}"

        return wav_url, txt_url
        
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

            #Clear existing patient profiles
            patient_profile_widget = self.ui.viewWidget.widget(0)
            patient_profile_layout = patient_profile_widget.layout()  # Get the layout of the first page


            # Clear existing patient profiles
            patient_profile_layout = self.ui.viewWidget.widget(0).layout()  # Get the layout of the first page
            

            if patient_profile_layout is None:
                patient_profile_layout = QtWidgets.QGridLayout()  # Use QGridLayout for a flexible grid
                # Assuming patient_profile_layout is a QGridLayout
                
                self.ui.viewWidget.widget(0).setLayout(patient_profile_layout)
            else:
                # Clear existing layout
                for i in reversed(range(patient_profile_layout.count())):
                    widget = patient_profile_layout.itemAt(i).widget()
                    if widget is not None:
                        widget.setParent(None)

            # Add patient title label
            patient_title_label = self.ui.profiles_title
            patient_profile_layout.addWidget(patient_title_label)

            if patient_ids:
                num_columns = 3
                num_patients = len(patient_ids)
                num_rows = (num_patients + num_columns - 1) // num_columns  # Calculate number of rows needed

                # Create a scroll area to contain the patient profiles
                scroll_area = QScrollArea()
                scroll_area.setWidgetResizable(True)
                scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)

                # Create a widget to hold the patient profiles
                scroll_content = QtWidgets.QWidget()
                scroll_layout = QtWidgets.QGridLayout(scroll_content)
                scroll_layout.setAlignment(Qt.AlignTop)

                for idx, patient_id in enumerate(patient_ids):
                    row = idx // num_columns
                    col = idx % num_columns

                    patient_data_ref = db.reference('patients').child(patient_id).child('profile')
                    patient_data = patient_data_ref.get()
                    if patient_data:
                        # Construct patient's full name
                        full_name = f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}"

                        # Create a profile card widget for the patient
                        profile_card = self.create_profile_card(full_name, patient_id)

                        # Add the profile card to the layout
                        scroll_layout.addWidget(profile_card, row, col)
                    else:
                        print(f"No data found for patient ID {patient_id} in the 'patients' node.")

                # Add empty widgets to fill remaining space in the grid
                for idx in range(num_rows * num_columns - num_patients):
                    row = num_patients // num_columns + idx // num_columns
                    col = num_patients % num_columns + idx % num_columns

                    empty_widget = QtWidgets.QWidget()
                    scroll_layout.addWidget(empty_widget, row, col)

                # Set the widget of the scroll area
                scroll_area.setWidget(scroll_content)

                # Add the scroll area to the layout of the first page
                patient_profile_layout.addWidget(scroll_area)
                # Set vertical scrollbar policy and apply stylesheet
                scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
                scroll_area.verticalScrollBar().setStyleSheet(
                    """
                    /* Set styling for the vertical scrollbar */
                    QScrollArea {
                        border: none;
                    }
                    QScrollBar:vertical {
                        border: none;
                        width: 14px;
                        margin: 15px 0 15px 0;
                        border-radius: 0px;
                    }
                    /* Set styling for the handle bar */
                    QScrollBar::handle:vertical {    
                        background-color: rgb(255, 163, 134);
                        min-height: 30px;
                        border-radius: 7px;
                    }
                    QScrollBar::handle:vertical:hover {    
                        background-color: rgb(229, 226, 218);
                    }
                    QScrollBar::handle:vertical:pressed {    
                        background-color: rgb(229, 226, 218);
                    }
                    /* Set styling for the top button */
                    QScrollBar::sub-line:vertical {
                        border: none;
                        background-color: rgb(255, 163, 134);
                        height: 15px;
                        border-top-left-radius: 7px;
                        border-top-right-radius: 7px;
                        subcontrol-position: top;
                        subcontrol-origin: margin;
                    }
                    QScrollBar::sub-line:vertical:hover {    
                        background-color: rgb(255, 163, 134);
                    }
                    QScrollBar::sub-line:vertical:pressed {    
                        background-color: rgb(185, 0, 92);
                    }
                    /* Set styling for the bottom button */
                    QScrollBar::add-line:vertical {
                        border: none;
                        background-color: rgb(255, 163, 134);
                        height: 15px;
                        border-bottom-left-radius: 7px;
                        border-bottom-right-radius: 7px;
                        subcontrol-position: bottom;
                        subcontrol-origin: margin;
                    }
                    QScrollBar::add-line:vertical:hover {    
                        background-color: rgb(255, 0, 127);
                    }
                    QScrollBar::add-line:vertical:pressed {    
                        background-color: rgb(185, 0, 92);
                    }
                    """
                )
                scroll_area.setStyleSheet("border: none;")
            else:
                # No patients found for the doctor
                self.ui.nopatients.setVisible(True)
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
    def patient_overview(self, patient_id):
        self.ui.norec.setVisible(False)
        self.ui.viewWidget.setCurrentIndex(1)  # Move to the second page of viewwidget
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
        self.ui.backtoprof_btn.clicked.connect(self.view_btn_toggled)

        records_ref = db.reference('patients').child(patient_id).child('recordings')
        recordings = records_ref.get()
        confidence_values = []  # Initialize an empty list to store confidence values
        dates_label_values = []
        feature_data_list = []

        # Check if recordings node exists and contains subnodes
        if recordings:
            print("Number of subnodes in recordings:", len(recordings))

            for recording_key, recording_data in recordings.items():
                confidence_str = recording_data.get("confidence")
                dates = recording_data.get("date_recorded")
                feature_data = recording_data.get("features")

                if confidence_str and dates is not None:  # Check if confidence value exists
                    confidence = 100 - float(confidence_str)
                    confidence_values.append(confidence)  # Append confidence value to the list
                    dates_label_values.append(dates)

                    if feature_data is not None:
                         feature_data_list.append(list(feature_data.values()))  # Append only the values of feature data to the list

        else: 
            confidence_values = [1]
            dates_label_values = "None"

        # PROGRESS GRAPH
        recent_values = confidence_values[-3:]
        average_confidence = sum(recent_values) / len(recent_values)

        # Create a ProgressCircle instance with the updated confidence values
        progress_graph = ProgressCircle()
        progress_graph.set_confidence(average_confidence)
        
        # Assuming progress_gph() returns a layout widget where you want to add the ProgressCircle
        progress_gph_layout_widget = self.ui.progress_gph
        
        # Clear the layout of any existing widgets
        while progress_gph_layout_widget.count():
            item = progress_gph_layout_widget.takeAt(0)
            widget = item.widget()
            if widget is not None:
                widget.deleteLater()
        
        # Adding the ProgressCircle widget to the layout
        progress_gph_layout_widget.addWidget(progress_graph)

        #BAR Graph
        # Create a ProgressCircle instance with the updated confidence values
        bar_graph = BarGraph(dates_label_values, confidence_values)
        
        # Assuming progress_gph() returns a layout widget where you want to add the ProgressCircle
        bar_gph_layout_widget = self.ui.bar_gph
        
        # Clear the layout of any existing widgets
        while bar_gph_layout_widget.count():
            item = bar_gph_layout_widget.takeAt(0)
            widget = item.widget()
            if widget is not None:
                widget.deleteLater()
        
        # Adding the ProgressCircle widget to the layout
        bar_gph_layout_widget.addWidget(bar_graph)

        #BOUNDARY GRAPH
        # Create a ProgressCircle instance with the updated confidence values
        boundary_graph = DecisionBoundaryPlot(feature_data_list)
        
        # Assuming progress_gph() returns a layout widget where you want to add the ProgressCircle
        bdy_gph_layout_widget = self.ui.boundary_gph
        
        # Clear the layout of any existing widgets
        while bdy_gph_layout_widget.count():
            item = bdy_gph_layout_widget.takeAt(0)
            widget = item.widget()
            if widget is not None:
                widget.deleteLater()
        
        # Adding the ProgressCircle widget to the layout
        bdy_gph_layout_widget.addWidget(boundary_graph)

        
#---------------------------RECORD HISTORY----------------------#
    def record_history(self, patient_id):
        patient_data_ref = db.reference('patients').child(patient_id).child('profile')
        patient_data = patient_data_ref.get()
        # Assuming labels exist in the second page with the names patientinfo_name, patientinfo_birthday, and patientinfo_sex
        # Get patient information from patient_data node
        first_name = patient_data.get('first_name', '')
        self.ui.rec_title.setText(f"{first_name}'s Recording History")
        self.ui.viewWidget.setCurrentIndex(2)  # Move to the third page of viewwidget
        self.ui.backtoprof_btn_2.clicked.connect(self.view_btn_toggled)
        # Start populating recordings in the background
        QTimer.singleShot(0, lambda: self.populate_recordings(patient_id))
        self.ui.loadingrec.setVisible(True)
        #self.populate_recordings(patient_id)  # Populate patient profiles

    def populate_recordings(self, patient_id):
        self.ui.loadingrec.setVisible(True)
        self.ui.norec.setVisible(False)
        # Retrieve patient data from Firebase
        user = auth.current_user
        if user:
            print("Patient ID:", patient_id)
            
            records_ref = db.reference('patients').child(patient_id).child('recordings')
            recordings = records_ref.get()
            print("Recordings node exists:", recordings is not None)

            # Get the existing scroll area widget named rec_layout from ui
            rec_page_layout_widget = self.ui.rec_layout

            # Ensure rec_page_layout_widget is a QScrollArea
            if isinstance(rec_page_layout_widget, QScrollArea):
                # Get the widget inside the scroll area
                rec_scroll_widget = rec_page_layout_widget.widget()
                # Ensure rec_scroll_widget has a vertical layout
                if isinstance(rec_scroll_widget.layout(), QVBoxLayout):
                    rec_page_layout = rec_scroll_widget.layout()
                else:
                    rec_page_layout = QVBoxLayout()
                    rec_scroll_widget.setLayout(rec_page_layout)
            else:
                print("rec_layout_widget is not a QScrollArea.")
                return

            # Clear existing layout
            while rec_page_layout.count():
                item = rec_page_layout.takeAt(0)
                widget = item.widget()
                if widget:
                    widget.deleteLater()

            # Check if recordings node exists and contains subnodes
            if recordings:
                print("Number of subnodes in recordings:", len(recordings))

                for recording_key, recording_data in recordings.items():
                    wav_url = recording_data.get("wav_url")
                    date = recording_data.get("date_label")
                    phrase = recording_data.get("phrase")
                    doctors_note = recording_data.get("doctor_note")
                    confidence = recording_data.get("confidence")


                    if wav_url:
                        print("WAV URL:", wav_url)
                        # Create an instance of AudioWidget for each recording
                        audio_widget = AudioWidget(wav_url, date, phrase, doctors_note, confidence)
                        # Add the AudioWidget to the layout
                        rec_page_layout.addWidget(audio_widget)
            else:
                print("No recordings found for the user.")
                self.ui.norec.setVisible(True)
            self.ui.loadingrec.setVisible(False)
            # Set vertical scrollbar policy
            rec_page_layout_widget.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
            # Set stylesheet for the vertical scrollbar
            rec_page_layout_widget.verticalScrollBar().setStyleSheet(
                """
                /* Set styling for the vertical scrollbar */
                QScrollBar:vertical {
                    border: none;
                    width: 14px;
                    margin: 15px 0 15px 0;
                    border-radius: 0px;
                }
                /* Set styling for the handle bar */
                QScrollBar::handle:vertical {    
                    background-color: rgb(255, 163, 134);
                    min-height: 30px;
                    border-radius: 7px;
                }
                QScrollBar::handle:vertical:hover {    
                    background-color: rgb(229, 226, 218);
                }
                QScrollBar::handle:vertical:pressed {    
                    background-color: rgb(229, 226, 218);
                }
                /* Set styling for the top button */
                QScrollBar::sub-line:vertical {
                    border: none;
                    background-color: rgb(255, 163, 134);
                    height: 15px;
                    border-top-left-radius: 7px;
                    border-top-right-radius: 7px;
                    subcontrol-position: top;
                    subcontrol-origin: margin;
                }
                QScrollBar::sub-line:vertical:hover {    
                    background-color: rgb(255, 163, 134);
                }
                QScrollBar::sub-line:vertical:pressed {    
                    background-color: rgb(185, 0, 92);
                }
                /* Set styling for the bottom button */
                QScrollBar::add-line:vertical {
                    border: none;
                    background-color: rgb(255, 163, 134);
                    height: 15px;
                    border-bottom-left-radius: 7px;
                    border-bottom-right-radius: 7px;
                    subcontrol-position: bottom;
                    subcontrol-origin: margin;
                }
                QScrollBar::add-line:vertical:hover {    
                    background-color: rgb(255, 0, 127);
                }
                QScrollBar::add-line:vertical:pressed {    
                    background-color: rgb(185, 0, 92);
                }
                """
            )

#-------------------------ADD RECORDING-------------------------#
    def add_record(self, patient_id):

        self.ui.viewWidget.setCurrentIndex(3)
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

        self.ui.viewrec_btn_2.clicked.connect(lambda: self.record_history(patient_id))
        self.ui.startrec_btn.clicked.connect(self.start_recording)
        self.ui.stoprec_btn.clicked.connect(self.stop_recording)
        self.ui.playback_btn.clicked.connect(self.playback_recording)
        self.ui.redo_btn.clicked.connect(self.redo_recording)
        self.ui.save_btn.clicked.connect(lambda: self.analyze_save_recording(patient_id))  # Assuming patient_id is available

    def analyze_save_recording(self, patient_id):
        phrase = self.ui.recphrase.text()
        notes = self.ui.recnotes.toPlainText()
        self.ui.loading.setVisible(True)
        recording_file, _ = QFileDialog.getOpenFileName(self, "Select Recording File", "", "Audio Files (*.wav *.mp3 *.ogg)")
        if recording_file:
            print("Selected file:", recording_file)
            print("Received patient_id:", patient_id)  # Print the patient_id received
            
            # Get current date
            current_date = QtCore.QDate.currentDate().toString(QtCore.Qt.ISODate)
            current_datetime = QtCore.QDateTime.currentDateTime()
            formatted_datetime = current_datetime.toString("yyyyMMddTHHmmss")

            # Generate a unique key for the recording under 'patients -> patient_id -> recordings -> current_date'
            recordings_ref = db.reference('patients').child(patient_id).child('recordings').child(formatted_datetime)
            text_data = self.convert_wav_to_text(recording_file)

            # Run diagnosis script
            try:
                # Call the subprocess to get diagnosis result and features
                result = subprocess.run(['python', 'ku_test.py', recording_file], capture_output=True, text=True)

                # Check if the subprocess returned a non-zero exit status
                if result.returncode != 0:
                    print("Error running diagnosis script:", result.stderr)
                    # Handle the error as needed
                else:
                    # Parse the subprocess output as JSON to extract diagnosis result (prediction probability) and features
                    output_data = json.loads(result.stdout.strip())

                    # Extract diagnosis result (prediction probability) and features
                    diagnosis_result = output_data['prediction_probability']
                    features = output_data['features']

                    # Print diagnosis result and features
                    print("Diagnosis Probability:", diagnosis_result)
                    print("Features:", features)
                #result = subprocess.run(['python', 'ku_test.py', recording_file], capture_output=True, text=True, check=True)
                # Parse the subprocess output as JSON to extract diagnosis result (prediction probability) and features
                output_data = json.loads(result.stdout.strip())

                # Extract diagnosis result (prediction probability) and features
                diagnosis_result = output_data['prediction_probability']
                features = output_data['features']
                print("Diagnosis completed successfully:", diagnosis_result,"%")

                wav_url, txt_url = self.upload_recording(
                    filename=formatted_datetime, 
                    patient_id=patient_id, 
                    file_url=recording_file, 
                    text_data=text_data
                )
        
                # Store the recording URL under the unique key
                recordings_ref.set({
                    "confidence": diagnosis_result,
                    "date_recorded" : formatted_datetime,
                    "date_label": current_date,
                    "phrase": phrase,
                    "doctor_note": notes,
                    "wav_url": wav_url,
                    "text_url" : txt_url,
                    "features" : features
                })

                self.ui.savesuccess.setVisible(True)
                self.clear_record_fields()
                # Schedule hiding of the success message after 5 seconds
                QTimer.singleShot(5000, self.hide_save_message)

            except subprocess.CalledProcessError as e:
                print("Error running diagnosis script:", e)
                diagnosis_result = -99
            except Exception as e2: 
                print("Recording not saved", e2)
                self.ui.savefail.setVisible(True)
            finally:
            # Hide loading indicator after execution
                self.ui.loading.setVisible(False)
                
        else:
            print("No user is currently logged in.")
            pass

    def clear_record_fields(self):
        self.ui.recphrase.clear()
        self.ui.recnotes.clear()
    
    def hide_save_message(self):
        self.ui.savesuccess.setVisible(False)

    def start_recording(self):
        pass

    def stop_recording(self):
        # Add stop recording logic here
        pass

    def playback_recording(self):
        # Add playback recording logic here
        pass

    def redo_recording(self):
        # Add redo recording logic here
        pass

#--------------------------ADD PATIENTS--------------------------#
    def add_btn_toggled(self):
        self.ui.menuWidget.setCurrentIndex(1)

    def add_patients(self):
        email_patient = self.ui.email_patient.text()
        first_name_patient = self.ui.firstname_patient.text()
        last_name_patient = self.ui.lastname_patient.text()
        birthday = self.ui.birthday.date().toString(QtCore.Qt.ISODate)
        sex = self.ui.sexdropdown.currentText()
        img_path = "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"

        user = auth.current_user
        if user:
            user_id = user['localId']
            doctor_data = db.reference('doctors').child(user_id).child('profile').get()
            full_dr = f"{doctor_data.get('first_name', '')} {doctor_data.get('last_name', '')}"
            default_password = "Peach123"

            # Create user account with default password and obtain the generated UID
            try:
                auth_data = auth.create_user_with_email_and_password(email_patient, default_password)
                patient_id = auth_data['localId']  # Get the UID generated for the patient
            except Exception as e:
                print("Failed to create patient account:", e)
                # Optionally handle the error, e.g., show a message to the user
                return

            # Store the patient data under the generated UID in 'patients' node
            doctor_ref = db.reference('doctors').child(user_id).child('patients')
            num_patients = len(doctor_ref.get() or {})
            doctor_ref.child(str(num_patients)).set(patient_id)

            patient_data_ref = db.reference('patients').child(patient_id).child('profile')
            patient_data_ref.set({
                "first_name": first_name_patient,
                "last_name": last_name_patient,
                "birthday": birthday,
                "email": email_patient,
                "doctor_id": user_id,
                "doctor_name": full_dr,
                "sex": sex,
                "user_type": 2,
                "patient_id": patient_id,
                "img_url": img_path
            })

            patient_pref_ref = db.reference('patients').child(patient_id).child('preferences')
            patient_pref_ref.set({
                "reports": True,
                "notifs": True,
                "access": True
            })

            # create folders in gcs for patient
            fileName = "emptyfile.txt"
            bucket = storage.bucket('peach-therapy.appspot.com')
            blob = bucket.blob("patients/"+str(patient_id)+"/recordings/"+fileName)
            blob.upload_from_filename(fileName)
            
            # Show success message
            self.ui.profilesuccess.setVisible(True)
            # Clear inputted data from the text boxes
            self.clear_input_fields()
            # Schedule hiding of the success message after 3 seconds
            QTimer.singleShot(3000, self.hide_success_message)
        else:
            print("No user is currently logged in.")


    def clear_input_fields(self):
        self.ui.email_patient.clear()
        self.ui.firstname_patient.clear()
        self.ui.lastname_patient.clear()
        self.ui.patientdropdown.setCurrentIndex(0)  # Assuming index 0 is the default option
        self.ui.birthday.setDate(QtCore.QDate(2000, 1, 1))

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
        self.ui.selpatienterror.setVisible(False) # Set Apt Success msg to invisible 

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

            # Iterate through fetched appointments if query is not None
            row = 0
            if query:
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
        else:
            print("No user is currently logged in.")

    def populate_patient_dropdown(self):
        # Clear existing items in the patient dropdown
        self.ui.patientdropdown.clear()

        # Add the default option "Select Patient" to the dropdown
        self.ui.patientdropdown.addItem("Select Patient", None)

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
        # Disable the "Book Now" button to prevent multiple clicks
        self.ui.booknow_btn.setEnabled(False)

        # Get the selected patient, date, and appointment note
        selected_patient_index = self.ui.patientdropdown.currentIndex()
        if selected_patient_index != 0:  # Check if a patient is selected
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

            # Schedule re-enabling of the "Book Now" button after 5 seconds
            QTimer.singleShot(5000, self.enable_booknow_button)

            # Schedule hiding of the success message after 3 seconds
            QTimer.singleShot(3000, self.hide_success_message_apt)
        else:
            self.ui.selpatienterror.setVisible(True)  # Show error message for not selecting a patient
            self.ui.booknow_btn.setEnabled(True)
            QTimer.singleShot(3000, self.hide_select_message_apt)

    def enable_booknow_button(self):
        # Re-enable the "Book Now" button
        self.ui.booknow_btn.setEnabled(True)

    def hide_success_message_apt(self):
        self.ui.aptsuccess.setVisible(False)

    def hide_select_message_apt(self):
        self.ui.selpatienterror.setVisible(False)  # Hide error message after a delay
        


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
