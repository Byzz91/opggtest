<template>
  <div :class="['match-preview', { winner: match.isWin }, { loser: !match.isWin }]">
    <div class="col-1">
      <span class="game-type">{{ convertGameType(match.gameType) }}</span><br>
      <span class="timeago">{{ convertTimestamp(match.createDate) }}</span><br>
      <span class="is-win">{{ match.isWin ? '승리' : '패배' }}</span><br>
      <span>{{ convertDuration(match.gameLength) }}</span><br>
    </div>
    <div class="col-2">
      <img :src="match.champion.imageUrl" alt="Champion Image">
      <div class="spells">
        <img :src="match.spells[0].imageUrl" alt="spell1">
        <img :src="match.spells[1].imageUrl" alt="spell2">
      </div>
      <div class="perks">
        <img :src="match.peak[0]" alt="perk1">
        <img :src="match.peak[1]" alt="perk2">
      </div>
    </div>
    <div class="col-3">
      <span>{{ match.stats.general.kill }} / {{ match.stats.general.assist }} / {{ match.stats.general.death }}</span>
      <span>{{ match.stats.general.kdaString }} 평점</span>
    </div>
    <div class="col-4">
      <ul class="items">
        <li v-for="(item, index) in match.items" :key="index">
          <img :src="item.imageUrl" alt="item">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'MatchPreview',
  props: {
    match: Object,
  },
  methods: {
    convertGameType(gameType) {
      if (gameType == '자유 5:5 랭크') {
        return '랭크'
      } else if (gameType == '무작위 총력전') {
        return '총력'
      }

      return gameType
    },
    convertTimestamp(timestamp) {
      return moment.unix(timestamp).fromNow(true)
    },
    convertDuration(duration) {
      let minutes = Math.ceil(duration / 60)
      let seconds = duration % 60
      return `${minutes}분 ${seconds}초`
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scope>
.match-preview {
  height: 96px;
  border: solid 1px #a7a7a7;
  margin-bottom: 8px;
  background-color: #b6b6b6;
  font-family: AppleSDGothic;
  font-size: 11px;
  color: #555555;
  &.winner { background-color: #b0ceea; }
  &.loser { background-color: #d6b5b2; }

  .col-1 {
    float: left;
    width: 90px;
    line-height: 18px;
    margin-top: 10px;
    text-align: center;
    > span {
      display: inline-block;
      text-align: center;
      &.game-type { font-weight: bold; }
      &.is-win { font-weight: bold; }
      &.timeago { border-bottom: 1px solid #94b9d6; }
    }
  }
  .col-2 {
    float: left;
    width: 120px;
    margin-top: 25px;
    > img {
      float: left;
      width: 46px;
      height: 46px;
      border-radius: 50%;
    }
    .spells {
      float: left;
      width: 22px;
      margin-left: 5px;
      > img {
        width: 22px;
        height: 22px;
        border-radius: 5px;
      }
    }
    .perks {
      float: left;
      width: 22px;
      margin-left: 5px;
      > img {
        width: 22px;
        height: 22px;
        border-radius: 5px;
      }
    }
  }
  .col-3 {
    float: left; 
    width: 80px;
    font-size: 14px;
    text-align: center;
    margin-top: 30px;
    > span {
      display: block;
      font-weight: bold;
    }
  }
  .col-4 {
    float: left;
    width: 100px;
    margin-top: 25px;
    margin-left: 20px;
    .items {
      width: 80px;
      li {
        float: left;
        margin-right: 2px;
      }
    }
    img {
      width: 22px;
      height: 22px;
      border-radius: 5px;
    }
  }
}
</style>