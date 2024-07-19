// MenuListComponent.js
import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import colors from '../../../colors/colors';
import Acceder from '../../assets/images/icons/Acceder.png';

const MenuListComponent = ({ sections: initialSections }) => {
  const [sections, setSections] = useState(initialSections);
  return (
    <View>
      {sections.map((section, index) => (
        <View key={index} style={styles.container}>
          <Text style={styles.title}>{section.title}</Text>
          {section.buttons.map((button, buttonIndex) => (
            <TouchableOpacity
              key={buttonIndex}
              style={styles.button}
              onPress={button.action}>
              <Text style={styles.buttonText}>{button.title}</Text>
              <Image
                source={Acceder}
                resizeMode="contain"
                style={{
                  width: 10,
                  height: 10,
                  tintColor: colors.greyCream,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.darkerGrey,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.greyCream,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 13,
    color: '#000',
    color: colors.greyCream,
  },
});

export default MenuListComponent;
