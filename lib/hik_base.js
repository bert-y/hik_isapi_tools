const request = require('request');
const xml2js = require('xml2js');

class HikIsapiBase {
    #user = null;
    #pass = null;
    constructor(user, pass) {
        this.#user = user;
        this.#pass = pass;
    }

    send(option) {
        const para = Object.assign(
            {
                auth: {
                    user: this.#user,
                    pass: this.#pass,
                    sendImmediately: false,
                },
                timeout: 20000,
            },
            option,
        );
        return new Promise((resolve, reject) => {
            request(para, async (err, response, body) => {
                if (err?.code === 'ETIMEDOUT') {
                    console.error('hik response timeout...');
                    resolve(false);
                    return;
                }
                if (!err && response.statusCode == 200) {
                    const json_data = await this.parse_xml(body);
                    resolve(json_data);
                } else {
                    console.error('hik response error...', err);
                    console.error(
                        'hik response error body is:',
                        body,
                    );
                    resolve(false);
                }
            });
        });
    }

    async parse_xml(str) {
        try {
            const res_data = await xml2js.parseStringPromise(str, {
                explicitArray: false,
                ignoreAttrs: false,
            });
            return res_data;
        } catch (error) {
            console.error('parse xml error..', error);
            return false;
        }
    }

    build_xml(obj) {
        let builder = new xml2js.Builder({
            xmldec: {
                encoding: 'UTF-8',
            },
        });
        let xml = builder.buildObject(obj);
        return xml;
    }

    response(hik_res) {
        if (hik_res?.ResponseStatus?.statusCode === '1') return true;
        return false;
    }
}
module.exports = HikIsapiBase;
