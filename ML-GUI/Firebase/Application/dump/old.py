import sys
from PyQt5.QtWidgets import QMainWindow, QApplication, QPushButton
from PyQt5.QtGui import QIcon
from peach_therapy import Ui_MainWindow
import resource_rc


class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()

        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        self.ui.stackedWidget.setCurrentIndex(0)
        self.ui.view_btn.setChecked(True)

        # Set icons for all buttons
        self.set_button_icons()

    def set_button_icons(self):
        # View Icons
        self.set_icon(self.ui.view_btn, ":/icons/icons/w_view.png", ":/icons/icons/p_view.png")

        # Add Icon
        self.set_icon(self.ui.add_btn, ":/icons/icons/w_talk.png", ":/icons/icons/p_talk.png")

        # Apt Icons
        self.set_icon(self.ui.apt_btn, ":/icons/icons/w_cal.png", ":/icons/icons/p_cal.png")

        # Settings Icon
        self.set_icon(self.ui.settings_btn, ":/icons/icons/w_gear.png", ":/icons/icons/p_gear.png")

        # Exit Icon
        self.set_icon(self.ui.exit_btn, ":/icons/icons/w_logout.png", ":/icons/icons/p_logout.png")
        self.ui.exit_btn.clicked.connect(QApplication.quit)  # Connect clicked signal to quit application

    def set_icon(self, button, normal_icon_path, hover_icon_path):
        normal_icon = QIcon(normal_icon_path)
        hover_icon = QIcon(hover_icon_path)
        button.setIcon(normal_icon)
        button.enterEvent = lambda event: button.setIcon(hover_icon)
        button.leaveEvent = lambda event: button.setIcon(normal_icon)
    
        ## Function for searching
    def on_search_btn_clicked(self):
        self.ui.stackedWidget.setCurrentIndex(5)
        search_text = self.ui.search_input.text().strip()
        if search_text:
            self.ui.search_input.setText(search_text)


    ## Change QPushButton Checkable status when stackedWidget index changed
    def on_stackedWidget_currentChanged(self, index):
        btn_list = self.ui.full_menu_widget.findChildren(QPushButton)
        
        for btn in btn_list:
            if index in [5, 6]:
                btn.setAutoExclusive(False)
                btn.setChecked(False)
            else:
                btn.setAutoExclusive(True)

        ## functions for changing menu page
    def view_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(0)

    def add_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(1)

    def apt_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(2)

    def settings_btn_toggled(self):
        self.ui.stackedWidget.setCurrentIndex(3)


if __name__ == "__main__":
    app = QApplication(sys.argv)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())




import sys
from PyQt5.QtWidgets import QMainWindow, QApplication, QPushButton
from PyQt5.QtGui import QIcon
from sidebar import MySideBar
import resource_rc

app = QApplication(sys.argv)

window = MySideBar()

window.show()
app.exec()