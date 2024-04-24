<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="bookPly_page">
        <div class="bookPly_page_title f2-5rem">
          <b>인기 북플리</b>
        </div>

        <div class="bookPly_search">
          <div class="search_box_long">
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

        <div class="bookPly_page_subTitle f1-875rem">
          <b>북플리 목록</b>
        </div>
        <div class="bookPly_cards_box">
          <table
            class="bookPly_card"
            v-for="bookPly in bookPlyList"
            :key="bookPly"
            @click="showBookPlyDetail(bookPly)"
          >
            <tr class="card_tr">
              <td class="card_img">
                <img v-if="bookPly.book_url" :src="bookPly.book_url" />
                <img v-else :src="defaultImg" />
              </td>
            </tr>
            <tr class="card_tr">
              <td class="card_title">{{ bookPly.bpl_name }}</td>
            </tr>
            <tr class="card_tr">
              <td class="card_userName">{{ bookPly.mem_name }}</td>
            </tr>
            <tr class="card_tr">
              <td class="card_like">
                ♥ {{ bookPly.like_cnt }}
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

        <bookPlyDetail
          v-if="selectedBookPly"
          :bookPlyDetail="selectedBookPly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue";
import { useUserStore } from "@/stores/user";
import defaultImg from "@/assets/images/default-img.png";
import bookPlyDetail from "@/components/mypage/BookPlyDetail.vue";

export default {
  components: { Sidebar, bookPlyDetail },
  data() {
    return {
      user: useUserStore().getUser,
      defaultImg: defaultImg,
      selectedBookPly: null,
      // 검색
      selectOptions: ["북플리명", "회원명"],
      selectOptionsColumn: ["bpl_name", "member.mem_name"],
      selectedOption: "북플리명",
      isOpen: false,
      searchText: "",
      searchOption: "",

      // 페이징
      nowPage: 1,
      showCnt: 10,
      totalCnt: 0,
      pagingCnt: 5,

      pageList: {},
      bookPlyList: {},
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.currentPage = sessionStorage.getItem("nowPage");
    }

    this.getBookPlyCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      3,
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
      this.getBookPlyCnt();
    },

    getBookPlyCnt() {
      let cnt = 0;
      for (const column of this.selectOptions) {
        if (column == this.selectedOption) {
          break;
        }
        cnt++;
      }

      let column = this.selectOptionsColumn[cnt]; // 뭐로 검색했는지
      this.searchOption = column;
      let reqBody = new Map();
      reqBody.set("column", column);
      reqBody.set("search", this.searchText);

      api
        .get(`/madang/bookPlyList/bookPlyListCnt`, {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.totalCnt = res.data.totalCnt;

            if (this.totalCnt > 0) {
              this.getBookPly(this.nowPage);
              this.getViewPage();
            }
          }
        });
    },

    getBookPly() {
      let reqBody = new Map();
      reqBody.set("column", this.searchOption);
      reqBody.set("search", this.searchText);

      api
        .get(`/madang/bookPlyList/bookPlyList/${this.nowPage}`, {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.bookPlyList = res.data.bookPlyList;
          } else {
            console.log("북플리 목록 가져오지 못함");
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
      this.getBookPly();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getBookPly();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getBookPly();
    },

    showBookPlyDetail(bookPly) {
      this.selectedBookPly = bookPly;
      // 북플리 상세보기 요소의 DOM 객체를 찾음
      const detailElement = document.querySelector(".bookPly_detail");
      // 북플리 상세보기 요소가 존재하면 스크롤
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
@import "../../assets/css/madang/bookPly.css";
</style>
