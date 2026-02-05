// pages/monitor/monitor.js
Page({
  data: {
    // 原有蓝牙相关
    isConnected: false,       // 蓝牙是否连接
    deviceName: '',           // 蓝牙设备名称
    tip: '',                  // 坐姿提示语
    // 新增计时相关
    bluetoothStatus: "未连接",// 蓝牙状态文案
    monitorTime: "00:00:00",  // 监测时长（格式化后）
    timer: null,              // 计时定时器
    seconds: 0,               // 累计秒数
    isMonitorPaused: false    // 监测是否暂停
  },

  onReady() {
    // 移除画布初始化（改用GIF展示，无需canvas绘制）
  },

  // ========== 核心：蓝牙连接+计时启动 ==========
  connectBluetooth() {
    const that = this;
    wx.openBluetoothAdapter({
      success() {
        // 更新蓝牙状态文案
        that.setData({ bluetoothStatus: "正在搜索设备..." });
        wx.startBluetoothDevicesDiscovery({
          success() {
            wx.getBluetoothDevices({
              success(res) {
                if (res.devices.length > 0) {
                  const device = res.devices[0];
                  that.setData({ 
                    deviceName: device.name || '坐姿监测设备',
                    bluetoothStatus: "正在连接设备..." 
                  });
                  wx.createBLEConnection({
                    deviceId: device.deviceId,
                    success() {
                      that.setData({ 
                        isConnected: true,
                        bluetoothStatus: "已连接" 
                      });
                      wx.showToast({ title: '蓝牙连接成功', icon: 'success' });
                      
                      // 蓝牙连接成功后 启动计时
                      that.startTimer();

                      // 监听蓝牙数据（保留原有逻辑，需替换实际UUID）
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: device.deviceId,
                        serviceId: '0000ffe0-0000-1000-8000-00805f9b34fb', // 替换为实际UUID
                        characteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb', // 替换为实际UUID
                        state: true,
                        success() {
                          wx.onBLECharacteristicValueChange((res) => {
                            that.handleData(res.value);
                          });
                        },
                        fail(err) {
                          wx.showToast({ title: '监听数据失败', icon: 'none' });
                          console.log('监听失败：', err);
                        }
                      });
                    },
                    fail(err) {
                      that.setData({ bluetoothStatus: "连接失败" });
                      wx.showToast({ title: '连接设备失败', icon: 'none' });
                      console.log('连接失败：', err);
                    }
                  });
                } else {
                  that.setData({ bluetoothStatus: "未搜索到设备" });
                  wx.showToast({ title: '未搜索到蓝牙设备', icon: 'none' });
                }
              },
              fail(err) {
                that.setData({ bluetoothStatus: "获取设备失败" });
                wx.showToast({ title: '获取设备列表失败', icon: 'none' });
                console.log('获取设备失败：', err);
              }
            });
          },
          fail(err) {
            that.setData({ bluetoothStatus: "搜索设备失败" });
            wx.showToast({ title: '开始搜索设备失败', icon: 'none' });
            console.log('搜索失败：', err);
          }
        });
      },
      fail() {
        that.setData({ bluetoothStatus: "蓝牙未开启" });
        wx.showToast({ title: '请开启蓝牙', icon: 'none' });
      }
    });
  },

  // ========== 计时控制方法 ==========
  // 开始计时（蓝牙连接成功后调用）
  startTimer() {
    // 如果是暂停后恢复，直接重启定时器；如果是首次启动，重置秒数
    if (this.data.isMonitorPaused) {
      this.setData({ isMonitorPaused: false });
    } else {
      this.setData({ seconds: 0 });
    }

    // 清除原有定时器，避免重复计时
    if (this.data.timer) clearInterval(this.data.timer);
    
    // 初始化新定时器并赋值
    const timer = setInterval(() => {
      let { seconds } = this.data;
      seconds++;
      // 格式化秒数为 HH:MM:SS
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      // 同步更新秒数和格式化后的时间
      this.setData({
        seconds,
        monitorTime: `${h}:${m}:${s}`
      });
    }, 1000);
    this.setData({ timer });
  },

  // 暂停监测（暂停计时）
  pauseMonitor() {
    if (!this.data.isConnected) {
      wx.showToast({ title: '请先连接蓝牙', icon: 'none' });
      return;
    }
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ isMonitorPaused: true });
      wx.showToast({ title: '已暂停监测', icon: 'success' });
    }
  },

  // 结束监测（停止计时+重置）
  endMonitor() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        monitorTime: "00:00:00",
        seconds: 0,
        isMonitorPaused: false,
        timer: null
      });
      wx.showToast({ title: '已结束监测', icon: 'success' });
    }
  },

  // ========== 原有蓝牙数据处理逻辑 ==========
  // 解析蓝牙数据（模拟逻辑，实际需按硬件协议解析）
  handleData(buffer) {
    // 模拟硬件返回的坐姿数据
    const forward = Math.floor(Math.random() * 15);
    const backward = Math.floor(Math.random() * 15);
    const left = Math.floor(Math.random() * 15);
    const right = Math.floor(Math.random() * 15);

    // 检测坐姿并提示
    this.checkPosture(forward, backward, left, right);
  },

  // 坐姿检测与提示
  checkPosture(forward, backward, left, right) {
    let tip = '';
    if (forward > 10) tip = '坐姿偏前，请调整';
    else if (backward > 10) tip = '坐姿偏后，请调整';
    else if (left > 10) tip = '坐姿左倾，请调整';
    else if (right > 10) tip = '坐姿右倾，请调整';
    else tip = '坐姿端正，保持良好习惯';

    if (tip !== this.data.tip) {
      this.setData({ tip });
      wx.showToast({ title: tip, icon: 'none', duration: 2000 });
    }
  },

  // ========== 页面生命周期 ==========
  // 页面卸载时清除定时器，避免内存泄漏
  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
    // 关闭蓝牙适配器（可选）
    wx.closeBluetoothAdapter({ fail: () => {} });
  }
});