<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="inquiry_page">
        <div class="inquiry_page_title f2-5rem">
          <b>문의사항</b>
        </div>

        <div class="inquiry_header">
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

        <div class="faqList">
          <div class="faqList_title f1-875rem"><b>자주하는 질문</b></div>
          <table class="faq_table">
            <tr class="faq_table_header">
              <th class="faq_num t_header"><b>번호</b></th>
              <th class="faq_title t_header pd_left"><b>제목</b></th>
            </tr>
            <tr class="list_row" v-for="(faq, index) in faqList" :key="index">
              <td class="faq_num t_list">{{ index + 1 }}</td>
              <td class="faq_title inquiry_list">
                <div class="accordion_wrap">
                  <div
                    class="que"
                    @click="accordion_faq(index)"
                    :class="{ opened: faq.opened }"
                  >
                    <b>{{ faq.faq_title }}</b>
                    <div class="arrow_wrap">
                      <div class="arrow" :class="{ rotated: faq.opened }"></div>
                    </div>
                    <div class="ans" :class="faq.opened">
                      <div class="ans_list">
                        <div><b>문의내용</b></div>
                        <div>{{ faq.faq_title }}</div>
                      </div>

                      <div class="ans_list">
                        <div><b>답변내용</b></div>
                        <div>{{ faq.faq_content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="qnaList">
          <div class="qnaList_title f1-875rem"><b>문의내역</b></div>
          <table class="qna_table">
            <tr class="qna_table_header">
              <th class="qna_num t_header"><b>번호</b></th>
              <th class="qna_userName t_header"><b>작성자</b></th>
              <th class="qna_title t_header pd_left"><b>제목</b></th>
            </tr>
            <tr class="list_row" v-for="(qna, index) in qnaList" :key="index">
              <td class="qna_num t_list">{{ index + 1 }}</td>
              <td class="qna_userName t_list">{{ qna.mem_name }}</td>
              <td class="qna_title inquiry_list">
                <div class="accordion_wrap">
                  <div
                    class="que"
                    @click="accordion_qna(index)"
                    :class="{ opened: qna.opened }"
                  >
                    <b>{{ qna.qes_title }}</b>
                    <div class="arrow_wrap">
                      <div class="arrow" :class="{ rotated: qna.opened }"></div>
                    </div>
                    <div class="ans" :class="qna.opened">
                      <div class="ans_list">
                        <div><b>문의내용</b></div>
                        <div>{{ qna.qes_content }}</div>
                      </div>

                      <div class="ans_list">
                        <div><b>답변내용</b></div>
                        <div>{{ qna.ans_content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="create_inquiry">
          <button class="button button_charcoal text_white inquiryCreate_btn" style="margin-left:auto"
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
import Sidebar from "@/components/common/SidebarView.vue";
import { useUserStore } from "@/stores/user";
import api from "@/api/axios";

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      user: useUserStore().getUser,

      // 검색
      selectOptions: ["제목"],
      selectOptionsColumn: ["qes_title"],
      selectedOption: "제목",
      isOpen: false,
      searchText: "",
      searchOption: "",

      //페이징
      nowPage: 1,
      showCnt: 10,
      totalCnt: 0,
      pagingCnt: 5,

      pageList: [],
      qnaList: [],
      faqList: [],
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getFaq();
    this.getQnaCnt();
  },

  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      4,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods: {
    // 어떤 게시물이 열려있는지 확인(faq)
    accordion_faq(index) {
      this.faqList.forEach((faq, i) => {
        if (i === index) {
          faq.opened = !faq.opened;
        } else {
          faq.opened = false;
        }
      });
    },
    // 어떤 게시물이 열려있는지 확인(qna)
    accordion_qna(index) {
      this.qnaList.forEach((qna, i) => {
        if (i === index) {
          qna.opened = !qna.opened;
        } else {
          qna.opened = false;
        }
      });
    },
    selectClick() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isOpen = false;
    },
    setSearchText(event) {
      this.searchText = event.target.value;
      this.getQnaCnt();
    },

    getFaq() {
      api.get("/madang/inquiry/getFaq").then((res) => {
        if (res.common.res_code == 200) {
          this.faqList = res.data.faqList;
        } else {
          console.log("자주하는 질문 불러오기 실패");
        }
      });
    },
    getQnaCnt() {
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
        .get("/madang/inquiry/getQnaCnt", {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.totalCnt = res.data.totalCnt;
            if (this.totalCnt > 0) {
              this.getQna(this.nowPage);
              this.getViewPage();
            }
          }
        });
    },
    getQna() {
      let reqBody = new Map();
      reqBody.set("column", this.searchOption);
      reqBody.set("search", this.searchText);

      api
        .get(`/madang/inquiry/getQna/${this.nowPage}`, {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.qnaList = res.data.qnaList;
          } else {
            console.log("문의내역 불러오기 실패");
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
      this.getQna();
      this.getViewPage();
    },
    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }
      this.nowPage = this.endPage + 1;
      this.getQna();
      this.getViewPage();
    },
    changePage(page) {
      this.nowPage = page;
      this.getQna();
    },

    goRegView(){
      sessionStorage.setItem("nowPage", this.nowPage);
      this.$router.push({
        name: "InquiryReg",
        params:{SidebarNo: 4},
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
@import "../../assets/css/madang/inquiry.css";
</style>
