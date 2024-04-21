<template>
  <div class="container">
    <div class="main_container">
      <div class="m_line_box">
        검색어: {{ searchText }}
      </div>
      <div class="m_show_box">
        <div class="table_line_box">
          <table class="m_table">
            <colgroup>
              <col v-for="range in columnRange" :key="range" :width="range">
            </colgroup>
            <thead class="m_thead">
              <tr>
                <th v-for="column in tableColumn" :key="column" class="m_th">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in bookList" :key="book" @click="goDetailView(book.book_isbn)">
                <td class="m_td">{{ book.book_no }}</td>
                <td class="m_td">{{ book.book_title }}</td>
                <td class="m_td">{{ book.book_author }}</td>
                <td class="m_td">{{ book.book_publisher }}</td>
                <td class="m_td">{{ book.book_isbn }}</td>
                <td class="m_td">{{ book.reg_date }}</td>
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

    if(this.$route.params.searchText != null || undefined) {
      this.searchText = this.$route.params.searchText;
    }

    this.getBookCount();
  },

  methods: {
    getBookCount() {
      let sqlData = new Map();
      sqlData.set("search", this.searchText);

      // api - main.js에서 사용하게 정의됨
      api.get(`/main/bookCount`, {params: Object.fromEntries(sqlData)})
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            this.totalCount = res.data.bookCount;

            if (this.totalCount > 0) {
              // 테이블 데이터가 있을 경우 조회
              console.log(this.totalCount);
              // this.getBookInfo(this.currentPage);
              // this.getViewPage();
            }
          } else { // 응답실패
            console.log("BookListView main/bookCount 응답실패");
          }
        })
    },
  },
}
</script>
<style>

</style>