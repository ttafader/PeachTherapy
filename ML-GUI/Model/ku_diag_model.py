import os
import parselmouth
import librosa
import numpy as np
import matplotlib.pyplot as plt
import joblib

from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score
from sklearn.preprocessing import StandardScaler
from itertools import combinations
from sklearn.decomposition import PCA
from mlxtend.plotting import plot_decision_regions

# Function to extract formants
def extract_formants(audio_path, order=5):
    y, sr = librosa.load(audio_path)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    lpc_coef = librosa.core.lpc(y, order=order)
    roots = np.roots(lpc_coef)
    roots = roots[roots.imag > 0]
    formants_hz = np.sort(np.angle(roots) * (sr / (2 * np.pi)))
    return formants_hz

# Function to extract pitch period using Praat
def extract_pitch_period(audio_file):
    try:
        snd = parselmouth.Sound(audio_file)
        pitch = snd.to_pitch()
        f0_values = pitch.selected_array['frequency']

        # Ensure there are non-zero F0 values
        valid_f0_values = f0_values[f0_values != 0]

        if len(valid_f0_values) > 0:
            pitch_period = 1 / valid_f0_values[0]
        else:
            pitch_period = 0
    except Exception as e:
        print(f"Error in pitch extraction for file {audio_file}: {e}")
        pitch_period = 0
    return pitch_period

def extract_mfcc(audio_file):
    try:
        # Load the audio file
        y, sr = librosa.load(audio_file, sr=None)

        # Compute MFCC features
        mfcc = librosa.feature.mfcc(y=y, sr=sr)
        return mfcc
    except Exception as e:
        print(f"Error extracting MFCC for file {audio_file}: {e}")
        return None

def extract_voice_features(audio_file):
    try:
        pitch_period = extract_pitch_period(audio_file)
        formants = extract_formants(audio_file)
        formant1 = formants[0] if len(formants) > 0 else 0
        formant2 = formants[1] if len(formants) > 1 else 0
        mfcc = extract_mfcc(audio_file)

        print('Extracting original dataset features...')
    except parselmouth.PraatError as e:
        print(f"Error in feature extraction for file {audio_file}: {e}")
        pitch_period = formant1 = formant2 = mfcc = 0
    
    # Calculate statistics for MFCCs
    if mfcc is not None:
        mfcc_mean = np.mean(mfcc)
        mfcc_var = np.var(mfcc)
    else:
        mfcc_mean = mfcc_var = 0

    features = {'formant1': formant1, 
                'formant2': formant2,
                'mfcc_mean': mfcc_mean,
                'mfcc_var': mfcc_var,
                'pitch_period': pitch_period}
    # Return the extracted features as a dictionary
    return features

# Directory paths
healthy_folder = "norm"
unhealthy_folder = "patho"

# Read audio files from folders and assign labels
healthy_files = [os.path.join(healthy_folder, file) for file in os.listdir(healthy_folder) if file.endswith(".wav")]
unhealthy_files = [os.path.join(unhealthy_folder, file) for file in os.listdir(unhealthy_folder) if file.endswith(".wav")]

# Assign labels
labels_healthy = np.zeros(len(healthy_files), dtype=int)  # Assuming 'healthy' is labeled as 0
labels_unhealthy = np.ones(len(unhealthy_files), dtype=int)  # Assuming 'unhealthy' is labeled as 1

# Convert lists to numpy arrays
X_healthy_list = [extract_voice_features(file) for file in healthy_files]
X_unhealthy_list = [extract_voice_features(file) for file in unhealthy_files]

# Convert lists to numpy arrays
X_healthy = np.array([list(feat.values()) for feat in X_healthy_list], dtype=np.float64)
X_unhealthy = np.array([list(feat.values()) for feat in X_unhealthy_list], dtype=np.float64)

# Combine features and labels for healthy and unhealthy voices
X_combined = np.concatenate((X_healthy, X_unhealthy), axis=0)
y_combined = np.concatenate((labels_healthy, labels_unhealthy))

# Split the data into a training set (70%) and a test set (30%)
X_train, X_test, y_train, y_test = train_test_split(X_combined, y_combined, test_size=0.3, random_state=42)

# Initialize Support Vector Machines model
model = SVC(probability=True)

# Feature scaling using StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Print mean values
print('Mean values for feature scaling:', scaler.mean_)

# Train the model
model.fit(X_train_scaled, y_train)

# Predict on the test set
y_pred = model.predict(X_test_scaled)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)

# Calculate confusion matrix
conf_matrix = confusion_matrix(y_test, y_pred)

# Calculate sensitivity and specificity
sensitivity = recall_score(y_test, y_pred, pos_label=1)
specificity = recall_score(y_test, y_pred, pos_label=0)

# Print performance metrics
print("Accuracy:", accuracy)
print("Confusion Matrix:\n", conf_matrix)
print("Sensitivity (True Positive Rate):", sensitivity)
print("Specificity (True Negative Rate):", specificity)

# Get support vectors for the model
support_vectors = X_train_scaled[model.support_]

# Calculate mean support vector for each feature
mean_support_vector = np.mean(support_vectors, axis=0)

import numpy as np
import matplotlib.pyplot as plt
from mlxtend.plotting import plot_decision_regions

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
    
    ax.set_xlabel(feature_names[0])
    ax.set_ylabel(feature_names[1])
    
    return ax

# Define 'features' at a higher scope
features = ['formant1', 'formant2', 'mfcc_mean', 'mfcc_var', 'pitch_period']

# Pairwise combinations of features
feature_combinations = list(combinations(features, 2))

# Plot decision boundaries for each feature pair
fig, axs = plt.subplots(len(feature_combinations) // 2, 2, figsize=(15, 15))  # Increase figure size
axs = axs.flatten()

for i, (feature1, feature2) in enumerate(feature_combinations):
    indices = [features.index(feature1), features.index(feature2)]
    scatter = plot_decision_boundaries(X_train_scaled[:, indices], y_train, [feature1, feature2], axs[i])

fig.suptitle('Decision Boundaries for SVM Model', y=1.02)
plt.tight_layout()
plt.show()

# Plot mean support vectors
plt.bar(range(len(features)), mean_support_vector, color='blue', label='Model')
plt.xlabel('Feature')
plt.ylabel('Mean Feature Value')
plt.title('Mean Support Vector Analysis - Model')
plt.xticks(range(len(features)), features)
plt.legend()
plt.tight_layout()
plt.show()

# Save the model and scaler
joblib.dump(model, 'model_for_plotting.pkl')
joblib.dump(scaler, 'scaler_for_plotting.pkl')
np.save('X_train_scaled.npy', X_train_scaled)
np.save('y_train.npy', y_train)

print("Model trained and saved successfully.")
