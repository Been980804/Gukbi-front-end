<template>
  <div class="container">
    <div class="main_container">
      <div class="aa m_content_box">
        <div class="aa m_sug_box">
          <div class="aa">

          </div>

          <div class="margin_right20"></div>

          <div class="aa m_sug_img_box">
            <img class="m_img_book" :src="replaceImg(sugBookInfo.book_url)"/>
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
import api from "@/api/axios";
import { useUserStore } from '@/stores/user.js';

export default {
  data() {
    return {
      user: useUserStore().getUser,

      sugBookInfo: {}
    }
  },

  created() {
    this.getSugBook();
  },

  methods: {
    goLogin() { // 로그인 화면으로 이동
      this.$router.push({ name: 'Login' })
    },

    getSugBook() { // 추천도서로 등록된 책 가져오기
      api.get(`/main/sugBookInfo`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.sugBookInfo = res.data.sugBookInfo;
          } else { // 응답실패
            console.log("BookSugView book/sugBook 응답실패");
          }
        })
    },

    replaceImg(url) { // 이미지가 없을 경우 기본 이미지로 대체
      if(url == undefined || url == '' || url == null) {
        return require("@/assets/images/default-img.png");
      }
      return url;
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