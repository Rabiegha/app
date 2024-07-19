import {StyleSheet} from 'react-native';
import colors from '../../../colors/colors';

const globalStyle = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: 'white',
    flex: 1,
  },
  backgroundBlack: {
    backgroundColor: colors.darkGrey,
    flex: 1,
  },
  container: {
    paddingTop: 70,
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    width: '100%',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    paddingBottom: 20,
    paddingTop: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.grey,
    height: 62,
  },
});

export default globalStyle;
