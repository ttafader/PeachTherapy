import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout
from PyQt5.QtChart import QChart, QChartView, QBarSet, QBarSeries, QBarCategoryAxis, QLineSeries, QScatterSeries, QValueAxis
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPainter, QColor, QFont, QBrush, QPen


class BarGraph(QWidget):
    def __init__(self, date_labels, values):
        super().__init__()

        layout = QVBoxLayout(self)

        # Set widget background color to blue
        self.setStyleSheet("background-color: #7cc9c7")

        # Slice the arrays to include only the last 10 elements
        date_labels = date_labels[-10:]
        values = values[-10:]

        # Create bar set
        bar_set = QBarSet('Values')

        # Append values to the bar set
        for value in values:
            bar_set.append(value)

        # Set bar color to white
        brush = QBrush(QColor(Qt.white))
        bar_set.setBrush(brush)

        # Create bar series and add the bar set
        bar_series = QBarSeries()
        bar_series.append(bar_set)

        # Create line series for average
        line_series = QLineSeries()
        sum = 0
        for i, value in enumerate(values):
            print(value)
            sum += value
            data_point = (sum / (i + 1))
            print(i, data_point)
            line_series.append(i, data_point)

        # Set line series color to RGB(229, 226, 218)
        line_series.setColor(QColor(229, 226, 218))

        # Add dots for each point
        scatter_series = QScatterSeries()
        scatter_series.setMarkerSize(10)
        scatter_series.setColor(QColor(229, 226, 218))
        scatter_pen = QPen(QColor(229, 226, 218))
        scatter_pen.setWidth(2)
        scatter_series.setPen(scatter_pen)
        for data_point in line_series.points():
            scatter_series.append(data_point)

        # Create chart and set series
        chart = QChart()
        chart.addSeries(bar_series)
        chart.addSeries(line_series)
        chart.addSeries(scatter_series)
        chart.setAnimationOptions(QChart.SeriesAnimations)
        chart.legend().hide()  # Hide legend

        # Set chart background color to blue
        chart.setBackgroundBrush(QColor("#7cc9c7"))
        # Create Y-axis
        axis_y = QValueAxis()
        axis_y.setRange(0, 100)
        axis_y.setTickCount(2)  # Set the number of ticks
        axis_y.setLabelFormat("%.0f")  # Display integers only
        chart.addAxis(axis_y, Qt.AlignLeft)
        bar_series.attachAxis(axis_y)
        line_series.attachAxis(axis_y)
        scatter_series.attachAxis(axis_y)
        axis_y.setLabelsColor(Qt.white)
        axis_y.setLabelsFont(QFont("Montserrat SemiBold", 8))
        axis_y.setGridLineVisible(False)


        '''
        # Create X-axis and set date_labels
        axis_x = QBarCategoryAxis()
        axis_x.append(date_labels)
        chart.addAxis(axis_x, Qt.AlignBottom)
        bar_series.attachAxis(axis_x)
        line_series.attachAxis(axis_x)
        scatter_series.attachAxis(axis_x)

        # Set X-axis labels font color to white and font family to Montserrat
        axis_x.setLabelsColor(Qt.white)
        axis_x.setLabelsFont(QFont("Montserrat SemiBold", 8))
        
        # Remove grid lines
        axis_x.setGridLineVisible(False)
        

        # Rotate X-axis labels diagonally
        axis_x.setLabelsAngle(-90) '''

        # Create chart view
        chart_view = QChartView(chart)
        chart_view.setRenderHint(QPainter.Antialiasing)

        layout.addWidget(chart_view)