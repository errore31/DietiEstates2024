import { Images } from "../models/database";

export class imagesController{

    static async createImage(req, res){
        return Images.create({
            url: req.body.url,
            order: req.body.order,
            description: req.body.description,
            propertyId: req.body.propertyId
        });
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

        const allowedUpdates = ['url', 'order', 'description'];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                image[field] = req.body[field];
            }
        });

        await image.save();
        
        return image;
    }

}
