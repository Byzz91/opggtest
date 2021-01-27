<template>
  <div class="match-overview">
    <ul class="tabs">
      <li :class="{ active: currentTab == TAB_OVERALL }">
        <button @click="changeTabAndData(TAB_OVERALL)">전체</button>
      </li>
      <li :class="{ active: currentTab == TAB_SOLO }">
        <button @click="changeTabAndData(TAB_SOLO)">솔로게임</button>
      </li>
      <li :class="{ active: currentTab == TAB_FREERANK }">
        <button @click="changeTabAndData(TAB_FREERANK)">자유랭크</button>
      </li>
    </ul>

    <div class="overview-datas" v-show="overview">
      <div class="cols overview">
        <div class="donut-graph">
          <span class="donut-above">{{ overview.games }}전 {{ overview.wins }}승 {{ overview.losses }}패</span>
          <div class="donut-r">
            <div class="donut" :style="`--first: ${overview.donut_win_rate}; --second: ${overview.donut_loss_rate};`">
              <div class="donut__slice donut__slice__first"></div>
              <div class="donut__slice donut__slice__second"></div>
              <div class="donut__label">
                <div class="donut__label__sub">{{ overview.winrate }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="kda-overview">
          <span class="kda">{{ overview.kills }} <span class="vb">/</span> {{ overview.assists }} <span class="vb">/</span> {{ overview.deaths }}</span>
          <span class="kda-rate">
            <em class="t1">{{ overview.kdarate }}:1</em> <em class="t2">({{ overview.kdarate2 }}%)</em>
          </span>
        </div>
      </div>

      <div class="cols champ" v-show="matches.champions">
        <ul class="most-champ">
          <li v-for="(champ, index) in getMostChamps" :key="index">
            <div v-if="champ.status">
              <img :src="champ.imageUrl" :alt="champ.name">

              <div class="rows">
                <span class="champ-name">{{ champ.name }}</span>
              </div>
              <div class="rows">
                <strong class="winrate">{{ champ.winrate }}%</strong> 
                <span class="winloss"> ({{ champ.wins }}승 {{ champ.losses }}패)</span>
                <span class="average">{{ champ.average }} 평점</span>
              </div>
            </div>
            <div v-else>
              <span class="no-image" title="챔피언 정보 없음"></span>
              <span class="no-champion">챔피언 정보가 없습니다.</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="cols position" v-show="matches.positions">
        <span class="position-title">선호 포지션(랭크)</span>

        <ul class="pos-sort">
          <li v-for="(pos, index) in getMostPositions" :key="index">
            <img :src="pos.positionIcon" :alt="pos.positionName">

            <div class="rows">
              <span class="txt-position">{{ pos.positionName }}</span>
            </div>
            <div class="rows">
              <span class="winrate">{{ pos.winrate }}%</span>
              <span class="winrate-h">승률 {{ pos.winrate }}%</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import ICON_TOP from '../../assets/TOP.png'
import ICON_MID from '../../assets/MID.png'
import ICON_AD from '../../assets/AD.png'
import ICON_JNG from '../../assets/JNG.png'
import ICON_SUP from '../../assets/SUP.png'

export default {
  name: 'MatchOverview',
  props: {
    matches: Object,
  },
  data() {
    return {
      TAB_OVERALL: 1,
      TAB_SOLO: 2,
      TAB_FREERANK: 3,
      /**
       * 현재 활성화된 탭을 나타냅니다.
       */
      currentTab: undefined,
      /**
       * 현재탭에 대응되는 정리된 출력데이터가 담겨있습니다.
       */
      overview: undefined,
      /**
       * 한 번 정리된 데이터에 대해서는 다시 정리하지 않습니다.
       */
      overviewCached: {},
    }
  },
  computed: {
    getMostChamps() {
      const limit = 3

      // 승률 및 평점을 계산합니다.
      this.matches.champions.map(r => {
        // 한 번 `computed`된 정보에 대하여 데이터가 틀리지 않도록 기존 `status` 값을 체크합니다.
        r.status = (status in r) ? r.status : true

        r.imageUrl = r.imageUrl.split('?')[0]
        r.winrate = Math.round((r.wins / r.games) * 100)
        r.average = parseFloat((r.kills + r.assists) / r.deaths).toFixed(2)
      })

      // 최개 갯수가 초과되면 그 이후를 절삭합니다.
      if (this.matches.champions.length > limit) {
        this.matches.champions.splice(limit + 1)
      } 

      // 3개 미만일 경우 빈이미지를 출력할 수 있도록 더미데이터를 할당합니다.
      if (this.matches.champions.length < limit) {
        for (let i = this.matches.champions.length; i < limit; i++) {
          this.matches.champions.push({ status: false })
        }
      }

      return this.matches.champions
    },
    getMostPositions() {
      // 승률 및 아이콘 계산
      this.matches.positions.map(r => {
        r.winrate = Math.round((r.wins / r.games) * 100)
        
        switch (r.position) {
          case 'TOP':
            r.positionIcon = ICON_TOP
          break
          case 'MID':
            r.positionIcon = ICON_MID
          break
          case 'AD':
            r.positionIcon = ICON_AD
          break
          case 'JNG':
            r.positionIcon = ICON_JNG
          break
          case 'SUP':
            r.positionIcon = ICON_SUP
          break
          default:
            // NOTE 테스트용도로 삽입 프로덕션 환경에서는 다른 조치가 필요합니다.
            r.positionIcon = ICON_AD
        }
      })

      return this.matches.positions
    }
  },
  methods: {
    /**
     * 현재 탭을 변경 그리고 그에 맞는 데이터를 재할당합니다.
     * 데이터는 성능 향상을 위해 `computed`되어야 합니다.
     * @param Number tab TAB_OVERALL | TAB_SOLO | TAB_FREERANK
     */
    changeTabAndData(tab) {
      switch (tab) {
        case this.TAB_OVERALL:
        case this.TAB_SOLO:
        case this.TAB_FREERANK:
          this.currentTab = tab
        break
        default:
          this.currentTab = this.TAB_OVERALL
      }

      // 기존에 계산된 데이터가 있으면 계산된 데이터로 값을 가져옵니다.
      this.overview = (this.currentTab in this.overviewCached)
                        ? this.overviewCached[this.currentTab]
                        : this.getParsedData(this.currentTab)
    },
    /**
     * 현재 탭의 맞는 데이터들을 파싱해 `overview` 데이터을 구합니다.
     */
    getParsedData(tab) {
      let matches = []
      let filterStr = (() => {
        switch (tab) {
          case this.TAB_SOLO:
            return '솔랭'
          case this.TAB_FREERANK:
            return '자유 5:5 랭크'
          default:
        }

        return null
      })()

      console.info('filterStr', filterStr)
      matches = (filterStr == null) ? this.matches.games : _.filter(this.matches.games, r => r.gameType == filterStr)
      console.info('Filtered MatchList', matches)

      // 모든 경기마다의 결과를 합산하여 저장합니다.
      let bulk = {
        wins: 0,
        losses: 0,
        kills: 0,
        assists: 0,
        deaths: 0,
      }

      _.each(matches, (match, idx) => {
        bulk.assists += match.stats.general.assist
        bulk.deaths += match.stats.general.death
        bulk.kills += match.stats.general.kill

        if (match.isWin) {
          bulk.wins += 1
        } else {
          bulk.losses += 1
        }
      })

      bulk.games = bulk.wins + bulk.losses
      bulk.kdarate = parseFloat((bulk.kills + bulk.assists) / bulk.deaths).toFixed(2)
      bulk.kdarate2 = Math.round((bulk.kills / (bulk.kills + bulk.assists + bulk.deaths)) * 100)
      bulk.winrate = Math.round((bulk.wins / (bulk.wins + bulk.losses)) * 100)
      bulk.donut_win_rate = 1 - (bulk.winrate / 100) + 0.1
      bulk.donut_loss_rate = 1 - bulk.donut_win_rate
      console.log('will cache', bulk)
      
      // do cache
      this.overviewCached[tab] = bulk 
      return this.overviewCached[tab]
    }
  },
  created() {
    this.currentTab = this.TAB_OVERALL
    this.overview = this.getParsedData(this.currentTab)
  }
}
</script>

<style lang="scss" scope>
@import url('./donut.css');

.match-overview {
  height: 194px;
  border-radius: 2px;
  width: 100%;
  border: solid 1px #cdd2d2;
  background-color: #ededed;
  box-sizing: border-box;
  .tabs {
    overflow: hidden;
    background-color: #f2f2f2;
    border-bottom: 1px solid #cdd2d2;
    li {
      float: left;
      width: 70px;
      height: 36px;
      &.active {
        color: #1f8ecd;
        border-bottom: 2px solid #1f8ecd;
      }
      > button {
        font-family: NanumBarunGothic, sans-serif;
        font-size: 12px;
        color: #555555;
        background-color: transparent;
        border: none;
        width: 100%;
        line-height: 36px;
        height: 100%;
        text-align: center;
        outline: none;
        cursor: pointer;
      }
    }
  }
  .overview-datas {
    overflow: hidden;
    height: 153px;
    .cols {
      position: relative;
      float: left;
      border-right: 1px solid #cdd2d2;
      height: 100%;
      box-sizing: border-box;
      &:nth-child(1) {
        width: 40%;
      }
      &:nth-child(2) {
        width: 35%;
      }
      &:nth-child(3) {
        width: 25%;
        border-right: none;
      }

      .donut-graph {
        font-size: 12px;
        color: #666666;
        font-family: Helvetica;
        .donut-above {
          display: block;
          margin: 15px 0 0 20px;
        }
        .donut-r {
          position: absolute;
          top: 40px;
          left: 20px;
        }
      }
      .kda-overview {
        position: absolute;
        font-size: 11px;
        right: 40px;
        top: 60px;
        font-family: Helvetica;
        > span {
          display: block;
          .vb {
            color: #bebebe;
          }
          &.kda-rate {
            font-size: 16px;
            margin-top: 10px;
            em {
              font-style: normal;
              &.t1 {
                color: #2daf7f;
              }
              &.t2 {
                color: #c6443e;
              }
            }
          }
        }
      }

      .most-champ {
        li {
          overflow: hidden;
          padding: 5px 17px;
          &:first-child {
            margin-top: 10px;
          }
          img {
            border-radius: 50%;
            width: 34px;
            height: 34px;
            float: left;
          }
          .rows {
            float: right;
            font-size: 11px;
            width: calc(100% - 34px - 5px);
            margin-top: 1px;
            .champ-name {
              font-size: 14px;
              font-family: NanumBarunGothic;
              color: #333333;
            }
            .winloss {
              color: #555555;
            }
            .average {
              color: #555555;
              font-family: Helvetica;
              font-weight: bold;
              &:before {
                display: inline-block;
                content: "|";
                margin: 0 7px;
                color: #cdd2d2;
              }
            }
          }
          .no-image {
            float: left;
            display: block;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background-color: #c2c2c2;
          }
          .no-champion {
            float: left;
            display: block;
            font-size: 12px;
            text-align: center;
            line-height: 22px;
            color: #333333;
            margin-top: 7px;
            margin-left: 5px;
          }
        }
      }

      &.position {
        font-size: 12px;
        .position-title {
          display: block;
          color: #666666;
          font-family: NanumBarunGothic;
          margin: 15px 10px 10px 10px;
        }
        .pos-sort {
          li {
            float: left;
            font-size: 11px;
            font-family: Helvetica;
            margin: 10px 10px;
            box-sizing: border-box;
          }
          img {
            width: 25px;
            height: 25px;
            float: left;
          }
          .rows {
            float: left;
            margin-left: 5px;
            width: 100px;
          }
          .txt-position {
            font-size: 14px;
            color: #333333;
            font-family: NanumBarunGothic;
          }
          .winrate {
            font-weight: bold;
            color: #1f8ecd;
          }
          .winrate-h {
            color: #666666;
          }
          .winrate-h:before {
            display: inline-block;
            content: "|";
            margin: 0 5px;
            color: #cdd2d2;
          }
        }
      }
    }
  }
}
</style>