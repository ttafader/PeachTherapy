import os
import sys
import parselmouth
import numpy as np
import joblib  
import librosa
import json

os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
import pygame

from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

# Extract recording name from command-line arguments
new_voice_file = sys.argv[1]

# Initialize Pygame mixer
pygame.mixer.init()

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

# Function to play audio file using Pygame
def play_audio_file(audio_file):
    pygame.mixer.music.load(audio_file)
    pygame.mixer.music.play()

    # Wait for the audio to finish playing
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

# Load the models and scalers during testing
model = joblib.load('model_svm_folded.pkl')
scaler = joblib.load('scaler_folded.pkl')

# Extract features from the new voice recording
new_features = extract_voice_features(new_voice_file)
new_features = np.nan_to_num(new_features)

# Convert the dictionary to a JSON serializable format
new_features_serializable = {key: float(value) for key, value in new_features.items()}

# Convert the dictionary to a 2D array
new_features_array = np.array([list(new_features.values())])

# IMPORTANT: Use the same scaler that was used during training
new_features_scaled = scaler.transform(new_features_array)

# Make a prediction using the selected model
prediction_probability = model.predict_proba(new_features_scaled)

# Output the probability of pathology

# Output the probability of pathology along with the features
#result = f"Prediction Probability: {prediction_probability[0][1] * 100:.2f}%\nFeatures: {new_features}"

result = {
    "prediction_probability": "{:.2f}".format(prediction_probability[0][1] * 100),
    "features": new_features_serializable
}

# Play the new voice recording
print(json.dumps(result))

# When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow