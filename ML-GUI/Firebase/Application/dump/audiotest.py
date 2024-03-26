import sys
import numpy as np
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QFileDialog, QHBoxLayout
from PyQt5.QtMultimedia import QMediaPlayer, QMediaContent
from PyQt5.QtCore import QUrl, QTimer
import pyqtgraph as pg
from scipy.io import wavfile

class AudioPlayer(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Audio Player with Waveform Display")
        self.setGeometry(100, 100, 600, 50)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)

        self.color_index = 0  # Initialize color index

        self.media_player = QMediaPlayer(self)
        
        self.play_button = QPushButton("Play")
        self.play_button.setFixedWidth(65)  # Set button width
        self.load_button = QPushButton("Load")
        self.load_button.setFixedWidth(65)  # Set button width

        self.waveform_plot = pg.PlotWidget()
        self.waveform_plot.setBackground('#FFBCA7')  # Set background color
        self.waveform_plot.showGrid(False, False)   # Disable grid
        self.waveform_plot.getAxis('left').setPen(None)
        self.waveform_plot.getAxis('bottom').setPen(None)
        self.waveform_plot.getPlotItem().hideAxis('bottom')
        self.waveform_plot.getPlotItem().hideAxis('left')

        # Create vertical layout for buttons
        button_layout = QVBoxLayout()
        button_layout.addWidget(self.play_button)
        button_layout.addWidget(self.load_button)

        # Create horizontal layout for buttons and waveform plot
        layout = QHBoxLayout()
        layout.addLayout(button_layout)
        layout.addWidget(self.waveform_plot)

        self.central_widget.setLayout(layout)

        self.play_button.clicked.connect(self.toggle_play)
        self.load_button.clicked.connect(self.load_audio)

        self.audio_data = None
        self.sample_rate = None
        self.timer = QTimer(self)

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

    def closeEvent(self, event):
        self.media_player.stop()  # Stop media player when closing the application

if __name__ == "__main__":
    app = QApplication(sys.argv)
    player = AudioPlayer()
    player.show()
    sys.exit(app.exec_())
