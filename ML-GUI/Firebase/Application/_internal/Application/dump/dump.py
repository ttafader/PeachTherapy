def populate_patient_profiles(self):
        # Retrieve patient data from Firebase
        user = auth.current_user
        if user:
            user_id = user['localId']
            doctor_patients_ref = db.reference('doctors').child(user_id).child('patients')
            patient_ids = doctor_patients_ref.get()

            # Get the existing scroll area widget named patient_profile_layout from ui
            patient_profile_layout_widget = self.ui.patient_profile_layout

            # Ensure patient_profile_layout_widget is a QScrollArea
            if isinstance(patient_profile_layout_widget, QScrollArea):
                # Get the widget inside the scroll area
                scroll_patients = patient_profile_layout_widget.widget()
                # Ensure rec_scroll_widget has a grid layout
                if isinstance(scroll_patients.layout(), QGridLayout()):
                    patient_profile_layout = scroll_patients.layout()
                else:
                    patient_profile_layout = QGridLayout()
                    scroll_patients.setLayout(patient_profile_layout)
            else:
                print("patient_profile_layout_widget is not a QScrollArea.")
                return

            if patient_ids:
                num_columns = 3
                num_patients = len(patient_ids)
                num_rows = (num_patients + num_columns - 1) // num_columns  # Calculate number of rows needed

                for idx, patient_id in enumerate(patient_ids):
                    row = idx // num_columns
                    col = idx % num_columns

                    patient_data_ref = db.reference('patients').child(patient_id).child('profile')
                    patient_data = patient_data_ref.get()
                    if patient_data:
                        # Construct patient's full name
                        full_name = f"{patient_data.get('first_name', '')} {patient_data.get('last_name', '')}"

                        # Create a profile card widget for the patient
                        profile_card = self.create_profile_card(full_name, patient_id)

                        # Add the profile card to the layout of the first page
                        scroll_patients.addWidget(profile_card, row, col)
                    else:
                        print(f"No data found for patient ID {patient_id} in the 'patients' node.")

                # Add empty widgets to fill remaining space in the grid
                for idx in range(num_rows * num_columns - num_patients):
                    row = num_patients // num_columns + idx // num_columns
                    col = num_patients % num_columns + idx % num_columns

                    empty_widget = QtWidgets.QWidget()
                    scroll_patients.addWidget(empty_widget, row, col)
            else:
                # No patients found for the doctor
                self.ui.nopatients.setVisible(True)

            # Set vertical scrollbar policy
            patient_profile_layout_widget.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
            # Set stylesheet for the vertical scrollbar
            patient_profile_layout_widget.verticalScrollBar().setStyleSheet(
                """
                /* Set styling for the vertical scrollbar */
                QScrollBar:vertical {
                    border: none;
                    width: 14px;
                    margin: 15px 0 15px 0;
                    border-radius: 0px;
                }
                /* Set styling for the handle bar */
                QScrollBar::handle:vertical {    
                    background-color: rgb(255, 163, 134);
                    min-height: 30px;
                    border-radius: 7px;
                }
                QScrollBar::handle:vertical:hover {    
                    background-color: rgb(229, 226, 218);
                }
                QScrollBar::handle:vertical:pressed {    
                    background-color: rgb(229, 226, 218);
                }
                /* Set styling for the top button */
                QScrollBar::sub-line:vertical {
                    border: none;
                    background-color: rgb(255, 163, 134);
                    height: 15px;
                    border-top-left-radius: 7px;
                    border-top-right-radius: 7px;
                    subcontrol-position: top;
                    subcontrol-origin: margin;
                }
                QScrollBar::sub-line:vertical:hover {    
                    background-color: rgb(255, 163, 134);
                }
                QScrollBar::sub-line:vertical:pressed {    
                    background-color: rgb(185, 0, 92);
                }
                /* Set styling for the bottom button */
                QScrollBar::add-line:vertical {
                    border: none;
                    background-color: rgb(255, 163, 134);
                    height: 15px;
                    border-bottom-left-radius: 7px;
                    border-bottom-right-radius: 7px;
                    subcontrol-position: bottom;
                    subcontrol-origin: margin;
                }
                QScrollBar::add-line:vertical:hover {    
                    background-color: rgb(255, 0, 127);
                }
                QScrollBar::add-line:vertical:pressed {    
                    background-color: rgb(185, 0, 92);
                }
                """
            )