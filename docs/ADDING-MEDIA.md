# Adding a new media item

Every article, interview, podcast, video and appearance uses the same format, so each one keeps
working after it's published: it shows as evidence of James's work, and points people to a next step.

One entry in `src/data/media.js` appears in four places automatically:

| Where | What visitors see |
|---|---|
| **Media page** (`#media`) | The item, with **what it means for families** and, for syndicated stories, where it ran in Colorado |
| **Home** ("In the news") | The newest two items, same family angle |
| **Speaking page** ("Media coverage") | The same item, with **what an audience can learn** from James |
| **"As seen in" strips** | Placement outlets: Colorado/Denver on Home and Media, national on Speaking |

## Checklist for each new item

Wait until the piece is **live** and you have its public link.

1. **Add the entry** at the top of `MEDIA` in `src/data/media.js`, newest first:

   ```js
   {
     id: 'kdvr-interview-2027',            // lowercase-with-dashes
     type: 'Interview',                    // Feature story | Article | Interview | Podcast | Video | Appearance | Book
     outlet: 'FOX31 Denver · Colorado’s Best',  // publication, program or show
     title: 'Adaptive Fitness for Every Family',
     date: '2027-02-14',                   // YYYY-MM-DD
     intro: 'One or two sentences in our own words about what the piece covers.',
     families: 'What this coverage means for families looking for coaching.',
     speaking: 'How it connects to James’s topics, and what an audience can learn.',
     topics: ['inclusive-environments'],   // ids from TOPICS in src/data/speaking.js
     action: { label: 'Watch the interview', href: 'https://…' },  // Read the article / Listen / Watch
     youtube: 'VIDEO_ID',                  // optional: embeds a clip
     audio: 'https://…',                   // optional: podcast or audio link ("Listen to the appearance")
   },
   ```

   Write the `intro`, `families` and `speaking` lines fresh. Don't paste text from the article.

2. **Syndicated stories** (a distribution report such as NewsUSA's "Live Results Export"):

   ```sh
   npm run import-placements -- path/to/report.xlsx my-story-id
   ```

   This writes `src/data/placements/my-story-id.json` with the headline numbers, every
   Colorado/Denver placement, every TV and radio station, and the 100 largest national print and online
   placements. In `media.js`, import that
   file and set `placements: myStory` on the entry. Then review what will show:
   - `hide`: patterns for links that shouldn't be featured, such as campus classifieds, market-data pages or off-topic sites
   - `rename`: fixes for garbled outlet names in the report

   Re-run the import whenever an updated report comes in.

   **Publisher logos for the ticker:** pushing new placement data runs the GitHub Action
   "Fetch press logos", which downloads each outlet's logo into `public/img/press/` and commits it.
   You can also run `npm run fetch-press-logos` anywhere with normal internet access. Logos under
   48px are rejected, and those outlets show as a name badge (with their TV network if any). To use a
   hand-picked logo, save it as `public/img/press/<key>.png` and add it to `src/data/press-logos.json`;
   the key is the outlet name in lowercase with spaces and punctuation removed (`The Buffalo News` → `buffalonews`).

3. **Feature it elsewhere** once it's live:
   - **Blog:** link it from any related post in `src/data/blog-posts.json`.
   - **Newsletter:** add an item using the same `intro` plus the live link.
   - **Video and social:** share the clip and tag the outlet.
   - **Speaking:** if it supports a talk, mention it when you send the topic sheet.

4. **Check it:** run `npm run dev` and open `#media` and `#speaking/media`. Open each link to
   make sure it works, then commit.

## Speaker schedule and topic sheets

- **Upcoming talks:** add `{ date: 'YYYY-MM-DD', title, org, location }` to `SCHEDULE` in
  `src/data/speaking.js`. While the list is empty, the page shows the "Now booking" note.
- **Topic sheets:** after editing `TOPICS`, run `npm run topic-pdfs` to rebuild the PDFs in
  `public/speaking/`.
