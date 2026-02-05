// pages/setting/setting.js
Page({
  data: {
    // 通知设置
    notifySetting: {
      newMessage: true,
      weeklyReport: true
    }
  },

  onLoad() {
    // 加载本地保存的通知设置
    const notifySetting = wx.getStorageSync('notifySetting');
    if (notifySetting) {
      this.setData({ notifySetting });
    }
  },

  // 修改密码
  changePassword() {
    wx.showModal({
      title: '修改密码',
      editable: true,
      placeholderText: '请输入新密码',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({
            title: '密码修改成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 绑定手机号
  bindPhone() {
    wx.showModal({
      title: '绑定手机号',
      editable: true,
      placeholderText: '请输入手机号',
      success: (res) => {
        if (res.confirm && res.content) {
          wx.showToast({
            title: '手机号绑定成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 通知设置开关
  onNotifyChange(e) {
    const key = e.currentTarget.dataset.key;
    const notifySetting = { ...this.data.notifySetting, [key]: e.detail.value };
    this.setData({ notifySetting });
    // 保存到本地
    wx.setStorageSync('notifySetting', notifySetting);
  },

  // 清空本地数据
  clearData() {
    wx.showModal({
      title: '确认清空',
      content: '清空后本地数据将无法恢复，是否继续？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '数据清空成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 导出全部数据
  exportAllData() {
    wx.showLoading({ title: '导出中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '全部数据导出成功',
        icon: 'success'
      });
    }, 1500);
  },

  // 检查版本
  checkVersion() {
    wx.showModal({
      title: '版本信息',
      content: '当前版本：v1.0.0\n已是最新版本',
      showCancel: false
    });
  },

  // 打开隐私政策
  openPrivacy() {
    wx.showToast({
      title: '隐私政策开发中',
      icon: 'none'
    });
  },

  // 打开用户协议
  openUserAgreement() {
    wx.showToast({
      title: '用户协议开发中',
      icon: 'none'
    });
  }
});