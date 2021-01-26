<template>
  <div class="gs-history">
    <ul class="tabs">
      <li>
        <button @click="changeTab(TAB_HISTORY)" :class="{ active: currentTab == TAB_HISTORY }">최근검색</button>
      </li>
      <li>
        <button @click="changeTab(TAB_BOOKMARK)" :class="{ active: currentTab == TAB_BOOKMARK }">즐겨찾기</button>
      </li>
    </ul>

    <ul :class="['gs-history-list', 'search']">
      <li v-for="(content, index) in contents" :key="index">
        <a :href="`./?search=${encodeURIComponent(content)}`">{{ content }}</a>

        <button :class="['action', 'bookmark', {'on': isBookmarked(content)}]" 
          v-if="currentTab == TAB_HISTORY"
          @click="addBookmark(content)">즐겨찾기 추가</button>

        <button class="action delete"
          @click="remove(currentTab, content)">삭제</button>
      </li>

      <li class="no-result" v-if="contents.length == 0">
        <span>저장된 데이터가 없습니다.</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Storage from '../../classes/Storage'

export default {
  name: 'GlobalSearchHistory',
  data() {
    return {
      TAB_HISTORY: 1,
      TAB_BOOKMARK: 2,
      /**
       * 현재 선택된 탭을 가르킵니다. (undefined | this.TAB_HISTORY | this.TAB_BOOKMARK)
       */
      currentTab: undefined,
      /**
       * 출력될 컨텐츠가 담기는 배열입니다.
       */
      contents: [],
      /**
       * `Storage` 인스턴스가 할당됩니다.
       * 자세한 내용은 `created()` 라이프사이클을 참조바랍니다.
       */
      $$storage: undefined,
      /**
       * 북마크된 리스트를 캐쉬합니다.
       */
      bookmarked: [],
    }
  },
  methods: {
    /**
     * 최근 히스토리 10개를 가져옵니다.
     * @return Array
     */
    getHistory() {
      let history = this.$$storage.switchDB('history').get() // Array

      // 최근 10개에 대해서만 출력합니다.
      history.splice(10)

      return history
    },
    /**
     * 최근 북마크된 리스트를 가져옵니다.
     */
    getBookmark() {
      let bookmark = this.$$storage.switchDB('bookmark').get() // Array
      return bookmark
    },
    /**
     * 입력된 문자열을 즐겨찾기로 추가합니다.
     * @param String str
     */
    addBookmark(str) {
      this.$$storage.switchDB('bookmark').update(str)
      this.bookmarked = this.getBookmark()
    },
    /**
     * 해당 문자가 북마크된 문자인지 체크합니다.
     * @return bool 
     */
    isBookmarked(str) {
      return this.bookmarked.indexOf(str) >= 0 ? true : false
    },
    /**
     * @param Number tab TAB_HISTORY | TAB_BOOKMARK
     * @param String rmstr 삭제시킬 문자열
     */
    remove(tab, rmstr) {
      switch (tab) {
        case this.TAB_HISTORY:
          this.$$storage.switchDB('history').remove(rmstr)
          this.contents = this.getHistory()
        break
        case this.TAB_BOOKMARK:
          this.$$storage.switchDB('bookmark').remove(rmstr)
          this.contents = this.getBookmark()
          this.bookmarked = this.getBookmark()
        break
        default:
      }
    },
    /**
     * `localStorage`에 새로저장된 데이터를 현재탭에 맞게 새로 갱신합니다.
     */
    update() {
      this.contents = (this.currentTab == this.TAB_HISTORY) 
                        ? this.getHistory()
                        : this.getBookmark()
    },
    /**
     * 현재 선택된 탭을 변경합니다.
     * @param Number tab
     */
    changeTab(tab) {
      switch (tab) {
        case this.TAB_HISTORY:
          this.currentTab = this.TAB_HISTORY
          this.contents = this.getHistory()
        break
        case this.TAB_BOOKMARK:
          this.currentTab = this.TAB_BOOKMARK
          this.contents = this.getBookmark()
        break
        default:
      }
    }
  },
  computed: {
  },
  created() {
    this.currentTab = this.TAB_HISTORY
    this.$$storage = new Storage()
  },
  mounted() {
    this.contents = this.getHistory()
    this.bookmarked = this.getBookmark()
  }
}
</script>

<style lang="scss" scope>
.gs-history {
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 50%);
  list-style: none;
  margin-top: 12px;
  
  ul {
    list-style: none;
  }

  .tabs {
    overflow: hidden;

    li {
      float: left;
      width: 50%;
      height: 40px;

      button {
        width: 100%;
        height: 100%;
        border: none;
        background-color: #e3e3e3;
        color: #9c9c9c;
        font-family: Helvetica, "Malgun Gothic", "Apple SD Gothic Neo", AppleGothic, sans-serif;
        cursor: pointer;
        outline: none;

        &.active {
          background-color: #fff;
          color: #4a4a4a;
        }
      }
    }
  }

  .gs-history-list {
    padding-bottom: 10px;

    li {
      position: relative;
      margin-top: 10px;
      padding-left: 20px;
      color: #666;
      font-family: Helvetica, "Malgun Gothic", AppleSDGothicNeo, sans-serif;
      font-size: 12px;

      &.no-result {
        text-align: center;
        padding: 20px 0;
      }
      
      a {
        color: #666;
        text-decoration: none;
      }

      .action {
        position: absolute;
        right: 10px;
        width: 16px;
        height: 16px;
        font-size: 0;
        text-indent: -9999px;
        overflow: hidden;
        border: none;
        background-color: transparent;
        outline: none;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        cursor: pointer;
        &.bookmark {
          right: 25px;
          background-image: url('../../assets/global-search/i-star-off.png');
          &.on {
            background-image: url('../../assets/global-search/i-star-on.png');
          }
        }
        &.delete {
          background-image: url('../../assets/global-search/i-delete.png');
        }
      }
    }
  }
}
</style>