// pages/userModel/userModel.js
Page({
  data: { height: '', weight: '' },
  onHeightInput(e) { this.setData({ height: e.detail.value }); },
  onWeightInput(e) { this.setData({ weight: e.detail.value }); },
  saveModel() {
    const { height, weight } = this.data;
    if (!height || !weight) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }
    wx.setStorageSync('userModel', { height, weight });
    wx.switchTab({ url: '/pages/monitor/monitor' });
  }
});