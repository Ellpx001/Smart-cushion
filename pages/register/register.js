// pages/register/register.js
const db = wx.cloud.database(); // 必须有这一句才能连数据库

Page({
  data: {
    account: '',
    password: '',
    confirmPassword: ''
  },

  // 输入框绑定
  handleAccountInput(e) { this.setData({ account: e.detail.value }) },
  handlePasswordInput(e) { this.setData({ password: e.detail.value }) },
  handleConfirmPasswordInput(e) { this.setData({ confirmPassword: e.detail.value }) },

  // 点击“立即注册”按钮
  onRegister() {
    console.log('按钮被点击了！'); // 调试日志

    const { account, password, confirmPassword } = this.data;

    // 1. 验证空值
    if (!account || !password || !confirmPassword) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    // 2. 验证密码一致
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '注册中...' });

    // 3. 查询账号是否存在
    db.collection('users').where({
      account: account
    }).get({
      success: res => {
        if (res.data.length > 0) {
          wx.hideLoading();
          wx.showToast({ title: '账号已存在', icon: 'none' });
        } else {
          // 4. 执行注册
          this.addUserToDB(account, password);
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error(err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    })
  },

  // 写入数据库
  addUserToDB(account, password) {
    db.collection('users').add({
      data: {
        account: account,
        password: password,
        createTime: new Date()
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({ title: '注册成功' });
        
        // 注册成功后，自动返回登录页
        setTimeout(() => {
          wx.navigateBack(); 
        }, 1500);
      }
    })
  }
})