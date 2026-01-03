
export enum ReportStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export enum IssueCategory {
  Pothole = 'Pothole',
  Streetlight = 'Streetlight Outage',
  Garbage = 'Overflowing Trash Bin',
  Electrical = 'Electrical Hazard',
  FireHazard = 'Fire Hazard',
  Graffiti = 'Graffiti',
  Other = 'Other'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: ReportStatus;
  location: Coordinates;
  imageUrl: string;
  date: string;
  userName?: string;
  phone?: string;
  upvotes: number;
}
