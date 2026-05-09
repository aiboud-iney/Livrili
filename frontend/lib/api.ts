export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getCurrentUser = (): { id: string } | null => {

  if (typeof window !== "undefined") {

    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (userStr) {

      try {

        return JSON.parse(userStr);

      } catch (e) {

        return null;

      }

    }

  }

  return null;

};

export const api = {

  getUserProfile: async (userId: string) => {

    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to fetch user profile (${response.status})`;
      try {
        const errorData = responseText ? JSON.parse(responseText) : null;
        if (errorData?.message) errorMessage = errorData.message;
      } catch {

        if (responseText) errorMessage = `Server error (${response.status}): ${responseText.substring(0, 100)}`;
      }
      throw new Error(errorMessage);
    }

    let data: { user?: any } = {};
    try {
      data = await response.json();
    } catch (parseError) {
      console.warn('[API] Failed to parse user profile response:', parseError);
      data = {};
    }

    return data.user || null;

  },

  getCurrentUserProfile: async () => {

    const user = getCurrentUser();

    if (!user) throw new Error('User not authenticated');

    return api.getUserProfile(user.id);

  },

  updateUserProfile: async (userId: string, profileData: {

    business_name?: string;

    category?: string;

    trade_register?: string;

    tin_nif?: string;

    phone_number?: string;

    email?: string;

    headquarters_address?: string;

    bio?: string;

  }, profilePicture?: File) => {

    const token = getAuthToken();

    if (!token) throw new Error('No auth token found');

    const formData = new FormData();

    if (profilePicture) {

      formData.append('profile_picture', profilePicture);

    }

    Object.entries(profileData).forEach(([key, value]) => {

      if (value !== undefined && value !== null && value !== '') {

        formData.append(key, value);

      }

    });

    const url = `${API_BASE_URL}/users/${userId}`;

    const response = await fetch(url, {

      method: 'PUT',

      headers: {

        'Authorization': `Bearer ${token}`,

      },

      body: formData,

    });

    if (!response.ok) {
      let errorMessage = `Failed to update profile (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        const responseText = await response.text();
        if (responseText) errorMessage = `Server error (${response.status}): ${responseText.substring(0, 100)}`;
      }
      throw new Error(errorMessage);
    }

    let data: { user?: any } = {};
    try {
      data = await response.json();
    } catch (parseError) {
      console.warn('[API] Failed to parse profile update response:', parseError);
      data = {};
    }

    return data.user || null;

  },

  getProfilePictureUrl(profilePicturePath: string | null): string {

    if (!profilePicturePath) return 'https://static.vecteezy.com/system/resources/previews/025/869/585/non_2x/round-profile-image-of-man-avatar-for-social-networks-fashion-beauty-blue-and-black-bright-illustration-in-trendy-style-vector.jpg';

    if (profilePicturePath.startsWith('http')) return profilePicturePath;

    return `${API_BASE_URL}/${profilePicturePath}`;

  },

};
