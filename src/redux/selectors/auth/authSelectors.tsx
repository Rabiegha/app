import { RootState } from '../../store';
import { UserInfo } from '../../../types/auth.types';

// Type-safe selectors for auth state
export const selectCurrentUserId = (state: RootState): string | null => state.auth.currentUserId;
export const selectUserType = (state: RootState): string | null => state.auth.userType;
export const selectUserInfo = (state: RootState): UserInfo | null => state.auth.userInfo;
export const selectIsLoading = (state: RootState): boolean => state.auth.isLoading;
export const selectError = (state: RootState): string | null => state.auth.error;
