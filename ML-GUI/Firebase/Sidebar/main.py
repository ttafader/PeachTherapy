import sys
from PyQt5.QtWidgets import QMainWindow, QApplication, QPushButton
from PyQt5.QtGui import QIcon
from peach_therapy import Ui_MainWindow
import resource_rc

import os, re, subprocess, firebase_admin, datetime, pyrebase
from firebase_admin import credentials, db
from firebase_admin import storage

from mycredentials import firebase_init
from mycredentials import pyrebase_config as config

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

cloud_storage_bucket = storage.bucket()

firebase = pyrebase.initialize_app(config)


class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.ui.stackedWidget.setCurrentIndex(0)
        self.ui.view_btn.setChecked(True)
        
        self.ui.view_btn.clicked.connect(self.view_btn_toggled)
        self.ui.add_btn.clicked.connect(self.add_btn_toggled)
        self.ui.apt_btn.clicked.connect(self.apt_btn_toggled)
        self.ui.settings_btn.clicked.connect(self.settings_btn_toggled)
        self.ui.exit_btn.clicked.connect(self.exit_btn_toggled)

    def switch_pages(self):
        self.ui.stackedWidget.setCurrentIndex(0)
        self.ui.view_btn.setChecked(True)

    # Functions for changing stacked widget index
    def view_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(0)

    def add_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(1)

    def apt_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(2)

    def settings_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(3)
    
    def exit_btn_toggled(self):
        QApplication.quit()

if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())




