const fs = require('fs');
module.exports =
    class NewsFilesRepository {

        static getServerNewsFilesFolder() {
            return "./wwwroot/news/";
        }
        static getNewsFilesFolder() {
            return "/news/";
        }
        static getNewsFileURL(GUID) {
            if (GUID != "")
                return this.getNewsFilesFolder() + GUID + ".png";
            return "";
        }
        static getThumbnailFileURL(GUID) {
            if (GUID != "")
                return this.getNewsFilesFolder() + "thumbnails/" + GUID + ".png";
            return "";
        }
        static getServerNewsFileURL(GUID) {
            return this.getServerNewsFilesFolder() + GUID + ".png";
        }
        static getServerThumbnailFileURL(GUID) {
            return this.getServerNewsFilesFolder() + "thumbnails/" + GUID + ".png";
        }
        static removeNewsFile(GUID) {
            if (GUID != "") {
                try {
                    fs.unlinkSync(this.getServerNewsFileURL(GUID));
                    fs.unlinkSync(this.getServerThumbnailFileURL(GUID));
                } catch (err) {
                    console.log('news not found');
                }
            }
        }
        static storeNewsData(previousGUID, newsDataBase64) {
            if (newsDataBase64) {
                // Remove MIME specifier
                newsDataBase64 = newsDataBase64.split("base64,").pop();

                const resizeImg = require('resize-img');
                const thumbnailSize = 256;
                const { v1: uuidv1 } = require('uuid');

                // remove previous news
                this.removeNewsFile(previousGUID);

                // get a new GUID
                let GUID = uuidv1();

                // Store new news file in newss folder
                let newsDataBinary = new Buffer.from(newsDataBase64, 'base64');
                fs.writeFileSync(this.getServerNewsFileURL(GUID), newsDataBinary);

                // Store new news file in thumbnails folder
                let tempGUID = uuidv1();
                let tempFile = this.getServerThumbnailFileURL(tempGUID);
                fs.writeFileSync(tempFile, newsDataBinary);

                // compute thumbnail resizes dimension keeping proportion of original size
                var sizeOf = require('image-size');
                var dimensions = sizeOf(tempFile);
                let newHeight = 0;
                let newWidth = 0;
                if (dimensions.height > dimensions.width) {
                    newWidth = dimensions.width * thumbnailSize / dimensions.height;
                    newHeight = thumbnailSize;
                } else {
                    newHeight = dimensions.height * thumbnailSize / dimensions.width;
                    newWidth = thumbnailSize;
                }

                // resize new news thumbnail 
                (async () => {
                    const thumbnailNews = await resizeImg(fs.readFileSync(tempFile), { width: newWidth, height: newHeight });
                    fs.writeFileSync(this.getServerThumbnailFileURL(GUID), thumbnailNews);
                    fs.unlinkSync(tempFile);
                })();
                return GUID;
            } else
                return previousGUID;
        }
    }