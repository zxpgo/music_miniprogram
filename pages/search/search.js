// pages/search/search.js
import request from '../../utils/request'
let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: '',
    searchContent: '',
    searchList: [],
    historyList: [],
  },

  handleInput(event) {
    this.setData({ searchContent: event.detail.value.trim() })

    //函数节流
    if (isSend) {
      return;
    }
    isSend = true;

    setTimeout(async () => {
      this.getSearchList();

      isSend = false;
    }, 300)

  },

  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({ searchList: [] })
      return;
    }
    let searchListData = await request('/search', { keywords: this.data.searchContent, limit: 10 })
    if (!searchListData || !searchListData.result) {
      return;
    }
    this.setData({ searchList: searchListData.result.songs })

    //将搜索的关键字存储
    let { searchContent, historyList } = this.data;
    if (!searchContent) {
      return ;
    }
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1);
    }
    historyList.unshift(searchContent);
    this.setData({ historyList })  //保证历史记录能时时显示
    wx.setStorageSync('searchHistory', historyList)
  },

  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({ historyList })
    }
  },

  //删除搜索历史记录回调
  deleteSearchHistory() {
    wx,wx.showModal({
      
      content: '确认删除历史记录？',
    
      success: (result) => {
        console.log(result)
        if (result.confirm) {
          this.setData({ historyList: [] })
          wx.removeStorageSync('searchHistory')
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })
    
  },

  async getInitData() {


    let placeholderContentData = await request('/search/default')
    this.setData({ placeholderContent: placeholderContentData.data.showKeyword })
  },

  async getHotListData() {
    let hotListData = await request('/search/hot/detail')
    this.setData({ hotList: hotListData.data })
  },

  clearSearchContent() {
    this.setData({ searchContent: '', searchList: [] })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    //获取本地搜索记录
    this.getSearchHistory();

    this.getHotListData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})