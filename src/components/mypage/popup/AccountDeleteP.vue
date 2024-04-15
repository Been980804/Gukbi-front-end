<template>
  <div class="accountDelete_popup">
    <div class="accountDelete_popup_main">
      <div class="accountDelete_popup_body">
        <div class="accountDelete_popup_title">
          <h1 class="h1_title">※ 탈퇴안내</h1>
        </div>
        <div class="accountDelete_info_list">
          <div class="accountDelete_info">
            <table>
              <tr class="main_info">
                <td>
                  <img src="../../../assets/images/dash.png" />
                  사용하고 계시는 아이디는(...)는 탈퇴시 재사용및 복구가 불가능
                  합니다.
                </td>
              </tr>
              <tr class="sub_info">
                <td>
                  <b class="text_red">탈퇴한 아이디는 본인과 타인 모두 재사용및 복구</b>
                  가 불가하오니 신중하게 선택하시기 바랍니다.
                </td>
              </tr>
            </table>
          </div>
          <div class="accountDelete_info">
            <table>
              <tr class="main_info">
                <td>
                  <img src="../../../assets/images/dash.png" />
                  미반납 도서가 있다면 도서를 먼저 반납하셔야 탈퇴가 가능합니다.
                </td>
              </tr>
              <tr class="sub_info"></tr>
            </table>
          </div>
          <div class="accountDelete_info">
            <table>
              <tr class="main_info">
                <td>
                  <img src="../../../assets/images/dash.png" />
                  탈퇴시, 기존에 작성하신 게시물의 수정/삭제가 불가능 합니다.
                </td>
              </tr>
              <tr class="sub_info"></tr>
            </table>
          </div>
        </div>
        <div class="checkbox">
          <input id="checkbox" type="checkbox" v-model="isChecked" />
          <label for="checkbox">위 내용을 이해하였으며, 탈퇴하겠습니다.</label>
        </div>
        <div class="accountDelete_popup_footer">
          <button class="button_charcoal text_white button" @click="accountDelete_submit">확인</button>
          <button class="button_charcoal text_white button" @click="accountDelete_cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";

export default {
  data() {
    return {
      user: useUserStore().getUser,
      idChecked : false,
    };
  },
  methods:{
    // 회원탈퇴
    accountDelete_submit(){
      if(!this.isChecked){
        alert('탈퇴를 진행하시려면, 안내문을 읽고 체크박스에 동의해주세요.');
        return;
      }
      
      if(confirm('정말로 탈퇴하시겠습니까?')){
        this.$api
        .post('mypage/userInfo/accountDelete', {mem_no : this.user.mem_no})
        .then(res => {
          const common = res.common;
          if(common.res_code == 200){
            alert('탈퇴되었습니다.');
            this.$emit('close');
            const userStore = useUserStore();
            userStore.setUser({});
            this.$router.push({ name: 'Main' });
          }
        }).catch(err => {
          console.log(err);
        })       
      }      
    },
    // 회원탈퇴 팝업 닫기
    accountDelete_cancel(){
        if(confirm("취소하시겠습니까?")){
            this.$emit('close');
        }
    }
  }
};
</script>

<style scoped>
    /* @import "../../../assets/css/mypage/popup/accountDeleteP.css"; */
</style>
