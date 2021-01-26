<template>
  <div class="app-top">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTop',
}
</script>

<style lang="scss">
.app-top {
  border-bottom: 1px solid #d8d8d8;
  box-sizing: border-box;
  padding: 20px 30px 15px 30px;
  margin-bottom: 10px;
}
</style>