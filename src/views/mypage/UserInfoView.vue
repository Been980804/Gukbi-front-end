<template>
  <div class="container">
    <MyPageSidebar></MyPageSidebar>
    <div class="main_container">
      <div class="userInfo_page">
        <div class="userInfo_page_title f2-5rem">
          <b>회원 정보 조회</b>
        </div>

        <div id="profil">
          <div class="profil_title f1-875rem">
            <b>프로필</b>
          </div>
          <div class="profil_table">
            <img src="../../assets/images/profil.png" alt="profil" class="profil_img"/>
            <div class="profil_info">
              <div class="profilName f1-875rem">
                <b>{{ user.mem_name }}</b>
              </div>
              <div class="profilEmail f0-8rem">{{ user.mem_email }}</div>
              <div class="profilPhone f0-8rem">{{ formatPhoneNum }}</div>
            </div>
          </div>
        </div>


        <div class="modi_table">
          <div class="row">
            <div class="userInfo_th">이름</div>
            <div class="userInfo_th">아이디</div>
            <div class="userInfo_th">비밀번호</div>
            <div class="userInfo_th">생년월일</div>
            <div class="userInfo_th">성별</div>
            <div class="userInfo_th">이메일</div>
            <div class="userInfo_th">휴대폰 번호</div>
            <div class="userInfo_th">관심 분야</div>
          </div>

          <div class="row">
            <input class="userInfo_td" type="text" v-model="user.mem_name" />
            <input class="userInfo_td" type="text" v-model="user.mem_id" readonly />
            <input class="userInfo_td" type="password" v-model="user.mem_pwd" readonly/>
            <input class="userInfo_td" type="date" v-model="user.mem_birth" />
            <div class="userInfo_td_gender">
              <input
                type="radio"
                id="gender_M"
                name="gender"
                value="M"
                v-model="user.mem_gender"
              />
              <label for="gender_M">남자</label>
              <input
                type="radio"
                id="gender_W"
                name="gender"
                value="W"
                v-model="user.mem_gender"
              />
              <label for="gender_W">여자</label>
            </div>
            <input class="userInfo_td" type="text" v-model="user.mem_email">
            <input class="userInfo_td" type="text" v-model="user.mem_phone">
            <div class="userInfo_td_prefer">
              <input type="radio" name="prefer" id="prefer01" value="01" v-model="user.mem_favorite">
              <label for="prefer01">자기계발</label>
              <input type="radio" name="prefer" id="prefer02" value="02" v-model="user.mem_favorite">
              <label for="prefer02">문학</label>
              <input type="radio" name="prefer" id="prefer03" value="03" v-model="user.mem_favorite">
              <label for="prefer03">건강/스포츠</label>
              <input type="radio" name="prefer" id="prefer04" value="04" v-model="user.mem_favorite">
              <label for="prefer04">가정</label>
              <input type="radio" name="prefer" id="prefer05" value="05" v-model="user.mem_favorite">
              <label for="prefer05">종교</label>
              <input type="radio" name="prefer" id="prefer06" value="06" v-model="user.mem_favorite">
              <label for="prefer06">사회/역사</label>
              <input type="radio" name="prefer" id="prefer07" value="07" v-model="user.mem_favorite">
              <label for="prefer07">과학/기술</label>
              <input type="radio" name="prefer" id="prefer08" value="08" v-model="user.mem_favorite">
              <label for="prefer08">경제</label>
              <input type="radio" name="prefer" id="prefer09" value="09" v-model="user.mem_favorite">
              <label for="prefer09">예술</label>
              <input type="radio" name="prefer" id="prefer10" value="10" v-model="user.mem_favorite">
              <label for="prefer10">기타</label>
            </div>
          </div>

          <div class="row_button">
            <div class="idCheck">
              <button class="idCheck_btn button button_charcoal text_white" @click="open_idCheckP">중복 체크</button>
              <IdCheckP v-if="idCheckP" @close="close_idCheckP" />
            </div>
            <div class="pwdCheck">
              <button class="pwdCheck_btn button button_charcoal text_white" @click="open_pwdUpdateP">비밀번호 수정</button>
              <PwdUpdateP v-if="pwdUpdateP" @close="close_pwdUpdateP" />
            </div>
          </div>
        </div>
        <div class="modi_footer">
          <button class="button button_charcoal text_white" @click="updateUserInfo">수정</button>
          <button class="button button_charcoal text_white" @click="open_accountDeleteP">회원탈퇴</button>
          <AccountDeleteP v-if="accountDeleteP" @close="close_accountDeleteP" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user.js";
import MyPageSidebar from "@/components/mypage/MypageSidebar.vue";
import IdCheckP from "@/components/mypage/popup/IdCheckP.vue";
import PwdUpdateP from "@/components/mypage/popup/PwdUpdateP.vue";
import AccountDeleteP from "@/components/mypage/popup/AccountDeleteP.vue";

export default {
  components: { MyPageSidebar, IdCheckP, PwdUpdateP, AccountDeleteP,},
  data() {
    return {
      user: useUserStore().getUser,

      idCheckP : false,
      pwdUpdateP : false,
      accountDeleteP : false,
    };
  },

  computed: {
    formatPhoneNum() {
      if (!this.user.mem_phone) return "";

      return this.user.mem_phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    },
  },

  methods:{
    // 아이디 중복 팝업 열기
    open_idCheckP(){
      this.idCheckP = true;
    },
    // 아이디 중복 팝업 닫기
    close_idCheckP(){
      this.idCheckP = false;
    },
    // 비밀번호 수정 팝업 열기
    open_pwdUpdateP(){
      this.pwdUpdateP = true;
    },
    // 비밀번호 수정 팝업 닫기
    close_pwdUpdateP(){
      this.pwdUpdateP = false;
    },
    // 회원탈퇴 팝업 열기
    open_accountDeleteP(){
      this.accountDeleteP = true;
    },
    // 회원탈퇴 팝업 닫기
    close_accountDeleteP(){
      this.accountDeleteP = false;
    },

    //회원정보 수정
    updateUserInfo(){
      const userInfo = {
        mem_no : this.user.mem_no,
        mem_name : this.user.mem_name,
        mem_id : this.user.mem_id,
        mem_birth : this.user.mem_birth,
        mem_gender : this.user.mem_gender,
        mem_email : this.user.mem_email,
        mem_phone : this.user.mem_phone,
        mem_favorite : this.user.mem_favorite
      };

      this.$api
      .put('mypage/userInfo/updateUserInfo', userInfo)
      .then(res => {
        const common = res.common;
        if(common.res_code == 200){
          const userStore = useUserStore();
          userStore.setUser(userInfo);
          alert('회원 정보가 수정되었습니다.');
          window.location.reload(true);
        }else{
          alert('회원 정보 수정에 실패했습니다.');
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

};
</script>

<style scoped>
@import "../../assets/css/mypage/userinfo.css";
</style>
