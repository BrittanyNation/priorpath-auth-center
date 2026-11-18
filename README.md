# PriorPath Auth Center — Prior Authorization Guides and Request Tracker

**Live site:** https://brittanynation.github.io/priorpath-auth-center/

A fully functional prior authorization help center website for **PriorPath**, a fictional authorization support service: nine plain word guides you can search, filter, sort, and read in full, a request tracker where a validated sample request earns a real PA reference number and can be looked up, updated with notes, moved through its statuses, or cancelled, and a resources page with a documentation checklist builder whose progress saves per service, a searchable glossary, FAQ accordions, and a duplicate aware letter signup. Every interactive element works, with no dead buttons and no placeholder links.

This is an original portfolio concept by Brittany Nation. No affiliation with any real payer, clinic, or company is claimed, and no real health information should be entered; sample data lives only in the visitor browser. It supports applications for Authorization and Verification Research Specialist (Silna Health), Payor Process and Documentation Specialist (Silna Health), Accounts Receivable Specialist (Labcorp), Premium Reconciliation Specialist (Trustmark), and Technical Writer roles, because it combines a coded front end, real documentation writing, and a working authorization workflow in one site. Design workflow: Sketch and Webflow for layout thinking, built with HTML, CSS, and JavaScript.

## Course track: complete — combined-skills build

The daily projects followed Dr. Angela Yu's Full-Stack Web Development Bootcamp (Udemy) one skill at a time: live APIs and async JavaScript, Node.js and Express, databases and REST API design, authentication, and React. With all five steps complete, this build combines the front-end patterns from across the course in plain JavaScript, with the code commented as study material:

- **Data-driven rendering** — guides, requests, checklists, glossary terms, and FAQs are all built from data arrays.
- **State and persistence** — requests, helpful votes, checklist progress, and letter signups save to localStorage on every change and restore on load.
- **Derived state** — visible guides, requests, and glossary terms are computed from filter, search, and sort inputs, never stored twice; checklist progress percentage is derived from checked items.
- **Validated forms** — the request form validates name, email, payer, service, a future planned date, and a clinical summary of at least 20 characters before generating a PA-XXXXXX confirmation reference.
- **Workflow state** — a request moves only forward through Submitted, In Review, and Decision Made, or into Cancelled, with every change written into its case notes.

## What works on the site

- **Guides** — 9 guides across Getting Started, Eligibility, Submitting, and Denials and Appeals; topic chips, live search, three sort orders, live result count, honest empty state, a full article reader with numbered steps, and a helpful vote that persists and then disables.
- **Request Tracker** — validated new request form ending in a PA-XXXXXX reference; two labeled sample requests on first load; status filter chips and lookup by reference, name, or service; a detail view where notes append with dates, status moves forward one step at a time, and a request can be cancelled, all persisted.
- **Checklists and FAQs** — a checklist builder for six services, each with its own document list, checkbox progress bar and percentage, a per service reset, and a completion link into the tracker; an 8 term searchable glossary; six FAQ accordions that open one at a time; and a duplicate aware letter signup.

## Verified

Automated DOM checks against the built files cover: all 9 guide cards rendering, topic filtering, search narrowing and the empty state, sort order, the article reader and its persisted vote, invalid and valid request submits including a past date rejection, the PA reference format and persistence, status filtering and lookup, note adding, status advancing to Decision Made, cancellation, checklist rendering for two services with progress math and persistence, checklist reset, glossary search, FAQ accordion behavior, and the letter signup with duplicate recognition.

## Palette

Deep teal `#0F3D3E`, teal `#17585A`, sea mint `#A7D8C9`, mint soft `#E6EFEA`, amber `#E9B44C`, cream `#FDFBF5`, ink `#1E2420`.

## Images

All content imagery is real photography from Pexels, downloaded into `images/` and referenced locally (photo IDs 4989132, 5452225, 5467601, 6129037, 6285379, 7640451, 7682205, 7691730, 8192000, 8376156). The `og-image.png` is a branded design graphic, not a photograph.

## Files

- `index.html` — guides home with Open Graph tags
- `guides.js` — guide data, filtering, search, sort, article reader, and votes, commented as study code
- `tracker.html` — request form and tracker
- `tracker.js` — request state, validation, workflow, notes, and cancellation, commented as study code
- `resources.html` — checklist builder, glossary, FAQs, and letter signup
- `resources.js` — checklist, glossary, accordion, and signup logic, commented as study code
- `styles.css` — shared styling
- `og-image.png` — 1200 by 627 social preview graphic in the project palette
