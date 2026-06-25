export interface SocialLink {
  platform: string;
  url: string | null;
  label: string;
}

export const socials: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/emmanuel-uzziel-malolos-25574831a/',
    label: 'LinkedIn',
  },
  {
    platform: 'Facebook',
    url: 'https://www.facebook.com/emmanueluzzie',
    label: 'Facebook',
  },
  {
    platform: 'GitHub',
    url: null,
    label: 'GitHub — coming soon',
  },
  {
    platform: 'YouTube',
    url: null,
    label: 'YouTube — coming soon',
  },
  {
    platform: 'itch.io',
    url: null,
    label: 'itch.io — coming soon',
  },
  {
    platform: 'Email',
    url: null,
    label: 'Email — coming soon',
  },
];
