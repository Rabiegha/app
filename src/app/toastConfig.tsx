import React from 'react';

import SuccessToast from '../components/elements/toasts/SuccessToast';
import ErrorToast from '../components/elements/toasts/ErrorToast';

interface ToastProps {
  text1: string;
  text2?: string;
  key?: string;
  [propName: string]: unknown;
}

export const toastConfig = {
  customError: (props: ToastProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...restProps } = props;
    return <ErrorToast {...restProps} />;
  },
  customSuccess: (props: ToastProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...restProps } = props;
    return <SuccessToast {...restProps} />;
  },
};
