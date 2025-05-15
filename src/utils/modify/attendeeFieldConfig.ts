export const attendeeFieldConfig = {
    comment: {
      label: 'Commentaire',
      fieldName: 'comment', //
      accessor: (a) => a.comment || '',
    },
    email: {
      label: 'Adresse mail',
      fieldName: 'email',
      accessor: (a) => a.email || '',
    },
    organization: {
      label: 'Entreprise',
      fieldName: 'organization',
      accessor: (a) => a.organization || '',
    },
    jobTitle: {
      label: 'Job Title',
      fieldName: 'designation', // 🧠 this must match API field (e.g., `designation`)
      accessor: (a) => a.jobTitle || '',
    },
    phone: {
      label: 'Téléphone',
      fieldName: 'phone',
      accessor: (a) => a.phone || '',
    },
  };
  