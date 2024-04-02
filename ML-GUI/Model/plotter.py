import numpy as np
import matplotlib.pyplot as plt
import joblib

# Load scale values and PCA model
scale_data = np.load('plot_axis_limits.npz')
xmin, xmax = scale_data['xlim']
ymin, ymax = scale_data['ylim']

# Load PCA model
saved_data = np.load('plot_info.npz', allow_pickle=True)
coef = saved_data['coef']
intercept = saved_data['intercept']
print(intercept)
colors = ['#78D6D9', '#FFA386']

# Load scaler
scaler = joblib.load('scaler_70_30.pkl')

# Define new MFCC and pitch period values
new_pitch_period = 0.0053018283110458815
new_mfcc = 11632.068359375


# Create new data array with only 'pitch_period' and 'mfcc_var', setting other features to 0
new_data = np.array([[new_pitch_period, 0, 0, 0, new_mfcc]])  # Assuming there are 5 features in total

# Scale and transform new data using the loaded scaler
scaled_new_data = scaler.transform(new_data)

# Plot the decision boundary
fig, ax = plt.subplots(figsize=(8, 6))

# Plot decision boundary using coefficients and intercept
x_decision = np.linspace(xmin, xmax, 100)
y_decision = (-coef[0] * x_decision - intercept) / coef[1]
ax.plot(x_decision, y_decision, color=colors[0], label='Decision Boundary')

# Plot new data points after transformation
ax.scatter(scaled_new_data[:, 0], scaled_new_data[:, 1], color='red', label='New Data')

# Set axis labels and limits
ax.set_xlabel('PCA Component 1')
ax.set_ylabel('PCA Component 2')

# Add title and legend
ax.set_title('Decision Boundary with New Data Transformed by PCA')
ax.legend()

plt.tight_layout()
plt.show()
