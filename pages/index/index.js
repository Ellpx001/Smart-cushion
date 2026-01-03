// pages/index/index.js
const db = wx.cloud.database();

Page({
  data: {
    account: '',
    password: ''
  },

  handleAccountInput(e) { this.setData({ account: e.detail.value }) },
  handlePasswordInput(e) { this.setData({ password: e.detail.value }) },

  // 点击“登录”按钮
  onLogin() {
    console.log("点击了登录");
    const { account, password } = this.data;
    if (!account || !password) {
      wx.showToast({ title: '请输入账号密码', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中...' });

    // 数据库查询
    db.collection('users').where({
      account: account,
      password: password
    }).get({
      success: res => {
        wx.hideLoading();
        if (res.data.length > 0) {
          wx.showToast({ title: '登录成功' });
          console.log('登录成功', res.data);
        } else {
          wx.showToast({ title: '账号或密码错误', icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '网络异常', icon: 'none' });
      }
    })
  },

  // 🌟 关键点：点击“注册账号”文字时的跳转逻辑
  // 替换原来的 onRegister 函数
  onRegister() {
    console.log("正在尝试跳转...");
    
    wx.navigateTo({
      url: '/pages/register/register',
      success: () => {
        console.log("跳转成功！");
      },
      fail: (err) => {
        // 🌟 这里会打印出红色的具体错误原因
        console.error("跳转失败，原因：", err);
        
        // 弹窗提示错误，方便查看
        wx.showModal({
          title: '跳转失败',
          content: JSON.stringify(err), // 把错误变成文字显示出来
          showCancel: false
        });
      }
    });
  },
  
  // 点击“忘记密码”
  onForgotPwd() {
    wx.showToast({ title: '暂未开放', icon: 'none' });
  }
})