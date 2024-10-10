import { useAuthStore } from '@/stores/auth';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

const baseUrl = `${import.meta.env.VITE_API_URL}`;

function request(method: string) {
  return (url: any, body?: any) => {
    const requestOptions: any = {
      method,
      headers: {
        ...authHeader(url),
        'Accept': 'application/json',
      }
    };
    if (body instanceof FormData) {

      //requestOptions.headers['Content-Type'] = 'multipart/form-data';
      requestOptions.body = body;
    } else if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    console.log(requestOptions.body)
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
      return Promise.reject({
        responseStatus: response.status,
        message: data.message,
        statusText: response.statusText

      });
    }

    return data;
  });
}
