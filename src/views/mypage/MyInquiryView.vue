<template>
  <div class="container">
    <MyPageSidebar />
    <div class="main_container">
      <div class="myInquiry_page">
        <div class="myInquiry_header">
          <div class="search_box">
            <input
              type="text"
              class="search_box_input"
              placeholder="검색어 입력"
            />
            <img
              class="search_box_img"
              src="../../assets/images/search_btn_icon.svg"
            />
          </div>

          <div class="create_inquiry">
            <button class="button button_charcoal text_white inquiryCreate_btn">
              문의하기
            </button>
          </div>
        </div>

        <div class="myInquiry_header_title f2-5rem">
          <b>개별 문의 내역</b>
        </div>

        <table class="myInquiry_table">
          <tr class="myInquiry_table_header">
            <th class="myInquiry_num t_header"><b>번호</b></th>
            <th class="myInquiry_title pd_left"><b>제목</b></th>
            <th class="myInquiry_delete t_header"><b>삭제</b></th>
          </tr>
          <!-- 아코디언 -->
          <tr v-for="(inquiry, index) in inquiryList" :key="index" class="list_row">
            <td class="myInquiry_num list_fixed t_list">{{index+1}}</td>
            <td class="myInquiry_title inquiry_list">
              <div class="accordion_wrap">
                <div class="que" @click="accordion(index)" :class="{opened : inquiry.opened}">
                  <b>{{inquiry.qes_title}}</b>
                  <div class="arrow_wrap">
                    <div class="arrow" :class="{rotated:inquiry.opened}"></div>
                  </div>
                  <div class="ans" :class="inquiry.opened">
                    <div class="ans_list">
                      <div><b>문의내용</b></div>                      
                      <div>{{inquiry.qes_content}}</div>
                    </div>

                    <div class="ans_list">
                      <div><b>답변내용</b></div>
                      <div>{{inquiry.ans_content}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="myInquiry_delete">
              <button class="button button_charcoal text_white myInquiry_btn" @click="deleteMyInquiry(inquiry.qna_no)">삭제</button>
            </td>
          </tr>         
        </table>
        <div class="page_line_box">
          <div class="page_box_img"><img src="../../assets/images/arrow-left.svg"></div>
          <div class="page_box_text">&nbsp;1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;4&nbsp;&nbsp;5&nbsp;&nbsp;</div>
          <div class="page_box_img"><img src="../../assets/images/arrow-right.svg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import MyPageSidebar from "@/components/mypage/MypageSidebar.vue";

export default {
  components: { MyPageSidebar },
  data() {
    return {
      user: useUserStore().getUser,
      inquiryList : [],
    };
  },
  created(){
    this.getMyInquiry();
  },

  methods: {
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
    getMyInquiry(){
      this.$api
      .get(`mypage/inquiry/getMyInquiry/${this.user.mem_no}`)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          const data = res.data;
          this.inquiryList = data.inquiryList.map(inquiry => {
            return {
              ...inquiry,
              opened : false,
            }
          })
        }else{
          alert('개별문의내역 조회 실패');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 개별문의내역 삭제
    deleteMyInquiry(qna_no){
      const reqBody = {
        qna_no : qna_no.toString(),
        mem_no : this.user.mem_no
      };
      if(confirm("정말 삭제하시겠습니까?")){
        this.$api
      .post("/mypage/inquiry/deleteInquiry", reqBody)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          alert('문의내역이 삭제되었습니다.');
          window.location.reload(true);          
        }else {
          alert('문의내역 삭제 실패');
        }
      })
      .catch(err => {
        console.log(err);
      })
      }
      
    },

    updateMyInquiry(){

    }
  },
};
</script>

<style scoped>
/* @import "../../assets/css/mypage/myInquiry.css"; */
</style>
