<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="hopeBookList_page">
        <div class="hopeBookList_page_title f2-5rem">
          <b>도서 신청 게시판</b>
        </div>

        <div class="bookPly_search fix_left">
          <div class="search_box">
            <input
              type="text"
              class="search_box_input"
              placeholder="검색어 입력"
              @keyup.enter="setSearchText($event)"
            />
            <img
              class="search_box_img"
              src="../../assets/images/search_btn_icon.svg"
            />
          </div>
          <div style="margin-left: 30px" class="m_select_box">
            <button class="m_select_button" @click="selectClick()">
              <span>{{ selectedOption }}</span>
            </button>
            <div class="m_drop_content" v-show="isOpen">
              <div
                v-for="option in selectOptions"
                :key="option"
                @click="selectOption(option)"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>

        <div class="hopeBookList">
          <table class="hopeBookList_table">
            <tr class="hbl_table_header">
              <th class="hbl_num t_header">번호</th>
              <th class="hbl_userName t_header">회원명</th>
              <th class="hbl_bookTitle t_header">도서명</th>
              <th class="hbl_author t_header">저자명</th>
              <th class="hbl_publisher t_header">출판사</th>
              <th class="hbl_reqDate t_header">신청일</th>
              <th class="hbl_reqState t_header">신청상태</th>
            </tr>

            <tr
              class="list_row"
              v-for="(hopeBook, index) in hopeBookList"
              :key="index"
            >
              <td class="hbl_num t_list">{{ index + 1 }}</td>
              <td class="hbl_userName t_list">{{ hopeBook.mem_name }}</td>
              <td class="hbl_bookTitle">{{ hopeBook.appl_title }}</td>
              <td class="hbl_author">{{ hopeBook.appl_author }}</td>
              <td class="hbl_publisher">{{ hopeBook.appl_publisher }}</td>
              <td class="hbl_reqDate">{{ hopeBook.reg_date }}</td>
              <td
                class="hbl_reqState"
                :class="getStateClass(hopeBook.appl_state)"
              >
                {{ hopeBook.appl_state }}
              </td>
            </tr>
          </table>

          <div class="hopeBook_create">
            <button class="button button_charcoal text_white" @click="open_hopeApplP">신청하기</button>
            <HopeBookReg v-if="hopeApplP" @close="close_hopeApplP" />
          </div>
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
import Sidebar from "@/components/common/SidebarView.vue";
import HopeBookReg from "@/components/mypage/popup/HopeBookRegP.vue";

export default {
  components: { Sidebar, HopeBookReg },
  data() {
    return {
      // 검색
      selectOptions: ["도서명", "출판사"],
      selectOptionsColumn: ["appl_title", "appl_publisher"],
      selectedOption: "도서명",
      isOpen: false,
      searchText: "",
      searchOption: "",

      // 페이징
      nowPage: 1,
      showCnt: 10,
      totalCnt: 0,
      pagingCnt: 5,

      hopeBookList: [],
      pageList: [],

      hopeApplP: false,
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getHopeBookCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      2,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
    selectClick() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isOpen = false;
    },
    setSearchText(event) {
      this.searchText = event.target.value;
      this.getHopeBookCnt();
    },

    getHopeBookCnt() {
      let cnt = 0;
      for (const column of this.selectOptions) {
        if (column == this.selectedOption) {
          break;
        }
        cnt++;
      }

      let column = this.selectOptionsColumn[cnt];
      this.searchOption = column;
      let reqBody = new Map();
      reqBody.set("column", column);
      reqBody.set("search", this.searchText);

      api
        .get("/madang/hopeBookList/hopeBookListCnt", {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.totalCnt = res.data.totalCnt;

            if (this.totalCnt > 0) {
              this.getHopeBook(this.nowPage);
              this.getViewPage();
            }
          }
        });
    },

    getHopeBook() {
      let reqBody = new Map();
      reqBody.set("column", this.searchOption);
      reqBody.set("search", this.searchText);

      api
        .get(`/madang/hopeBookList/hopeBookList/${this.nowPage}`, {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.hopeBookList = res.data.hopeBookList;
          } else {
            console.log("도서 신청 게시글 불러오기 실패");
          }
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
      this.getHopeBook();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getHopeBook();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getHopeBook();
    },

    // 상태에 따른 class 부여
    getStateClass(state) {
      return {
        text_red: state === "반려",
        text_blue: state === "입고중" || "신청중",
        text_green: state === "입고완료",
      };
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
@import "../../assets/css/madang/hopeBook.css";
</style>
