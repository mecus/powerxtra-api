
export interface IProgramme {
  title: string;
  presenter: string;
  presenter_id: string; // user_id
  startTime: string; // e.g., "08:00"
  endTime: string;
  category: 'Live' | 'AutoDJ' | 'Podcast';
  active: boolean;
  artwork?: string; // New field for the show image
  description?: string;
  createdBy?: string;
}
