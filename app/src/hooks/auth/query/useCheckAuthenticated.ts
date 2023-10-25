import {request} from '../../../services/axios.service';
import {apiUrls} from '../../api-urls';
import {useQuery} from '@tanstack/react-query';

const getProfile = async () => {
  try {
    const response: TServerResponse = await request({
      url: apiUrls.auth.GET_PROFILE,
      method: 'GET',
    });
    return response;
  } catch (error) {
    // Handle errors and return an error response or an empty object.
    return {error: 'Failed to fetch user profile'};
  }
};

export const useCheckAuthenticated = (onSuccess: TOnSuccessHandle) => {
  return useQuery(['user', 'get-profile'], getProfile, {
    onSuccess,
    enabled: false,
  });
};
