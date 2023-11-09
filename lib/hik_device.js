const HikIsapiBase = require('./hik_base');

class HikDevice extends HikIsapiBase {
    /*******
     * @description: 海康设备信息处理类
     * @param {string} ip: 设备ip
     * @param {number} port: 设备端口 默认80
     * @param {string} format: http || https
     * @param {string} user: 用户名
     * @param {string} pass: 密码
     * @return {*}
     */
    constructor(ip, port, format = 'http', user, pass) {
        super(user, pass);
        this.base_ip = ip;
        this.base_port = port || 80;
        this.base_url = `${format}://${this.base_ip}:${this.base_port}`;
    }

    /*******
     * @description:获取通道的详细信息
     * @param {number} id: 通道id
     * @return {*}
     */
    async get_channel_info(id) {
        const options = {
            method: 'GET',
            uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels/${id}`,
        };

        const res = await this.send(options);
        if (!res) return false;
        return {
            id: res?.InputProxyChannel?.id,
            name: res?.InputProxyChannel?.name,
            ip: res?.InputProxyChannel?.sourceInputPortDescriptor
                ?.ipAddress,
        };
    }

    /*******
     * @description: 获取所有的通道信息
     * @return {*}
     */
    async get_all_channels() {
        try {
            const options = {
                method: 'GET',
                uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels`,
            };

            const res = await this.send(options);
            if (!res) return false;
            const channels =
                res?.InputProxyChannelList?.InputProxyChannel;
            const channel_list = channels.map(
                (item, index, array) => {
                    return {
                        id: item?.id,
                        name: item?.name,
                        ip: item?.sourceInputPortDescriptor
                            ?.ipAddress,
                    };
                },
            );
            return channel_list;
        } catch (error) {
            console.error('get all channels error ...', error);
            return false;
        }
    }

    /*******
     * @description: 添加相机通道
     * @param {*} protocol:
     * @param {*} ip:
     * @param {*} port:
     * @param {*} user:
     * @param {*} pwd:
     * @return {*}
     */
    async add_channel(protocol = 'ONVIF', ip, port, user, pwd) {
        const add_camera_obj = {
            InputProxyChannel: {
                id: 0,
                quickAdd: false,
                sourceInputPortDescriptor: {
                    proxyProtocol: protocol,
                    addressingFormatType: 'ipaddress',
                    ipAddress: ip,
                    managePortNo: port,
                    srcInputPort: 1,
                    userName: user,
                    password: pwd,
                    streamType: 'auto',
                },
                certificateValidationEnabled: false,
            },
        };
        const xml = this.build_xml(add_camera_obj);
        const options = {
            method: 'POST',
            uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels`,
            headers: {
                'Content-Type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: xml,
        };
        const res = await this.send(options);
        if (!res) return false;
        return res?.ResponseStatus?.id
            ? {
                  channel_id: Number(res?.ResponseStatus?.id),
              }
            : false;
    }

    /*******
     * @description: 获取所有通道的状态 包括激活通道
     * @return {*}
     */
    async get_channel_status() {
        const options = {
            method: 'GET',
            uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels/status`,
        };
        const res = await this.send(options);
        console.log(res);
    }

    /*******
     * @description: 删除通道
     * @param {*} id:
     * @return {*}
     */
    async delete_channel(id) {
        const options = {
            method: 'DELETE',
            uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels/${id}`,
        };

        const res = await this.send(options);
        if (!res) return false;
        console.log(res);
        return res?.ResponseStatus?.statusCode === '1';
    }
}
module.exports = HikDevice;
