<template>
  <div class="container">
    <div class="main_container">
      <div class="m_show_box">
        <div class="table_line_box">
          <table class="m_table">
            <tbody>
              <tr style="display: flex;">
                <div style="margin-left: 25%;">
                  <td style="text-align: left; border: none;" class="m_td"><img class="m_img_book" :src="replaceImg(bookInfo.book_url)"/></td>
                  <td style="text-align: left; padding: 20px; border: none;" class="m_td">
                    <div style="font-size: 24px; font-weight: bold;">{{ bookInfo.book_title }}</div>
                    <div class="inline_blank24"></div>
                    <div style="display: flex;">
                      <div style="width: 500px;">
                        <div class="m_search_text">저자: {{ bookInfo.book_author }}</div>
                        <div class="m_search_text">출판사: {{ bookInfo.book_publisher }}</div>
                        <div class="m_search_text">출판년도: {{ bookInfo.book_pub_year }}년도</div>
                        <div class="m_search_text">카테고리: {{ bookInfo.book_category_no }}. {{ bookInfo.book_category_name }}</div>
                        <div class="m_search_text">ISBN: {{ bookInfo.book_isbn }}</div>
                      </div>
                    </div>
                  </td>
                </div>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="m_button_line_box">
          <div class="button button_purple" @click="setBasket()">
            <div class="text_white">책바구니</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button button_red">
            <div class="text_white">북플리 추가</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button" @click="setRental()" v-show="bookStatus == '대여'">
            <div class="text_gray">도서대여</div>
          </div>
          <div class="margin_right10" v-show="bookStatus == '예약'"></div>
          <div class="button" @click="setReserve()" v-show="bookStatus == '예약'">
            <div class="text_gray">도서예약</div>
          </div>
        </div>

        <div class="m_title_line_box"></div>

        <div>
          <div class="m_show_box_title">책소개</div>
          <div>
            {{ descript }}
          </div>
        </div>

        <div class="m_title_line_box"></div>
        <div>
          <div class="m_show_box_title">리뷰</div>
        </div>
      </div>
    </div>
  </div>
  <AddBookPly style="display: none;"></AddBookPly>
</template>
<script>
import api from "@/api/axios";
import { useUserStore } from '@/stores/user.js';
import AddBookPly from "@/components/mypage/popup/AddBookPlyP.vue";
export default {
  components: {
    AddBookPly
  },

  data() {
    return {
      user: useUserStore().getUser,
      bookStatus: null,

      isbn: this.$route.params.isbn,
      descript: null,
      bookInfo: {}
    }
  },

  created() {
    if((sessionStorage.getItem("isbn") != null || undefined) && this.$route.params.isbn == null || undefined) {
      this.isbn = sessionStorage.getItem("isbn");
    }

    this.getBookInfo();
    sessionStorage.setItem("isbn", this.isbn);
  },

  methods: {
    getBookInfo() { // 도서 정보 가져오기
      api.get(`/main/bookInfo/${this.isbn}`)
        .then(res => {
          if(res.common.res_code == 200 && res.data.book_no != '') {
            this.bookInfo = res.data.bookInfo;
            console.log(this.bookInfo);
            // this.sumCategory();
            this.setRentalStatus();
          } else {
            console.log("DetailView main/bookInfo 응답실패");
          }
        })
      this.getDescript(this.isbn);
    },

    getDescript(value) { // 도서정보마루 api 통신
      api.get(`/main/descript/${value}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.descript = res.data.descript;
          } else {
            console.log("DetailView main/descript 응답실패");
          }
        })
    },

    setBasket() { // 책바구니
      this.user = useUserStore().getUser;
      if(this.user.mem_id == null || undefined || '') {
        // 로그인 정보가 없을 경우
        this.$router.push({ path: '/Login' });      
      }

      let sqlData = new Map();
      sqlData.set("memNo", this.user.mem_no);
      sqlData.set("bookNo", this.bookInfo.book_no);

      api.post(`/main/bookInfo/basket`, Object.fromEntries(sqlData))
        .then(res => {
          if(res.common.res_code == 200) {
            console.log(res.data.basket);
          } else {
            console.log("DetailView main/bookInfo/basket 응답실패");
          }
        })
    },

    setRental() { // 도서대여
      this.user = useUserStore().getUser;
      if(this.user.mem_id == null || undefined || '') {
        // 로그인 정보가 없을 경우
        this.$router.push({ path: '/Login' });      
      }
    },

    setReserve() { // 도서예약
      this.user = useUserStore().getUser;
      if(this.user.mem_id == null || undefined || '') {
        // 로그인 정보가 없을 경우
        this.$router.push({ path: '/Login' });      
      }
    },

    replaceImg(url) { // 이미지가 없을 경우 기본 이미지로 대체
      if(url == undefined || url == '' || url == null) {
        return require("@/assets/images/default-img.png");
      }
      return url;
    },

    setRentalStatus() { // 도서 대여 상태에 따라 버튼 변경
      api.get(`/main/bookInfo/status/${this.bookInfo.book_no}`)
        .then(res => {
          if(res.common.res_code == 200) {
            if(res.data.status == 1) {
              this.bookStatus = "예약";
            } else if(res.data.status == 0) {
              this.bookStatus = "대여";
            }
          } else {
            console.log("DetailView main/bookInfo/status 응답실패");
          }
        })
    }
  }
}
</script>
<style>
@import "../../assets/css/main/main.css";
</style>