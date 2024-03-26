def populate_recordings(self, patient_id):
        # Retrieve patient data from Firebase
        user = auth.current_user
        if user:
            print("Patient ID:", patient_id)
            
            records_ref = db.reference('patients').child(patient_id).child('recordings')
            recordings = records_ref.get()
            print("Recordings node exists:", recordings is not None)

            # Get the existing scroll area widget named rec_layout from ui
            rec_page_layout_widget = self.ui.rec_layout

            # Ensure rec_page_layout_widget is a QScrollArea
            if isinstance(rec_page_layout_widget, QScrollArea):
                # Get the widget inside the scroll area
                rec_scroll_widget = rec_page_layout_widget.widget()
                # Ensure rec_scroll_widget has a vertical layout
                if isinstance(rec_scroll_widget.layout(), QVBoxLayout):
                    rec_page_layout = rec_scroll_widget.layout()
                else:
                    rec_page_layout = QVBoxLayout()
                    rec_scroll_widget.setLayout(rec_page_layout)
            else:
                print("rec_layout_widget is not a QScrollArea.")
                return

            # Clear existing layout
            while rec_page_layout.count():
                item = rec_page_layout.takeAt(0)
                widget = item.widget()
                if widget:
                    widget.deleteLater()

            # Check if recordings node exists and contains subnodes
            if recordings:
                print("Number of subnodes in recordings:", len(recordings))

                for recording_key, recording_data in recordings.items():
                    wav_url = recording_data.get("wav_url")
                    date = recording_data.get("date_label")
                    phrase = recording_data.get("phrase")
                    doctors_note = recording_data.get("doctor_note")
                    confidence = recording_data.get("confidence")


                    if wav_url:
                        print("WAV URL:", wav_url)
                        # Create an instance of AudioWidget for each recording
                        audio_widget = AudioWidget(wav_url, date, phrase, doctors_note, confidence)
                        # Add the AudioWidget to the layout
                        rec_page_layout.addWidget(audio_widget)
            else:
                print("No recordings found for the user.")
                self.ui.norec.setVisible(True)

            # Set vertical scrollbar policy
            rec_page_layout_widget.setVerticalScrollBarPolicy(Qt.ScrollBarAsNeeded)
            # Set stylesheet for the vertical scrollbar
            rec_page_layout_widget.verticalScrollBar().setStyleSheet(
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