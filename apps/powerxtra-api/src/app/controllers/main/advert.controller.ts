import { Types } from 'mongoose';
import { AdvertModel } from '../../models';
import { IAdvert } from '../../interfaces';

export class Advert {

  // CREATE
  static createAdvert(data: Partial<IAdvert>): Promise<IAdvert> {
    return new Promise(async (resolve, reject) => {
      try {
         const advert = new AdvertModel({
          ...data,
          deletedAt: null
        });
        const saved = await advert.save();
        resolve(saved);
      } catch (error) {
        reject(error);
      }
    });
  }

  // LIST ALL
  static listAdvert(query: any): Promise<IAdvert[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const adverts = await AdvertModel.find(query)
        .find({ deletedAt: null })
        .sort({ createdAt: -1 });
        resolve(adverts);
      } catch (error) {
        reject(error);
      }
    });
  }

  // GET ONE
  static getAdvert(id: string | Types.ObjectId): Promise<IAdvert | null> {
    return new Promise(async (resolve, reject) => {
      try {
         const advert = await AdvertModel.findOne({
          _id: id,
          deletedAt: null
        });
        resolve(advert);
      } catch (error) {
        reject(error);
      }
    });
  }

  // UPDATE
  static updateAdvert(
    id: string | Types.ObjectId,
    data: Partial<IAdvert>
  ): Promise<IAdvert | null> {
    return new Promise(async (resolve, reject) => {
      try {
         const updated = await AdvertModel.findOneAndUpdate(
          { _id: id, deletedAt: null },
          data,
          { new: true, runValidators: true }
        );
        resolve(updated);
      } catch (error) {
        reject(error);
      }
    });
  }

  // DELETE
  static deleteAdvert(id: string | Types.ObjectId): Promise<{ message: string }> {
    return new Promise(async (resolve, reject) => {
      try {
         await AdvertModel.findByIdAndUpdate(id, {
          deletedAt: new Date()
        });
        resolve({ message: 'Advert deleted successfully' });
      } catch (error) {
        reject(error);
      }
    });
  }
   // RESTORE (optional but recommended)
  static restoreAdvert(id: string | Types.ObjectId): Promise<IAdvert | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const restored = await AdvertModel.findByIdAndUpdate(
          id,
          { deletedAt: null },
          { new: true }
        );

        resolve(restored);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// export default new Advert();
