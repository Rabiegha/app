// Define the attendee type interface
interface Attendee {
  comment?: string;
  email?: string;
  organization?: string;
  jobTitle?: string;
  designation?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

// Define the field config type to make it indexable with string keys
interface FieldConfig {
  label: string;
  fieldName: string;
  accessor: (a: Attendee) => string;
}

// Define the type for the entire config object
interface AttendeeFieldConfigType {
  [key: string]: FieldConfig;
}

export const attendeeFieldConfig: AttendeeFieldConfigType = {
  comment: {
    label: 'Commentaire',
    fieldName: 'comment', //
    accessor: (a: Attendee) => a.comment || '',
  },
  email: {
    label: 'Adresse mail',
    fieldName: 'email',
    accessor: (a: Attendee) => a.email || '',
  },
  organization: {
    label: 'Entreprise',
    fieldName: 'organization',
    accessor: (a: Attendee) => a.organization || '',
  },
  jobTitle: {
    label: 'Job Title',
    fieldName: 'designation', // this must match API field (e.g., `designation`)
    accessor: (a: Attendee) => a.jobTitle || '',
  },
  phone: {
    label: 'Téléphone',
    fieldName: 'phone',
    accessor: (a: Attendee) => a.phone || '',
  },
  firstName: {
    label: 'Prénom',
    fieldName: 'firstName',
    accessor: (a: Attendee) => a.firstName || '',
  },
  lastName: {
    label: 'Nom',
    fieldName: 'lastName',
    accessor: (a: Attendee) => a.lastName || '',
  },
};