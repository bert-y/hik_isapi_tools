# hik_isapi_tools

## 1.​ 简介
nodejs 封装海康ispi接口 可用来操作海康相机、存储、超脑等设备。
- hik_device：通道等基本信息操作类
- hik_face_data: 人脸信息操作类

## 2. 安装
```
npm install
```

## 3. 接口文档

-   类实例化所需参数:

    |  参数  |  类型  |      说明       |
    | :----: | :----: | :-------------: |
    |   ip   | string |     设备IP      |
    |  port  | number | 设备端口默认80  |
    | format | string | http \|\| https |
    |  user  | string |     用户名      |
    |  pass  | string |      密码       |

    例如：

    ```javascript
    const hik_device = new HikDevice(
        '192.168.1.69',
        80,
        'http',
        'admin',
        'admin123',
    );
    ```

    -   HikDevice类api列表:

        1.   获取指定通道的详细信息:

             ```javascript
             /*******
              * @description:获取通道的详细信息
              * @param {number} id: 通道id
              * @return {{
              *  id: string,
              *  name: string,
              *  ip: string
              * }}
              */
             async get_channel_info(id)
             ```

        2.   获取所有通道信息:

             ```javascript
             /*******
              * @description: 获取所有的通道信息
              * @return {[
              *  {
              *  	id: <string>,
              *  	name: <string>,
              *  	ip: <string>
              *  }
              * ]}
              */
             async get_all_channels()
             ```

        3.   添加通道:

             ```js
             /*******
              * @description: 添加相机通道
              * @param {string} protocol: 默认ONVIF
              * @param {string} ip: 相机IP
              * @param {string} port: 端口
              * @param {string} user: 用户名
              * @param {string} pwd: 密码
              * @return {{channel_id:<int>} || false}
              */
             async add_channel(protocol = 'ONVIF', ip, port, user, pwd)
             ```

        4.   获取通道状态:

             ```js
              /*******
              * @description: 获取通道状态
              * @param {string || null } ip: 设备IP 可以不填
              * @return {[
              *  {
              *  	id: <string>,
              *  	name: <string>,
              *  	ip: <string>
              *  }
              * ]}
              */
             async get_channel_status(ip = null)
             ```

        5.   删除通道:

             ```js
              /*******
              * @description: 删除通道
              * @param {int} id: 通道id
              * @return {bool} 
              */
             async delete_channel(id) 
             ```

    -   HikFaceData类api列表:

        1.   添加人脸进入设备

             ```js
             /*******
              * @description: 添加人脸信息
              * @param {Object} para: 添加信息对象
              * @param {string} para.face_base64: 人脸的base64图片
              * @param {string} para.FDID: 人脸库 ID
              * @param {string} para.name: 人名
              * @param {string} para.born_time: 生日
              * @param {string} para.sex: 性别
              * @param {string} para.province:
              * @param {string} para.city: 城市
              * @param {string} para.certificate_type: 证件类别
              * @param {string} para.certificate_number: 证件号
              * @param {string} para.phone_number: 手机号
              * @return {string} pid: 人脸照片的ID
              */
             async add_face_data(para)
             ```

        2.   删除人脸

             ```js
             /*******
              * @description: 删除人脸信息
              * @param {string} FDID: 人脸库id
              * @param {string} PID: 人脸图片ID
              * @return {bool}
              */
             async delete_face_data(FDID, PID)
             ```

             
