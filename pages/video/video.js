// pages/video/video.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '' ,
    videoList: [],
    videoId: '',  //记录当前点击的videoID
    videoUpdateTime: [],
    isTriggered: false,
    offset: 0,
  },

  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  changeNav(event) {
    let id = event.currentTarget.id;
    this.setData({navId: id, videoList:[], offset: 0})
    
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId);
  },

  async getVideoGroupList() {
    let videoGroupListData = await request("/video/group/list");
    this.setData({videoGroupList: videoGroupListData.data.slice(0,14), navId: videoGroupListData.data[0].id});

    this.getVideoList(this.data.navId);
  },
  
  async getVideoList(navId, offset=0, isToLower=false) {
    if (!navId) {
      return ;
    }
    let videoListData = await request("/video/group", {id:navId, offset:offset});
    let index = 0;
    let videoListNew = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    });

    let videoList = [];
    if (isToLower) {
      videoList = this.data.videoList;
      videoList.push(...videoListNew);
      console.log(videoList);
    } else {
      videoList = videoListNew;
    }
    this.setData({videoList, isTriggered: false});

    wx.hideLoading();
   // this.setData({videoGroupList: videoGroupListData.data.slice(0,14), navId: videoGroupListData.data[0].id});
  },

  handlePlay(event){ //解决多个视频可以同时播放的问题
    //console.log("play()")
    //获取上一个视频的id
    
    let vid = event.currentTarget.id;
    // if (this.vid == vid) {
    //   return;
    // }
    //this.vid !== vid && this.videoContent && this.videoContent.stop();
   // this.vid = vid;
    this.setData({videoId: vid})  //点击图片时，保证视频替换图片
    
    // if (!this.videoContent) {
    //   this.videoContent = wx.createVideoContext(vid);
    // } else {
    //   this.videoContent.stop();
    //   this.videoContent = wx.createVideoContext(vid);
    // }
   
    this.videoContent = wx.createVideoContext(vid);
    let videoItem = this.data.videoUpdateTime.find(item => item === vid);
    if (videoItem) {
      this.videoContent.seek(videoItem.currentTime)
    } else {
      this.videoContent.play();
    }
  },

  handleTimeUpdate(event) {
    let videoTimeObject = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObject.vid)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObject);
    }

    this.setData({videoUpdateTime})
  },

  handleEnded(event){
    let videoUpdateTIme = this.data.videoUpdateTime
    videoUpdateTIme.splice(event.currentTarget.id)
    this.setData({videoUpdateTIme})
  },

  handleRefresh(){
   // console.log("scorll refresh")
    this.getVideoList(this.data.navId)
  },

  handleToLower() {
    console.log("to lower")
    this.setData({offset: this.data.offset+8})
    this.getVideoList(this.data.navId, this.data.offset, true)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList();
    
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
    console.log("页面刷新")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面触底")

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    console.log(from)
    if (from === "button") {
      return {
        "title": "来自button的转发",
        "page": "/pages/video/video",
        "imageUrl": "/static/images/nvsheng.jpg"
      }
    } else {
      return {
        "title": "来自menu的转发",
        "page": "/pages/video/video",
        "imageUrl": "/static/images/nvsheng.jpg"
      }
    }
  }
})