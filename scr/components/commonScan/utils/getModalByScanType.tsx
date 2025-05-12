import React from 'react';
import { ScanType } from '../types/scan';
import CommentModal from '../../../screens/partner/scan/CommentModal';
import DetailsModal from '../../elements/modals/DetailsModal';
import CheckinPrintModal from '../../elements/modals/CheckinPrintModal';

type Props = {
  scanType: ScanType;
  props: any;
  isButtonActive?: boolean;
};

export const getModalByScanType = ({ scanType, props, isButtonActive }: Props) => {
  switch (scanType) {
    case ScanType.Partner:
      return <CommentModal {...props} />;

    case ScanType.Main:
      return isButtonActive ? (
        <DetailsModal {...props} />
      ) : (
        <CheckinPrintModal
          status={props.status}
          onClose={props.onClosePrintModal}
          visible={true} // même si ça ne sert plus
        />
      );

    default:
      return null;
  }
};
