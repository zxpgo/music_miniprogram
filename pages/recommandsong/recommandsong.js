// pages/recommendsong/recommendsong.js
import request from "../../utils/request"
import PubSub from "pubsub-js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0, //点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //判断用户是否登陆
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登陆',
        icon: "none",
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //获取每日推荐的数据
   this.getrecommendList();

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

      //订阅事件
    PubSub.subscribe('switchtype', (msg, type) => {
      console.log(msg, type);
      
      if (type === "pre") {
        this.data.index -= 1;
      } else if (type === "next") {
        this.data.index += 1;   
      }
      let musicList = this.data.recommendList;
      let musicId = musicList[this.data.index%musicList.length].id;
      PubSub.publish('musicid', musicId);
    });
  },

  async getrecommendList() {
    let recommendListData = await request("/recommend/songs")
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    this.setData({index})
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?song='+ song.id,
    })
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