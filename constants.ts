
import { Report, IssueCategory, ReportStatus } from './types';

export const ISSUE_CATEGORIES: IssueCategory[] = [
  IssueCategory.Pothole,
  IssueCategory.Streetlight,
  IssueCategory.Garbage,
  IssueCategory.Electrical,
  IssueCategory.FireHazard,
  IssueCategory.Graffiti,
  IssueCategory.Other
];

export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Major Pothole on Main St.',
    description: 'Deep pothole causing traffic slowdowns and hazard to cyclists near the intersection.',
    category: IssueCategory.Pothole,
    status: ReportStatus.Pending,
    location: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
    date: '2024-10-12',
    upvotes: 24,
  },
  {
    id: '2',
    title: 'Corner Streetlight Out',
    description: 'The streetlight at the corner of Oak and Park is completely dark, creating a safety concern.',
    category: IssueCategory.Streetlight,
    status: ReportStatus.InProgress,
    location: { lat: 40.7150, lng: -74.0090 },
    imageUrl: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&q=80&w=400',
    date: '2024-10-10',
    upvotes: 8,
  },
  {
    id: '3',
    title: 'Garbage accumulation',
    description: 'Trash bins are full and spilling over into the sidewalk near the playground.',
    category: IssueCategory.Garbage,
    status: ReportStatus.Resolved,
    location: { lat: 40.7135, lng: -74.0040 },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    date: '2024-10-11',
    upvotes: 15,
  }
];
