import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  // this로 접근시 화살표함수x 일반함수
  getters: {
    getUser() {
      const aUser = {};
      Object.assign(aUser, this.user);
      return aUser;
    },
  },
  actions: {
    setUser(u) {
      this.user = u;
    },
    updateUser(k, v) {
      this.user[k] = v;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      { 
        storage: sessionStorage,
      }
    ],
  },
})