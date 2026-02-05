// pages/remind/remind.js
Page({
  data: {
    // 提醒阈值（秒）
    remindTime: 10,
    // 提醒方式：vibrate(震动)、sound(声音)、both(震动+声音)
    remindType: 'vibrate',
    // 监测时段
    startTime: '08:00',
    endTime: '22:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载本地保存的设置
    const remindSetting = wx.getStorageSync('remindSetting');
    if (remindSetting) {
      this.setData(remindSetting);
    }
  },

  // 调整提醒阈值
  onRemindTimeChange(e) {
    this.setData({
      remindTime: e.detail.value
    });
  },

  // 选择提醒方式
  onRemindTypeChange(e) {
    this.setData({
      remindType: e.detail.value
    });
  },

  // 选择开始时间
  onStartTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    });
  },

  // 选择结束时间
  onEndTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    });
  },

  // 保存提醒设置
  saveRemindSetting() {
    const remindSetting = {
      remindTime: this.data.remindTime,
      remindType: this.data.remindType,
      startTime: this.data.startTime,
      endTime: this.data.endTime
    };

    // 保存到本地存储
    wx.setStorageSync('remindSetting', remindSetting);

    wx.showToast({
      title: '设置保存成功',
      icon: 'success'
    });

    // 1秒后返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});