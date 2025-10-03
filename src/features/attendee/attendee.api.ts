import { handleApiError } from '../../utils/api/handleApiError';
import { cleanParams } from '../../utils/api/cleanParams';
import mainApi from '../../config/mainApi';
import { BASE_URL } from '../../config/config';

import { 
  Attendee, 
  FetchAttendeesParams, 
  UpdateAttendeeStatusParams,
  UpdateAttendeeStatusResponse,
  UpdateAttendeeFieldParams,
  AddAttendeeData,
  EditAttendeeData,
  PartnerAttendee,
  FetchPartnerAttendeesParams
} from './attendee.types';

import { handleApiSuccess } from '@/utils/api/handleApiSuccess';

/**
 * Fetch attendees list with optional filtering
 */
export const fetchAttendees = async ({
  userId,
  eventId,
  attendeeId,
  attendeeStatus
}: FetchAttendeesParams): Promise<Attendee[]> => {
  try {
    // Validate required parameters
    if (!userId) {
      console.warn('Missing userId in fetchAttendees');
    }
    if (!eventId) {
      console.warn('Missing eventId in fetchAttendees');
    }
    if (!attendeeId) {
      console.warn('Missing attendeeId in fetchAttendees');
    }

    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
      attendee_status: attendeeStatus
    });
    
    console.log('Params sent to API:', params);
    console.log('Full API URL:', `${BASE_URL}/ajax_get_event_attendee_details/?current_user_login_details_id=${userId}&event_id=${eventId}&attendee_id=${attendeeId}`);

    // Add a timeout to ensure the request doesn't hang
    const response = await mainApi.get('/ajax_get_event_attendee_details/', { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data) {
      console.error('No data received from API');
      return [];
    }

    if (!response.data.event_attendee_details) {
      console.error('No event_attendee_details in response');
      return [];
    }

    if (!Array.isArray(response.data.event_attendee_details)) {
      console.error('event_attendee_details is not an array');
      return [];
    }

    if (response.data.event_attendee_details.length === 0) {
      console.warn('Empty attendee list returned');
    } else {
      console.log('Attendee list received from API:', response.data.event_attendee_details);
    }

    return response.data.event_attendee_details;
  } catch (error) {
    console.error('Error in fetchAttendees:', error);
    handleApiError(error, 'Failed to fetch event attendee list');
    return []; 
  }
};

/**
 * Update attendee status (check-in/check-out)
 */
export const updateAttendeeStatus = async ({
  userId,
  eventId,
  attendeeId,
  status
}: UpdateAttendeeStatusParams): Promise<UpdateAttendeeStatusResponse> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
      attendee_status: status,
    });

    const response = await mainApi.post(
      '/update_event_attendee_attendee_status/',
      null,
      { params }
    );

    if (__DEV__) {
      console.log('Params sent to API:', params);
      if (response.data?.status === true) {
        console.log('Attendee status updated successfully');
      }
    }

    return response.data;
    
  } catch (error) {
    handleApiError(error, 'Failed to update attendee status');
    throw error;
  }
};

/**
 * Update a specific field for an attendee
 */
export const updateAttendeeField = async ({
  userId,
  attendeeId,
  field,
  value
}: UpdateAttendeeFieldParams): Promise<boolean> => {
  try {
    const params = cleanParams({
      current_user_login_details_id: userId,
      attendee_id: attendeeId,
      generate_badge: 1,
      [field]: value
    });

    const response = await mainApi.post(
      '/ajax_update_attendee/',
      null,
      { params }
    );

    if (__DEV__) {
        console.log('Params sent to API:', params);
      }

    return response.data?.status === true;
  } catch (error) {
    handleApiError(error, 'Failed to update attendee field');
    throw error;
  }
};

/**
 * Map API attendee data to frontend display format
 */
export const mapAttendeeToDetails = (attendee: Attendee) => {
  // Use the nice formatted date if available, otherwise format the raw date
  let formattedDate = '-';
  if (attendee.attendee_status === 1) {
    if (attendee.nice_attendee_status_change_datetime && 
        attendee.nice_attendee_status_change_datetime !== '-') {
      // Clean up the format from API which has escaped slashes and extra spaces
      // Example: "18\/05\/2025 02:57 AM" -> "18/05/2025 02:57 AM"
      let cleanedDate = attendee.nice_attendee_status_change_datetime;
      
      // Replace escaped slashes with normal slashes
      cleanedDate = cleanedDate.split('/').join('/');
      
      // Fix any extra spaces
      cleanedDate = cleanedDate.trim();
      
      // Use the cleaned date
      formattedDate = cleanedDate;
    } else if (attendee.attendee_status_change_datetime) {
      try {

        
        // Only try to parse if it's not the default "0000-00-00 00:00:00" format
        if (attendee.attendee_status_change_datetime !== '0000-00-00 00:00:00') {
          const date = new Date(attendee.attendee_status_change_datetime);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('fr-FR');
          }
        }
      } catch (e) {
        console.warn('Error formatting date:', e);
      }
    }
  }

  // Use attendeeStatus as a number (0 or 1)
  const attendeeStatus: number = attendee.attendee_status === 1 ? 1 : 0;
  
  return {
    type: attendee.attendee_type_name || '',
    lastName: attendee.last_name,
    firstName: attendee.first_name,
    email: attendee.email || '',
    phone: attendee.phone || '',
    organization: attendee.organization || '',
    jobTitle: attendee.designation || '',
    theAttendeeId: String(attendee.id),
    commentaire: attendee.comment || '',
    attendeeStatusChangeDatetime: formattedDate,
    attendeeStatus,
    urlBadgePdf: attendee.badge_pdf_url || '',
    urlBadgeImage: attendee.badge_image_url || '',
  };
};


//attende edit 


export const editAttendee = async (attendeeData: EditAttendeeData) => {
  try {
    const params = cleanParams({
      current_user_login_details_id: attendeeData.userId,
      attendee_id: attendeeData.attendeeId,
      first_name: attendeeData.first_name,
      last_name: attendeeData.last_name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      organization: attendeeData.organization,
      designation: attendeeData.jobTitle,
      attendee_type_id: attendeeData.typeId,
      generate_badge: 1,
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await mainApi.post(
      '/ajax_update_attendee/',
      null,
      { params }
    );

    return handleApiSuccess(response, 'Failed to edit attendee');
  } catch (error) {
    throw handleApiError(error, 'Failed to edit attendee');
  }
};


//attendee add

export const addAttendee = async (attendeeData: AddAttendeeData) => {
  try {
    // Champs obligatoires
    const {
      current_user_login_details_id,
      ems_secret_code,
    } = attendeeData;

    if (!current_user_login_details_id || !ems_secret_code) {
      throw new Error('Missing required fields: user ID or secret code');
    }

    // Tous les paramètres
    const params = cleanParams({
      current_user_login_details_id,
      ems_secret_code,
      attendee_type_id: attendeeData.attendee_type_id,
      salutation: attendeeData.salutation,
      first_name: attendeeData.first_name,
      last_name: attendeeData.last_name,
      email: attendeeData.email,
      phone: attendeeData.phone,
      organization: attendeeData.organization,
      designation: attendeeData.jobTitle,
      postal_address: attendeeData.postal_address,
      status_id: attendeeData.status_id,
      attendee_status: attendeeData.attendee_status,

      // Options supplémentaires
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 1,
      send_badge_yn: 0,
      send_badge_item: '',
    });

    if (__DEV__) {
      console.log('Params sent to API:', params);
    }

    const response = await mainApi.post(
      '/add_attendee/',
      null,
      { params: params }
    );

    return handleApiSuccess(response, 'Failed to add attendee');
  } catch (error) {
    handleApiError(error, 'Failed to add attendee');
  }
};

/**
 * Fetch all partner attendees for an event
 */
export const fetchPartnerAttendeesList = async ({
  userId,
  eventId
}: Omit<FetchPartnerAttendeesParams, 'attendeeId'>): Promise<PartnerAttendee[]> => {
  try {
    // Validate required parameters
    if (!userId) {
      throw new Error('Missing userId in fetchPartnerAttendeesList');
    }
    if (!eventId) {
      throw new Error('Missing eventId in fetchPartnerAttendeesList');
    }

    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      // attendee_id est omis pour récupérer toute la liste
    });
    
    if (__DEV__) {
      console.log('Fetching partner attendees list with params:', params);
      console.log('Full API URL:', `${BASE_URL}/ajax_get_event_partner_attendee_details/?current_user_login_details_id=${userId}&event_id=${eventId}`);
    }

    const response = await mainApi.get('/ajax_get_event_partner_attendee_details/', { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data) {
      console.error('No data received from partner attendees API');
      return [];
    }

    if (!response.data.status) {
      console.error('API returned status false:', response.data);
      return [];
    }

    if (!Array.isArray(response.data.data)) {
      console.error('Partner attendees data is not an array:', response.data);
      return [];
    }

    if (__DEV__) {
      console.log(`Partner attendees list received: ${response.data.data.length} items`);
    }

    return response.data.data;
  } catch (error) {
    console.error('Error in fetchPartnerAttendeesList:', error);
    handleApiError(error, 'Failed to fetch partner attendees list');
    return []; 
  }
};

/**
 * Fetch specific partner attendee details
 */
export const fetchPartnerAttendeeDetails = async ({
  userId,
  eventId,
  attendeeId
}: FetchPartnerAttendeesParams): Promise<PartnerAttendee | null> => {
  try {
    // Validate required parameters
    if (!userId) {
      throw new Error('Missing userId in fetchPartnerAttendeeDetails');
    }
    if (!eventId) {
      throw new Error('Missing eventId in fetchPartnerAttendeeDetails');
    }
    if (!attendeeId) {
      throw new Error('Missing attendeeId in fetchPartnerAttendeeDetails');
    }

    const params = cleanParams({
      current_user_login_details_id: userId,
      event_id: eventId,
      attendee_id: attendeeId,
    });
    
    if (__DEV__) {
      console.log('Fetching partner attendee details with params:', params);
      console.log('Full API URL:', `${BASE_URL}/ajax_get_event_partner_attendee_details/?current_user_login_details_id=${userId}&event_id=${eventId}&attendee_id=${attendeeId}`);
    }

    const response = await mainApi.get('/ajax_get_event_partner_attendee_details/', { 
      params,
      timeout: 10000 // 10 second timeout
    });

    if (!response.data) {
      console.error('No data received from partner attendee details API');
      return null;
    }

    if (!response.data.status) {
      console.error('API returned status false:', response.data);
      return null;
    }

    if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
      console.warn('No partner attendee details found for attendeeId:', attendeeId);
      return null;
    }

    // Retourne le premier élément car on cherche un attendee spécifique
    const attendeeDetails = response.data.data[0];
    
    if (__DEV__) {
      console.log('Partner attendee details received:', attendeeDetails);
    }

    return attendeeDetails;
  } catch (error) {
    console.error('Error in fetchPartnerAttendeeDetails:', error);
    handleApiError(error, 'Failed to fetch partner attendee details');
    return null; 
  }
};

/**
 * Map partner attendee data to frontend display format
 */
export const mapPartnerAttendeeToDetails = (partnerAttendee: PartnerAttendee) => {
  return {
    id: partnerAttendee.id,
    attendeeId: partnerAttendee.attendee_id,
    eventId: partnerAttendee.event_id,
    eventName: partnerAttendee.event_name,
    eventTypeName: partnerAttendee.event_type_name,
    firstName: partnerAttendee.first_name,
    lastName: partnerAttendee.last_name,
    fullName: partnerAttendee.attendee_name,
    email: partnerAttendee.email,
    phone: partnerAttendee.phone || '',
    organization: partnerAttendee.organization,
    jobTitle: partnerAttendee.designation,
    attendeeTypeName: partnerAttendee.attendee_type_name,
    partnerName: partnerAttendee.partner_name,
    partnerEmail: partnerAttendee.partner_email,
    partnerCompanyName: partnerAttendee.partner_company_name,
    partnerUserTypeName: partnerAttendee.partner_user_type_name,
    comment: partnerAttendee.comment || '',
    createdOn: partnerAttendee.nice_created_on,
    createdBy: partnerAttendee.created_by,
  };
};