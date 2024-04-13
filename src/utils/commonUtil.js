const cUtil = {

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