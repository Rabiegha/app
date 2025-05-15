import { AttendeeFieldConfig } from './attendeeFieldConfig.types';
import { AttendeeData } from '../../components/screens/MoreComponent.types';

/**
 * Configuration for attendee fields that can be modified
 */
export const attendeeFieldConfig: AttendeeFieldConfig = {
    comment: {
      label: 'Commentaire',
      fieldName: 'comment', //
      accessor: (a: AttendeeData): string => a.comment || '',
    },
    email: {
      label: 'Adresse mail',
      fieldName: 'email',
      accessor: (a: AttendeeData): string => a.email || '',
    },
    organization: {
      label: 'Entreprise',
      fieldName: 'organization',
      accessor: (a: AttendeeData): string => a.organization || '',
    },
    jobTitle: {
      label: 'Job Title',
      fieldName: 'designation', // 🧠 this must match API field (e.g., `designation`)
      accessor: (a: AttendeeData): string => a.jobTitle || '',
    },
    phone: {
      label: 'Téléphone',
      fieldName: 'phone',
      accessor: (a: AttendeeData): string => a.phone || '',
    },
  };
  