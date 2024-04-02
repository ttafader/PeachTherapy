import sys
from PyQt5 import QtWidgets, QtCore, QtGui, uic
from PyQt5.QtWidgets import QDialog, QApplication, QScrollArea, QVBoxLayout, QWidget, QPushButton, QFileDialog, QHBoxLayout
from PyQt5.QtCore import QUrl, QTimer, QPropertyAnimation, QEasingCurve
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.uic import loadUi
from peach_therapy import Ui_MainWindow

import sys
import numpy as np
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QFileDialog, QHBoxLayout
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtCore import QUrl, QTimer
import pyqtgraph as pg
from scipy.io import wavfile

import numpy as np
import speech_recognition as sr
import io

import pyqtgraph as pg
from scipy.io import wavfile
from scipy.io.wavfile import read

import os, re, subprocess, firebase_admin, datetime, pyrebase
from firebase_admin import credentials, db, storage

from mycredentials import firebase_init
from mycredentials import pyrebase_config as config

def record_history(self, patient_id):
        self.ui.viewWidget.setCurrentIndex(2)  # Move to the third page of viewwidget
        self.ui.record1.setVisible(False)
        self.populate_recordings()  # Populate patient profiles
        print("Current Index of viewWidget:", self.ui.viewWidget.currentIndex())

    def populate_recordings(self):
        # Retrieve patient data from Firebase
        user = auth.current_user
        if user:
            user_id = user['localId']
            records_ref = db.reference('patients').child(user_id).child('recordings') # fix this 
            recordings = records_ref.get()

            # Clear existing patient profiles
            view_widget = self.ui.menuWidget.currentWidget()  # Assuming viewWidget is the current widget in menuWidget
            first_page_layout = self.ui.viewWidget.widget(0).layout()  # Get the layout of the first page

            if first_page_layout is None:
                first_page_layout = QtWidgets.QVLayout()  # Use QGridLayout for a flexible grid
                self.ui.viewWidget.widget(0).setLayout(first_page_layout)

            if patient_ids:
                num_columns = 3
                num_patients = len(patient_ids)
                num_rows = (num_patients + num_columns - 1) // num_columns  # Calculate number of rows needed

                for idx, patient_id in enumerate(patient_ids):
                    row = idx // num_columns
                    col = idx % num_columns

                    patient_data_ref = db.reference('patients').child(patient_id).child('profile')
                    patient_data = patient_data_ref.get()
                    if patient_data:
                        # Construct patient's full name
                        full_name = f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}"

                        # Create a profile record widget for the patient
                        recording = self.create_recording(full_name, patient_id)

                        # Add the profile record to the layout of the first page
                        first_page_layout.addWidget(recording, row, col)
                    else:
                        print(f"No data found for patient ID {patient_id} in the 'patients' node.")

                # Add empty widgets to fill remaining space in the grid
                for idx in range(num_rows * num_columns - num_patients):
                    row = num_patients // num_columns + idx // num_columns
                    col = num_patients % num_columns + idx % num_columns

                    empty_widget = QtWidgets.QWidget()
                    first_page_layout.addWidget(empty_widget, row, col)

            else:
                # No patients found for the doctor
                self.ui.nopatients.setVisible(True)
        else:
            print("No user is currently logged in.")
        
    
    def create_recording(self, full_name, patient_id):
        # Create a new instance of the record template
        recording = QtWidgets.QWidget()

        # Set properties from the template widget
        recording.setObjectName(self.recording_template.objectName())
        recording.setGeometry(100, 100, 600, 50)
        recording.color_index = 0  # Initialize color index

        recording.media_player = QMediaPlayer(recording)
        
        recording.play_button = QPushButton("Play")
        recording.play_button.setFixedWidth(65)  # Set button width
        recording.load_button = QPushButton("Load")
        recording.load_button.setFixedWidth(65)  # Set button width

        recording.waveform_plot = pg.PlotWidget()
        recording.waveform_plot.setBackground('#FFBCA7')  # Set background color
        recording.waveform_plot.showGrid(False, False)   # Disable grid
        recording.waveform_plot.getAxis('left').setPen(None)
        recording.waveform_plot.getAxis('bottom').setPen(None)
        recording.waveform_plot.getPlotItem().hideAxis('bottom')
        recording.waveform_plot.getPlotItem().hideAxis('left')

        # Create vertical layout for buttons
        button_layout = QVBoxLayout()
        button_layout.addWidget(recording.play_button)
        button_layout.addWidget(recording.load_button)

        # Create horizontal layout for buttons and waveform plot
        layout = QHBoxLayout()
        layout.addLayout(button_layout)
        layout.addWidget(recording.waveform_plot)

        recording.central_widget.setLayout(layout)

        recording.play_button.clicked.connect(recording.toggle_play)
        recording.load_button.clicked.connect(recording.load_audio)

        recording.audio_data = None
        recording.sample_rate = None
        recording.timer = QTimer(recording)

        # Create a layout for the profile record
        record_layout = QtWidgets.QVBoxLayout(recording)

        record_layout.setContentsMargins(0, 0, 0, 40)

        # Copy children widgets from the template widget
        for child in self.record_template.children():
            if isinstance(child, QtWidgets.QPushButton):
                # If it's a QPushButton (name button), create a new button and set its text and signal
                date_btn = QtWidgets.QPushButton(date)
                date_btn.clicked.connect(lambda: self.recording_data(patient_id))  # Connect to patient_overview method with patient_id
                record_layout.addWidget(date_btn)
            elif isinstance(child, QtWidgets.QLabel):
                # If it's a QLabel (picture label), you can set other properties if needed
                pass
            else:
                # For other types of child widgets, you can create instances and set properties accordingly
                pass

    def load_audio(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Open Audio File", "", "Audio Files (*.mp3 *.wav)")
        if file_path:
            self.media_player.setMedia(QMediaContent(QUrl.fromLocalFile(file_path)))
            self.sample_rate, self.audio_data = wavfile.read(file_path)
            self.update_waveform()

    def update_waveform(self):
        audio_duration = len(self.audio_data) / self.sample_rate
        time_vector = np.linspace(0, audio_duration, len(self.audio_data))

        # Resample audio data to a higher sampling rate
        target_sampling_rate = 44100
        resampled_time_vector = np.linspace(0, audio_duration, int(len(self.audio_data) * target_sampling_rate / len(time_vector)))
        resampled_audio_data = np.interp(resampled_time_vector, time_vector, self.audio_data)

        # Find maximum and minimum amplitude for each chunk
        chunk_size = int(target_sampling_rate / 120)  # Use a chunk size of 10 ms
        max_amplitudes = [max(resampled_audio_data[i:i+chunk_size]) for i in range(0, len(resampled_audio_data), chunk_size)]
        min_amplitudes = [min(resampled_audio_data[i:i+chunk_size]) for i in range(0, len(resampled_audio_data), chunk_size)]

        # Determine the overall maximum and minimum amplitude
        overall_max = max(max_amplitudes)
        overall_min = min(min_amplitudes)

        # Set y-range to include only positive values
        self.waveform_plot.setYRange(0, overall_max)

        self.waveform_plot.clear()
        for i in range(len(max_amplitudes)):
            self.waveform_plot.plot(
                [resampled_time_vector[i], resampled_time_vector[i]],
                [0, max(0, max_amplitudes[i])],
                pen={'color': 'w', 'width': 3}  # Adjust the width as needed
            )

    def change_line_color(self):
        # Change the color of the line at the current index
        if self.color_index < len(self.waveform_plot.plotItem.listDataItems()):
            pen = pg.mkPen(color='#d0a08c', width=3)  # Create a pen with white color
            self.waveform_plot.plotItem.listDataItems()[self.color_index].setPen(pen)
            self.color_index += 1
        else:
            self.timer.stop()  # Stop the timer when all lines have been colored

    def toggle_play(self):
        if self.media_player.state() == QMediaPlayer.PlayingState:
            self.media_player.pause()
            self.play_button.setText("Play")
            self.timer.stop()  # Stop the timer when playback is paused
        else:
            self.media_player.play()
            self.play_button.setText("Pause")
            # Calculate interval between color changes based on remaining audio duration
            total_duration = len(self.audio_data) / self.sample_rate
            current_position = self.media_player.position() / 1000  # Current position in seconds
            remaining_duration = total_duration - current_position
            # Adjust the scaling factor based on the total duration
            scaling_factor = 1 - np.log10(total_duration) / 10  # Adjust as needed
            # Ensure scaling factor is within reasonable bounds
            scaling_factor = max(0.1, min(1.0, scaling_factor))
            interval_ms = (remaining_duration * 1000) / len(self.waveform_plot.plotItem.listDataItems()) * scaling_factor
            self.timer.timeout.connect(self.change_line_color)
            self.timer.start(interval_ms)  # Start the timer with calculated interval
    
    return recording

# patient_data_ref = db.reference('patients').child(patient_id).child('profile')