<template>
  <div class="modal">
    <div class="modal_main">
      <div class="modal_body">
        <div class="modal_title">도서 전체 목록</div>
        <div class="modal_title_line_box"></div>
        <input type="radio" v-model="category" value="자기계발">자기계발
        <input type="radio" v-model="category" value="기타">자기계발
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      category: null
    }
  }
}
</script>
<style src="../../assets/css/common/index.css"></style>
