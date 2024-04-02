import numpy as np
import matplotlib.pyplot as plt
import joblib
from sklearn.decomposition import PCA
from mlxtend.plotting import plot_decision_regions
from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from PyQt5.QtWidgets import QSizePolicy

class DecisionBoundaryPlot(QWidget):
    def __init__(self, new_data):
        super().__init__()
        self.new_data = new_data
        self.initUI()

    def initUI(self):
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        
        self.figure = plt.figure(figsize=(8, 6))
        self.canvas = FigureCanvas(self.figure)
        self.layout.addWidget(self.canvas)

        ax = self.figure.add_subplot(111)
        ax.clear()
        
        # Load saved data arrays, model and scalers
        X_train_scaled = np.load('X_train_scaled.npy')
        X_train_scaled = X_train_scaled[:, [3, 4]]
        y_train = np.load('y_train.npy')
        model = joblib.load('model_for_plotting.pkl')
        scaler = joblib.load('scaler_for_plotting.pkl')
        
        # PCA for visualization (reduce to 2 dimensions)
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X_train_scaled)
        
        # Create a new SVM model for visualization
        model_for_plot = model
        model_for_plot.fit(X_pca, y_train)

        # Plot decision boundaries
        plot_decision_regions(X_pca, y_train, clf=model_for_plot, legend=0, ax=ax, colors='#78D6D9,#FFA386',
                              contourf_kwargs={'levels': [0], 'alpha': 0.8})
        
        # Apply PCA transformation to the new data points
        new_data_scaled = scaler.transform(self.new_data)
        new_data_selected = new_data_scaled[:, [3, 4]]

        new_data_pca = pca.transform(new_data_selected)
        ax.scatter(new_data_pca[:, 0], new_data_pca[:, 1], c='w', marker='o', edgecolors='k', s=50, label='Recordings')

        ax.set_xlabel('Pitch Period')
        ax.set_ylabel('MFCC Variance')
        ax.legend()
        
        self.canvas.draw()
        ax.axis('off')  # Turn off x and y axes
        plt.tight_layout()
        self.canvas.draw()
