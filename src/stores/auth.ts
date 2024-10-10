import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
     
      const user = await fetchWrapper.post(`auth/login`, { email: username, password });

      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/');
    },
    async logout() {
      this.user = null;
     // await fetchWrapper.post(`auth/logout`, {});
      localStorage.removeItem('user');
      router.push('/auth/login1');
    },
    async checkAuthenticationApi() {
      try {
        // Fazer a requisição ao servidor para verificar a autenticação
        var response = await fetchWrapper.post(`auth/me`);
  
        if (response.ok) {
          return true; // Token válido
        } else {
          return false; // Token inválido
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false; // Erro na requisição
      }
    }
  }

  
});
