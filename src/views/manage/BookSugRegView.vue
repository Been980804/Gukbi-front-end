<!-- 추천도서등록화면 -->
<template>
  <div class="container">
    <MgrSidebar ref="mgrSidebar"></MgrSidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">추천도서 등록</div>
        <div class="m_title_line_box"></div>

        <div class="m_line_box">
          <div class="m_search_isbn">ISBN 검색</div>
          <div class="margin_right10"></div>
          <div class="search_box search_box_short">
            <input type="text" class="search_box_input" placeholder="검색어 입력" @keyup.enter="getBookInfo($event)">
            <img class="search_box_img" src="../../assets/images/search_btn_icon.svg">
          </div>
        </div>

        <div class="inline_blank24"></div>

        <img class="m_img_book" :src="bookInfo.book_url"/>

        <div class="inline_blank24"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">도서코드</div>
            <div class="m_table_column_result">{{ bookInfo.book_no }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">도서명</div>
            <div class="m_table_column_result">{{ bookInfo.book_title }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">저자</div>
            <div class="m_table_column_result">{{ bookInfo.book_author }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판사</div>
            <div class="m_table_column_result">{{ bookInfo.book_publisher }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">ISBN</div>
            <div class="m_table_column_result">{{ bookInfo.book_isbn }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">등록일자</div>
            <div class="m_table_column_result">{{ setDateFormat() }}</div>
          </div>
        </div>

        <div class="inline_blank24"></div>

        <div class="m_button_line_box">
          <div class="button button_purple" @click="regist()">
            <div class="text_white">등록</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button" @click="goPrevView()">
            <div class="text_gray">목록</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
import MgrSidebar from "../manage/MgrSidebar.vue"
export default {
  components: {
    MgrSidebar
  },

  data() {
    return {
      bookInfo: {}
    }
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.mgrSidebar.getLargeMenu(9);
  },

  methods: {
    getBookInfo(event) { // 도서정보마루 api 통신
      this.bookInfo = {};
      api.get(`/manage/book/bookInfo/${event.target.value}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.book_no != '') {
          this.bookInfo = res.data.bookInfo;
        } else {
          console.log("BookDetailView book/bookInfo 응답실패");
        }
      })
    },

    setDateFormat() {
      let now = new Date();

      var year = now.getFullYear();
      var month = ('0' + (now.getMonth() + 1)).slice(-2);
      var day = ('0' + now.getDate()).slice(-2);
      
      var hours = ('0' + now.getHours()).slice(-2); 
      var minutes = ('0' + now.getMinutes()).slice(-2);
      var seconds = ('0' + now.getSeconds()).slice(-2); 

      return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    },

    regist() { // 추천도서 테이블 등록
      api.put(`/manage/book/sugRegist`, {params: Object.fromEntries(this.sqlData)})
      .then(res => {
          if(res.common.res_code == 200) {
            console.log("sugRegist:::" + res.data.sugRegist)
          } else {
            console.log("BookDetailView book/descript 응답실패")
          }
        })
    },

    goPrevView() {
      this.$router.go(-1);
    }
  },
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>