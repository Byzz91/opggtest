<template>
  <ul class="previous-tiers">
    <li v-for="(prevTier, index) in summoner.previousTiers" :key="index">
      <em>{{ prevTier.shortString }}</em> <span>{{ prevTier.tier }}</span>
    </li>
  </ul>
  <div class="user-profile">
    <span class="profile-border">
      <img :src="summoner.profileImageUrl" alt="">
    </span>
    <div class="profile-text">
      <span class="rows summoner-name">{{ purifyName(summoner.name) }}</span>
      <span class="rows summoner-rank">레더 랭킹 {{ numberFormat(summoner.ladderRank.rank) }} (상위 {{ summoner.ladderRank.rankPercentOfTop }}%)</span>
    </div>
  </div>
</template>

<script>
import { numberFormat, purifyName } from '../../classes/Utils'

export default {
  name: 'SummonerProfile',
  props: {
    summoner: Object
  },
  methods: {
    numberFormat: numberFormat,
    purifyName: purifyName,
  }
}
</script>

<style lang="scss" scope>
.previous-tiers {
  width: 100%;
  list-style: none;
  overflow: hidden;
  margin-bottom: 9px;
  margin-left: 7px;

  li {
    float: left;
    width: auto;
    height: 20px;
    margin: 0 7px 0 0;
    padding: 4px 5px 3px;
    border-radius: 2px;
    border: solid 1px #d0d3d4;
    background-color: #e0e3e3;
    font-family: Helvetica, sans-serif;
    font-size: 11px;
    letter-spacing: -0.42px;
    text-align: center;
    box-sizing: border-box;
    line-height: 12px;
    color: #657070;
    em {
      font-style: normal;
      font-weight: bold;
    }
  }
}
.user-profile {
  overflow: hidden;

  .profile-border {
    float: left;
    display: block;
    width: 120px;
    height: 120px;
    > img {
      width: 100%;
      height: 100%;
      border: 5px solid #eee;
      box-sizing: border-box;
    }
  }
  .profile-text {
    float: left;
    margin-left: 17px;
    .rows {
      display: block;
    }
    .summoner-name {
      font-family: AppleSDGothicNeo;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: -0.77px;
      color: #242929;
      line-height: 40px;
    }
    .summoner-rank {
      font-size: 11px;
      letter-spacing: -0.42px;
      color: #657070;
    }
  }
}
</style>