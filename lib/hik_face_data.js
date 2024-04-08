const HikIsapiBase = require('./hik_base');
const FormData = require('form-data');

class HikFaceData extends HikIsapiBase {
    /*******
     * @description: 海康人脸信息处理类
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
    async add_face_data(para) {
        const img_data = Buffer.from(para.face_base64, 'base64');
        const upload_data = {
            PictureUploadData: {
                FDID: para.FDID,
                FaceAppendData: {
                    name: para.name,
                    bornTime: para.born_time || '2004-01-01',
                    sex: para?.sex || 'female',
                    province: para?.province,
                    city: para?.city,
                    certificateType: para?.certificate_type || 'ID',
                    certificateNumber: para?.certificate_number,
                    phoneNumber: para?.phone_number,
                },
            },
        };
        const xml = this.build_xml(upload_data);

        const formData = {
            FaceAppendData: {
                value: xml,
                options: {
                    contentType: 'text/xml',
                },
            },
            importImage: {
                value: img_data,
                options: {
                    contentType: 'image/jpeg',
                },
            },
        };

        const options = {
            method: 'POST',
            url: `${this.base_url}/ISAPI/Intelligent/FDLib/pictureUpload?type=concurrent`,
            headers: { 'Content-Type': 'multipart/form-data' },
            formData: formData,
        };
        const res = await this.send(options);
        if (!res) return false;
        return res?.PID || res?.MaskInfo?.PID || '';
    }

    /*******
     * @description: 删除人脸信息
     * @param {string} FDID: 人脸库id
     * @param {string} PID: 人脸图片ID
     * @return {bool}
     */
    async delete_face_data(FDID, PID) {
        const options = {
            method: 'DELETE',
            uri: `${this.base_url}/ISAPI/Intelligent/FDLib/${FDID}/picture/${PID}`,
        };
        const res = await this.send(options);
        if (!res) return false;

        const status = this.response(res);
        return status;
    }
}
module.exports = HikFaceData;
