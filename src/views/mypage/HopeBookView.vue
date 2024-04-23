<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="hopeBook_page">
        <div class="hopeBook_page_title f2-5rem">
          <b>희망도서 신청목록</b>
        </div>

        <div class="hopeBookList">
          <table class="hopeBook_table">
            <tr class="hopeBook_table_header">
              <th class="hopeBook_number t_header">번호</th>
              <th class="hopeBook_bookTitle t_header">도서명</th>
              <th class="hopeBook_author t_header">저자명</th>
              <th class="hopeBook_publisher t_header">출판사</th>
              <th class="hopeBook_reqDate t_header">신청일</th>
              <th class="hopeBook_reqState t_header">신청상태</th>
            </tr>

            <tr
              class="list_row"
              v-for="(hopeBook, index) in hopeBookList"
              :key="index"
            >
              <td class="hopeBook_number t_list">{{ index + 1 }}</td>
              <td class="hopeBook_bookTitle t_list">
                {{ hopeBook.appl_title }}
              </td>
              <td class="hopeBook_author t_list">{{ hopeBook.appl_author }}</td>
              <td class="hopeBook_publisher t_list">
                {{ hopeBook.appl_publisher }}
              </td>
              <td class="hopeBook_reqDate t_list">{{ hopeBook.reg_date }}</td>
              <td
                class="hopeBook_reqState t_list"
                :class="getStateClass(hopeBook.appl_state)"
              >
                {{ hopeBook.appl_state }}
              </td>
              <td class="hopeBook_cancelButton">
                <button
                  class="list_row_btn button_charcoal text_white button"
                  @click="cancelHopeBook(hopeBook.appl_no)"
                >
                  신청취소
                </button>
              </td>
            </tr>
          </table>
        </div>

        <div class="hopeBook_applyButton">
          <button
            class="list_row_btn button_charcoal text_white button"
            @click="open_hopeApplP"
          >
            신청하기
          </button>
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

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      hopeBookList: [],
      options: { year: "numeric", month: "2-digit", day: "2-digit" },
      hopeApplP: false,

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

    this.getHopeBookTotalCnt();
  },

  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },

  methods: {
    // 희망도서 총 게시글 수
    getHopeBookTotalCnt() {
      api.get(`/mypage/bookAppl/hopeBookCnt/${this.user.mem_no}`).then((res) => {
        if (res.common.res_code == 200) {
          this.totalCnt = res.data.totalCnt;

          if (this.totalCnt > 0) {
            this.getHopeBookList(this.nowPage);
            this.getViewPage();
          }
        }
      });
    },
    // 나의 희망도서 게시글 리스트 조회
    getHopeBookList() {
      this.$api
        .get(`/mypage/bookAppl/hopeBookList/${this.nowPage}`, {
          params: { mem_no: this.user.mem_no },
        })
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.hopeBookList = data.hopeBookList;
          } else {
            alert("희망 도서 목록 없음");
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
        console.log("첫페이지입니다.");
        return;
      }

      this.nowPage = this.startPage - 1;
      this.getHopeBookList();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getHopeBookList();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getHopeBookList();
    },

    // 상태에 따른 class 부여
    getStateClass(state) {
      return {
        text_red: state === "반려",
        text_blue: state === "입고중" || "신청중",
        text_green: state === "입고완료",
      };
    },
    // 희망도서 삭제
    cancelHopeBook(appl_no) {
      const reqBody = {
        appl_no: appl_no,
        mem_no: this.user.mem_no,
      };
      if (confirm("정말 취소하시겠습니까?")) {
        this.$api
          .post("/mypage/bookAppl/cancelHopeBook", reqBody)
          .then((res) => {
            const common = res.common;
            if (common.res_code == 200) {
              alert("취소 되었습니다.");
              window.location.reload(true);
            } else {
              alert("현재 입고중이거나 입고완료된 도서 입니다.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 신청하기 팝업 열기
    open_hopeApplP() {
      this.hopeApplP = true;
    },
    //  신청하기 팝업 닫기
    close_hopeApplP() {
      this.hopeApplP = false;
    },
  },
  computed: {
    // 날짜 형식 맞추기
    calculateDates() {
      return this.hopeBookList.map((hopeBook) => {
        const reg_date = new Date(hopeBook.reg_date);

        return {
          ...hopeBook,
          reg_date: reg_date.toLocaleDateString("ko-KR", this.options),
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
@import "../../assets/css/mypage/hopeBook.css";
</style>
