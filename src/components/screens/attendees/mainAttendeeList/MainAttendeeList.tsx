import React, { useContext, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import { useEvent } from '../../../../context/EventContext';
import { AuthContext } from '../../../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../../redux/selectors/auth/authSelectors';
import Toast from 'react-native-toast-message';
import { fetchMainAttendees } from '../../../../redux/thunks/attendee/mainAttendeesThunk';
import { updateAttendee } from '../../../../redux/thunks/attendee/updateAttendeeThunk';
import { updateAttendeeLocally } from '../../../../redux/slices/attendee/attendeesListSlice';
import { Attendee } from '../../../../types/attendee.types';
import MainAttendeeListItem from './MainAttendeeListItem';
import BaseAttendeeList from '../../../common/attendee/BaseAttendeeList';
import { FilterCriteria, ListHandle } from '../../../common/attendee/types/attendeeList.types';

type Props = {
  searchQuery: string;
  onTriggerRefresh?: () => void;
  filterCriteria: FilterCriteria;
  onShowNotification?: () => void;
  summary?: any;
};

const MainAttendeeList = forwardRef<ListHandle, Props>(
  ({ searchQuery, onTriggerRefresh, filterCriteria }, ref) => {
    const dispatch = useDispatch();
    const event = useEvent();
    const eventId = event ? event.eventId : undefined;
    const { isDemoMode } = useContext(AuthContext);
    const userId = useSelector(selectCurrentUserId);
    const { data: allAttendees, isLoadingList, error } = useSelector((state: any) => state.attendees);

    const [refreshing, setRefreshing] = useState(false);
    const [openSwipeable, setOpenSwipeable] = useState<React.RefObject<any> | null>(null);

    const handleRefresh = async () => {
      setRefreshing(true);
      await dispatch(fetchMainAttendees({ userId, eventId, isDemoMode }));
      setRefreshing(false);
      onTriggerRefresh?.();
    };

    useImperativeHandle(ref, () => ({
      handleRefresh,
    }));

    useEffect(() => {
      handleRefresh();
    }, [userId, eventId, isDemoMode]);

    const handleUpdateAttendee = async (updatedAttendee: Attendee) => {
      dispatch(updateAttendeeLocally(updatedAttendee));
      const result = await dispatch(updateAttendee(updatedAttendee));

      // Close any open swipeable
      openSwipeable?.current?.close();
      onTriggerRefresh?.();
    };

    const handleSwipeableOpen = (swipeable: React.RefObject<any>) => {
      if (openSwipeable && openSwipeable.current && openSwipeable !== swipeable) {
        openSwipeable.current.close();
      }
      setOpenSwipeable(swipeable);
    };

    return (
      <BaseAttendeeList
        ref={ref}
        searchQuery={searchQuery}
        onTriggerRefresh={handleRefresh}
        filterCriteria={filterCriteria}
        refreshing={refreshing}
        attendees={allAttendees || []}
        isLoading={isLoadingList}
        error={error}
        renderItem={(item) => (
          <MainAttendeeListItem
            item={item}
            searchQuery={searchQuery}
            onUpdateAttendee={handleUpdateAttendee}
            onSwipeableOpen={handleSwipeableOpen}
          />
        )}
      >
        {/* Any additional header content can go here */}
      </BaseAttendeeList>
    );
  }
);

const styles = StyleSheet.create({
  viewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainAttendeeList;
