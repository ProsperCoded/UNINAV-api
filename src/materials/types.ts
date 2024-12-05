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
export type ResponseType = { message: string; data?: any; error?: any };
