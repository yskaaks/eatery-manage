// jwtUtils.ts

import jwtDecode from 'jwt-decode';

export interface ParseJWTToken {
  id: number;
  // Add other properties if applicable
}

function parseJwt(): ParseJWTToken | null {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (typeof decodedToken === 'object' && decodedToken !== null && 'id' in decodedToken) {
        return decodedToken as ParseJWTToken;
      } else {
        console.error("Invalid token format.");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.error("No token found in local storage.");
  }

  return null;
}

export function getIdFromToken(): number | null {
  const parsedToken = parseJwt();
  return parsedToken ? parsedToken.id : null;
}
