// pages/device/device.js
Page({
  data: {
    // 蓝牙状态
    bluetoothState: false,
    // 搜索中
    searching: false,
    // 已绑定设备
    bindedDevices: [],
    // 搜索到的设备
    searchedDevices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查蓝牙状态
    this.checkBluetoothState();
    // 加载已绑定设备
    const bindedDevices = wx.getStorageSync('bindedDevices') || [];
    this.setData({ bindedDevices });
  },

  // 检查蓝牙状态
  checkBluetoothState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        this.setData({
          bluetoothState: res.available
        });
      },
      fail: () => {
        this.setData({
          bluetoothState: false
        });
      }
    });
  },

  // 开启/关闭蓝牙
  toggleBluetooth() {
    if (!this.data.bluetoothState) {
      // 初始化蓝牙
      wx.openBluetoothAdapter({
        success: () => {
          wx.showToast({
            title: '蓝牙开启成功',
            icon: 'success'
          });
          this.setData({
            bluetoothState: true
          });
        },
        fail: (err) => {
          wx.showToast({
            title: '蓝牙开启失败',
            icon: 'none'
          });
          console.log('蓝牙开启失败：', err);
        }
      });
    }
  },

  // 搜索设备
  searchDevice() {
    if (this.data.searching) return;

    this.setData({
      searching: true,
      searchedDevices: []
    });

    // 开始搜索蓝牙设备
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      success: () => {
        wx.showToast({
          title: '开始搜索设备',
          icon: 'success'
        });

        // 监听发现设备事件
        wx.onBluetoothDeviceFound((res) => {
          const devices = res.devices.filter(device => device.name && device.name.includes('坐姿监测'));
          if (devices.length > 0) {
            this.setData({
              searchedDevices: [...this.data.searchedDevices, ...devices]
            });
          }
        });

        // 5秒后停止搜索
        setTimeout(() => {
          wx.stopBluetoothDevicesDiscovery();
          this.setData({
            searching: false
          });

          if (this.data.searchedDevices.length === 0) {
            wx.showToast({
              title: '未搜索到设备',
              icon: 'none'
            });
          }
        }, 5000);
      },
      fail: (err) => {
        wx.showToast({
          title: '搜索设备失败',
          icon: 'none'
        });
        this.setData({
          searching: false
        });
        console.log('搜索设备失败：', err);
      }
    });
  },

  // 绑定设备
  bindDevice(e) {
    const device = e.currentTarget.dataset.device;
    const bindedDevices = [...this.data.bindedDevices, {
      deviceId: device.deviceId,
      name: device.name,
      connected: false
    }];

    // 去重
    const uniqueDevices = Array.from(new Set(bindedDevices.map(item => item.deviceId)))
      .map(id => bindedDevices.find(item => item.deviceId === id));

    this.setData({
      bindedDevices: uniqueDevices
    });

    // 保存到本地
    wx.setStorageSync('bindedDevices', uniqueDevices);

    wx.showToast({
      title: '设备绑定成功',
      icon: 'success'
    });

    // 清空搜索结果
    this.setData({
      searchedDevices: []
    });
  },

  // 连接设备
  connectDevice(e) {
    const deviceId = e.currentTarget.dataset.deviceid;
    const bindedDevices = this.data.bindedDevices.map(item => {
      if (item.deviceId === deviceId) {
        return { ...item, connected: true };
      }
      return item;
    });

    this.setData({ bindedDevices });
    wx.setStorageSync('bindedDevices', bindedDevices);

    wx.showToast({
      title: '设备连接成功',
      icon: 'success'
    });
  },

  // 解绑设备
  unbindDevice(e) {
    const deviceId = e.currentTarget.dataset.deviceid;
    wx.showModal({
      title: '确认解绑',
      content: '确定要解绑该设备吗？',
      success: (res) => {
        if (res.confirm) {
          const bindedDevices = this.data.bindedDevices.filter(item => item.deviceId !== deviceId);
          this.setData({ bindedDevices });
          wx.setStorageSync('bindedDevices', bindedDevices);

          wx.showToast({
            title: '设备解绑成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时停止搜索设备
    wx.stopBluetoothDevicesDiscovery();
  }
});