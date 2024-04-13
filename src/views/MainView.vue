<template>
  <div class="main_page">
    <h1>Main Page</h1>
    <button @click="apiTest">apiTest</button>
    <button @click="dbTest">dbTest</button>
    <button @click="goLogin">login</button>

    <br><br>
    <input type="text" v-model="user.mem_name" readonly>
    <br>
    <button @click="logout">logout</button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.js';

export default {
  data() {
    return {
      user: useUserStore().getUser,

      number: '1',
      msg: 'hello',
    }
  },

  methods: {
    goLogin() {
      this.$router.push({ name: 'Login' })
    },

    apiTest() {
      this.$api
      .put(`/api/test/${this.number}`, {
        msg: this.msg
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    },

    dbTest() {
      this.$api
      .get(`/api/test/user/${this.number}`)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    },

    logout() {
      const userStore = useUserStore();
			userStore.setUser({});
      this.$router.push({ name: 'Main' })
      window.location.reload(true);
      // 메뉴 로직 구현 후 작성
			// const menuStore = useMenuStore();
			// menuStore.setMenu({});
    },

  }
}
</script>

<style scoped>
.main_page {
  min-height: 50vh;
}
</style>