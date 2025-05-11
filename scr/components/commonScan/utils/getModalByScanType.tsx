// utils/scan/getModalByScanType.tsx
import React from 'react';

import { ScanType } from '../types/scan';
import CommentModal from '../../../screens/partner/scan/CommentModal';

export const getModalByScanType = ({
  scanType,
  props,
}: {
  scanType: ScanType;
  props: any;
}) => {
  switch (scanType) {
    case ScanType.Partner:
      return <CommentModal {...props} />;
    case ScanType.Main:
      return <CommentModal {...props} />;
    default:
      return null;
  }
};
