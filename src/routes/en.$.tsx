import { createFileRoute, notFound } from "@tanstack/react-router";
import { CargoSeoContentPage } from "@/components/CargoSeoContentPage";
import { cargoSeoPageHead, getCargoSeoPage } from "@/packages/config/seo-pages";

export const Route = createFileRoute("/en/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? "";
    const page = getCargoSeoPage("en", slug);
    if (!page) throw notFound();
    return { slug, page };
  },
  head: ({ loaderData }) =>
    loaderData ? cargoSeoPageHead("en", loaderData.slug, loaderData.page) : {},
  component: ContentPage,
});

function ContentPage() {
  const { slug, page } = Route.useLoaderData();
  return <CargoSeoContentPage locale="en" slug={slug} page={page} />;
}
