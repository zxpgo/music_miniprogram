// pages/index/index.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
      bannersList: [],
      recommandList: [],
      topList: [],
  },

  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommandsong/recommandsong',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
      let res = await request('/banner', {type: 2}, "POST");
    console.log(res);
     this.setData({bannersList: res.banners});

     let recommand = await request('/personalized?limit=10',"GET");
     console.log(recommand);
     this.setData({recommandList: recommand.result});

    let index = 0;
    let resultAttr = [];
    while(index < 5) {
      let topListData = await request('/top/list',{idx: index++});
      console.log(topListData);
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0,3)};
      //this.setData({topList: topListData.playlist.name, topListData.playlist.tracks});
      resultAttr.push(topListItem);
      this.setData({topList: resultAttr});
    }
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