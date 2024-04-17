<template>
  <div class="container">
    <div class="main_container">
      <div class="aa m_content_box">
        <div class="aa m_sug_box">
          <div class="aa">

          </div>

          <div class="margin_right20"></div>

          <div class="aa m_sug_img_box">

          </div>
        </div>
      </div>

      <div class="inline_blank24"></div>

      <div class="aa m_content_box" style="flex-direction: column;">
        <div class="aa m_content_title">현재 급상승 중인 도서!</div>
        <div class="aa m_card_box">
        </div>
      </div>
    </div>
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
    },
  }
}
</script>
<style>
  @import "../assets/css/main/main.css";
  @import "../assets/css/common/index.css";
  .aa {
    border: 1px solid black;
  }
</style>