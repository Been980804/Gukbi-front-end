<template>
  <div class="join">
    <button class="imgbtn logo_h" @click="goMain">
      <img src="../../assets/images/logo_h.png" alt="LOGO">
    </button>
    <div class="input_form w20rem">
      <div class="con">
        <input type="text" placeholder="이름을 입력하세요." v-model="name">
        <div class="input-err" :style="{ display: errorMsg.isShowNameErrMsg ? 'block' : 'none'}">
          이름을 확인하세요.
        </div>
      </div>
      <div class="con">
        <div class="flex-sb">
          <input class="wCalc-20" type="text" placeholder="아이디를 입력하세요." v-model="id">
          <button class="btn_charcoal rad10 wCalc-80 h1rem f0-8rem" @click="checkDuplicate()">중복확인</button>
        </div>
        <div class="input-err" :style="{ display: errorMsg.isShowIdErrMsg ? 'block' : 'none'}">
          아이디를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="password" placeholder="비밀번호를 입력하세요." v-model="password">
        <div class="input-err" :style="{ display: errorMsg.isShowPasswordErrMsg ? 'block' : 'none'}">
          비밀번호를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="text" placeholder="생년월일 8자리를 입력하세요." v-model="birth">
        <div class="input-err" :style="{ display: errorMsg.isShowBirthErrMsg ? 'block' : 'none'}">
          생년월일을 확인하세요.
        </div>
      </div>
      <div class="con" style="position: relative;">
        <div class="m_gender_box">
          성별<div class="margin_right20"></div>
          <input type="radio" v-model="gender" value="M">남자
          <input type="radio" v-model="gender" value="W" style="margin-left: 12px;">여자
        </div>
      </div>
      <div class="con">
        <div class="flex-sb">
          <input class="wCalc-20" type="text" placeholder="관심분야를 선택하세요." v-model="prefer" disabled = 'true'>
          <button class="btn_charcoal rad10 wCalc-80 h1rem f0-8rem" @click="showPrefer()">관심분야</button>
        </div>
        <div class="input-err" :style="{ display: errorMsg.isShowPreferMsg ? 'block' : 'none'}">
          관심분야를 선택하세요.
        </div>
      </div>
      <div class="con">
        <input type="email" placeholder="이메일주소를 입력하세요." v-model="email">
        <div class="input-err" :style="{ display: errorMsg.isShowEmailErrMsg ? 'block' : 'none'}">
          이메일 주소를 확인하세요.
        </div>
      </div>
      <div class="con">
        <input type="text" placeholder="휴대폰 번호를 입력하세요." v-model="phone">
        <div class="input-err" :style="{ display: errorMsg.isShowPhoneErrMsg ? 'block' : 'none'}">
          휴대폰 번호를 확인하세요.
        </div>
      </div>
      <button class="btn_charcoal rad20 mt1rem" @click="joinCheck()">회원가입</button>
    </div>
    <div class="flex-sb mt1rem w13-5rem f0-8rem">
      <img src="../../assets/images/user_icon2.svg" alt="user_icon2">
      <div class="gray">이미 계정이 있으신가요?</div>
      <router-link to="/Login" class="underline_a">로그인</router-link>
    </div>
    <modal :style="{display: isOpenPrefer ? 'block' : 'none'}" @selectCategory="selectPrefer"></modal>
  </div>
</template>
<script>
import api from "@/api/axios";
import cUtil from "@/utils/commonUtil";
import modal from "@/components/common/CategoryP.vue"
export default {
  components: {
    modal
  },

  data() {
    return {
      id: '',
      name: '',
      password: '',
      birth: '',
      email: '',
      phone: '',
      prefer: '',

      errorMsg: {
        isShowNameErrMsg: false,
        isShowIdErrMsg: false,
        isShowPasswordErrMsg: false,
        isShowBirthErrMsg: false,
        isShowEmailErrMsg: false,
        isShowPhoneErrMsg: false,
        isShowPreferMsg: false
      },

      gender: "M", // 기본 값 M
      isOpenPrefer: false // 팝업화면이 보이는 상태인지
    }
  },

  methods: {
    goMain() { // 메인으로
      this.$router.push({ name: 'Main' })
    },

    checkDuplicate() { // 중복체크
      if(this.id == '') {
        return;
      }

      api.get(`/user/duplicate/${this.id}`)
        .then(res => {
          if (res.common.res_code == 200) { // 응답성공
            console.log(res.data.userInfo);
          } else { // 응답실패
            console.log("BookListView book/bookCount 응답실패");
          }
        })
    },

    joinCheck() { // 회원가입 유효성 체크
      this.errorMsg.isShowNameErrMsg = cUtil.checkName(this.name);
      this.errorMsg.isShowIdErrMsg = cUtil.checkId(this.id);
      this.errorMsg.isShowPasswordErrMsg = cUtil.checkPassword(this.password);
      this.errorMsg.isShowBirthErrMsg = cUtil.checkBirth(this.birth);
      this.errorMsg.isShowEmailErrMsg = cUtil.checkEmail(this.email);
      this.errorMsg.isShowPhoneErrMsg = cUtil.checkPhone(this.phone);
      if(this.prefer != '') {
        this.errorMsg.isShowPreferMsg = false;
      } else {
        this.errorMsg.isShowPreferMsg = true;
      }

      let check = false;
      for(let msg in this.errorMsg) {
        if(this.errorMsg[msg] == true) {
          check = true;
          break;
        }
      }

      if(check == true) { // 회원가입 불가
        return;
      } else {
        console.log("회원가입");
      }
    },

    showPrefer() { // 관심분야 선택 팝업 보이기
      this.isOpenPrefer = true;
    },

    selectPrefer(result) { // 관심분야 선택 설정
      this.isOpenPrefer = false;
      this.prefer = result;
    }
  }
}
</script>
<style>
@import "../../assets/css/join.css";
</style>