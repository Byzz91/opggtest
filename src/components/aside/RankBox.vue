<template>
  <div class="rank-box" 
    v-for="(league, index) in getLeagues" :key="index">
    <img :src="league.tierRank.imageUrl" :alt="league.tierRank.tier">

    <div class="text-info">
      <span class="rows rank-type">{{ league.tierRank.name }}</span>
      <span class="rows total-game">(총 {{ numberFormat(league.wins + league.losses) }}게임)</span>
      <span class="rows tier">{{ league.tierRank.tier }}</span>
      <span class="rows">
        <em class="lp">{{ league.tierRank.lp }} LP</em>
        <span class="winloss">{{ league.wins }}승 {{ league.losses }}패</span>
      </span>
      <span class="rows winrate">승률 {{ Math.round((league.wins / (league.wins + league.losses)) * 100) }}%</span>
    </div>
  </div>
</template>

<script>
import { numberFormat } from '../../common/utils'

export default {
  name: 'RankBox',
  props: {
    summoner: Object,
  },
  methods: {
    numberFormat: numberFormat,
  },
  computed: {
    getLeagues: function () {
      return this.summoner.leagues.filter(r => r.hasResults)
    }
  }
}
</script>

<style lang="scss" scope>
.rank-box {
  border: 1px solid #cdd2d2;
  background-color: #f2f2f2;
  border-radius: 2px;
  padding: 10px 8px;
  margin-bottom: 10px;
  overflow: hidden;

  > img {
    width: 104px;
    height: 104px;
    float: left;
  }
  .text-info {
    float: left;
    margin-top: 5px;
    
    .rows {
      display: block;
      font-family: AppleSDGothicNeo;
      font-size: 12px;

      &:first-child {
        margin-top: 10px;
      }
      
      &.rank-type {
        color: #879292;
        font-size: 11px;
      }

      &.tier {
        color: #1f8ecd;
        font-size: 15px;
        font-weight: bold;
      }

      .lp {
        font-size: 12px;
        font-style: normal;
        font-weight: bold;
        font-family: Helvetica;
      }

      .winloss {
        font-family: Helvetica;
        font-size: 12px;
        color: #879292;
        font-weight: normal;
        &:before {
          display: inline-block;
          content: "/";
          margin: 0 3px;
        }
      }

      &.winrate {
        color: #879292;
        font-size: 12px;
      }
    }
  }
}
</style>