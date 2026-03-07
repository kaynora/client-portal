const minio = require('minio')

const mc = new minio.Client({
    endPoint: process.env.MC_HOST,
    port: Number(process.env.MC_PORT),
    useSSL: process.env.MC_SSL === 'true',
    accessKey: process.env.MC_USER,
    secretKey: process.env.MC_PASSWORD
})

;(async () => {
    const exists = await mc.bucketExists('main-bucket')
    if (!exists) await mc.makeBucket('main-bucket')
})()

module.exports = {
    mc
}
