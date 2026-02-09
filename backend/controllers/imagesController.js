import { Images } from "../models/database.js";

export class imagesController{

    static async createImages(propertyId, files){
        const ImagePromise = files.map((file, index) => {
            return Images.create({
                url: file.filename,
                order: index, // use a position based on the order of files
                propertyId: propertyId
            });
        });
        return Promise.all(ImagePromise); //attend all the promises 
    }
  
    static async deleteImage(idImage){
        const image = await Images.findByPk(idImage);
        if(!image){
            throw new customError('Immagine non trovata', 404);    
        }

        await image.destroy();
        return true;
    }

    static async updateImage(req, idImage){
        const image = await Images.findByPk(idImage);
        if(!image){
            throw new customError('Immagine non trovata', 404);    
        }

        const allowedUpdates = ['url', 'order'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                image[field] = req.body[field];
            }
        });

        await image.save();
        
        return image;
    }

}
