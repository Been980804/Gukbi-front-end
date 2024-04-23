<template>
  <div class="container">
    <div class="main_container">
      <div class="m_line_box" v-show="searchText != ''">
        검색어: {{ searchText }}
      </div>
      <div class="m_show_box">
        <div class="table_line_box">
          <table class="m_table">
            <colgroup>
              <col v-for="range in columnRange" :key="range" :width="range">
            </colgroup>
            <thead class="m_thead">
              <!-- <tr>
                <th v-for="column in tableColumn" :key="column" class="m_th">{{ column }}</th>
              </tr> -->
            </thead>
            <tbody>
              <tr v-for="book in bookList" :key="book" @click="goDetailView(book.book_isbn)">
                <td class="m_td"><img class="m_img_book" :src="replaceImg(book.book_url)"/></td>
                <td class="m_td">
                  {{ book.book_title }}<br>
                  {{ book.book_author }}<br>
                  {{ book.book_publisher }}<br>
                  {{ book.book_isbn }}<br>
                  {{ book.book_pub_year }}<br>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="inline_blank24"></div>
        <div class="page_line_box">
          <div class="page_box_img" @click="prevPage()"><img src="../../assets/images/arrow-left.svg"></div>
          <ul>
            <li class="page_box_text li_inline" @click="changePage(page)" v-for="page in pageList" :key="page">{{ page }}</li>
          </ul>
          <div class="page_box_img" @click="nextPage()"><img src="../../assets/images/arrow-right.svg"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/axios";
export default {
  data() {
    return {
      searchText: "", // 검색했을때 검색 내용 저장
      menuName: "",

      columnRange: ["5%", "48%", "14%", "10%", "10%", "10%"],
      tableColumn: ["도서코드", "도서명", "저자", "출판사", "ISBN", "등록일시"],

      currentPage: 1, // 현재 페이지 번호
      recordPage: 10, // 한 페이지에 보여줄 row 개수
      totalCount: 0, // 전체 데이터 개수
      pagingCount: 5, // pagination에 보여질 페이지 개수

      bookList: {},
      pageList: {}
    }
  },

  created() {
    if(sessionStorage.getItem("currentPage") != null || undefined) {
      this.currentPage = sessionStorage.getItem("currentPage");
    }

    if(this.$route.query.searchText != null || undefined) {
      this.searchText = this.$route.query.searchText;
    } else {
      this.menuName = this.$route.query.menuName;
    }
    this.getBookCount();
  },

  methods: {
    setSearchText(searchText) {
      this.searchText = searchText;
      this.getBookCount();
    },
    
    getBookCount() {
      if(this.searchText != '' || null || undefined) {
        let sqlData = new Map();
        sqlData.set("search", this.searchText);

        // api - main.js에서 사용하게 정의됨
        api.get(`/main/bookCount`, {params: Object.fromEntries(sqlData)})
          .then(res => {
            if (res.common.res_code == 200) { // 응답성공
              this.totalCount = res.data.bookCount;

              if (this.totalCount > 0) {
                // 테이블 데이터가 있을 경우 조회
                this.getBookInfo(this.currentPage);
                this.getViewPage();
              }
            } else { // 응답실패
              console.log("BookListView main/bookCount 응답실패");
            }
          })
      } else {
        let sqlData = new Map();
        sqlData.set("menuName", this.menuName);
        // api - main.js에서 사용하게 정의됨
        api.get(`/main/catCount`, {params: Object.fromEntries(sqlData)})
          .then(res => {
            if (res.common.res_code == 200) { // 응답성공
              this.totalCount = res.data.bookCount;
              console.log(this.totalCount);
              // if (this.totalCount > 0) {
              //   // 테이블 데이터가 있을 경우 조회
              //   this.getBookInfo(this.currentPage);
              //   this.getViewPage();
              // }
            } else { // 응답실패
              console.log("BookListView main/bookCount 응답실패");
            }
          })
      }
    },

    getBookInfo() { // 현재 페이지의 책 리스트 정보 가져오기
      if(this.searchText != '' || this.searchText != null) {
        let sqlData = new Map();
        sqlData.set("search", this.searchText);

        api.get(`/main/bookList/${this.currentPage}`, {params: Object.fromEntries(sqlData)})
          .then(res => {
            if (res.common.res_code == 200) { // 응답성공
              this.bookList = res.data.bookList;
            } else { // 응답실패
              console.log("BookListView book/bookList 응답실패");
            }
          })
      } else {
        console.log("BookListView book/bookList 응답실패");
      }
    },

    getViewPage() { // 페이징 영역에 보일 페이지 번호 구하기
      let pages = [];
      let num = this.startPage;
      while (num <= this.endPage) {
        pages.push(num++);
      }
      this.pageList = pages;
    },

    prevPage() { // 이전 버튼
      if (this.endPage - this.pagingCount <= 0) { // 첫페이지일 경우 return
        return;
      }

      this.currentPage = this.startPage - 1;
      this.getBookInfo();
      this.getViewPage();
    },

    nextPage() { // 다음 버튼
      if (this.startPage + this.pagingCount > this.totalPage) { // 마지막 페이지일 경우 return
        return;
      }

      this.currentPage = this.endPage + 1;
      this.getBookInfo();
      this.getViewPage();
    },

    changePage(page) {
      this.currentPage = page;
      this.getBookInfo();
    },

    replaceImg(url) { // 이미지가 없을 경우 기본 이미지로 대체
      if(url == undefined || url == '' || url == null) {
        return require("@/assets/images/default-img.png");
      }
      return url;
    },

    goDetailView(isbn) {
      // 이전 화면으로 돌아올 때 데이터를 sessionStorage에 저장
      sessionStorage.setItem("currentPage", this.currentPage);
      this.$router.push({ name: 'Detail', params: { isbn: `${isbn}` }});
    }
  },

  computed: {
    totalPage() { // 전체 페이지 개수
      if (this.totalCount == 0) {
        return 1;
      }
      return Math.ceil(this.totalCount / this.recordPage); // 숫자 올림 처리
    },

    startPage() {
      return (Math.trunc((this.currentPage - 1) / this.pagingCount) * this.pagingCount) + 1;
    },

    endPage() {
      let result = this.startPage + this.pagingCount - 1;
      return result < this.totalPage ? result : this.totalPage;
    }
  }
}
</script>
<style>
@import "../../assets/css/main/main.css";
</style>