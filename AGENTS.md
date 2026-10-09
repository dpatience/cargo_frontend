<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Three isolated app areas (client at `/`, `/driver/*`, `/admin/*`) share only `src/packages/*`; never add role-based switching between them — they must stay independently deployable.
- All dynamic data goes through `src/packages/api` with Zod validation; never add mock data — show unconfigured/empty/error states instead.
- UI strings use i18n keys in `src/packages/i18n` (EN source, RW partial with EN fallback).
