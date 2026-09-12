# مركز السيارة — UI Design System

هذا الملف يثبت قرارات الواجهة حتى لا ترجع التعديلات المستقبلية إلى تصميمات متضاربة.

## Design direction
- Arabic-first RTL automotive commerce.
- Premium utility: clean, technical, restrained, high trust.
- Dark navy foundation + warm orange action color + cool neutral surfaces.
- Real product photography; no emoji product placeholders.
- English numerals for money, stock, quantities, order numbers and dates.
- Mobile-first responsive layout with large tap targets.

## Typography
- Arabic: IBM Plex Sans Arabic.
- Latin/numerals: Manrope with tabular numerals.

## Core tokens
- Ink: `#0b1220`
- Accent: `#ef5b2a`
- Background: `#f5f7fa`
- Card: `#ffffff`
- Border: `#e3e8ee`
- Success: `#169a64`

## UX rules
1. Product cards must use the same component contract and never depend on a second global theme file.
2. Product images must use a fixed frame and `object-fit: contain` with an explicit fallback.
3. Search, category filters, favorites, cart and checkout must work on first load without Supabase.
4. UI copy stays Iraqi-friendly but concise and professional.
5. Numbers are formatted through `Intl.NumberFormat('en-US')`.

## Design methodology
The design direction was implemented using principles from NextLevelBuilder's UI UX Pro Max skill, especially its design-system-first approach, and cross-checked against frontend-design, webapp-testing, systematic-debugging and verification-oriented skills from the VoltAgent Awesome Agent Skills catalog.
