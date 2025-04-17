import Toast from 'react-native-toast-message';

export const showErrorToast = (title = 'Oops!', message = 'Une erreur est survenue') => {
    Toast.show({
        type: 'customError',
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000,
    });
};

export const showSuccessToast = (title = 'Succès', message = '') => {
    Toast.show({
        type: 'customSuccess',
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 3000,
    });
};
