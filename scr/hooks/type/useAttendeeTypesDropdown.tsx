import {useState, useEffect} from 'react';
import {getAttendeeTypes} from '../../services/getAttendeeTypeService';
import colors from '../../assets/colors/colors';
import useUserId from '../../hooks/useUserId';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';

const useAttendeeTypeDropdown = () => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const userId = useSelector(selectCurrentUserId);

  useEffect(() => {
    if (userId) {
      populateAttendeeTypeDropdown();
    }
  }, [userId]);

  const populateAttendeeTypeDropdown = async () => {
    try {
      const attendeeTypes = await getAttendeeTypes(userId);
      const formattedData = [
        {label: 'Aucun', value: null, color: colors.grey},
        ...attendeeTypes.map(item => ({
          label: item.name,
          value: item.id,
          color: item.background_color,
        })),
      ];

      setDropdownOptions(formattedData);
    } catch (error) {
      console.error('Failed to populate attendee type dropdown:', error);
    }
  };
  return dropdownOptions;
};

export default useAttendeeTypeDropdown;
