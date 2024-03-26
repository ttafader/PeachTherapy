import sys
from PyQt5 import QtWidgets
from PyQt5.QtWidgets import QDialog, QApplication, QMessageBox
from PyQt5.uic import loadUi
import firebase_admin
from firebase_admin import credentials, db
from firebase_admin import storage
import resource_rc
from requests.exceptions import HTTPError

import pyrebase

from mycredentials import firebase_init
from mycredentials import pyrebase_config as config

# Initialize Firebase Admin SDK
cred = credentials.Certificate('firebasecredentials.json')
firebase_admin.initialize_app(cred, firebase_init)

# Initialize Pyrebase
firebase = pyrebase.initialize_app(config)

auth=firebase.auth()

# cool 

class Login(QDialog):
    def __init__(self):
        super(Login,self).__init__()
        loadUi("login.ui",self)
        self.loginbutton.clicked.connect(self.loginfunction)
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        self.createaccbutton.clicked.connect(self.gotocreate)
        self.invalid.setVisible(False)

    def loginfunction(self):
        email=self.email.text()
        password=self.password.text()
        try:
            auth.sign_in_with_email_and_password(email,password)
        except:
            self.invalid.setVisible(True)
    def gotocreate(self):
        createacc=CreateAcc()
        widget.addWidget(createacc)
        widget.setCurrentIndex(widget.currentIndex()+1)

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
        license_id = self.licenseid.text()

        if self.password.text() == self.confirmpass.text():
            password = self.password.text()
            try:
                auth_data = auth.create_user_with_email_and_password(email, password)
                user_id = auth_data['localId']  # Extract the user ID from the authentication data
                print("User ID:", user_id)  # Check if user ID is properly extracted

                # Write user info to the 'doctors' node in Firebase
                doctor_ref = db.reference('doctors').child(user_id)
                doctor_ref.set({
                    "first_name": first_name,
                    "last_name": last_name,
                    "license_id": license_id,
                    "email": email
                })
 
                login = Login()
                widget.addWidget(login)
                widget.setCurrentIndex(widget.currentIndex() + 1)
            except HTTPError as e:
                error_message = e.args[0].response.json()['error']['message']
                if error_message == "EMAIL_EXISTS":
                    self.emailinvalid.setVisible(True)
                else:
                    self.failed.setVisible(True)
            except Exception as e:
                self.failed.setVisible(True)

app=QApplication(sys.argv)
mainwindow=Login()
widget=QtWidgets.QStackedWidget()
widget.addWidget(mainwindow)
widget.setFixedWidth(700)
widget.show()
app.exec_()