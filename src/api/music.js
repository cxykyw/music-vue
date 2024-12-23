import request from '../utils/request'

// 获取歌曲详情
export function getSongDetail(id) {
  return request({
    url: `/api/songs/${id}`,
    method: 'get'
  })
}

// 获取推荐歌单
export function getRecommendPlaylists() {
  return request({
    url: '/playlist/recommend',
    method: 'get'
  })
}

// 获取歌单详情
export function getPlaylistDetail(id) {
  return request({
    url: `/playlist/detail/${id}`,
    method: 'get'
  })
}

// 搜索
export function search(keywords, type = 1, page = 1, limit = 30) {
  return request({
    url: '/search',
    method: 'get',
    params: {
      keywords,
      type,
      page,
      limit
    }
  })
}

// 获取热门搜索
export function getHotSearch() {
  return request({
    url: '/search/hot',
    method: 'get'
  })
}

// 获取搜索建议
export function getSearchSuggestions(keywords) {
  return request({
    url: '/search/suggest',
    method: 'get',
    params: { keywords }
  })
}

// 获取歌曲列表
export function getSongs(params) {
  return request({
    url: '/api/songs',
    method: 'get',
    params
  })
} 