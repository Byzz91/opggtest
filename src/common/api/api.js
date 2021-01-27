
export const SUMMONER_INFO = 'https://codingtest.op.gg/api/summoner/{summonerName}'
export const MOST_CHAMP = 'https://codingtest.op.gg/api/summoner/{summonerName}/mostInfo'

/**
 * 소환사의 정보를 가져옵니다.
 * @param string query 
 */
export const getSummonerInfo = query => {
    let endpoint = SUMMONER_INFO.replace('{summonerName}', query)
    return axios.get(endpoint).then(res => res.data)
}

/**
 * 많이 선택한 챔프리스트을 가져옵니다.
 * @param string query 
 */
export const getMostChamp = query => {
    let endpoint = MOST_CHAMP.replace('{summonerName}', query)
    return axios.get(endpoint).then(res => res.data)
}