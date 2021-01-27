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
      <win-rates v-if="mostChamp" :mostChamp="mostChamp"></win-rates>
    </aside>
    
    <div class="contents" v-show="summonerMatches" v-if="summonerMatches">
      <match-overview v-if="summonerMatches" :matches="summonerMatches"></match-overview>

      <match-preview v-for="(match, index) in summonerMatches.games"
        :match="match"
        :key="index"></match-preview>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppTop from './components/AppTop.vue'
import GlobalSearch from './components/headers/GlobalSearch.vue'
import SummonerProfile from './components/tops/SummonerProfile.vue'
import RankBox from './components/aside/RankBox.vue'
import API from './common/api'
import WinRates from './components/aside/WinRates.vue'
import MatchOverview from './components/tops/MatchOverview.vue'
import MatchPreview from './components/contents/MatchPreview.vue'

export default {
  name: 'Summoner',
  components: {
    AppHeader,
    AppTop,
    GlobalSearch,
    SummonerProfile,
    RankBox,
    WinRates,
    MatchOverview,
    MatchPreview,
  },
  data() {
    return {
      /**
       * 검색 문자열
       */
      summonerName: '',
      /**
       * 검색된 서머너의 프로필 데이터
       */
      summonerProfile: undefined,
      /**
       * mostChamp
       */
      mostChamp: undefined,
      /**
       * summonerMatches
       */
      summonerMatches: undefined,
    }
  },
  methods: {
  },
  created() {
    let capture = /search=(.*)/.exec(window.location.search)

    if (capture != null) {
      this.summonerName = capture[1]
    }
  },
  beforeMount() {
    API.getSummonerInfo(this.summonerName).then(res => {
      console.log('App.vue.summonerInfo', res.summoner)
      this.summonerProfile = res.summoner
    })

    API.getMostChamp(this.summonerName).then(res => {
      console.log('App.vue.mostInfo', res)
      this.mostChamp = res
    })

    API.getSummonerMatches(this.summonerName).then(res => {
      console.log('App.vue.matches', res)
      this.summonerMatches = res
    })
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
ul, li {
  list-style-type: none;
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
  float: left;
}
.contents {
  float: left;
  width: calc(100% - 300px - 10px);
}
</style>