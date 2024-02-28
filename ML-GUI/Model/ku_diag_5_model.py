import os
import parselmouth
import librosa
import numpy as np
import matplotlib.pyplot as plt
import joblib

from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, StratifiedKFold
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

    features = {'pitch_period': pitch_period, 
                'formant1': formant1, 
                'formant2': formant2,
                'mfcc_mean': mfcc_mean,
                'mfcc_var': mfcc_var}
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

# Define number of folds
num_folds = 5

# Initialize Stratified K-Fold
skf = StratifiedKFold(n_splits=num_folds, shuffle=True, random_state=42)

# Initialize lists to store accuracies
accuracies = []

# Iterate over folds
for fold, (train_index, test_index) in enumerate(skf.split(X_combined, y_combined), 1):
    print(f"Fold {fold}:")
    X_train_fold, X_test_fold = X_combined[train_index], X_combined[test_index]
    y_train_fold, y_test_fold = y_combined[train_index], y_combined[test_index]

    # Feature scaling using StandardScaler
    scaler_fold = StandardScaler()
    X_train_fold_scaled = scaler_fold.fit_transform(X_train_fold)
    X_test_fold_scaled = scaler_fold.transform(X_test_fold)

    # Initialize Support Vector Machines model
    model_fold = SVC(probability=True)

    # Train the model
    model_fold.fit(X_train_fold_scaled, y_train_fold)

    # Predict on the test set
    y_pred_fold = model_fold.predict(X_test_fold_scaled)

    # Calculate accuracy
    accuracy_fold = accuracy_score(y_test_fold, y_pred_fold)
    accuracies.append(accuracy_fold)
    print("Accuracy:", accuracy_fold)
    print()

# Print average accuracy
print("Average Accuracy:", np.mean(accuracies))

# Save the model and scaler
joblib.dump(model_fold, 'model_svm_folded.pkl')
joblib.dump(scaler_fold, 'scaler_folded.pkl')

print("Model trained and saved successfully.")
