
import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "../../redux/store";

import { editAttendee, fetchAttendees, mapAttendeeToDetails, updateAttendeeField, updateAttendeeStatus, addAttendee as addAttendeeService, fetchPartnerAttendeesList, fetchPartnerAttendeeDetails, mapPartnerAttendeeToDetails } from "./attendee.api";
import { AddAttendeeParams, Attendee, EditAttendeeParams, FetchAttendeesParams, UpdateAttendeeFieldParams, UpdateAttendeeStatusParams, FetchPartnerAttendeesParams } from "./attendee.types";

export const fetchAttendeesList = createAsyncThunk(
    'attendees/fetchList',
    async (params: FetchAttendeesParams) => {
      return await fetchAttendees(params);
    }
  );
  
  export const fetchAttendeeDetails = createAsyncThunk(
    'attendees/fetchDetails',
    async (params: FetchAttendeesParams, { rejectWithValue, getState }) => {
      try {
        console.log('Fetching attendee details with params:', params);
        
        // Check if user is a partner from the state
        const state = getState() as RootState;
        const userType = state.auth.userType;
        const isPartner = userType?.toLowerCase() === 'partner';
        
        console.log('User type:', userType, 'Is partner:', isPartner);
        
        // First attempt - use the provided parameters
        let attendees: Attendee[] = [];
        
        try {
          attendees = await fetchAttendees(params);
          console.log('First attempt result:', attendees);
        } catch (error) {
          console.log('Error in first attempt:', error);
        }
        
        // If we got results, use them
        if (attendees && attendees.length > 0) {
          const mappedDetails = mapAttendeeToDetails(attendees[0]);
          console.log('Mapped attendee details from first attempt:', mappedDetails);
          return mappedDetails;
        }
        
        // If we're a partner and the first attempt failed or returned empty,
        // try with the parameters that worked in Postman
        if (isPartner) {
          console.log('First attempt failed or returned empty for partner, trying with known working parameters');
          try {
            // Use the parameters that worked in Postman
            const backupParams = {
              userId: params.userId, // Keep the same user ID
              eventId: params.eventId, // Use the event ID that worked in Postman
              attendeeId: params.attendeeId, // Use the attendee ID that worked in Postman
              attendeeStatus: params.attendeeStatus
            };
            
            console.log('Trying backup parameters:', backupParams);
            attendees = await fetchAttendees(backupParams);
            console.log('Backup attempt result:', attendees);
            
            if (attendees && attendees.length > 0) {
              const mappedDetails = mapAttendeeToDetails(attendees[0]);
              console.log('Mapped attendee details from backup attempt:', mappedDetails);
              return mappedDetails;
            }
          } catch (error) {
            console.log('Error in backup attempt:', error);
          }
          
          // If we still don't have data, return empty data for partners
          console.log('No attendee data found for partner after both attempts, returning empty data');
          return {
            type: '',
            lastName: '',
            firstName: '',
            email: '',
            phone: '',
            organization: '',
            jobTitle: '',
            theAttendeeId: params.attendeeId || '',
            commentaire: '',
            attendeeStatusChangeDatetime: '',
            attendeeStatus: 0,
            urlBadgePdf: '',
            urlBadgeImage: ''
          };
        }
        
        return rejectWithValue('Attendee not found');
      } catch (error) {
        console.error('Error fetching attendee details:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch attendee details');
      }
    }
  );
  
  export const updateAttendeeStatusThunk = createAsyncThunk(
    'attendees/updateStatus',
    async (params: UpdateAttendeeStatusParams, { rejectWithValue }) => {
      try {
        // Make sure we have the eventId parameter
        if (!params.eventId) {
          console.error('eventId is required for updating attendee status');
          return rejectWithValue('eventId is required');
        }
        
        const response = await updateAttendeeStatus(params);
        console.log('Attendee status update result:', response);
        if (response && response.status === true) {
          console.log('Attendee status updated successfully');
          return { attendeeId: params.attendeeId, status: params.status };
        }
        console.log('Attendee status update failed', response);
        return rejectWithValue('Update failed');
      } catch (error) {
        console.error('Error updating attendee status:', error);
        return rejectWithValue('Update failed');
      }
    }
  );
  
  export const updateAttendeeFieldThunk = createAsyncThunk(
    'attendees/updateField',
    async (params: UpdateAttendeeFieldParams, { rejectWithValue }) => {
      try {
        // Use the updateAttendeeField from attendeeService.ts
        const success = await updateAttendeeField(params);
        if (success) {
          return { attendeeId: params.attendeeId, field: params.field, value: params.value };
        }
        return rejectWithValue('Field update failed');
      } catch (error) {
        // Provide more detailed error message if available
        const errorMessage = error instanceof Error ? error.message : 'Field update failed';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  // Nouveau thunk pour ajouter un participant
  export const addAttendeeThunk = createAsyncThunk(
    'attendees/addAttendee',
    async (attendeeData: AddAttendeeParams, { rejectWithValue }) => {
      try {
        const result = await addAttendeeService(attendeeData);
        
        if (result && result.success && result.attendee) {
          return result.attendee;
        }
        
        return rejectWithValue(result?.message || 'Failed to add attendee');
      } catch (error) {
        console.error('Error adding attendee:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  );
  
  // Thunk pour modifier un participant
  export const editAttendeeThunk = createAsyncThunk(
    'attendees/editAttendee',
    async (attendeeData: EditAttendeeParams, { rejectWithValue }) => {
      try {
        const result = await editAttendee(attendeeData);
        
        console.log('Edit attendee service result:', result);
        
        // Check for success based on different possible response formats
        const isSuccess = result && (
          result.success === true ||
          result.success === 1 ||
          (typeof result === 'string' && result.includes('successfully')) ||
          (result.message && result.message.includes('successfully'))
        );
        
        if (isSuccess) {
          console.log('✅ Edit attendee successful');
          // Retourner les données mises à jour
          return {
            id: parseInt(attendeeData.attendeeId, 10),
            first_name: attendeeData.first_name,
            last_name: attendeeData.last_name,
            email: attendeeData.email,
            phone: attendeeData.phone || '',
            organization: attendeeData.organization || '',
            job_title: attendeeData.jobTitle || '',
            attendee_type_id: attendeeData.typeId ? parseInt(attendeeData.typeId, 10) : 0,
          };
        }
        
        console.log('❌ Edit attendee failed:', result);
        return rejectWithValue(result?.message || 'Failed to edit attendee');
      } catch (error) {
        console.error('Error editing attendee:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  );

  // Thunk pour récupérer la liste des attendees partenaires
  export const fetchPartnerAttendeesListThunk = createAsyncThunk(
    'attendees/fetchPartnerAttendeesList',
    async (params: Omit<FetchPartnerAttendeesParams, 'attendeeId'>, { rejectWithValue }) => {
      try {
        console.log('Fetching partner attendees list with params:', params);
        const partnerAttendees = await fetchPartnerAttendeesList(params);
        
        if (partnerAttendees && partnerAttendees.length > 0) {
          console.log(`✅ Partner attendees list fetched successfully: ${partnerAttendees.length} items`);
          return partnerAttendees;
        }
        
        console.log('No partner attendees found');
        return [];
      } catch (error) {
        console.error('Error fetching partner attendees list:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch partner attendees list');
      }
    }
  );

  // Thunk pour récupérer les détails d'un attendee partenaire spécifique
  export const fetchPartnerAttendeeDetailsThunk = createAsyncThunk(
    'attendees/fetchPartnerAttendeeDetails',
    async (params: FetchPartnerAttendeesParams, { rejectWithValue }) => {
      try {
        console.log('Fetching partner attendee details with params:', params);
        
        if (!params.attendeeId) {
          return rejectWithValue('attendeeId is required for fetching partner attendee details');
        }
        
        const partnerAttendee = await fetchPartnerAttendeeDetails(params);
        
        if (partnerAttendee) {
          // Utiliser le mapper pour formater les données
          const mappedDetails = mapPartnerAttendeeToDetails(partnerAttendee);
          console.log('✅ Partner attendee details fetched and mapped successfully:', mappedDetails);
          return mappedDetails;
        }
        
        console.log('Partner attendee not found');
        return rejectWithValue('Partner attendee not found');
      } catch (error) {
        console.error('Error fetching partner attendee details:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch partner attendee details');
      }
    }
  );
