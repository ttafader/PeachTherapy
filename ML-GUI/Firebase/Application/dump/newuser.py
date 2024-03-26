def createaccfunction(self):
        email = self.email.text()
        first_name = self.firstname.text()
        last_name = self.lastname.text()
        clinic = self.clinic.text()

        if self.password.text() == self.confirmpass.text():
            password = self.password.text()
            try:
                auth_data = auth.create_user_with_email_and_password(email, password)
                user_id = auth_data['localId']  # Extract the user ID from the authentication data

                # Write user info to the 'doctors -> profile' node in Firebase
                doctor_ref = db.reference('doctors').child(user_id).child('profile')
                doctor_ref.set({
                    "first_name": first_name,
                    "last_name": last_name,
                    "clinic": clinic,
                    "email": email,
                    "user_type" : 1
                })

                self.accept()  # Close the dialog if account creation successful
                self.account_created.emit()  # Emit the signal
            except Exception as e:
                self.failed.setVisible(True)
                print(e)