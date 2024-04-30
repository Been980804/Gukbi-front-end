const cUtil = {

  checkName(value) {
    // 이름이 공백인 경우
    if(value == '') { return true; }

    // 한글, 영어만 입력 제한
    var reg_name = /^[가-힣a-zA-Z]+$/;
    if(!reg_name.test(value)) { return true; }

    // 이름 길이 제한 확인
    if(value.length < 2 || value.length > 10) { return true; }

    return false;
  },

  checkId(value) {
    // 아이디가 공백인 경우
    if(value == '') { return true; }

    // 영어, 숫자만 입력 제한
    var reg_id = /^[a-zA-Z0-9]+$/;
    if(!reg_id.test(value)) { return true; }

    // 아이디 길이 제한 확인
    if(value.length < 2 || value.length > 16) { return true; }

    return false;
  },

  checkBirth(value) {
    var reg_birth = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return reg_birth.test(value) ? true : false;
  },

  checkOnlyNumber(value) {
    return value.replace(/[^0-9]/gi, '');
  },

  checkEmail(value) {
    // eslint-disable-next-line
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    return reg_email.test(value) ? true : false;
  },

}

export default cUtil;