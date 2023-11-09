const { HikFace, HikDevice } = require('../index.js');
test_get_channels();
async function test_get_channels() {
    const hik_device = new HikDevice(
        '192.168.1.69',
        80,
        'http',
        'admin',
        'clounode123',
    );
    const channel_list = await hik_device.get_all_channels();
    console.log(channel_list);
}
