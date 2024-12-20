import { useAuthStore } from '@/stores/auth';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

const baseUrl = `${import.meta.env.VITE_API_URL}`;

function request(method: string) {
  return (url: string, body?: any) => {
    const requestOptions: any = {
      method,
      headers: {
        ...authHeader(url),
        'Accept': 'application/json',
      }
    };

    if (method.toUpperCase() === 'GET' && body) {
      // Transformar body em query parameters
      const queryParams = new URLSearchParams(body).toString();
      url = `${url}?${queryParams}`;
    } else if (body instanceof FormData) {
      requestOptions.body = body;
    } else if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    return fetch(`${baseUrl}/${url}`, requestOptions).then(handleResponse);
  };
}

// helper functions

function authHeader(url: any) {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.access_token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

  if (isLoggedIn) {
    // console.log(user.access_token) //Teste para imprimir token usado

    return { 'Accept': 'application/json', Authorization: `Bearer ${user.access_token}` };
  } else {
    return {};
  }
}

function handleResponse(response: any) {
  return response.text().then((text: any) => {

    // console.log(text)

    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      const error = (data && data.message) || response.statusText;
     // return Promise.reject(data);
     return Promise.reject({
        status: response.status,
        data: data,
        statusText: response.statusText,

      }); 
    }

    return data;
  });
}
