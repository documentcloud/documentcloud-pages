# documentcloud-pages

This is a work in progress. Follow the development at this repo's [Github pages](http://documentcloud.github.io/documentcloud-pages/).

# Goals

A responsive, embeddable JavaScript library which displays pages from documents on DocumentCloud (or any other API-compatible location).

# Why?

1. DocumentCloud's existing [document-viewer](https://github.com/documentcloud/document-viewer) doesn't play terribly well with mobile devices due to its pioneering nature. (It was originally written in 2006, and while it's done a terrific job, it's not well-suited for a mobile-first world.)
2. There are a number of use cases where it's useful to display only a single page from a document and where the rich metadata of the full document (such as [DocumentCloud notes](http://www.documentcloud.org/help/notes) or document title/contributor information) would complement the single pages of supporting material.
3. DocumentCloud plans to incrementally build a responsive viewer from smaller constituent components, and a full page with notes is the next step up from [our smaller individual note embeds](http://www.documentcloud.org/help/notes).

# Participating

You should [open an issue](https://github.com/documentcloud/documentcloud-pages/issues) for suggestions or ideas you'd like to tell us about!

# Installation

TODO: explain this:

    bower install
    bundle install
    guard
