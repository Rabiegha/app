import {Platform, StyleSheet} from 'react-native';

import colors from '../colors/colors';

const globalStyle = StyleSheet.create({
  backgroundBlack: {
    backgroundColor: colors.darkGrey,
    flex: 1,
  },
  backgroundWhite: {
    backgroundColor: colors.white,
    flex: 1,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
  },
  input: {
    backgroundColor: colors.greyCream,
    borderColor: colors.grey,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.darkGrey,
    fontSize: 15,
    height: Platform.OS === 'ios' ? 55 : 50,
    lineHeight: Platform.OS === 'ios' ? undefined : 20,
    marginTop: 10,
    padding: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 15,
    textAlignVertical: 'center',
    width: '100%',
  },
});

export default globalStyle;
