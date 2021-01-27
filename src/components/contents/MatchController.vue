<template>
  <div v-if="summonerMatches" v-show="summonerMatches">
    <match-preview 
      :filters="filters"
      :matches="summonerMatches"></match-preview>

    <match-overview 
      :filters="filters"
      :current-filter="currentFilter"
      @f-change="changeFilter"
      :matches="summonerMatches"></match-overview>
  </div>
</template>

<script>
import API from '../../common/api'
import MatchPreview from '../contents/MatchOverview.vue'
import MatchOverview from '../contents/MatchPreview.vue'

export default {
  name: 'MatchController',
  components: {
    MatchPreview,
    MatchOverview,
  },
  data() {
    return {
      currentFilter: undefined,
      filters: {
        ALL: 1,
        SOLO: 2,
        FREERANK: 3,
      },
      /**
       * summonerMatches
       */
      summonerMatches: undefined,
    }
  },
  methods: {
    changeFilter(tab) {
      console.log('-----------------')
      console.log('changeFilter', tab)
      this.currentFilter = tab
    }
  },
  created() {
    // 기본 탭(필터) 지정
    this.currentFilter = this.filters.ALL

    API.getSummonerMatches(this.summonerName).then(res => {
      console.log('App.vue.matches', res)
      this.summonerMatches = res
    })
  }
}
</script>

<style lang="scss" scope>
</style>