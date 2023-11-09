# hik_isapi_tools

## 1.​ 简介
nodejs 封装海康ispi接口 可用来操作海康相机、存储、超脑等设备。
- hik_device：通道等基本信息操作类
- hik_face_data: 人脸信息操作类

## 2. 安装
```
npm install
```

## 3. 使用
```javascript
 const hik_device = new HikDevice(
      '192.168.1.xx', // 设备ip
      80,             // 连接端口
      'http',        
      'admin',        // 用户名
      'admin123',     // 密码
  );
  // 获取所有添加的相机
  const channel_list = await hik_device.get_all_channels();
  console.log(channel_list);
```

