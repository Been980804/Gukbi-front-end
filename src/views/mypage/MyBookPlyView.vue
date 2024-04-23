<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="myBookPly_page">
        <div class="myBookPly_page_title f2-5rem">
          <b>내 북플리</b>
        </div>

        <div class="myBookPlyList">
          <div class="myBookPlyList_title f1-875rem">
            <b>북플리 목록</b>
          </div>

          <table class="myBookPlyList_table">
            <tr class="myBookPlyList_table_header">
              <th class="bookPly_checkbox t_header">
                <input type="checkbox" @change="checkAll($event)" />
              </th>
              <th class="bookPly_img t_header"></th>
              <th class="bookPly_bplName t_header">북플리명</th>
              <th class="bookPly_userName t_header">회원명</th>
              <th class="bookPly_like t_header">좋아요 수</th>
              <th class="bookPly_updateDate t_header">최종 수정날짜</th>
              <th class="bookPly_disclosure t_header">공개여부</th>
            </tr>

            <tbody v-for="(bookPly, index) in bookPlyList" :key="index">
              <tr class="bookPly_list_row">
                <td class="bookPly_checkbox t_list" rowspan="2">
                  <input
                    type="checkbox"
                    class="bookPly_chk"
                    :value="bookPly.bpl_no"
                    @change="checkboxClicked($event)"
                  />
                </td>
                <td
                  class="bookPly_img"
                  rowspan="2"
                  @click="showBookPlyDetail(bookPly)"
                >
                  <img v-if="bookPly.book_url" :src="bookPly.book_url" />
                  <img v-else :src="defaultImg" />
                </td>
                <td
                  class="bookPly_bplName t_list"
                  @click="showBookPlyDetail(bookPly)"
                >
                  {{ bookPly.bpl_name }}
                </td>
                <td
                  class="bookPly_userName t_list"
                  @click="showBookPlyDetail(bookPly)"
                >
                  {{ bookPly.mem_name }}
                </td>
                <td
                  class="bookPly_like t_list"
                  @click="showBookPlyDetail(bookPly)"
                >
                  {{ bookPly.like_cnt }}
                </td>
                <td
                  class="bookPly_updateDate t_list"
                  @click="showBookPlyDetail(bookPly)"
                >
                  {{ bookPly.mod_date }}
                </td>
                <td class="bookPly_disclosure t_list">
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="bookPly.bpl_yn === 'Y'"
                      @change="updateVisibility(bookPly)"
                    />
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
              <tr
                class="bookPly_row_content"
                @click="showBookPlyDetail(bookPly)"
              >
                <td colspan="5">{{ bookPly.bpl_intro }}</td>
              </tr>
            </tbody>
          </table>

          <div class="bookPly_button">
            <div class="bookPly_create btn_flex margin-right">
              <b>북플리 생성</b>
              <button
                class="button button_charcoal text_white bookPlCreate_popup_parent"
                @click="open_createBplP"
              >
                생성
              </button>
              <CreateBplP v-if="createBplP" @close="close_createBplP" />
            </div>
            <div class="bookPly_delete btn_flex">
              <b>북플리 삭제</b>
              <button
                class="button button_charcoal text_white"
                @click="deleteSelectedBpl"
              >
                삭제
              </button>
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
import { useUserStore } from "@/stores/user.js";
import Sidebar from "@/components/common/SidebarView.vue";
import defaultImg from "@/assets/images/default-img.png";
import bookPlyDetail from "@/components/mypage/BookPlyDetail.vue";
import CreateBplP from "@/components/mypage/popup/CreateBookPlyP.vue";

export default {
  components: { Sidebar, bookPlyDetail, CreateBplP },
  data() {
    return {
      user: useUserStore().getUser,
      bookPlyList: [],
      defaultImg: defaultImg,
      selectedBookPly: null,
      createBplP: false,
      checkedBpls: [],

      // 페이징
      nowPage: 1, // 현재 페이지
      showCnt: 3, // 보여줄 개수
      totalCnt: 0,
      pagingCnt: 5,

      pageList: [],
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getBookPlyCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
    // 북플리 개수 조회
    getBookPlyCnt() {
      api.get(`/mypage/bookPly/bookPlyCnt/${this.user.mem_no}`).then((res) => {
        if (res.common.res_code == 200) {
          this.totalCnt = res.data.totalCnt;

          if (this.totalCnt > 0) {
            this.getBookPlyList(this.nowPage);
            this.getViewPage();
          }
        }
      });
    },
    // 북플리 목록 조회
    getBookPlyList() {
      this.$api
        .get(`/mypage/bookPly/bookPlyList/${this.nowPage}`, {
          params: { mem_no: this.user.mem_no },
        })
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.bookPlyList = data.bookPlyList;
          } else {
            alert("북플리 목록 없음");
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
      this.getBookPlyList();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getBookPlyList();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getBookPlyList();
    },

    // 공개여부 설정
    updateVisibility(bookPly) {
      const newStatus = bookPly.bpl_yn === "Y" ? "비공개" : "공개"; // 변경할 상태

      this.$api
        .put("/mypage/bookPly/updateVisibility", { bpl_no: bookPly.bpl_no })
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            alert(`북플리를 ${newStatus}합니다.`);
            bookPly.bpl_yn = bookPly.bpl_yn === "Y" ? "N" : "Y";
          } else {
            alert("공개여부 수정 실패");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 북플리 상세보기에 정보 넘김
    showBookPlyDetail(bookPly) {
      this.selectedBookPly = bookPly;
      // 북플리 상세보기 요소의 DOM 객체를 찾습니다.
      const detailElement = document.querySelector(".bookPly_detail");
      // 북플리 상세보기 요소가 존재하면 스크롤합니다.
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    // 체크박스 전체 체크
    checkAll(event) {
      const isChecked = event.target.checked;

      document.querySelectorAll(".bookPly_chk").forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    },

    // 북플리 생성 팝업
    open_createBplP() {
      this.createBplP = true;
    },
    close_createBplP() {
      this.createBplP = false;
    },

    // 체크박스 선택된거 배열에 저장
    checkboxClicked(event) {
      const bpl_no = event.target.value;
      const index = this.checkedBpls.indexOf(bpl_no);

      if (index !== -1) {
        this.checkedBpls.splice(index, 1);
      } else {
        this.checkedBpls.push(bpl_no);
      }
    },

    // 북플리 삭제
    deleteSelectedBpl() {
      const reqBody = {
        mem_no: this.user.mem_no,
        bpl_no: this.checkedBpls,
      };

      if (confirm("정말 삭제하시겠습니까?")) {
        this.$api
          .post("/mypage/bookPly/deleteBpl", reqBody)
          .then((res) => {
            const common = res.common;
            if (common.res_code == 200) {
              alert("삭제 성공");
              window.location.reload(true);
            } else {
              alert("삭제 실패");
            }
          })
          .catch((err) => {
            console.log(err);
          });
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
@import "../../assets/css/mypage/myBookPly.css";
</style>
