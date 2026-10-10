const publicSiteUrl = import.meta.env["VITE_PUBLIC_SITE_URL"];
const clientHost = import.meta.env["VITE_CLIENT_HOST"];
const publicSiteOrigin = publicSiteUrl || (clientHost ? `https://${clientHost}` : undefined);

export function absoluteSiteUrl(path: string): string | undefined {
  return publicSiteOrigin ? new URL(path, publicSiteOrigin).toString() : undefined;
}
