import { ScanType } from "../components/commonScan/types/scan";


export type RootStackParamList = {
  // Screens accessibles via navigation
  ScanScreen: { scanType: ScanType };
  // Ajoute ici tous les autres écrans avec params
  EventDetails: { eventId: string };
  // ...
};
