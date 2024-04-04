import json

# Open the JSON file and load the credentials
with open('twiliocredentials.json', 'r') as file:
    twilio_credentials = json.load(file)

# Extract the account SID and auth token
account_sid = twilio_credentials['account_sid']
auth_token = twilio_credentials['auth_token']

# Print the extracted credentials
print(account_sid, auth_token)
