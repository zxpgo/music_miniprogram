import request from "../../utils/request"

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password:  ""
  },

  handleInput(event){
    console.log(event);
    let type = event.currentTarget.id;
    //console.log(type, event.detail.value);
    this.setData({[type]: event.detail.value});
  },

  async login(){
    //前端验证
    let {phone, password} = this.data;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error',
        duration: 2000
      });      
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error',
        duration: 2000
      });  
    }

    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error',
        duration: 2000
      });      
    }

    //后端验证
    let res = await request("/login/cellphone", {phone, password, isLogin:true});
    console.log(res);
    if (res.code == 200) {
      wx.showToast({
        title: '登陆成功',
        icon: "success",
        duration: 2000
      });
      wx.switchTab ({
        url: '/pages/personal/personal',
      })
      wx.setStorageSync("userInfo", JSON.stringify(res.profile));
    } else if (res.code == 400) {
      wx.showToast({
        title: '手机号错误',
        icon: "error",
        duration: 2000
      });
    } else if (res.code == 502) {
      wx.showToast({
        title: '密码错误',
        icon: "error",
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '登陆失败',
        icon: "error",
        duration: 2000
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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