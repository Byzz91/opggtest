<template>
  <app-header>
    <template v-slot:global-search>
      <global-search></global-search>
    </template>
  </app-header>

  <app-top>
    <summoner-profile v-if="summonerProfile" :summoner="summonerProfile"></summoner-profile>
  </app-top>

  <div class="container">
    <aside class="sidebar">
      <rank-box v-if="summonerProfile" :summoner="summonerProfile"></rank-box>
    </aside>
    
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppTop from './components/AppTop.vue'
import GlobalSearch from './components/headers/GlobalSearch.vue'
import SummonerProfile from './components/tops/SummonerProfile.vue'
import RankBox from './components/aside/RankBox.vue'
import { SUMMONER_INFO } from '../src/classes/opgg.consts'

export default {
  name: 'Summoner',
  components: {
    AppHeader,
    AppTop,
    GlobalSearch,
    SummonerProfile,
    RankBox,
  },
  data() {
    return {
      /**
       * 검색 문자열
       */
      search: '',
      /**
       * 검색된 서머너의 이름
       */
      summonerProfile: undefined,
    }
  },
  methods: {
    /**
     * 서머너의 관련된 정보를 가져옵니다.
     */
    getSummonerProfile() {
      let endpoint = SUMMONER_INFO.replace('{summonerName}', encodeURIComponent(this.search))

      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log('data.summoner', data.summoner)
            this.summonerProfile = data.summoner
          })
    }
  },
  created() {
    let capture = /search=(.*)/.exec(window.location.search)

    if (capture != null) {
      this.search = capture[1]
    }
  },
  mounted() {
    this.getSummonerProfile()
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
.sidebar {
  width: 300px;
  margin-right: 10px;
}

</style>