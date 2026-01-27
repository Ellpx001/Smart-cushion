// 初始化云开发数据库（确保你的云开发已开通）
const db = wx.cloud.database();

Page({
  data: {
    account: '',   // 账号
    password: ''   // 密码
  },

  // 账号输入框绑定（和你原有逻辑一致）
  handleAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  // 密码输入框绑定（和你原有逻辑一致）
  handlePasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 新增：解决“注册账号”点击报错的核心方法
  onRegister() {
    // 跳转到注册页（非tabBar页面，用navigateTo）
    wx.navigateTo({
      url: '/pages/register/register',
      fail: (err) => {
        console.log('跳转注册页失败：', err);
        wx.showToast({ title: '跳转失败，请检查路径', icon: 'none' });
      }
    });
  },

  // 可选：忘记密码方法（如果需要的话）
  onForgotPwd() {
    wx.showToast({ title: '暂未开放找回密码功能', icon: 'none' });
  },

  // 登录按钮点击事件（核心登录逻辑，保留并完善跳转）
  onLogin() {
    console.log('登录按钮被点击');
    const { account, password } = this.data;

    // 1. 空值验证
    if (!account || !password) {
      wx.showToast({ title: '请填写账号和密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    // 2. 数据库验证账号密码
    db.collection('users').where({
      account: account,
      password: password
    }).get({
      success: (res) => {
        wx.hideLoading();
        if (res.data.length > 0) {
          // 登录成功
          wx.showToast({ title: '登录成功', icon: 'success' });
          // 保存用户信息到本地缓存
          wx.setStorageSync('userInfo', { account: account });
          
          // 3. 判断是否设置过身高体重，跳转对应页面
          const userModel = wx.getStorageSync('userModel');
          setTimeout(() => {
            if (userModel && userModel.height && userModel.weight) {
              // 已设置模型 → 跳转到监测页（tabBar，用switchTab）
              wx.switchTab({
                url: '/pages/monitor/monitor',
                fail: (err) => {
                  console.log('跳转监测页失败：', err);
                  wx.showToast({ title: '跳转失败，请检查路径', icon: 'none' });
                }
              });
            } else {
              // 未设置模型 → 跳转到模型设置页（非tabBar，用navigateTo）
              wx.navigateTo({
                url: '/pages/userModel/userModel',
                fail: (err) => {
                  console.log('跳转模型页失败：', err);
                  wx.showToast({ title: '跳转失败，请检查路径', icon: 'none' });
                }
              });
            }
          }, 1500);
        } else {
          // 账号密码错误
          wx.showToast({ title: '账号或密码错误', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('登录查询失败：', err);
        wx.showToast({ title: '网络错误，请重试', icon: 'none' });
      }
    });
  }
});