// pages/record/record.js
// 重新引入wxCharts（确保utils文件夹下有wxcharts.js文件）
import wxCharts from '../../utils/wxcharts.js';

Page({
  data: {
    currentTime: 'week',
    // 不同时间维度的模拟数据
    dataMap: {
      day: {
        stats: { correct: 45, forward: 12, backward: 8, left: 15, right: 10 },
        statsRatio: { correct: '45.0%', forward: '12.0%', backward: '8.0%', left: '15.0%', right: '10.0%' }
      },
      week: {
        stats: { correct: 315, forward: 84, backward: 56, left: 105, right: 70 },
        statsRatio: { correct: '45.0%', forward: '12.0%', backward: '8.0%', left: '15.0%', right: '10.0%' }
      },
      month: {
        stats: { correct: 1350, forward: 360, backward: 240, left: 450, right: 300 },
        statsRatio: { correct: '45.0%', forward: '12.0%', backward: '8.0%', left: '15.0%', right: '10.0%' }
      }
    },
    stats: {},
    statsRatio: {},
    chart: null // 保存图表实例，用于后续更新
  },

  onReady() {
    // 初始化本周数据+图表
    this.switchTime({ currentTarget: { dataset: { type: 'week' } } });
  },

  // 时间维度切换（联动更新数据+图表）
  switchTime(e) {
    const type = e.currentTarget.dataset.type;
    const { stats, statsRatio } = this.data.dataMap[type];
    this.setData({
      currentTime: type,
      stats,
      statsRatio
    }, () => {
      // 数据更新后重新渲染图表
      this.initChart();
    });
    wx.showToast({ title: `切换为${type === 'day' ? '今日' : type === 'week' ? '本周' : '本月'}数据`, icon: 'none' });
  },

  // 初始化/更新饼状图（核心方法）
  initChart() {
    const that = this;
    // 延迟获取canvas，避免页面渲染未完成导致尺寸为0
    setTimeout(() => {
      wx.createSelectorQuery().select('.chart-canvas').fields({
        node: true,
        size: true
      }).exec(res => {
        if (res[0] && res[0].width && res[0].height) {
          const { width, height } = res[0];
          // 如果已有图表实例，直接更新数据；否则新建
          if (that.data.chart) {
            that.data.chart.updateData({
              series: [
                { name: '坐姿端正', data: that.data.stats.correct, color: '#52c41a' },
                { name: '坐姿偏前', data: that.data.stats.forward, color: '#ff7a45' },
                { name: '坐姿偏后', data: that.data.stats.backward, color: '#ff6b6b' },
                { name: '坐姿左倾', data: that.data.stats.left, color: '#40a9ff' },
                { name: '坐姿右倾', data: that.data.stats.right, color: '#722ed1' }
              ]
            });
          } else {
            const chart = new wxCharts({
              canvasId: 'postureChart', // 必须和wxml的canvas-id一致
              type: 'pie',
              series: [
                { name: '坐姿端正', data: that.data.stats.correct, color: '#52c41a' },
                { name: '坐姿偏前', data: that.data.stats.forward, color: '#ff7a45' },
                { name: '坐姿偏后', data: that.data.stats.backward, color: '#ff6b6b' },
                { name: '坐姿左倾', data: that.data.stats.left, color: '#40a9ff' },
                { name: '坐姿右倾', data: that.data.stats.right, color: '#722ed1' }
              ],
              width: width,
              height: height,
              dataLabel: true, // 显示百分比
              legend: false,
              title: { name: '坐姿占比', fontSize: 14 }
            });
            that.setData({ chart });
          }
        } else {
          wx.showToast({ title: '图表初始化失败', icon: 'none' });
        }
      });
    }, 100);
  },

  // 导出数据
  exportData() {
    wx.showModal({
      title: '导出数据',
      content: `是否导出${this.data.currentTime === 'day' ? '今日' : this.data.currentTime === 'week' ? '本周' : '本月'}的坐姿数据？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '导出中...' });
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '数据导出成功', icon: 'success' });
          }, 1500);
        }
      }
    });
  }
});