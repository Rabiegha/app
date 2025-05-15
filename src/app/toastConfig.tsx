import React from 'react';
import SuccessToast from '../components/elements/toasts/SuccessToast';
import ErrorToast from '../components/elements/toasts/ErrorToast';

export const toastConfig = {
  customError: ErrorToast,
  customSuccess: SuccessToast,
};
