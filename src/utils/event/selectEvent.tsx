import { useEvent } from '../../context/EventContext';

export const useEventSelector = () => {
    const {updateEventDetails} = useEvent();

    const selectEvent = (event) => {

    const {
        ems_secret_code,
        event_id,
        event_name,
        nice_start_datetime,
        } = event;
        updateEventDetails({
        newSecretCode: ems_secret_code,
        newEventId: event_id,
        newEventName: event_name,
        newNiceStartDate: nice_start_datetime,
        });
    };
    return selectEvent;
};
