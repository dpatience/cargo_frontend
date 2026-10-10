const publicSiteUrl = import.meta.env["VITE_PUBLIC_SITE_URL"];
const clientHost = import.meta.env["VITE_CLIENT_HOST"];
const publicSiteOrigin =
  publicSiteUrl || (clientHost ? `https://${clientHost}` : "https://cargo.tembera.nyxarith.com");

export function absoluteSiteUrl(path: string): string {
  return new URL(path, publicSiteOrigin).toString();
}
