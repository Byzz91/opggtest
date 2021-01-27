<template>
  <div class="win-rates">
    <ul class="tabs">
      <li :class="{ active: currentTab == TAB_CHAMPION }">
        <button @click="currentTab = TAB_CHAMPION">챔피언 승률</button>
      </li>
      <li :class="{ active: currentTab == TAB_SEVENDAYS }">
        <button @click="currentTab = TAB_SEVENDAYS">7일간 랭크 승률</button>
      </li>
    </ul>

    <ul class="datalist champion" v-show="currentTab == TAB_CHAMPION">
      <li v-for="(champ, index) in getChampionSorted" :key="index">
        <img :src="champ.imageUrl" :alt="champ.name">

        <ul class="text-info">
          <li class="above champ-name">{{ champ.name }}</li>
          <li class="above average">{{ champ.average }}:1 평점</li>
          <li class="above winrate">{{ champ.winrate }}%</li>
          <li class="below cs">CS {{ champ.cs }}</li>
          <li class="below kda">{{ champ.kills }} / {{ champ.deaths }} / {{ champ.assists }}</li>
          <li class="below games">{{ champ.games }}게임</li>
        </ul>
      </li>
    </ul>
    
    <ul class="datalist rates-seven" v-show="currentTab == TAB_SEVENDAYS">
      <li v-for="(champ, index) in getSevenSorted" :key="index">
        <img :src="champ.imageUrl" :alt="champ.name" class="small">

        <span class="inline-info champ-name">{{ champ.name }}</span>
        <span class="inline-info winrate">{{ champ.winrate }}%</span>
        <div class="inline-info winrate-graph">
          <em class="win">{{ champ.wins }}승</em>
          <em class="loss">{{ champ.losses }}패</em>
          <span class="winrate-draw" :style="{ width: `${champ.winrate}%`, }"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WinRates',
  props: {
    mostChamp: Object,
  },
  data() {
    return {
      TAB_CHAMPION: 1,
      TAB_SEVENDAYS: 2,
      /**
       * 현재 선택된 탭을 나타냅니다.
       */
      currentTab: undefined,
    }
  },
  methods: {
  },
  computed: {
    getChampionSorted() {
      this.mostChamp.champions.map(r => {
        // 챔피언 이미지 변환처리
        r.imageUrl = r.imageUrl.split('?')[0]

        // 평균점수 구하기
        r.average = parseFloat((r.kills + r.assists) / r.deaths).toFixed(2)

        // 승률 구하기
        r.winrate = Math.round((r.wins / r.games) * 100)
      })

      // 정렬, 게임 횟수가 많은 순에서 내림차순
      this.mostChamp.champions.sort((a, b) => {
        return b.games - a.games
      })

      return this.mostChamp.champions
    },
    getSevenSorted() {
      // 승률 구하기
      this.mostChamp.recentWinRate.map(r => {
        r.games = r.wins + r.losses
        r.winrate = Math.round((r.wins / r.games) * 100)
        r.lossrate = parseFloat(100 - r.winrate)
      })

      // 정렬, 게임 횟수 내림차순
      this.mostChamp.recentWinRate.sort((a, b) => {
        return b.winrate - a.winrate
      })

      return this.mostChamp.recentWinRate
    }
  },
  created() {
    this.currentTab = this.TAB_CHAMPION
  }
}
</script>

<style lang="scss" scope>
.win-rates {
  border: 1px solid #cdd2d2;
  background-color: #ededed;
  border-radius: 2px;
  margin-bottom: 10px;
  overflow: hidden;

  .tabs {
    list-style: none;
    overflow: hidden;

    li {
      width: 50%;
      box-sizing: border-box;
      float: left;
      height: 44px;
      background-color: #f6f6f6;
      border-bottom: 1px solid #cdd2d2;

      &.active {
        background-color: #ededed;
        border-bottom: 0;
      }

      &.active:first-child {
        border-right: 1px solid #cdd2d2;
      }

      &.active:last-child {
        border-left: 1px solid #cdd2d2;
      }

      > button {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        cursor: pointer;
        background-color: transparent;
        font-size: 12px;
        font-family: AppleSDGothicNeo, sans-serif;
        color: #879292;
      }
    }
  }

  .datalist {
    overflow: hidden;
    li {
      overflow: hidden;
      padding: 7px 15px;
      border-bottom: 1px solid #d1d1d1;
      &:last-child {
        border-bottom: none;
      }

      img {
        float: left;
        border-radius: 50%;
        width: 45px; 
        height: 45px;
      }
      .text-info {
        float: left;
        width: calc(100% - 45px);
        font-family: AppleSDGothicNeo;
        font-size: 13px;
        margin-top: 9px;
        li {
          float: left;
          text-align: center;
          width: 33.3333333%;
          color: #5e5e5e;
          line-height: 16px;
          padding: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border: none;

          &.above {
            font-weight: bold;
            font-size: 110%;
          }
          &.below {
            color: #879292;
          }
        }
      }
      .inline-info {
        display: block;
        float: left;
        font-size: 13px;
        color: #5e5e5e;
        margin: 15px 0 0 0;
        &.champ-name {
          margin-left: 15px;
          font-weight: bold;
          width: 60px;
        }
        &.winrate {
          font-weight: bold;
          color: #879292;
          font-family: Helvetica, sans-serif;
          width: 30px;
          text-align: center;
        }
        &.winrate-graph {
          position: relative;
          width: 110px;
          height: 24px;
          background-color: #ee5a52;
          border-radius: 5px;
          margin-top: 11px;
          margin-left: 5px;
          .win, .loss {
            position: absolute;
            left: 2px;
            top: 6px;
            color: #ffffff;
            font-weight: normal;
            font-style: normal;
            font-size: 11px;
            z-index: 10;
          }
          .loss {
            left: unset;
            right: 2px;
          }
          .winrate-draw {
            position: absolute;
            height: 100%;
            top: 0;
            left: 0;
            background-color: #1f8ecd;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
        }
      }
    }
  }
}
</style>