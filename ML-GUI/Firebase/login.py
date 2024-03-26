import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout, QLabel, QLineEdit, QStackedWidget

# Suppress font enumeration warning globally
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="Qt QFontDatabase: Cannot find font directory")

class InitialWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Initial Screen")
        self.setGeometry(100, 100, 400, 300)
        self.setStyleSheet("background-color: #fff6f4; font-family: Arial, sans-serif;")
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        login_button = QPushButton("Login", self)
        login_button.setStyleSheet("background-color: #ffa386;")
        signup_button = QPushButton("Sign Up", self)
        signup_button.setStyleSheet("background-color: #ffa386;")

        layout.addWidget(login_button)
        layout.addWidget(signup_button)

        self.setLayout(layout)

class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Login")
        self.setStyleSheet("background-color: #fff6f4; font-family: Arial, sans-serif;")
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        email_label = QLabel("Email:", self)
        email_edit = QLineEdit(self)
        password_label = QLabel("Password:", self)
        password_edit = QLineEdit(self)
        password_edit.setEchoMode(QLineEdit.Password)

        login_button = QPushButton("Login", self)
        login_button.setStyleSheet("background-color: #ffa386;")

        layout.addWidget(email_label)
        layout.addWidget(email_edit)
        layout.addWidget(password_label)
        layout.addWidget(password_edit)
        layout.addWidget(login_button)

        self.setLayout(layout)

class SignupWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Sign Up")
        self.setStyleSheet("background-color: #fff6f4; font-family: Arial, sans-serif;")
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout()

        email_label = QLabel("Email:", self)
        email_edit = QLineEdit(self)
        password_label = QLabel("Password:", self)
        password_edit = QLineEdit(self)
        password_edit.setEchoMode(QLineEdit.Password)

        signup_button = QPushButton("Sign Up", self)
        signup_button.setStyleSheet("background-color: #ffa386;")

        layout.addWidget(email_label)
        layout.addWidget(email_edit)
        layout.addWidget(password_label)
        layout.addWidget(password_edit)
        layout.addWidget(signup_button)

        self.setLayout(layout)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    
    initial_window = InitialWindow()
    login_window = LoginWindow()
    signup_window = SignupWindow()

    stack = QStackedWidget()
    stack.addWidget(initial_window)
    stack.addWidget(login_window)
    stack.addWidget(signup_window)

    initial_window.show()
    
    sys.exit(app.exec_())
