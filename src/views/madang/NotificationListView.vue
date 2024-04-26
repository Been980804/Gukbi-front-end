<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="noti_page">
        <div class="noti_page_title f2-5rem">
          <b>공지사항</b>
        </div>

        <div class="noti_search">
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

        <div class="notiList">
          <table class="noti_table">
            <tr class="noti_table_header">
              <th class="noti_num t_header">번호</th>
              <th class="noti_userName t_header">작성자</th>
              <th class="noti_title t_header">제목</th>
              <th class="noti_views t_header">조회수</th>
              <th class="noti_regDate t_header">등록일</th>
            </tr>

            <tr class="list_row" v-for="(noti, index) in notiList" :key="index">
              <td class="noti_num t_list">{{index + 1}}</td>
              <td class="noti_userName t_list">{{noti.mem_name}}</td>
              <td class="noti_title t_list">{{noti.noti_title}}</td>
              <td class="noti_views t_list">{{noti.noti_cnt}}</td>
              <td class="noti_regDate t_list">{{noti.reg_date}}</td>
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
import { useUserStore } from "@/stores/user";
import Sidebar from "../../components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  data() {
    return {
      user: useUserStore().getUser,

      // 검색
      selectOptions: ["제목"],
      selectOptionsColumn: ["noti_title"],
      selectedOption: "제목",
      isOpen: false,
      searchText: "",
      searchOption: "",

      // 페이징
      nowPage: 1,
      showCnt: 10,
      totalCnt: 0,
      pagingCnt: 5,

      pageList: [],
      notiList:[],
    };
  },
  created() {
    if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.nowPage = sessionStorage.getItem("nowPage");
    }

    this.getNotiListCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      4,
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
      this.getNotiListCnt();
    },

    getNotiListCnt() {
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
        .get("/madang/notiList/notiListCnt", {
          params: Object.fromEntries(reqBody),
        })
        .then((res) => {
          if (res.common.res_code == 200) {
            this.totalCnt = res.data.totalCnt;

            if (this.totalCnt > 0) {
              this.getNotiList(this.nowPage);
              this.getViewPage();
            }
          }
        });
    },

    getNotiList() {
      let reqBody = new Map();
      reqBody.set("column", this.searchOption);
      reqBody.set("search", this.searchText);

      api.get(`/madang/notiList/notiList/${this.nowPage}`, {params : Object.fromEntries(reqBody)})
      .then(res => {
        if(res.common.res_code == 200){
          this.notiList = res.data.notiList;
        } else{
          console.log('공지사항 가져오지 못함');
        }
      })
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
      this.getNotiList();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getNotiList();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getNotiList();
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
@import "../../assets/css/madang/notification.css";
</style>
