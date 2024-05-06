<template>
  <div class="hopeBookReg_popup">
    <div class="hopeBookReg_popup_main">
      <div class="hopeBookReg_popup_body">
        <div class="hopeBookReg_popup_info">
          <div class="hbr_info_title">
            <b>신청 안내</b>
          </div>

          <div class="hbr_info_qual">
            <b>※ 신청 자격</b>
            <div class="hbr_info_qual_detail">
              ☞ 희망도서 신청은 도서관 회원만 이용이 가능합니다.
              <br />
              ☞ 회원이 아니신 분들은 회원가입 후 이용해 주시기 바랍니다.
            </div>
          </div>

          <div class="hbr_info_before">
            <b>※ 신청 전 주의사항</b>
            <div class="hbr_info_before_detail">
              ☞ 도서관에 이미 있는 도서는 신청 시 반려될 수 있습니다.
              <br />
              ☞ 도서 신청 전 도서관에 이미 있는 도서인지 검색 후 신청하시길
              바랍니다.
            </div>
          </div>

          <div class="hbr_info_after">
            <b>※ 신청 후 주의사항</b>
            <div class="hbr_info_after_detail">
              ☞ 선정적인 도서는 신청 후 반려될 수 있으니 주의하시길 바랍니다.
              <br />
              ☞ 신청 후 사정에 따라 입고까지 지연될 수 있습니다.
            </div>
          </div>
        </div>

        <div class="hopeBookReg_popup_reg">
          <div class="hbr_reg_title">
            <b>희망도서 신청하기</b>
          </div>

          <table class="hbr_reg_table">
            <tr class="hbr_reg_tr">
              <th class="hbr_reg_th">도서명</th>
              <td class="hbr_reg_td">
                <input
                  type="text"
                  placeholder="도서명을 입력해주세요."
                  id="hbrReg_bookTitle"
                />
              </td>
            </tr>
            <tr class="hbr_reg_tr">
              <th class="hbr_reg_th">작가명</th>
              <td class="hbr_reg_td">
                <input
                  type="text"
                  placeholder="작가명을 입력해주세요."
                  id="hbrReg_author"
                />
              </td>
            </tr>
            <tr class="hbr_reg_tr">
              <th class="hbr_reg_th">출판사</th>
              <td class="hbr_reg_td">
                <input
                  type="text"
                  placeholder="출판사를 입력해주세요."
                  id="hbrReg_publisher"
                />
              </td>
            </tr>
          </table>

          <div class="hbr_reg_btnBox">
            <button
              class="button button_charcoal text_white"
              @click="hbr_submit"
            >
              확인
            </button>
            <button
              class="button button_charcoal text_white"
              @click="hbrReg_cancel"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import { useUserStore } from "@/stores/user";

export default {
  data() {
    return {
      user: useUserStore().getUser,
    };
  },
  methods: {
    hbr_submit() {
      let title = document.getElementById("hbrReg_bookTitle").value;
      let author = document.getElementById("hbrReg_author").value;
      let publisher = document.getElementById("hbrReg_publisher").value;

      if (!title) {
        alert("도서명을 입력하세요.");
        return;
      } else if (!author) {
        alert("작가명을 입력하세요.");
        return;
      } else if (!publisher) {
        alert("출판사를 입력하세요.");
        return;
      }

      let reqBody = {
        mem_no: this.user.mem_no,
        appl_title: title,
        appl_author: author,
        appl_publisher: publisher,
      };

      api.post("/mypage/bookAppl/bookApplReg", reqBody).then((res) => {
        if (res.common.res_code == 200) {
          alert("등록되었습니다.");
          window.location.reload(true);
          this.$emit("close");
        } else {
          console.log("도서신청 등록에 실패하였습니다.");
        }
      });
    },
    hbrReg_cancel() {
      if (confirm("취소하시겠습니까?")) {
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
@import "../../../assets/css/mypage/popup/hopeBookRegP.css";
</style>
