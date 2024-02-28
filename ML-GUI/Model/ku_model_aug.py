import librosa
import soundfile as sf
import numpy as np
import os

def pitch_up(audio_path, output_path):
    y, sr = librosa.load(audio_path, sr=None, mono=True)

    # Ensure the input signal is mono (1D array)
    if y.ndim > 1:
        y = np.mean(y, axis=0)

    # Create pitched up version
    y_pitch_up = librosa.effects.pitch_shift(y, sr=sr, n_steps=2)

    # Save pitched up audio using soundfile
    sf.write(output_path, y_pitch_up, sr)

def pitch_down(audio_path, output_path):
    y, sr = librosa.load(audio_path, sr=None, mono=True)

    # Ensure the input signal is mono (1D array)
    if y.ndim > 1:
        y = np.mean(y, axis=0)

    # Create pitched down version
    y_pitch_down = librosa.effects.pitch_shift(y, sr=sr, n_steps=-2)

    # Save pitched down audio using soundfile
    sf.write(output_path, y_pitch_down, sr)

def add_noise(audio_path, output_path, noise_level=0.005):
    y, sr = librosa.load(audio_path, sr=None)
    
    # Generate random noise
    noise = np.random.normal(0, noise_level, len(y))
    
    # Add noise to the audio
    noisy_audio = y + noise

    # Save the noisy audio using soundfile
    sf.write(output_path, noisy_audio, sr)

def create_variations(input_file, output_folder):
    file_name, file_extension = os.path.splitext(os.path.basename(input_file))
    pitched_up_file = os.path.join(output_folder, f"{file_name}_pitched_up{file_extension}")
    pitched_down_file = os.path.join(output_folder, f"{file_name}_pitched_down{file_extension}")
    noisy_file = os.path.join(output_folder, f"{file_name}_noisy{file_extension}")

    pitch_up(input_file, pitched_up_file)
    pitch_down(input_file, pitched_down_file)
    add_noise(input_file, noisy_file)

if __name__ == "__main__":
    # Directory paths
    folder = "patho"

    # Process healthy files
    for file in os.listdir(folder):
        if file.endswith(".wav"):
            input_audio_file = os.path.join(folder, file)
            create_variations(input_audio_file, folder)

    print("Variations created and saved successfully.")
