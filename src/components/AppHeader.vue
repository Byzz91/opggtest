<template>
  <header class="header">
    <div class="container">
      <slot name="global-search"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss">
.header {
  background-color: #1ea1f7;
  height: 97px;
  
  .container {
    height: 100%;
  }
}
</style>