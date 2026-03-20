
export interface IPresenter {
  name: string;
  uid: string;
  category: 'Live' | 'AutoDJ' | 'Podcast';
  active: boolean;
  avatar?: string; // New field for the show image
  settings: string;
}
