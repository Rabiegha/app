import { scanAttendee } from "../../../services/scanAttendeeService";
import { ScanType } from "../types/scan";

export type HandleScanParams = {
  data: string;
  scanType: ScanType;
  userId: string;
  eventId: string;
  setAttendeeData: React.Dispatch<React.SetStateAction<any>>;
  setAttendeeName: React.Dispatch<React.SetStateAction<string>>;
  setScanStatus: React.Dispatch<React.SetStateAction<string>>;
  afterSuccess: (attendee: any) => Promise<void>;
  afterFailure: () => Promise<void>;

  // Ajoute les fonctions spécifiques utilisées dans le switch
  fetchCounts?: (id: string) => Promise<void>;
  setModalVisible?: (val: boolean) => void;
  setRefreshTrigger?: React.Dispatch<React.SetStateAction<number>>;
  resetScanner?: () => void;
  hasScanned?: React.MutableRefObject<boolean>;
};


export const handleScan = async ({
  data,
  userId,
  eventId,
  setScanStatus,
  setAttendeeData,
  setAttendeeName,
  afterSuccess,
  afterFailure,
}: HandleScanParams) => {
  try {
    const response = await scanAttendee(userId, eventId, data);
    console.log('dataSentToThe', data, userId , eventId)
    if (response.status === true) {
      const attendee = response.attendee_details;

      setAttendeeData({
        id: attendee?.attendee_id || 'N/A',
        name: attendee?.attendee_name || 'Unknown Attendee',
      });
      setAttendeeName(attendee?.attendee_name || 'Unknown');
      setScanStatus('found');

      await afterSuccess?.(attendee);
    } else {
      setScanStatus('not_found');
      await afterFailure?.();
    }
  } catch (error) {
    console.error('Error during scanning:', error);
    setScanStatus('not_found');
    await afterFailure?.();
  }
};
