# Chief Alltechs Ventures Information System — Design Specification

**Date:** 2026-07-27  
**Status:** Approved for specification review

## Purpose

Create a clear, polished coursework information-system website for Chief Alltechs Ventures. The site must visibly satisfy the required pages, JavaScript demonstrations, group profiles, authentication, and database CRUD operations while remaining usable on desktop and mobile devices.

## Scope

### Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home page; navigation, company overview, group profiles, scrolling text, five-image swap gallery, and company-brief popup. |
| `about.html` | Company background, mission, vision, values, and operating model. |
| `services.html` | Service offerings and service-detail popup. |
| `contact.html` | Company contact information, validated contact form, and confirmation popup. |
| `login.html` | Login and registration interface for the database portal. |
| `database.html` | Protected client-side database demonstration with CRUD controls and tabular retrieval. |

### Group profiles

The home page will display the supplied images in this order:

1. Ebenezer Nana Annan — `MS/ITE/25/0041` — UCC Campus, Cape Coast
2. Okyere-Darko Addai — `MS/ITE/25/0044` — UCC Campus, Cape Coast
3. Frank Akrasi Antwi — `MS/ITE/25/0051` — UCC Campus, Cape Coast
4. Michael Essel — `MS/ITE/25/0053` — UCC Campus, Cape Coast

## Visual design

The interface is coursework-first: each assessed function is easy to identify and use, with visual refinement applied consistently.

- **Typography:** Instrument Serif for headings; Bricolage Grotesque for body copy, navigation, labels, forms, and table content.
- **Palette:** warm paper backgrounds, near-black ink, and restrained gold accents.
- **Layout:** a detached floating navigation pill, spacious editorial sections, responsive single-column mobile fallbacks, and asymmetric home-page profile/gallery composition.
- **Components:** important cards, forms, gallery frames, and data panels use nested double-bezel surfaces for tactile depth. Buttons use pill shapes and custom spring-like motion.
- **Motion:** `IntersectionObserver` entry reveals and transform/opacity-only transitions. All motion honors reduced-motion preferences.

## JavaScript functionality

### Required demonstrations

1. **Scrolling text:** a continuously moving operations/news notice on the home page.
2. **Image swap:** home-page gallery cycles through no more than five provided hero images. Controls allow manual selection; automatic cycling pauses when reduced motion is preferred.
3. **Three pop-ups:**
   - Home: company brief modal.
   - Services: service-detail modal.
   - Contact: successful enquiry confirmation modal after validation.

### Authentication

- Registration requires full name, username, email, and a password.
- Accounts are stored in browser `localStorage` for this static-site demo.
- The supplied `admin` / `admin123` account remains available as a demo account.
- A valid login writes a session marker and routes to `database.html`.
- The database page redirects unauthenticated visitors to `login.html`; logout clears the session marker.

### Database demonstration

The database represents company employee records. Fields are record ID, employee name, role, and department.

| Control | Expected behavior |
| --- | --- |
| Add Record | Validates required fields, rejects duplicate record IDs, stores a new record, and refreshes the table. |
| Retrieve Record | Displays all stored records in a visible semantic table; a supplied record ID may narrow the display to one matching row. |
| Update Record | Requires an existing record ID and replaces its values with validated form values. |
| Delete Record | Requires an existing record ID, requests confirmation, removes the record, and refreshes the table. |

Seed records ensure that the Retrieve Record action has meaningful tabular output on a first visit. Records are stored in `localStorage` so CRUD behavior persists across refreshes on the same browser.

## Validation and error handling

- Forms use clear inline errors and preserve entered values when validation fails.
- Database actions announce outcomes in a status region.
- Modals close with their close button, overlay click, and Escape key, returning focus to the triggering control.
- Empty database states use an explanatory message rather than a blank table.

## Verification criteria

- All six pages load and navigation links resolve.
- The home page shows all four specified member names, IDs, locations, and images.
- Scrolling text, image swap, and all three pop-ups execute without browser-console errors.
- Registration/login controls gate the database page correctly.
- Add, Retrieve, Update, and Delete work against the employee records, with Retrieve producing a table.
- At widths below 768px, navigation and page sections remain usable without horizontal overflow.
- Font declarations load Instrument Serif and Bricolage Grotesque as specified.

## Non-goals

- This is a static frontend demonstration, not a production authentication system or server-backed database.
- No external payment, email-delivery, or administration service is included.
