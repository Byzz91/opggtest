<template>
  <div class="gs-search">
    <form method="get" action="./" class="gs-form" autocomplete="off" v-on:submit.prevent="doSubmit" ref="gsForm">
      <input v-model="search" 
        ref="gsInput"
        @keyup="lazySearch" 
        @keyup.up="touchIndex(1)"
        @keyup.down="touchIndex(-1)"
        @blur="calcShowHistory()"
        @focus="calcShowHistory()"
        class="gs-input" placeholder="소환사명, 챔피언 ..."
        name="search">
      <button type="submit" class="gs-submit">검색</button>
    </form>

    <global-search-result 
      v-show="searchResult.length > 0"
      :search-index="searchIndex"
      :search-result="searchResult"></global-search-result>

    <global-search-history 
      ref="history"
      v-show="showHistory"></global-search-history>
  </div>

</template>

<script>
import { debounce } from 'lodash'
import API from '../../common/api'
import GlobalSearchResult from './GlobalSearchResult.vue'
import GlobalSearchHistory from './GlobalSearchHistory.vue'
import Storage from '../../common/Storage'

export default {
  name: 'GlobalSearch',
  components: { 
    GlobalSearchResult,
    GlobalSearchHistory,
  },
  data() {
    return {
      /**
       * `input`의 바인딩되어 입력된 문자열이 할당됩니다.
       */
      search: "",
      /**
       * `this.search` 바탕으로 검색된 결과를 할당합니다.
       */
      searchResult: [],
      /**
       * 검색된 결과의 인덱스를 지정합니다. 
       * 해당 인덱스는 키보드 방향키의 의해서 조작될 수 있습니다.
       */
      searchIndex: 0,
      /**
       * `Storage` 인스턴스가 할당됩니다.
       * 자세한 내용은 `created()` 라이프사이클을 참조바랍니다.
       */
      $$storage: undefined,
      /**
       * 히스토리 상자를 노출할지에 대한 여부가 할당됩니다.
       */
      showHistory: false,
    }
  },
  methods: {
    /**
     * 현재 검색결과의 선택된 인덱스 번호를 변경합니다.
     * @param n Number `n` 만큼 숫자를 더합니다.
     */
    touchIndex(n) {
      let maximumIndex = this.searchResult.length ? this.searchResult.length - 1 : 0
      n = parseInt(n, 10)

      if (this.searchResult.length == 0) {
        this.searchIndex = 0
      } else {
        if (n > 0) {
          this.searchIndex++
          if (this.searchIndex > maximumIndex) {
            this.searchIndex = maximumIndex
          }
        } else {
          this.searchIndex--
          if (this.searchIndex < 0) {
            this.searchIndex = 0
          }
        }
      }

      console.info('searchIndex', this.searchIndex)
    },
    /**
     * <form />의 `submit` 이벤트를 제어합니다.
     */
    doSubmit() {
      this.$$storage.switchDB('history').update(this.search)
      this.$refs.history.update()
      this.$refs.gsForm.submit()
    },
    /**
     * 소환사명을 검색하여 결과값을 출력합니다.
     * TODO 출력 API에 대해서는 소환사명에 대해서 `LIKE` 검색을 수행할 수 있는 API가 존재하지 않아 `SUMMONER_INFO` API로 대체합니다.
     */
    lazySearch: debounce(function (e) {
      let value = e.target.value

      // 화살키에 2개 Up(`38`), Down(`40`)에 대해서는 `escape` 처리합니다.
      if (e.which == 38 || e.which == 40) {
        return
      }

      this.searchResult = []

      if (value.length) {
        API.getSummonerInfo(value).then(res => {
          this.searchResult.push(res.summoner)
          this.calcShowHistory()
        })
      }
    }, 400),
    /**
     * 히스토리를 보여줄지에 대한 상황판단을 합니다.
     * @return bool
     */
    calcShowHistory() {
      if (this.searchResult.length == 0 /*&& this.$refs.gsInput === document.activeElement*/) {
        this.showHistory = true
      } else {
        this.showHistory = false
      }
    }
  },
  created() {
    this.$$storage = new Storage()
  }
}
</script>

<style lang="scss" scope>
.gs-search {
  position: absolute;
  right: 0;
  bottom: 12px;
  width: 260px;
  height: 32px;
  border-radius: 2px;
  background-color: #ffffff;
  box-sizing: border-box;

  .gs-form {
    position: relative;
    margin: 9px 0 8px 14px;
    height: 15px;

    .gs-input {
      position: absolute;
      left: 0;
      top: 0;
      height: 15px;
      line-height: 15px;
      border: 0;
      outline: 0;
      font-family: AppleSDGothicNeo;
      font-size: 12px;
      color: #727272;
      width: 204px;
    }
    .gs-submit {
      position: absolute;
      right: 12px;
      top: 0;
      background-color: transparent;
      border: none;
      outline: none;
      width: 30px;
      height: 13px;
      font-size: 0;
      background-image: url('../../assets/global-search/submit-icon.svg');
      background-repeat: no-repeat;
      background-size: contain;
      text-indent: -9999px;
      overflow: hidden;
      padding: 0;
      cursor: pointer;
    }
  }
}
</style>