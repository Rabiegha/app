export const handleApiSuccess = (response, fallbackMessage = 'An unexpected error occurred') => {
    if(!response.data  || response.data.status === false ) {
        if(__DEV__){
            console.log('Full API response:', response.data);
        }

        const message = response.data?.message || fallbackMessage;
        throw new Error(message);
    }

    return response.data;
};
