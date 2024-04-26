<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="myInquiry_page">
        <div class="myInquiry_header">
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
        </div>

        <div class="myInquiry_header_title f2-5rem">
          <b>개별 문의 내역</b>
        </div>

        <table class="myInquiry_table">
          <tr class="myInquiry_table_header">
            <th class="myInquiry_num t_header"><b>번호</b></th>
            <th class="myInquiry_title pd_left"><b>제목</b></th>
            <th class="myInquiry_sidclosure t_header"><b>공개여부</b></th>
            <th class="myInquiry_delete t_header"><b>삭제</b></th>
          </tr>
          <!-- 아코디언 -->
          <tr
            v-for="(inquiry, index) in inquiryList"
            :key="index"
            class="list_row"
          >
            <td class="myInquiry_num list_fixed t_list">{{ index + 1 }}</td>
            <td class="myInquiry_title inquiry_list">
              <div class="accordion_wrap">
                <div
                  class="que"
                  @click="accordion(index)"
                  :class="{ opened: inquiry.opened }"
                >
                  <b>{{ inquiry.qes_title }}</b>
                  <div class="arrow_wrap">
                    <div
                      class="arrow"
                      :class="{ rotated: inquiry.opened }"
                    ></div>
                  </div>
                  <div class="ans" :class="inquiry.opened">
                    <div class="ans_list">
                      <div><b>문의내용</b></div>
                      <div>{{ inquiry.qes_content }}</div>
                    </div>

                    <div class="ans_list">
                      <div><b>답변내용</b></div>
                      <div>{{ inquiry.ans_content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="myInquiry_disclosure">
              <label class="switch">
                <input type="checkbox" 
                :checked="inquiry.qna_yn == 'Y'"
                @change="updateVisibility(inquiry)"/>
                <span class="slider"></span>
              </label>
            </td>
            <td class="myInquiry_delete">
              <button
                class="button button_charcoal text_white myInquiry_btn"
                @click="deleteMyInquiry(inquiry.qna_no)"
              >
                삭제
              </button>
            </td>
          </tr>
        </table>

        <div class="create_myInquiry">
          <button class="button button_charcoal text_white myInquiryCreate_btn"
          @click="goRegView()">
            문의하기
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
import { useUserStore } from "@/stores/user";
import Sidebar from "@/components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,
      inquiryList: [],

      // 페이징
      nowPage: 1, // 현재 페이지
      showCnt: 10, // 보여줄 개수
      totalCnt: 0,
      pagingCnt: 5,

      pageList: [],

      // 검색어
      searchText: "",
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getMyInquiryCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      8,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
    // 검색한 내용 저장
    setSearchText(event) {
      this.searchText = event.target.value;
      this.getMyInquiry();
    },

    // 개별 문의 총 게시글 수
    getMyInquiryCnt() {
      api
        .get(`/mypage/inquiry/getMyInquiryCnt/${this.user.mem_no}`)
        .then((res) => {
          if (res.common.res_code == 200) {
            this.totalCnt = res.data.totalCnt;

            if (this.totalCnt > 0) {
              this.getMyInquiry(this.nowPage);
              this.getViewPage();
            }
          }
        });
    },
    // 어떤 게시물이 열려있는지 확인
    accordion(index) {
      this.inquiryList.forEach((inquiry, i) => {
        if (i === index) {
          inquiry.opened = !inquiry.opened;
        } else {
          inquiry.opened = false;
        }
      });
    },
    // 개별문의내역 조회
    getMyInquiry() {
      let reqBody = new Map();
      reqBody.set("mem_no", this.user.mem_no);
      reqBody.set("search", this.searchText);

      this.$api
        .get(`mypage/inquiry/getMyInquiry/${this.nowPage}`, {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          const common = res.common;
          if (common.res_code == 200) {
            const data = res.data;
            this.inquiryList = data.inquiryList.map((inquiry) => {
              return {
                ...inquiry,
                opened: false,
              };
            });
          } else {
            alert("개별문의내역 조회 실패");
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

    // 개별문의내역 삭제
    deleteMyInquiry(qna_no) {
      const reqBody = {
        qna_no: qna_no.toString(),
        mem_no: this.user.mem_no,
      };
      if (confirm("정말 삭제하시겠습니까?")) {
        this.$api
          .post("/mypage/inquiry/deleteInquiry", reqBody)
          .then((res) => {
            const common = res.common;
            if (common.res_code == 200) {
              alert("문의내역이 삭제되었습니다.");
              window.location.reload(true);
            } else {
              alert("문의내역 삭제 실패");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updateVisibility(inquiry){
      const newStatus = inquiry.qna_yn == 'Y' ? '비공개' : '공개';
      
      api.put("/mypage/inquiry/updateVisibility", {qna_no : inquiry.qna_no})
      .then(res => {
        if(res.common.res_code == 200){
          alert(`현 문의를 ${newStatus}합니다.`);
          inquiry.qna_yn = inquiry.qna_yn == 'Y' ? 'N' : 'Y';
        } else{
          console.log('공개여부 수정 실패');
        }
      })
    },
    goRegView(){
      sessionStorage.setItem("nowPage", this.nowPage);
      this.$router.push({
        name: "InquiryReg",
        params:{SidebarNo: 8},
        query: {
          path: `${this.$route.path}`,
          menuNo: `${this.$route.query.menuNo}`,
        },
      });
    }
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
@import "../../assets/css/mypage/myInquiry.css";
</style>
