# DocumentCloud Page Embed

A responsive, embeddable JavaScript library which displays pages from documents on DocumentCloud (or any other API-compatible location). Follow the development on our [example page](http://documentcloud.github.io/documentcloud-pages/).

## Why?

1. DocumentCloud's existing [document-viewer](https://github.com/documentcloud/document-viewer) doesn't play terribly well with mobile devices. It was originally written in 2006, and while it's done a terrific job, it's not well-suited for a mobile-first world.
2. There are a number of use cases where it's useful to display only a single page from a document and where the rich metadata of the full document (such as [DocumentCloud notes](https://www.documentcloud.org/help/notes) or document title/contributor information) would complement the single pages of supporting material.
3. DocumentCloud plans to incrementally build a responsive viewer from smaller constituent components, and a full page with notes is the next step up from [our smaller individual note embeds](https://www.documentcloud.org/help/notes).

## Browser Compatibility

* Unenhanced markup (effectively, noscript) is compatible with everything unless being served on an HTTPS page, in which case it requires an SNI-compatible browser (aka anything besides [IE on XP](https://github.com/documentcloud/documentcloud/issues/278)).
* Enhanced markup is compatible with IE8+ on Vista+ and all the other usual suspects.

## Participating

You should [open an issue](https://github.com/documentcloud/documentcloud-pages/issues) for suggestions or ideas you'd like to tell us about!

### Installation/setup

* Install [Bower](http://bower.io) and [Bundler](http://bundler.io/)
* Install JavaScript dependencies with `bower install`
* Install gem dependencies with `bundle install`

### Development

We use [Guard](https://github.com/guard/guard) to watch and build the project, so on the daily you'll want to `cd` to the repo directory and run `bundle exec guard`. Outputs will be built to `/dist/`.

## License

Copyright (c) 2015 DocumentCloud, Investigative Reporters & Editors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
