//发送ajax请求
import config from "./config.js"

export default (url, data={}, method="GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.includes("MUSIC_U")) : ''
      },
      //["__csrf=d2b06faf28db17de08405f3c757d1945; Max-Age=1296010; Expires=Sat 19 Jun 2021 15:09:44 GMT; Path=/;","MUSIC_U=cf3ad1e0545ece12d38d4ffe1db4a14d86d28c3331a5351342ec1affcaefba320931c3a9fbfe3df2; Max-Age=1296000; Expires=Sat 19 Jun 2021 15:09:34 GMT; Path=/;","__remember_me=true; Max-Age=1296000; Expires=Sat 19 Jun 2021 15:09:34 GMT; Path=/;","NMTID=00OqJY77WNLNRPvkEGutNyk-cvapBwAAAF515KFLw; Max-Age=315360000; Expires=Mon 2 Jun 2031 15:09:34 GMT; Path=/;"]
      success:(res)=>{
        if (data.isLogin) {
          wx.setStorageSync('cookies', res.cookies);
        }
        console.log(res);
        resolve(res.data);
      },
      fail:(err)=>{
        reject(err);
      }
    })  
  })
}