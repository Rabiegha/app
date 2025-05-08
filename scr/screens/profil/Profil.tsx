import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import colors from '../../assets/colors/colors';
import userIcon from '../../assets/images/user.png';
import LogoutIcon from '../../assets/images/icons/Log-out.png';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../redux/selectors/auth/authSelectors';
import MainHeader from '../../components/elements/header/MainHeader';
import { logoutThunk } from '../../redux/thunks/auth/logoutThunk';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ onLogout }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const handleLogOut = async () => {
        await dispatch(logoutThunk()).unwrap();
        navigation.reset({ index: 0, routes: [{ name: 'Connexion' }] });

      };

  const userInfo = useSelector(selectUserInfo);

  const name = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim();
  const email = userInfo?.email || '-';
  const role = userInfo?.user_type_name || '-';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', onPress: onLogout },
    ]);
  };

  const goBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
        <MainHeader onLeftPress={goBack} title={'Profil'} onRightPress={undefined}></MainHeader>
        <View style={styles.contentContainer}>

        <View style={styles.imageContainer}>
            <Image source={userIcon} style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
            <Text style={styles.label}>Nom:</Text>
            <Text style={styles.value}>{name || '-'}</Text>

            <Text style={styles.label}>Adresse mail:</Text>
            <Text style={styles.value}>{email}</Text>

            <Text style={styles.label}>Rôle:</Text>
            <Text style={styles.value}>{role}</Text>
        </View>

                {/* 
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
                <Image source={LogoutIcon} style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity> 
                */}

        </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: colors.darkGrey,
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 40,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 15,
    color: colors.darkGrey,
  },
  value: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  logoutButton: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});

export default ProfileScreen;
