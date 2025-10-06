import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import colors from '../../assets/colors/colors';
import userIcon from '../../assets/images/user.png';
import Icons from '../../assets/images/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { selectIsLoading, selectUserInfo } from '../../redux/selectors/auth/authSelectors';
import MainHeader from '../../components/elements/header/MainHeader';
import { logoutThunk } from '../../redux/thunks/auth/logoutThunk';
import { useNavigation, NavigationProp, ParamListBase, CommonActions } from '@react-navigation/native';
import LogOutButton from '@/components/elements/buttons/LogOutButton';
import LargeButton from '@/components/elements/buttons/LargeButton';

interface ProfileScreenProps {
    onLogout?: () => void;
}

const ProfileScreen = ({ onLogout }: ProfileScreenProps) => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const dispatch = useDispatch<AppDispatch>();
    const handleLogOut = async () => {
        await dispatch(logoutThunk()).unwrap();
        navigation.reset({ index: 0, routes: [{ name: 'Connexion' }] } as any);

      };


  const isLoading = useSelector(selectIsLoading);

  const userInfo = useSelector(selectUserInfo);

  const name = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim();
  const email = userInfo?.email || '-';
  const role = userInfo?.user_type_name || '-';

const handleLogout = async () => {
    try {
      // Show a confirmation dialog
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: async () => {
              try {
                // Use unwrap to properly handle async/await with createAsyncThunk
                await dispatch(logoutThunk()).unwrap();
                // Only navigate after successful logout
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Connexion'}],
                  }),
                );
              } catch (err) {
                // Handle logout error
                const errorMessage = err instanceof Error ? err.message : 'There was a problem logging out';
                Alert.alert('Logout Failed', errorMessage);
              }
            },
          },
        ],
        {cancelable: true},
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Logout error:', errorMessage);
    }
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
        </View>
        <View style={styles.buttonContainer}>
        <LargeButton 
            onPress={handleLogout}  
            title={'Se deconnecter'}
            backgroundColor={colors.red}
          />
        </View>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
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
  buttonContainer: {
    marginBottom: 80,
    marginHorizontal: 20,
  }
});

export default ProfileScreen;
