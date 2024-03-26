from PyQt5.QtWidgets import QLabel, QWidget, QToolButton, QHBoxLayout, QVBoxLayout, QSizePolicy
import numpy as np
import pyqtgraph as pg
from scipy.io import wavfile
from google.cloud import storage
import tempfile
import os
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtCore import QTimer, QUrl, Qt, QSize
from PyQt5.QtGui import QIcon, QFont

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebasecredentials.json'

class AudioWidget(QWidget):
    def __init__(self, wav_url, date, phrase, doctors_note, confidence, parent=None):
        super().__init__(parent)
        self.media_player = QMediaPlayer(self)

        self.wav_url = wav_url
        self.date = date
        self.phrase = phrase
        self.doctors_note = doctors_note
        self.confidence = confidence

        self.audio_data = None
        self.sample_rate = None
        self.color_index = 0
        self.timer = QTimer(self)

        self.setup_ui()
        self.load_audio()
        

    def setup_ui(self):
        layout = QVBoxLayout()  # Use a vertical layout

        # Create QLabel widgets for date, phrase, and doctor's note
        date_label = QLabel(f"{self.date}")
        phrase_label = QLabel(f"Phrase: {self.phrase}")
        doctors_note_label = QLabel(f"Doctor's Note: {self.doctors_note}")
        confidence_label = QLabel(f"Pathology Severity: {self.confidence}")

        # Set font color and font for labels
        font = QFont("Montserrat SemiBold", 8)
        font_date = QFont("Montserrat SemiBold", 17)
        date_label.setFont(font_date)
        date_label.setStyleSheet("color: #d0a08c;")
        phrase_label.setFont(font)
        phrase_label.setStyleSheet("color: #664b42;")
        doctors_note_label.setFont(font)
        doctors_note_label.setStyleSheet("color: #664b42;")
        confidence_label.setFont(font)
        confidence_label.setStyleSheet("color: #664b42;")

        # Widget for labels
        label_widget = QWidget()
        label_layout = QVBoxLayout()
        label_layout.addWidget(phrase_label)
        label_layout.addWidget(doctors_note_label)
        label_layout.addWidget(confidence_label)
        label_widget.setLayout(label_layout)
        label_widget.setStyleSheet("background-color: white; padding-left: 15px;")
        

        # Create a container widget for the play button and waveform plot
        player_widget = QWidget()
        player_layout = QHBoxLayout()  # Use a horizontal layout for the player widget

        self.play_button = QToolButton()
        self.play_button.setIcon(QIcon("C:/Users/tajmi/OneDrive/Documents/PeachTherapy/ML-GUI/Firebase/Sidebar/icons/play_pink.png"))
        self.play_button.setIconSize(QSize(34, 38))

        self.waveform_plot = pg.PlotWidget()
        self.waveform_plot.setBackground('#FFE5E1')  # Set background color
        self.waveform_plot.showGrid(False, False)
        self.waveform_plot.getAxis('left').setPen(None)
        self.waveform_plot.getAxis('bottom').setPen(None)
        self.waveform_plot.getPlotItem().hideAxis('bottom')
        self.waveform_plot.getPlotItem().hideAxis('left')

        player_layout.addWidget(self.play_button)
        player_layout.addWidget(self.waveform_plot)

        player_widget.setLayout(player_layout)

        # Set left padding to 10 pixels
        player_layout.setContentsMargins(20, 5, 10, 5)

        # Ensure the waveform plot expands within the layout
        self.waveform_plot.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

        # Widget to contain both label and player widgets
        audio_card = QWidget()
        audio_card_layout = QVBoxLayout()
        audio_card_layout.addWidget(date_label)
        audio_card_layout.addWidget(player_widget)
        audio_card_layout.addWidget(label_widget)
        audio_card.setLayout(audio_card_layout)
        audio_card.setFixedWidth(900)

        layout.addWidget(audio_card)
        self.setLayout(layout)

        self.play_button.clicked.connect(self.toggle_play)

        # Set the background color and rounded corners for the player widget
        audio_card.setStyleSheet("""
            QWidget {
                background-color: #FFE5E1;
                border-radius: 10px;
            }
        """)

        # Styling the play button to match the background color
        self.play_button.setStyleSheet("QToolButton { background-color: #FFE5E1; border: none; }")

    def load_audio(self):
        self.download_audio_from_url(self.wav_url)

    def download_audio_from_url(self, url):
        bucket_name, object_name = self.extract_bucket_and_object_names(url)
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(object_name)
        audio_data = blob.download_as_string()

        # Create a temporary file to save the audio data
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            temp_file.write(audio_data)
            self.temp_file_path = temp_file.name  # Store the temporary file path

        # Read the audio data from the temporary file
        sample_rate, audio_data = wavfile.read(self.temp_file_path)

        # Ensure audio_data is one-dimensional
        if audio_data.ndim > 1:
            audio_data = audio_data.flatten()

        # Update the attributes with the loaded audio data
        self.sample_rate = sample_rate
        self.audio_data = audio_data

        # Update the waveform display
        self.update_waveform()

        # Set media content to play
        self.media_player.setMedia(QMediaContent(QUrl.fromLocalFile(self.temp_file_path)))
        
    def extract_bucket_and_object_names(self, url):
        parts = url.split("/")
        bucket_name = parts[2]
        object_name = "/".join(parts[3:])
        return bucket_name, object_name

    def update_waveform(self):
        audio_duration = len(self.audio_data) / self.sample_rate
        time_vector = np.linspace(0, audio_duration, len(self.audio_data))

        # Resample audio data to a higher sampling rate
        target_sampling_rate = 44100
        resampled_time_vector = np.linspace(0, audio_duration,
                                            int(len(self.audio_data) * target_sampling_rate / len(time_vector)))
        resampled_audio_data = np.interp(resampled_time_vector, time_vector, self.audio_data)

        # Find maximum and minimum amplitude for each chunk
        chunk_size = int(target_sampling_rate / 120)  # Use a chunk size of 10 ms
        max_amplitudes = [max(resampled_audio_data[i:i + chunk_size]) for i in
                          range(0, len(resampled_audio_data), chunk_size)]
        min_amplitudes = [min(resampled_audio_data[i:i + chunk_size]) for i in
                          range(0, len(resampled_audio_data), chunk_size)]

        # Determine the overall maximum and minimum amplitude
        overall_max = max(max_amplitudes)
        overall_min = min(min_amplitudes)

        # Set y-range to include only positive values
        self.waveform_plot.setYRange(0, overall_max)
        self.waveform_plot.setMouseEnabled(x=False, y=False)
        self.waveform_plot.enableAutoRange()

        self.waveform_plot.clear()
        for i in range(len(max_amplitudes)):
            self.waveform_plot.plot(
                [resampled_time_vector[i], resampled_time_vector[i]],
                [0, max(0, max_amplitudes[i])],
                pen={'color': '#FFA386', 'width': 4}  # Adjust the width as needed
            )

    def change_line_color(self):
        # Change the color of the line at the current index
        if self.color_index < len(self.waveform_plot.plotItem.listDataItems()):
            pen = pg.mkPen(color='#d0a08c', width=4)  # Create a pen with white color
            self.waveform_plot.plotItem.listDataItems()[self.color_index].setPen(pen)
            self.color_index += 1
        else:
            self.reset_colors()
            self.timer.stop()  # Stop the timer when all lines have been colored
    
    def reset_colors(self):
        for item in self.waveform_plot.plotItem.listDataItems():
            item.setPen(color='#FFA386', width=4)

    def toggle_play(self):
        if self.media_player.state() == QMediaPlayer.PlayingState:
            self.media_player.pause()
            self.play_button.setIcon(QIcon("C:/Users/tajmi/OneDrive/Documents/PeachTherapy/ML-GUI/Firebase/Sidebar/icons/play_pink.png"))
            self.timer.stop()  # Stop the timer when playback is paused
        else:
            self.media_player.play()
            self.play_button.setIcon(QIcon("C:/Users/tajmi/OneDrive/Documents/PeachTherapy/ML-GUI/Firebase/Sidebar/icons/pause_brown.png"))
            
            # Calculate the interval between color changes
            total_duration = len(self.audio_data) / self.sample_rate
            num_bars = len(self.waveform_plot.plotItem.listDataItems())
            current_position = self.media_player.position() / 1000  # Current position in seconds
            remaining_duration = total_duration - current_position
            
            # Set a maximum interval to avoid slowing down too much for longer audio

            scaling_factor = 1 - np.log10(total_duration) / 10  # Adjust as needed
            # Ensure scaling factor is within reasonable bounds
            #scaling_factor = max(0.1, min(1.0, scaling_factor))
            
            # Adjust the interval calculation based on the total duration and number of bars
            interval_ms = (remaining_duration * 1000) / 121 * scaling_factor
            print(interval_ms)
            
            self.timer.timeout.connect(self.change_line_color)
            self.timer.start(interval_ms)  # Start the timer with calculated interval

            # Connect slot for handling audio finish
            self.media_player.stateChanged.connect(self.handle_media_player_state_changed)

    def handle_media_player_state_changed(self, state):
        if state == QMediaPlayer.StoppedState:
            self.play_button.setIcon(QIcon("C:/Users/tajmi/OneDrive/Documents/PeachTherapy/ML-GUI/Firebase/Sidebar/icons/play_pink.png"))
            self.timer.stop()
            # Safe to delete the temporary file
            if hasattr(self, 'temp_file_path'):
                os.unlink(self.temp_file_path)
                delattr(self, 'temp_file_path')
