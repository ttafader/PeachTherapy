import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { label: 'Text Notifications', value: '1' },
  { label: 'Email Notifications', value: '2' },
  { label: 'In-App Notifications', value: '3' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: '#24A8AC' }]}>

        </Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#24A8AC' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select Notification Preference' : '...'}
        searchPlaceholder="Search..."

        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      // renderLeftIcon={() => (
      //   <AntDesign
      //     style={styles.icon}
      //     color={isFocus ? '#24A8AC' : '#24A8AC'}
      //     name="Safety"
      //     size={20}
      //   />
      // )}
      />
    </SafeAreaView>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#24A8AC',
    paddingHorizontal: 8,
  },
  icon: {
    color: '#24A8AC',
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    color: '#24A8AC',
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#24A8AC',

  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#24A8AC',
  },
  iconStyle: {
    width: 20,
    color: '#24A8AC',
    height: 20,
  },
  inputSearchStyle: {
    color: '#24A8AC',
    height: 40,
    fontSize: 16,
  },
});