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

    features = {'pitch_period': pitch_period, 
                'formant1': formant1, 
                'formant2': formant2,
                'mfcc_mean': mfcc_mean,
                'mfcc_var': mfcc_var}
    # Return the extracted features as a dictionary
    return features

def train_model(X_train, y_train):
    # Initialize Support Vector Machines model
    model = SVC(probability=True)

    # Feature scaling using StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Train the model on the training set
    model.fit(X_train_scaled, y_train)

    # Print mean values
    print('Mean values for feature scaling:', scaler.mean_)

    return model, scaler

def test_model(model, X_test, y_test, scaler, gender):
    # Feature scaling using StandardScaler
    X_test_scaled = scaler.transform(X_test)

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
    print(f"\n{gender.capitalize()} Model Test Accuracy:", accuracy)
    print("Confusion Matrix:\n", conf_matrix)
    print("Sensitivity (True Positive Rate):", sensitivity)
    print("Specificity (True Negative Rate):", specificity)

    return accuracy, conf_matrix, sensitivity, specificity

def plot_decision_boundaries(X, y, model, scaler, feature_names, gender):
    # PCA for visualization (reduce to 2 dimensions)
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(scaler.transform(X))

    # Create a new SVM model for visualization
    model_for_plot = SVC(kernel='linear', probability=True)
    model_for_plot.fit(X_pca, y)

    # Plot decision boundaries
    plot_decision_regions(X_pca, y, clf=model_for_plot, scatter_kwargs={'edgecolor': 'k', 'c': y, 'cmap': plt.cm.coolwarm},
                          contourf_kwargs={'levels': [0], 'alpha': 0.8})
    
    plt.xlabel(feature_names[0])
    plt.ylabel(feature_names[1])
    plt.title(f'Decision Boundaries for {gender.capitalize()} Model')
    plt.show()

def save_model(model, scaler, model_filename='model_svm_fitted_loocv.pkl', scaler_filename='scaler_loocv.pkl'):
    # Save the model and scaler
    joblib.dump(model, model_filename)
    joblib.dump(scaler, scaler_filename)

# Directory paths
healthy_male_folder = "norm_m"
unhealthy_male_folder = "patho_m"
healthy_female_folder = "norm_f"
unhealthy_female_folder = "patho_f"

# Read audio files from folders and assign labels
healthy_male_files = [os.path.join(healthy_male_folder, file) for file in os.listdir(healthy_male_folder) if file.endswith(".wav")]
unhealthy_male_files = [os.path.join(unhealthy_male_folder, file) for file in os.listdir(unhealthy_male_folder) if file.endswith(".wav")]
healthy_female_files = [os.path.join(healthy_female_folder, file) for file in os.listdir(healthy_female_folder) if file.endswith(".wav")]
unhealthy_female_files = [os.path.join(unhealthy_female_folder, file) for file in os.listdir(unhealthy_female_folder) if file.endswith(".wav")]

# Assign labels
healthy_male_labels = [1] * len(healthy_male_files)
unhealthy_male_labels = [0] * len(unhealthy_male_files)
healthy_female_labels = [1] * len(healthy_female_files)
unhealthy_female_labels = [0] * len(unhealthy_female_files)

# Convert lists to numpy arrays
X_male_list = [list(extract_voice_features(file).values()) for file in healthy_male_files + unhealthy_male_files]
X_female_list = [list(extract_voice_features(file).values()) for file in healthy_female_files + unhealthy_female_files]

# Convert lists to numpy arrays and ensure numeric data type
X_male = np.array(X_male_list, dtype=np.float64)
X_female = np.array(X_female_list, dtype=np.float64)

# Combine labels for male and female
y_male = np.concatenate([healthy_male_labels, unhealthy_male_labels])
y_female = np.concatenate([healthy_female_labels, unhealthy_female_labels])

# Check if there are at least 2 classes in the male dataset
if len(np.unique(y_male)) < 2:
    raise ValueError("Not enough classes in the male dataset. Ensure a balanced distribution.")

# Check if there are at least 2 classes in the female dataset
if len(np.unique(y_female)) < 2:
    raise ValueError("Not enough classes in the female dataset. Ensure a balanced distribution.")

# Split the data into male and female sets
X_train_male, X_test_male, y_train_male, y_test_male = train_test_split(X_male, y_male, test_size=0.3, random_state=42)
X_train_female, X_test_female, y_train_female, y_test_female = train_test_split(X_female, y_female, test_size=0.3, random_state=42)

# Initialize Support Vector Machines models for male and female
model_male, scaler_male = train_model(X_train_male, y_train_male)
model_female, scaler_female = train_model(X_train_female, y_train_female)

# Test the models on the test set
accuracy_male, _, _, _ = test_model(model_male, X_test_male, y_test_male, scaler_male, 'male')
accuracy_female, _, _, _ = test_model(model_female, X_test_female, y_test_female, scaler_female, 'female')

# Print performance metrics for male model
print("\nMale Model Train Accuracy:", model_male.score(scaler_male.transform(X_train_male), y_train_male))
print("Male Model Test Accuracy:", accuracy_male)
print("Confusion Matrix (Male Model):\n", confusion_matrix(y_test_male, model_male.predict(scaler_male.transform(X_test_male))))
print("Sensitivity (True Positive Rate) - Male Model:", recall_score(y_test_male, model_male.predict(scaler_male.transform(X_test_male)), pos_label=1))

# Print performance metrics for female model
print("\nFemale Model Train Accuracy:", model_female.score(scaler_female.transform(X_train_female), y_train_female))
print("Female Model Test Accuracy:", accuracy_female)
print("Confusion Matrix (Female Model):\n", confusion_matrix(y_test_female, model_female.predict(scaler_female.transform(X_test_female))))
print("Sensitivity (True Positive Rate) - Female Model:", recall_score(y_test_female, model_female.predict(scaler_female.transform(X_test_female)), pos_label=1))

# Save the models and scalers for male and female
save_model(model_male, scaler_male, 'model_svm_male.pkl', 'scaler_male.pkl')
save_model(model_female, scaler_female, 'model_svm_female.pkl', 'scaler_female.pkl')

# Plot decision boundaries for the combined dataset
features = ['pitch_period', 'formant1', 'formant2', 'mfcc_mean', 'mfcc_var']
plot_decision_boundaries(X_male, y_male, model_male, scaler_male, features, 'male')
plot_decision_boundaries(X_female, y_female, model_female, scaler_female, features, 'female')
