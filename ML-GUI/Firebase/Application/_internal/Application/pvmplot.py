import numpy as np
import matplotlib.pyplot as plt
import joblib
from sklearn.decomposition import PCA
from mlxtend.plotting import plot_decision_regions

# Load saved data arrays, model and scalers
X_train_scaled = np.load('X_train_scaled.npy')
y_train = np.load('y_train.npy')
model = joblib.load('model_for_plotting.pkl')
scaler = joblib.load('scaler_for_plotting.pkl')

def plot_decision_boundaries(X, y, feature_names, ax):
    # PCA for visualization (reduce to 2 dimensions)
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    # Create a new SVM model for visualization
    model_for_plot = model #SVC(kernel='linear', probability=True)
    model_for_plot.fit(X_pca, y)

    # Plot decision boundaries
    plot_decision_regions(X_pca, y, clf=model_for_plot, legend=0, ax=ax, colors = '#78D6D9,#FFA386',
                           contourf_kwargs={'levels': [0], 'alpha': 0.8})
    
    # Apply PCA transformation to the new data points
    new_data = np.array([[356.2141418457031, 4679.6689453125, -15.868865966796875, 11632.068359375, 0.0053018283110458815], 
                         [6319.072265625, 0.0, -17.12540054321289, 10363.60546875, 0.012165957208233607], 
                         [1300.451416015625, 7220.5302734375, -12.359660148620605, 8724.353515625, 0.004117430871527314], 
                         [6525.73291015625, 0.0, -8.674641609191895, 6795.41064453125, 0.008992449763021597], 
                         [464.6122131347656, 7418.736328125, -16.92323112487793, 11128.4365234375, 0.004270574202422396], 
                         [450.20867919921875, 7388.18212890625, -13.471109390258789, 4769.57275390625, 0.004269214907763801], 
                         [6562.41015625, 0.0, -12.52293872833252, 10733.6865234375, 0.002474142259610403]])
    new_data_scaled = scaler.transform(new_data)
    new_data_selected = new_data_scaled[:, [3, 4]]

    new_data_pca = pca.transform(new_data_selected)
    ax.scatter(new_data_pca[:, 0], new_data_pca[:, 1], c='w', marker='o', edgecolors='k', s=50, label='New Data Point')

    ax.set_xlabel(feature_names[0])
    ax.set_ylabel(feature_names[1])
    ax.legend()
    
    return ax

# Plot decision boundaries for pitch period vs. mfcc_var
fig, ax = plt.subplots(1, 1, figsize=(8, 6))
scatter = plot_decision_boundaries(X_train_scaled[:, [3, 4]], y_train, ['MFCC Variance', 'Pitch Period'], ax)

plt.title('Decision Boundary for Pitch Period vs. MFCC Variance')
plt.show()

