import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import env from "../env";

const s3Config: S3ClientConfig = {
    region: "eu-north-1",
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    }
};

const s3Client = new S3Client(s3Config);
export default s3Client;