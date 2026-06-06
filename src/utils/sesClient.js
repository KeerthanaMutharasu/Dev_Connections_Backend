const { SESClient } = require("@aws-sdk/client-ses")
const REGION = "ap-south-1";


console.log(process.env.AWS_SES_ACCESSKEY,
    process.env.AWS_SES_SECRETKEY, "jhj"
)
const sesClient = new SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESSKEY,
        secretAccessKey: process.env.AWS_SES_SECRETKEY
    }
});
module.exports = { sesClient };