export const acceptableMaterialTypes = [
  'GDrive',
  'pdf',
  'video',
  'audio',
  'image',
  'article',
  'other',
];
export type AcceptableMaterialTypes =
  | 'GDrive'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'image'
  | 'article'
  | 'other';

export type RequestFromAuth = { user: { id: string } };
