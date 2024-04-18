<!-- 도서상세정보등록화면 -->
<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>

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

        <img class="m_img_book" :src="replaceImg(bookInfo.book_url)"/>
      
        <div class="inline_blank24"></div>

        <div class="m_table_list">
          <div class="m_table_row">
            <div class="m_table_column">도서코드</div>
            <div class="m_table_column_result">{{ bookInfo.book_no }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">도서명</div>
            <div class="m_table_column_result" v-if="status == `등록`">{{ bookInfo.book_title }}</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_title" ref="book_title" v-else>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">저자</div>
            <div class="m_table_column_result" v-if="status == `등록`">{{ bookInfo.book_author }}</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_author" ref="book_author" v-else>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판사</div>
            <div class="m_table_column_result" v-if="status == `등록`">{{ bookInfo.book_publisher }}</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_publisher" ref="book_publisher" v-else>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">카테고리</div>
            <div class="m_table_column_result">{{ category }}</div>
          </div>
          <div class="m_table_row">
            <div class="m_table_column">출판년도</div>
            <div class="m_table_column_result" v-if="status == `등록`">{{ bookInfo.book_pub_year }}</div>
            <input type="text" class="m_table_column_result_insert" :value="bookInfo.book_pub_year" ref="book_pub_year" v-else>
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
          <div class="button button_purple" v-show="status == `등록`">
            <div class="text_white">등록</div>
          </div>
          <div class="button button_purple" v-show="status != `등록`" @click="setBookInfo()">
            <div class="text_white">수정</div>
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
import Sidebar from "../../components/common/SidebarView.vue"
export default {
  components: {
    Sidebar
  },

  data() {
    return {
      status: "등록",
      bookInfo: [],
      descript: null,
      category: null
    }
  },

  created() {
    // 화면 만들어질때 등록, 수정 구분
    if(this.$route.params.bookInfo != "" || null) {
      this.status = "수정";
      this.bookInfo = JSON.parse(this.$route.params.bookInfo);
      this.descript = this.$route.params.descript;
    }

    this.sumCategory();
  },

  // DOM이 만들어진 후 실행
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(9, this.$route.query.path, this.$route.query.menuNo);
  },

  methods: {
    sumCategory() { // 카테고리 번호, 이름 합치기
      if(this.status == "등록" && this.bookInfo != null || "") {
        this.category = `${this.bookInfo.book_category_no}. ${this.bookInfo.book_category_name}`;
        return;  
      }
      if(this.status == "등록") {
        this.category = "";
        return;
      }    
      this.category = `${this.bookInfo.book_category_no}. ${this.bookInfo.book_category_name}`;
    },

    getBookInfo(event) { // 도서 정보 가져오기
      api.get(`/manage/book/bookInfo/${event.target.value}`)
        .then(res => {
          if(res.common.res_code == 200 && res.data.book_no != '') {
            this.bookInfo = res.data.bookInfo;
            this.sumCategory();
          } else {
            console.log("BookDetailView book/bookInfo 응답실패");
          }
        })
      this.getDescript(event.target.value);
    },

    setBookInfo() { // 도서 정보 수정하기
      let sqlData = new Map();
      sqlData.set("isbn", this.bookInfo.book_isbn);
      sqlData.set("book_title", this.$refs.book_title.value);
      sqlData.set("book_author", this.$refs.book_author.value);
      sqlData.set("book_publisher", this.$refs.book_publisher.value);
      sqlData.set("book_pub_year", this.$refs.book_pub_year.value);

      api.put(`/manage/book/bookModify`, Object.fromEntries(sqlData))
        .then(res => {
          if(res.common.res_code == 200 && res.data.book == 1) {
            this.$router.go(-1);
          } else {
            console.log("BookDetailView book/bookModify 응답실패");
          }
        })
    },

    getDescript(value) { // 도서정보마루 api 통신
      api.get(`/manage/book/descript/${value}`)
        .then(res => {
          if(res.common.res_code == 200) {
            this.descript = res.data.descript;
          } else {
            console.log("BookDetailView book/descript 응답실패")
          }
        })
    },

    goPrevView() {
      this.$router.go(-1);
    },

    replaceImg(url) { // 이미지가 없을 경우 기본 이미지로 대체
      if(url == undefined || url == '' || url == null) {
        return require("@/assets/images/default-img.png");
      }
      return url;
    }
  },
}
</script>
<style>
@import "../../assets/css/common/index.css";
@import "../../assets/css/manage/manage.css";
</style>