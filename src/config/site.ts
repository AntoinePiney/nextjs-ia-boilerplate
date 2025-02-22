export const siteConfig = {
  name: "Mon Application",
  description: "Description de mon application",
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: "https://mon-app.com/og.jpg",
  links: {
    twitter: "https://twitter.com/mon-app",
    github: "https://github.com/mon-app",
  },
  creator: "Votre Nom",
};

export type SiteConfig = typeof siteConfig;
