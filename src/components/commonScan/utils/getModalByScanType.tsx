import React from 'react';
import { ScanType } from '../types/scan';
import CommentModal from '../../../screens/partner/scan/CommentModal';
import DetailsModal from '../../elements/modals/DetailsModal';
import CheckinPrintModal from '../../elements/modals/CheckinPrintModal';

type Props = {
  scanType: ScanType;
  props: any;
  isGiftModeActive?: boolean;
};

export const getModalByScanType = ({ scanType, props, isGiftModeActive }: Props) => {
  switch (scanType) {
    case ScanType.Partner:
      return <CommentModal {...props} />;

    case ScanType.Main:
      return isGiftModeActive ? (
        <DetailsModal {...props} />
      ) : (
        <CheckinPrintModal
          status={props.status}
          onClose={props.onClosePrintModal}
          visible={true}
        />
      );

    default:
      return null;
  }
};
