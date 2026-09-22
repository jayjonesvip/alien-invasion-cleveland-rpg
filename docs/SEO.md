# Search discovery

The preferred public origin is https://lakeeffectinvasion.com/. HTTPS was verified to return the game before updating metadata. The repository's CNAME is retained. No forced protocol redirect was added: browser saves belong to their exact origin, including HTTP versus HTTPS.

The root sitemap lists the three public pages: the game, How to Play, and the art gallery. Each has its own canonical URL, title, description, social card metadata, and JSON-LD. The game uses Schema.org VideoGame; the guide uses WebPage and the gallery uses CollectionPage. Structured data describes existing content without invented reviews, ratings, or offers. The title screen also includes a visible explanation of the game; important descriptive content is present in the HTML before JavaScript runs.

robots.txt allows the site and its art, points to the sitemap, and asks crawlers to skip development tests and internal notes. Robots rules are not access controls or a guarantee of deindexing.

When adding a public page, add its canonical URL to sitemap.xml and give it a distinct title and description. The sitemap intentionally omits changefreq, priority, and dates that could become stale. Check that every listed URL returns 200, and parse all JSON-LD and the sitemap after edits.

The sitemap is discoverable through robots.txt. It has not been submitted through a verified Google Search Console account. A site owner can submit https://lakeeffectinvasion.com/sitemap.xml there and monitor coverage. Crawling, indexing, rankings, and rich-result display are decided by search engines.

References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Schema.org VideoGame](https://schema.org/VideoGame).
