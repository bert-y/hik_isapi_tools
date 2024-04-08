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
     * @return {{
     *  id: <string>,
     *  name: <string>,
     *  ip: <string>
     * }}
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
     * @return {[
     *  {
     *  	id: <string>,
     *  	name: <string>,
     *  	ip: <string>
     *  }
     * ]}
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
     * @param {string} protocol: 默认ONVIF
     * @param {string} ip: 相机IP
     * @param {string} port: 端口
     * @param {string} user: 用户名
     * @param {string} pwd: 密码
     * @return {{channel_id:<int>} || false}
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
    async get_channel_status(ip = null) {
        const options = {
            method: 'GET',
            uri: `${this.base_url}/ISAPI/ContentMgmt/InputProxy/channels/status`,
        };
        const res = await this.send(options);
        if (!res) return false;
        let all_channel_status =
            res?.InputProxyChannelStatusList?.InputProxyChannelStatus;
        if (ip) {
            all_channel_status = all_channel_status.filter((item) => {
                if (
                    item?.sourceInputPortDescriptor?.ipAddress === ip
                ) {
                    return item;
                }
            });
        }

        return this.parse_channel_status(all_channel_status);
    }

    parse_channel_status(data) {
        return data.map((item) => {
            return {
                id: item?.id,
                online: item?.online,
                ip: item?.sourceInputPortDescriptor?.ipAddress,
            };
        });
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
        return res?.ResponseStatus?.statusCode === '1';
    }
}
module.exports = HikDevice;
