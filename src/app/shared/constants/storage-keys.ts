export const STORAGE_KEYS = {
  AVATAR_CACHE: 'candidatos-avatars',
  CURRENT_PAGE: 'candidatos-current-page',
} as const;

export const AVATAR_IMAGES = [
  'https://img.daisyui.com/images/profile/demo/2@94.webp',
  'https://img.daisyui.com/images/profile/demo/3@94.webp',
  'https://img.daisyui.com/images/profile/demo/4@94.webp',
  'https://img.daisyui.com/images/profile/demo/5@94.webp'
] as const;

export type AvatarImage = typeof AVATAR_IMAGES[number];
