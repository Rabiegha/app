import Toast from 'react-native-toast-message';

export const showToast = (type, title = 'Oops!', message = 'Une erreur est survenue') => {
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000,
    });
};
