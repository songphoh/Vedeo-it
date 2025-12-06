export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export const parseJwt = (token: string): UserProfile | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const data = JSON.parse(jsonPayload);
    return {
      name: data.name,
      email: data.email,
      picture: data.picture
    };
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};