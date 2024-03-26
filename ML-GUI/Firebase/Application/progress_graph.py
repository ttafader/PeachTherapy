from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtGui import QPainter, QColor, QFont
from PyQt5.QtCore import Qt

class ProgressCircle(QWidget):
    def __init__(self, parent=None):
        super(ProgressCircle, self).__init__(parent)
        self.confidence = 0
        self.outer_gray_radius = 0
        self.green_circle_radius = 0
        self.smaller_gray_radius = 0
        self.smaller_white_radius = 0
        self.setFixedSize(300, 300)  # Set fixed size to 300x300 pixels
        

    def set_confidence(self, confidence):
        self.confidence = confidence
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.fillRect(event.rect(), QColor("#fcf4f4"))
        
        # Determine the color based on confidence
        if self.confidence < 35:
            color = QColor("#f87070")  # Red color
            status = "Unhealthy"
            label_text = "There is room for improvement"
        elif self.confidence >= 35 and self.confidence <= 70:
            color = QColor("#ffeda3")  # Yellow color
            status = "Mildly Unhealthy"
            label_text = "You're improving a lot!"
        else:
            color = QColor("#A0E480")  # Green color
            status = "Healthy"
            label_text = "Keep up the good work!"
        
        # Calculate radii
        outer_radius = min(self.width(), self.height()) / 2
        self.outer_gray_radius = outer_radius  # 5 pixels smaller than green circle
        self.green_circle_radius = self.outer_gray_radius - 6
        self.smaller_gray_radius = self.green_circle_radius - 8  # 15 pixels smaller than green circle
        self.smaller_white_radius = self.smaller_gray_radius - 6  # 10 pixels smaller than smaller gray circle
        
        # Draw outer gray circle (Circle 1)
        painter.setPen(Qt.NoPen)
        painter.setBrush(QColor(217, 217, 217))  # D9D9D9
        painter.drawEllipse(self.width() / 2 - self.outer_gray_radius, self.height() / 2 - self.outer_gray_radius,
                            self.outer_gray_radius * 2, self.outer_gray_radius * 2)
        
        # Draw smaller green pie chart representing the average (Circle 2)
        angle = 360 * self.confidence / 100
        painter.setBrush(color)
        painter.drawPie(self.width() / 2 - self.green_circle_radius, self.height() / 2 - self.green_circle_radius,
                        self.green_circle_radius * 2, self.green_circle_radius * 2, 90 * 16, -angle * 16)
        
        # Draw smaller gray circle on top (Circle 3)
        painter.setBrush(QColor(217, 217, 217))  # D9D9D9
        painter.drawEllipse(self.width() / 2 - self.smaller_gray_radius, self.height() / 2 - self.smaller_gray_radius,
                            self.smaller_gray_radius * 2, self.smaller_gray_radius * 2)
        
        # Draw even smaller white circle on top of the gray circle (Circle 4)
        painter.setBrush(Qt.white)
        painter.drawEllipse(self.width() / 2 - self.smaller_white_radius, self.height() / 2 - self.smaller_white_radius,
                            self.smaller_white_radius * 2, self.smaller_white_radius * 2)
        
        # Draw text
        painter.setPen(QColor("#664b42"))  # brown color

        # Font for confidence value
        font = QFont('Montserrat ExtraBold', 25)  # Set font to Montserrat with size 25px
        painter.setFont(font)
        text = f'{int(self.confidence)}\n'
        painter.drawText(event.rect(), Qt.AlignCenter, text)

        # Font for status
        status_font = QFont('Montserrat SemiBold', 11)  # Set font to Montserrat with size 15px
        painter.setFont(status_font)
        text1 = f'{status}'
        painter.drawText(event.rect(), Qt.AlignCenter, text1)

        # Font for label text
        label_font = QFont('Montserrat Medium', 9)  # Set font to Montserrat with size 10px
        painter.setFont(label_font)
        text2 = f'\n\n{label_text}'
        painter.drawText(event.rect(), Qt.AlignCenter, text2)
