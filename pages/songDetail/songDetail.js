import request from "../../utils/request"
import PubSub from 'pubsub-js'
import moment from 'moment'

const appInst = getApp()

// pages/songDetail/songDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songDetail: {},
    musicId: '',
    musicLink: '',
    currentTime: '00:00',
    totalTime: '00:00',
    currentWidth: 0,
  },

  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })

    let musicId = this.data.musicId;
    this.musicControl(isPlay, musicId, this.data.musicLink)
  },

  //控制音乐播放和暂停
  async musicControl(isPlay, musicId, musicLink){
    if(isPlay) {
      //获取音乐连接
      if (!musicLink) {
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url;
        this.setData({musicLink});
      }
      
      this.audioManager.src = musicLink;
      this.audioManager.title = this.data.songDetail.name;
      this.audioManager.play();
    } else {
      this.audioManager.pause();
    }
  },

  async getSongDetail(ids) {
    let songDetailData = await request("/song/detail", {ids});

    let totalTime = moment(songDetailData.songs[0].dt).format('mm:ss');
    this.setData({totalTime})
    console.log(songDetailData.songs[0])
    this.setData({songDetail: songDetailData.songs[0]})
    wx.setNavigationBarTitle({
      title: songDetailData.songs[0].name,
    })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PubSub.subscribe('musicid', (msg, musicId) => {
      console.log(musicId);
      //收到消息后，取消订阅
      PubSub.unsubscribe('musicid')
      //this.setData({isPlay: false});
      this.getSongDetail(musicId);
      this.musicControl(true, musicId);
      //this.setData({musicId})
      //this.handleMusicPlay();
    })


    let ids = options.song;
    this.getSongDetail(ids);
    this.setData({musicId: ids});
    
    this.audioManager = wx.getBackgroundAudioManager();

       //判断当前页面是否在播放，并且是否为同一首音乐
       if (appInst.globalData.isMusicPlay && appInst.globalData.musicId === this.data.musicId) {
        this.setData({isPlay: true});
      } else {
        this.audioManager.stop();
      }

    this.audioManager.onPause(() => {
      //修改音乐播放状态
      this.changePlayState(false)
    })

    this.audioManager.onPlay(() => {
      this.changePlayState(true)
      appInst.globalData.musicId = this.data.musicId;
    })

    this.audioManager.onStop(()=>{
      this.changePlayState(false)
    })

    this.audioManager.onEnded(()=>{
      //自动切换到下一首音乐，进度条归零
      PubSub.publish('switchtype', 'next')

      this.setData({currentWidth:0, currentTime: '00:00'})
    })


    this.audioManager.onTimeUpdate(() => {
      let currentTime = moment(this.audioManager.currentTime * 1000).format('mm:ss')
      this.setData({currentTime})

      let currentWidth = this.audioManager.currentTime / this.audioManager.duration * 430;
      this.setData({currentWidth})
    });
  },

  changePlayState(isPlay) {
    this.setData({isPlay})
    appInst.globalData.isMusicPlay = isPlay;
  },

  //点击切换歌曲回调
  handleSwitchMusic(event) {
    this.audioManager.stop();
    let type = event.currentTarget.id;
    PubSub.publish('switchtype', type)
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