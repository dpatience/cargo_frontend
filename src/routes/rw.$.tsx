import { createFileRoute, notFound } from "@tanstack/react-router";
import { CargoSeoContentPage } from "@/components/CargoSeoContentPage";
import { cargoSeoPageHead, getCargoSeoPage } from "@/packages/config/seo-pages";

export const Route = createFileRoute("/rw/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? "";
    const page = getCargoSeoPage("rw", slug);
    if (!page) throw notFound();
    return { slug, page };
  },
  head: ({ loaderData }) =>
    loaderData ? cargoSeoPageHead("rw", loaderData.slug, loaderData.page) : {},
  component: ContentPage,
});

function ContentPage() {
  const { slug, page } = Route.useLoaderData();
  return <CargoSeoContentPage locale="rw" slug={slug} page={page} />;
}
