import _ from 'lodash'

/**
 * `localStorage`를 조금 더 쉽게 사용하기 위한 랩핑 클래스 파일입니다.
 * 
 * NOTE 코딩 테스트를 진행하기 위해 작성된 클래스 파일임으로 고도화 진행은 하지 않았습니다.
 */
export default class Storage
{
  prefix = 'opgg-'
  currentDB = undefined

  /**
   * 저장될 데이터의 `dbName`을 설정합니다.
   * 예) `Storage.switchDB('history').get()`
   * @param string dbName 
   */
  switchDB(dbName) {
    this.currentDB = this.prefix + String(dbName).trim().toString()
    return this
  }

  /**
   * 설정된 `dbName`에 데이터를 업데이트 합니다.
   * @param String data 
   * @return void
   */
  update(data) {
    let before = [], update = []

    if (this.currentDB == undefined) {
      throw new Error('DB가 설정되어 있지 않습니다.')
    }

    before = this.get()

    if (before instanceof Array) {
      // unique
      update = _.union(before, [data])
    } else {
      update = [data]
    }

    window.localStorage.setItem(this.currentDB, JSON.stringify(update))
  }

  /**
   * 입력된 `data`로 전체 데이터를 덮어씌웁니다.
   * @param Array data 
   */
  override(data) {
    if (this.currentDB == undefined) {
      throw new Error('DB가 설정되어 있지 않습니다.')
    }

    if (!(data instanceof Array)) {
      throw new Error('Array 자료형이 입력되어야 합니다.')
    }

    window.localStorage.setItem(this.currentDB, JSON.stringify(data))
  }

  /**
   * 설정된 `dbName`에 저장된 데이터를 가져옵니다.
   * @return Array
   */
  get() {
    let result = []

    if (this.currentDB == undefined) {
      throw new Error('DB가 설정되어 있지 않습니다.')
    }

    result = window.localStorage.getItem(this.currentDB)

    if (result) {
      result = JSON.parse(result)
    }

    if (result instanceof Array) {
      return result.reverse()
    }

    return []
  }

  /**
   * 삭제시킬 문자열을 찾아 제거합니다.
   * @param String rmstr 
   */
  remove(rmstr) {
    let result = []

    if (this.currentDB == undefined) {
      throw new Error('DB가 설정되어 있지 않습니다.')
    }

    result = this.get()
    _.remove(result, r => r == rmstr)
    
    this.override(result)
  }
}