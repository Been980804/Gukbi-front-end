<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="rentedList_page">
        <div class="rentedList_page_title f2-5rem">
          <b>대여 내역</b>
        </div>

        <div class="rentedList">
          <div class="rentedList_title f1-875rem">
            <b>대여한 도서 목록</b>
          </div>
          <table class="rentedList_table">
            <tr class="rentedList_table_header">
              <th class="rented_bookCode t_header">
                <b>도서코드</b>
              </th>
              <th class="rented_bookTitle t_header">
                <b>도서명</b>
              </th>
              <th class="rented_userName t_header">
                <b>회원명</b>
              </th>
              <th class="rented_rentDate t_header">
                <b>대여일</b>
              </th>
              <th class="rented_returnDate t_header">
                <b>반납일</b>
              </th>
            </tr>

            <tr
              class="list_row"
              v-for="(rented, index) in calcuateDates"
              :key="index"
            >
              <td class="rented_bookCode t_list">{{ rented.book_no }}</td>
              <td class="rented_bookTitle t_list">{{ rented.book_title }}</td>
              <td class="rented_userName t_list">{{ rented.mem_name }}</td>
              <td class="rented_rentDate t_list">{{ rented.rent_date }}</td>
              <td class="rented_returnDate t_list">{{ rented.return_date }}</td>
              <td class="rented_reviewButton">
                <button
                  class="list_row_btn button_charcoal text_white button"
                  @click="open_reviewP(rented)"
                >
                  리뷰작성
                </button>
                <ReviewP
                  v-if="reviewP"
                  @close="close_reviewP"
                  :reviewBook="selectedBook"
                />
              </td>
            </tr>
          </table>
        </div>
        <div class="page_line_box">
          <div class="page_box_img" @click="prevPage()">
            <img src="../../assets/images/arrow-left.svg" />
          </div>
          <ul>
            <li
              class="page_box_text li_inline"
              @click="changePage(page)"
              v-for="page in pageList"
              :key="page"
            >
              {{ page }}
            </li>
          </ul>
          <div class="page_box_img" @click="nextPage()">
            <img src="../../assets/images/arrow-right.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import { useUserStore } from "@/stores/user.js";
import Sidebar from "@/components/common/SidebarView.vue";
import ReviewP from "@/components/mypage/popup/ReviewP.vue";

export default {
  components: { Sidebar, ReviewP },
  data() {
    return {
      user: useUserStore().getUser,
      rentedList: [],
      options: { year: "numeric", month: "2-digit", day: "2-digit" },
      reviewP: false,
      selectedBook: null,

      // 페이징
      nowPage: 1, // 현재 페이지
      showCnt: 10, // 보여줄 개수
      totalCnt: 0,
      pagingCnt: 5,

      pageList: [],
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getRentedTotalCnt();
  },

  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },

  methods: {
    getRentedTotalCnt() {
      api.get(`/mypage/rent/rentedCnt/${this.user.mem_no}`).then((res) => {
        if (res.common.res_code == 200) {
          this.totalCnt = res.data.totalCnt;

          if (this.totalCnt > 0) {
            this.getRentedList(this.nowPage);
            this.getViewPage();
          }
        }
      });
    },

    // 대여했던 도서목록 조회
    getRentedList() {
      this.$api
        .get(`/mypage/rent/rentedList/${this.nowPage}`, {
          params: { mem_no: this.user.mem_no },
        })
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.rentedList = data.rentedList;
          } else {
            alert("대여한 내역 없음");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getViewPage() {
      let pages = [];
      let num = this.startPage;
      while (num <= this.endPage) {
        pages.push(num++);
      }
      this.pageList = pages;
    },

    prevPage() {
      if (this.endPage - this.pagingCnt <= 0) {
        // 첫페이지일경우
        console.log('첫페이지입니다.')
        return;
      }

      this.nowPage = this.startPage - 1;
      this.getRentedList();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log('마지막페이지입니다.')
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getRentedList();
      this.getViewPage();
    },

    changePage(page){
      this.nowPage = page;
      this.getRentedList();
    },

    // 리뷰작성 팝업 열기
    open_reviewP(rented) {
      this.selectedBook = rented;
      this.reviewP = true;
    },
    // 리뷰작성 팝업 닫기
    close_reviewP() {
      this.reviewP = false;
    },
    // 선택된 책 정보 넘기기
    selectedRentedBook(rented) {
      this.selectedBook = rented;
    },
  },
  computed: {
    // 날짜 형식 맞추기
    calcuateDates() {
      return this.rentedList.map((rented) => {
        const rent_date = new Date(rented.rent_date);
        const return_date = new Date(rented.return_date);

        return {
          ...rented,
          rent_date: rent_date.toLocaleDateString("ko-KR", this.options),
          return_date: return_date.toLocaleDateString("ko-KR", this.options),
        };
      });
    },

    totalPage() {
      if (this.totalCnt == 0) {
        return 1;
      }
      return Math.ceil(this.totalCnt / this.showCnt);
    },

    startPage() {
      return (
        Math.trunc((this.nowPage - 1) / this.pagingCnt) * this.pagingCnt + 1
      );
    },

    endPage() {
      let result = this.startPage + this.pagingCnt - 1;
      return result < this.totalPage ? result : this.totalPage;
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/mypage/rentedList.css";
</style>
