<template>
  <div class="container">
    <div class="main_container">
      <div class="m_content_box">
        <div class="m_sug_box">
          <div>
            <span style="font-size: 72px; font-weight: bold;">이 책 어때요?</span><br><br>
            <span style="font-size: 20px;">이번 주간에 가장 인기가 많았던 책이에요.</span><br>
            <span style="font-size: 20px;">도서 대여를 놓치지 마세요!</span>
          </div>
          <img class="m_sug_img_box" :src="replaceImg(sugBookInfo.book_url)"/>
        </div>
      </div>

      <div class="inline_blank24"></div>

      <div class="m_content_box" style="flex-direction: column; background-color: white;">
        <div class="m_content_title" style="font-size: 24px; font-weight: bold;">현재 급상승 중인 도서!</div>
        <div class="m_card_box">
          <div class="trend_div" v-for="reserv of reservList" :key="reserv">
						<img :src="replaceImg(reserv.book_url)"/>
						<div style="border: 1px solid #e5e5e5;"></div>
						<div style="font-weight: 600;">{{ reserv.book_title }}</div>
						<div>카테고리: {{ reserv.book_category_no }}. {{ reserv.book_category_name }}</div>
            <div>출판사: {{ reserv.book_publisher }}</div>
					</div>
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

      sugBookInfo: {},
      reservList: {}
    }
  },

  created() {
    this.getSugBook();
    this.getReservaion();
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

    getReservaion() { // 예약내역 가져오기
      api.get(`/main/bookInfo/reservation`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.reservList = res.data.reservation;
            console.log(this.reservList);
          } else { // 응답실패
            console.log("BookSugView main/bookInfo/reservation 응답실패");
          }
        })
    }
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