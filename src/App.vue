<template>
  <app-header>
    <template v-slot:global-search>
      <global-search></global-search>
    </template>
  </app-header>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import GlobalSearch from './components/headers/GlobalSearch.vue'

export default {
  name: 'Summoner',
  components: {
    AppHeader,
    GlobalSearch
  }
}
</script>

<style lang="scss">
body, html {
  margin: 0;
  padding: 0;
  font-family: AppleSDGothicNeo, Helvetica, sans-serif;
}
h1, h2, h3, h4, ul, li, form, input {
  margin: 0;
  padding: 0;
}
.container {
  position: relative;
  width: 1000px;
  margin: 0 auto;
}
.container:after {
  display: block;
  content: "";
  clear: both;
}
</style>