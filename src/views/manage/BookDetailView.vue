<!-- 도서상세정보화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

    <div class="main_container">
      <div class="m_show_box">
        <div class="m_show_box_title">{{ bookInfo.book_title }}</div>
        <div class="m_title_line_box"></div>
        <img class="m_img_book" :src="bookInfo.book_url" />

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
            <div class="m_table_column">카테고리</div>
            <div class="m_table_column_result">{{ sumCategory() }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판년도</div>
            <div class="m_table_column_result">{{ bookInfo.book_pub_year }}</div>
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
          <div class="button button_purple" @click="goRegView()">
            <div class="text_white">수정</div>
          </div>
          <div class="margin_right10"></div>
          <div class="button button_red" @click="deleteBook()">
            <div class="text_white">삭제</div>
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
import Sidebar from "../../components/common/SidebarView.vue";
export default {
  components: {
    Sidebar
  },

  data() {
    return {
      isbn: this.$route.params.isbn,
      descript: '',
      bookInfo: {}
    }
  },

  created() {
    if(sessionStorage.getItem("isbn") != null || undefined) {
      this.isbn = sessionStorage.getItem("isbn");
    }

    if(this.$route.params.isbn != null || undefined) {
      this.isbn = this.$route.params.isbn;
    }
    
    api.get(`/manage/book/bookInfo/${this.isbn}`)
      .then(res => {
        if(res.common.res_code == 200 && res.data.book_no != '') {
          this.bookInfo = res.data.bookInfo;
          this.getDescript();
        } else {
          console.log("BookDetailView book/bookInfo 응답실패");
        }
      })
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
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

    sumCategory() { // 카테고리 번호, 이름 합치기
      return `${this.bookInfo.book_category_no}. ${this.bookInfo.book_category_name}`;
    },

    goRegView() { // 수정
      // 이전 화면으로 돌아올 때 데이터를 sessionStorage에 저장
      sessionStorage.setItem("isbn", this.isbn);
      this.$router.push({ name: 'MgrBookDetailReg', params: { 'bookInfo': JSON.stringify(this.bookInfo), 'descript': this.descript },
      query: { path: `${this.$route.query.path}`, menuNo: `${this.$route.query.menuNo}` } });
    },

    deleteBook() {
      api.put(`/manage/book/bookDelete/${this.isbn}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.$router.go(-1);
          } else {
            console.log("BookDetailView book/delete 응답실패")
          }
        })
    },

    goPrevView() { // 뒤로 돌아가기
      this.$router.go(-1);
    }
  }
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>