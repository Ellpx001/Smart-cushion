// pages/help/help.js
Page({
  data: {
    // 常见问题展开状态
    faqOpen: [false, false, false, false]
  },

  // 展开/收起常见问题
  toggleFaq(e) {
    const index = e.currentTarget.dataset.index;
    const faqOpen = [...this.data.faqOpen];
    faqOpen[index] = !faqOpen[index];
    this.setData({ faqOpen });
  },

  // 打开教程详情
  openTutorial() {
    wx.showToast({
      title: '教程详情开发中',
      icon: 'none'
    });
  },

  // 在线咨询客服
  contactService() {
    wx.showModal({
      title: '在线咨询',
      content: '是否跳转到客服聊天界面？',
      success: (res) => {
        if (res.confirm) {
          // 实际开发可跳转小程序客服或第三方客服
          wx.showToast({
            title: '正在接入客服...',
            icon: 'none'
          });
        }
      }
    });
  }
});