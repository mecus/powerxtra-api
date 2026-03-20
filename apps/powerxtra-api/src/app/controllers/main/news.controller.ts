import { Types } from 'mongoose';
import { NewsModel } from '../../models';
import { INews } from '../../interfaces';

// export interface INews extends Document {
//   title: string;
//   content: string;
//   imageUrl?: string;
//   published: boolean;
//   deletedAt?: Date | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export class News {

  // CREATE
  static createNews(data: Partial<INews>): Promise<INews> {
    return new Promise(async (resolve, reject) => {
      try {
        const news = new NewsModel({
          ...data,
          deletedAt: null
        });

        const saved = await news.save();
        resolve(saved);
      } catch (error) {
        reject(error);
      }
    });
  }

  // LIST (exclude deleted)
  static listNews(query: any): Promise<INews[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const newsList = await NewsModel
          .find({...query, deletedAt: null })
          .sort({ createdAt: -1 });

        resolve(newsList);
      } catch (error) {
        reject(error);
      }
    });
  }

  // GET ONE (exclude deleted)
  static getNews(id: string | Types.ObjectId): Promise<INews | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const news = await NewsModel.findOne({
          _id: id,
          deletedAt: null
        });

        resolve(news);
      } catch (error) {
        reject(error);
      }
    });
  }

  // UPDATE (only if not deleted)
  static updateNews(
    id: string | Types.ObjectId,
    data: Partial<INews>
  ): Promise<INews | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await NewsModel.findOneAndUpdate(
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

  // SOFT DELETE
  static deleteNews(id: string | Types.ObjectId): Promise<{ message: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        await NewsModel.findByIdAndUpdate(id, {
          deletedAt: new Date()
        });

        resolve({ message: 'News soft deleted successfully' });
      } catch (error) {
        reject(error);
      }
    });
  }

  // RESTORE
  static restoreNews(id: string | Types.ObjectId): Promise<INews | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const restored = await NewsModel.findByIdAndUpdate(
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

// export default new News();
