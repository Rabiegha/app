import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import Icons from '@/assets/images/icons';
import FailComponent from '../elements/notifications/FailComponent';
import LargeButton from '../elements/buttons/LargeButton';
import { AuthContext } from '../../context/AuthContext';
import { ConnexionComponentProps } from './ConnexionComponent.types';

/**
 * Component for user login screen
 */
const ConnexionComponent: React.FC<ConnexionComponentProps> = ({
  userName,
  password,
  setUserName,
  setPassword,
  handleLogin,
  style,
}) => {
  // State for toggling password visibility and tracking login success
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {/* {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={"Mot de passe ou nom d'utilisateur incorrect"}
        />
      )} */}
      <TextInput
        style={globalStyle.input}
        placeholder="Nom d'utilisateur"
        value={userName}
        onChangeText={setUserName}
        placeholderTextColor={colors.grey}
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[globalStyle.input, styles.passwordInput]}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={colors.grey}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? Icons.PasVu : Icons.Vu}
            style={styles.togglePasswordIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', width: '100%'}}>
        <LargeButton
          title="Connexion"
          onPress={handleLogin}
          backgroundColor={colors.green}
          loading={false}
        />
      </View>
    </ScrollView>
  );
};

/**
 * Styles for the ConnexionComponent
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  passwordInputContainer: ViewStyle;
  passwordInput: ViewStyle;
  togglePasswordButton: ViewStyle;
  togglePasswordIcon: ImageStyle;
}>({
  container: {
    flexGrow: 1,
    padding: 20,
    width: '100%',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  togglePasswordButton: {
    position: 'absolute',
    right: 0,
    top: 10,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  togglePasswordIcon: {
    width: 20,
    height: 20,
    tintColor: colors.green,
  },
});

export default ConnexionComponent;
