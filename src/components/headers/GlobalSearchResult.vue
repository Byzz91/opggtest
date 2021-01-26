<template>
  <ul class="gs-result">
    <li v-for="(summoner, index) in searchResult" :key="index" :class="{ active: (searchIndex == index) }">
      <div class="summoner-brief">
        <img :src="summoner.profileImageUrl" :alt="`${summoner.name}'s Profile Image`">

        <div class="cols">
          <span class="summoner-name">{{ summoner.name }}</span>
          <span class="summoner-level">{{ parseLevel(summoner) }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'GlobalSearchResult',
  props: {
    searchResult: Array,
    searchIndex: Number,
  },
  methods: {
    /**
     * 소환수의 레벨을 파싱합니다. 규칙은 다음과 같습니다.
     *   1. 언랭크 유저인 경우 현재 계정의 레벨을 출력합니다.
     *   2. 티어를 갖는 유저인 경우 티어를 출력합니다.
     * 
     * @param summoner object
     * @return string
     */
    parseLevel(summoner) {
      let tierOrLevel = ''

      if (summoner.leagues instanceof Array && summoner.leagues[0].hasResults) {
        tierOrLevel = summoner.leagues[0].tierRank.string
      } else {
        tierOrLevel = summoner.level
      }

      return tierOrLevel
    }
  }
}
</script>

<style lang="scss" scope>
.gs-result {
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 50%);
  list-style: none;
  margin-top: 12px;

  li {
    margin: 5px 0;
    cursor: pointer;

    &.active {
      background-color: #f0f9ff;
    }
  }

  .summoner-brief {
    overflow: hidden;
    padding: 7px 17px;

    .cols {
      float: left;
      margin-top: 5px;
    }
    > img {
      float: left;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 14px;
    }
    .summoner-name, .summoner-level {
      display: block;
      font-family: sans-serif;
      font-size: 12px;
      color: #666;
      line-height: 14px;
    }
  }
}
</style>