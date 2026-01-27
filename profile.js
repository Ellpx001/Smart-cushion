// pages/profile/profile.js
Page({
  data: {
    // 模拟个人信息（可对接真实用户数据）
    userInfo: {
      nickname: '坐姿守护者',
      avatar: '../../images/user.png', // 匹配实际图片路径
      deviceCount: 1
    },
    // 模拟本周数据（可对接蓝牙/后端真实数据）
    weekStats: {
      totalTime: '12.5h',
      correctRate: '82%',
      remindCount: 18
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时可获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }

    // 获取已绑定设备数量
    const bindedDevices = wx.getStorageSync('bindedDevices') || [];
    this.setData({
      'userInfo.deviceCount': bindedDevices.length
    });
  },

  // 编辑个人资料（预留扩展：头像上传、昵称修改）
  editProfile() {
    wx.showActionSheet({
      itemList: ['修改头像', '修改昵称'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 选择图片修改头像
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
              // 临时文件路径（实际开发可上传到服务器）
              const tempFilePath = res.tempFilePaths[0];
              const userInfo = { ...this.data.userInfo, avatar: tempFilePath };
              this.setData({ userInfo });
              // 保存到本地
              wx.setStorageSync('userInfo', userInfo);
              wx.showToast({ title: '头像修改成功', icon: 'success' });
            }
          });
        } else if (res.tapIndex === 1) {
          // 修改昵称
          wx.showModal({
            title: '修改昵称',
            editable: true,
            placeholderText: '请输入新昵称',
            success: (res) => {
              if (res.confirm && res.content) {
                const userInfo = { ...this.data.userInfo, nickname: res.content };
                this.setData({ userInfo });
                // 保存到本地
                wx.setStorageSync('userInfo', userInfo);
                wx.showToast({ title: '昵称修改成功', icon: 'success' });
              }
            }
          });
        }
      }
    });
  },

  // 跳转我的记录页面（关联之前的坐姿统计页面）
  goToRecord() {
    wx.navigateTo({ 
      url: '/pages/record/record' 
    });
  },

  // 跳转提醒设置页面
  goToRemind() {
    wx.navigateTo({ 
      url: '/pages/remind/remind' 
    });
  },

  // 跳转设备管理页面
  goToDevice() {
    wx.navigateTo({ 
      url: '/pages/device/device' 
    });
  },

  // 跳转帮助中心
  goToHelp() {
    wx.navigateTo({ 
      url: '/pages/help/help' 
    });
  },

  // 跳转个人设置（预留功能）
  goToSetting() {
    wx.navigateTo({ 
      url: '/pages/setting/setting' 
    });
  },

  // 退出登录（清除登录状态+跳转登录页）
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？退出后将清空本地登录状态',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储的用户信息和登录态
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          wx.removeStorageSync('remindSetting');
          wx.removeStorageSync('bindedDevices');
          
          // 跳转登录页（无登录页可先返回首页）
          wx.redirectTo({ 
            url: '/pages/index/index' 
          });
        }
      }
    });
  }
});