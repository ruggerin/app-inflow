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

        if (this.user == null) {
          return false;
        }
        var response = await fetchWrapper.post(`auth/me`);
        //console.log(response)
        return true;

      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false; // Erro na requisição
      }
    },
    async refreshToken() {
      try {

        const response = await fetchWrapper.post('auth/refresh');

        // Atualize o usuário com o novo access token
        this.user.access_token = response.access_token;
        localStorage.setItem('user', JSON.stringify(this.user));
        //  console.log('Token atualizado com sucesso');
      } catch (error) {

        console.log(error)
        throw error;
      }
    },

    async hasPermission(menuName: string, permissionName: string): Promise<boolean> {
      var response = await fetchWrapper.post(`auth/verifypermission`, {
        "menu_name": menuName,
        "permission_name": permissionName
      });
      var result: boolean = response.result ?? false;
      return response;
    }
  }
});
