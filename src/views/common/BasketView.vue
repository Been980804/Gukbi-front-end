<!-- 책바구니 화면 -->
<template>
  <div class="container">
    <div class="main_container">
      <div class="m_show_box_title" style="width: 70%; margin: 0px auto; font-weight: bold;">책바구니</div>
      <div class="inline_blank12"></div>

      <div class="m_show_box" style="width: 70%; margin: 0px auto;">
        <div class="table_line_box">
          <table class="m_table">
            <colgroup>
              <col v-for="range in columnRange" :key="range" :width="range">
            </colgroup>
            <thead class="m_thead">
              <tr>
                <th v-for="column in tableColumn" :key="column" class="m_th"
                  style="text-align: left;">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in basketList" :key="book">
                <td class="m_td" style="cursor: default;">
                  <div style="display: flex;">
                    <img style="width: 70px; height: 80px; border: 1px solid black;" :src="replaceImg(book.book_url)">
                    <div class="basket_div_book">
                      <div style="font-weight: 600; margin-bottom: 10px;">{{ book.book_category_no }}. {{ book.book_category_name }}</div>
                      <div>{{ book.book_title }}</div>
                    </div>
                  </div>
                </td>
                <td class="m_td" style="cursor: default;">
                  <div style="display: flex;">
                    <div class="basket_div_book" style="width: 100%;">
                      <div style="font-weight: 600; margin-bottom: 26px;"> </div>
                      <div style="display: flex;">
                        <div>{{ book.book_publisher }}</div>
                        <div style="margin-left: auto;"></div>
                        <img src="../../assets/images/cross.svg" alt="cancel" style="cursor: pointer;" @click="basketDelete()">
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="inline_blank24"></div>
        <div class="m_line_box">
          <div>
            <div>대여한 도서는 지정된 기간 내에 반납되어야 합니다.</div>
            <div>도서 반납시 도서의 상태는 대여 시와 동일하게 유지해주셔야 합니다.</div>
          </div>
          <div class="basket_rental_period">
            <div>대여기간: <span style="font-weight: 600;">대여일로부터 2주</span></div>
          </div>
        </div>
        <div class="m_title_line_box" style="border: 1px solid gray;"></div>
        <div class="m_line_box">
          <div>
            <input type="checkbox" v-model="agree" value="agree1">
              <span style="margin-left: 5px;">도서 대여 기간을 어길 경우, 회원 등급에 부정적인 영향을 끼칠 수 있음에 동의합니다.</span><br>
            <input type="checkbox" v-model="agree" value="agree2">
              <span style="margin-left: 5px;">반납 시 도서가 손상된 경우, 손상 정도에 따라 별도의 비용이 청구될 수 있음에 동의합니다.</span>
          </div>
          <div class="basket_rental_period">
            <div class="button button_purple" @click="rent()">
              <div class="text_white">대여하기</div>
            </div>
          </div>
        </div>
        <div class="inline_blank24"></div>
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
      basketList: {},

      columnRange: ["60%", "40%"],
      tableColumn: ["도서명", "출판사"],
      agree: []
    }
  },

  created() {
    if(this.user.mem_id == null || undefined || '') {
      this.$router.push({ name: 'Main' });
    }
    
    // 사용자 책바구니 내역 가져오기
    this.getBasket();
  },

  methods: {
    getBasket() { // 책바구니 목록 가져오기
      api.get(`/main/bookInfo/basketList/${this.user.mem_no}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.basketList = res.data.basketList;
          } else { // 응답실패
            console.log("BookListView book/bookCount 응답실패");
          }
        })
    },

    basketDelete(bookNo) { // 책바구니 목록에서 빼기
      this.user = useUserStore().getUser;
      let sqlData = new Map();
      sqlData.set("memNo", this.user.mem_no);
      sqlData.set("bookNo", bookNo);

      api.put(`/main/bookInfo/basketDelete`, Object.fromEntries(sqlData))
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            console.log(res.data.basket);
          } else { // 응답실패
            console.log("BasketView main/bookInfo/basketDelete 응답실패");
          }
        })
    },

    replaceImg(url) { // 이미지가 없을 경우 기본 이미지로 대체
      if(url == undefined || url == '' || url == null) {
        return require("@/assets/images/default-img.png");
      }
      return url;
    },

    rent() { // 대여하기
      // 전체 동의사항에 체크가 되어 있는지 확인
      if(this.agree.length != 2) {
        // 전체 동의사항에 체크하라는 메시지 전달
        alert("전체 동의사항에 대한 동의가 필요합니다.");
        return;
      }
      
    }
  }
}
</script>
<style>
@import "../../assets/css/main/main.css";
</style>