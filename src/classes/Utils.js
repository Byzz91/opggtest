/**
 * 천의 자리숫자를 끊어 콤마(,)를 찍어줍니다.
 * @param Number number
 */
export function numberFormat(number) {
  let rNumberFormat = /\B(?=(\d{3})+(?!\d))/g
  return number.toString().replace(rNumberFormat, ',')  
}

/**
 * `encoded`된 이름을 사람이 읽을 수 있도록 처리합니다.
 */
export function purifyName(encodedName) {
  encodedName = decodeURIComponent(encodedName).replace(/\+/g, ' ')
  return encodedName
}