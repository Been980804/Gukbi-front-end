<!-- 도서상세정보등록화면 -->
<template>
  <div class="container">
    <MgrSidebar ref="mgrSidebar"></MgrSidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">도서정보 {{ status }}</div>
        <div class="m_title_line_box"></div>
        <div class="m_line_box" v-show="status == `등록`">
          <div class="m_search_isbn">ISBN 검색</div>
          <div class="margin_right10"></div>
          <div class="search_box search_box_short">
            <input type="text" class="search_box_input" placeholder="검색어 입력" @keyup.enter="getBookInfo($event)">
            <img class="search_box_img" src="../../assets/images/search_btn_icon.svg">
          </div>
        </div>

        <div class="inline_blank24" v-show="status == `등록`"></div>

        <img class="m_img_book" :src="bookInfo.book_url"/>
      
        <div class="inline_blank24"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">도서코드</div>
            <div class="m_table_column_result">{{ bookInfo.book_no }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">도서명</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_title">
          </div>
          <div class="m_table_row">
            <div class="m_table_column">저자</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_author">
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판사</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_publisher">
          </div>
          <div class="m_table_row">
            <div class="m_table_column">카테고리</div>
            <div class="m_table_column_result">{{ sumCategory() }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판년도</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_pub_year">
          </div>
          <div class="m_table_row">
            <div class="m_table_column">ISBN</div>
            <div class="m_table_column_result">{{ bookInfo.book_isbn }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">책소개</div>
            <div class="m_table_column_result">{{ descript }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">등록일자</div>
            <div class="m_table_column_result">{{ bookInfo.reg_date }}</div>
          </div>
        </div>

        <div class="inline_blank24"></div>

        <div class="m_button_line_box">
          <div class="button button_purple">
            <div class="text_white" v-if="status == `등록`">등록</div>
            <div class="text_white" v-else>수정</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button" @click="goPrevView()">
            <div class="text_gray" v-if="status == `등록`">목록</div>
            <div class="text_gray" v-else>취소</div>
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
      status: "등록",
      bookInfo: [],
      descript: null
    }
  },

  created() {
    // 화면 만들어질때 등록, 수정 구분
    if(this.$route.params.bookInfo != "" || null) {
      this.status = "수정";
      this.bookInfo = JSON.parse(this.$route.params.bookInfo);
      this.descript = this.$route.params.descript;
    }
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.mgrSidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
    sumCategory() { // 카테고리 번호, 이름 합치기
      if(this.status == "등록") {
        return "";
      }
      return `${this.bookInfo.book_category_no}. ${this.bookInfo.book_category_name}`;
    },

    getBookInfo(event) {
      api.get(`/manage/book/bookInfo/${event.target.value}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.book_no != '') {
          this.bookInfo = res.data.bookInfo;
          this.getDescript();
        } else {
          console.log("BookDetailView book/bookInfo 응답실패");
        }
      })
    },

    getDescript() { // 도서정보마루 api 통신
      api.get(`/manage/book/descript/${this.isbn}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.descript = res.data.descript;
          } else {
            console.log("BookDetailView book/descript 응답실패")
          }
        })
    },

    modBook() { // 도서 정보 수정
      api.put(``)
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