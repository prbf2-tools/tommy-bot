import ftp from "basic-ftp";

export const uploadFiles = async (...files: string[][]) => {
    const clientFTP = new ftp.Client();
    clientFTP.ftp.verbose = true;
    try {
        await clientFTP.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
        });
        files.forEach(async (f) => {
            await clientFTP.uploadFrom(
                f[0],
                f[1],
            );
        });
    } catch (err) {
        console.log(err);
    }
    clientFTP.close();
};
