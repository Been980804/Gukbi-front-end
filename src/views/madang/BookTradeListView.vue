<template>
  <div class="container">
    <Sidebar ref="Sidebar"></Sidebar>
    <div class="main_container">
      <div class="bookTrade_page">
        <div class="bookTrade_page_title f2-5rem">
          <b>도서 거래 게시판</b>
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

        <div class="bookTradeList">
          <table class="trade_table">
            <tr class="trade_table_header">
              <th class="trade_num t_header">번호</th>
              <th class="trade_userName t_header">판매자</th>
              <th class="trade_title t_header">제목</th>
              <th class="trade_bookTitle t_header">도서명</th>
              <th class="trade_publisher t_header">출판사</th>
              <th class="trade_price t_header">가격</th>
              <th class="trade_state t_header">판매상태</th>
            </tr>

            <tr
              class="list_row"
              v-for="(trade, index) in tradeList"
              :key="index"
            >
              <td class="trade_num t_list">{{ index + 1 }}</td>
              <td class="trade_userNmae t_list">{{ trade.mem_name }}</td>
              <td class="trade_title t_list">{{ trade.trade_title }}</td>
              <td class="trade_bookTitle t_list">
                {{ trade.trade_book_title }}
              </td>
              <td class="trade_publisher t_list">
                {{ trade.trade_publisher }}
              </td>
              <td class="trade_price t_list">
                {{ formatPrice(trade.trade_price) }}
              </td>
              <td
                class="trade_state t_list"
                :class="getStateClass(trade.trade_state)"
              >
                {{ trade.trade_state }}
              </td>
            </tr>
          </table>

          <div class="trade_create">
            <button class="button button_charcoal text_white">등록</button>
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
import { useUserStore } from '@/stores/user';
import api from "@/api/axios";
import Sidebar from "../../components/common/SidebarView.vue";

export default {
  components: { Sidebar },
  data(){
    return{
      user : useUserStore().getUser,

      // 검색
      selectOptions : ["도서명", "출판사"],
      selectOptionsColumn : ["trade_book_title", "trade_publisher"],
      selectedOption : "도서명",
      isOpen : false,
      searchText : "",
      searchOption : "",

      // 페이징
      nowPage : 1,
      showCnt : 10,
      totalCnt : 0,
      pagingCnt : 5,

      tradeList : [],
      pageList : [],
    }
  },
  created(){
     if (sessionStorage.getItem("nowPage") != null || undefined) {
      this.currentPage = sessionStorage.getItem("nowPage");
    }

    this.getBookTradeCnt();
  },
  mounted() {
    this.$refs.Sidebar.setCurrentMenu(
      3,
      this.$route.path,
      this.$route.query.menuNo
    );
  },
  methods:{
    selectClick() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isOpen = false;
    },
    setSearchText(event) {
      this.searchText = event.target.value;
      this.getBookTradeCnt();
    },

    getBookTradeCnt(){
      let cnt = 0;
      for(const column of this.selectOptions){
        if(column == this.selectedOption){
          break;
        }
        cnt++;
      }

      let column = this.selectOptionsColumn[cnt];
      this.searchOption = column;
      let reqBody = new Map();
      reqBody.set("column", column);
      reqBody.set("search", this.searchText);

      api.get('/madang/bookTrade/bookTradeCnt', {params : Object.fromEntries(reqBody)})
      .then(res => {
        if(res.common.res_code == 200){
          this.totalCnt = res.data.totalCnt;
        
          if(this.totalCnt > 0){
            this.getBookTrade(this.nowPage);
            this.getViewPage();
          }
        }
      })
    },

    getBookTrade(){
      let reqBody = new Map();
      reqBody.set("column", this.searchOption);
      reqBody.set("search", this.searchText);

      api.get(`/madang/bookTrade/bookTradeList/${this.nowPage}`, {params: Object.fromEntries(reqBody)})
      .then(res => {
        if(res.common.res_code == 200){
          this.tradeList = res.data.tradeList;
        }else{
          console.log("거래도서 게시글 가져오지 못함")
        }
      })
    },

    // 가격 18000 -> 18,000 으로 변경
    formatPrice(price) {
      const changePrice = parseInt(price);
      if (!isNaN(changePrice)) {
        return changePrice.toLocaleString("ko-KR");
      } else {
        return changePrice;
      }
    },
     // 판매 상태에 따른 색 변경
    getStateClass(state) {
      return {
        text_blue: state === "판매중",
        text_green: state === "판매완료",
      };
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
      this.getBookTrade();
      this.getViewPage();
    },

    nextPage() {
      if (this.startPage + this.pagingCnt > this.totalPage) {
        // 마지막페이지일 경우
        console.log("마지막페이지입니다.");
        return;
      }

      this.nowPage = this.endPage + 1;
      this.getBookTrade();
      this.getViewPage();
    },

    changePage(page) {
      this.nowPage = page;
      this.getBookTrade();
    },
  },
  computed:{
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
  }
};
</script>

<style scoped>
@import "../../assets/css/madang/bookTrade.css";
</style>
