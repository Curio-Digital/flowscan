# Flow Scan

Flow Scan is a tool designed to help identify and categorize issues in web pages. It scans the page for common problems related to SEO, performance, accessibility, and content, and organizes them into four categories for easy identification and resolution.

## Install

Add the following script to your Footer code (before body close tag)

```
<script>let time = (new Date().getTime());document.addEventListener("DOMContentLoaded",function(){function loadflowscan(e){let t=document.createElement("script");t.setAttribute("type","text/javascript");if(e){t.setAttribute("src",e);document.body.appendChild(t);t.addEventListener("error",e=>{console.log("Error loading Flow Scan",e)})}}let src=window.location.host.includes("webflow.io")?"https://cdn.jsdelivr.net/npm/@curiolabs/flowscan/flowscan.js?"+time:"";if(src){loadflowscan(src)}});</script>
```

## Categories

- **SEO**: Issues related to meta tags, broken links, etc.
- **Performance**: Issues related to large image sizes, etc.
- **Accessibility**: Issues related to missing alt text for images, etc.
- **Content**: Issues related to placeholder content like "Lorem Ipsum", missing links, etc.

# Flow Scan Documentation

Flow Scan is a Webflow app that helps in identifying and resolving common issues in your website. This app checks for broken links, placeholder content, images without alt text, pages without meta tags, and more.

Flow Scan API can be accessed by calling flowScan on the console. Functions can be used alongside your normal Javascript/jQuery scripts, so you can actually improve on top of the existing app!

Variables are read only, you probably won't need to update them directly. But, you can read its.

## Variables

- `issues`: Stores all the issues found on your website.
- `allPersistentHighlights`: Keeps track of all persistent highlights on your website.
- `issueStates`: Keeps track of the state of each issue, matches the localStorage.
- `clickedHighlights`: Stores all clicked highlights.
- `hoveredIssue`: Keeps track of the issue that is being hovered over.

## Functions

- `loadIssueStates()`: Loads the states of all issues to local storage.
- `saveIssueStates()`: Saves the states of all issues to local storage.
- `clearLocalIssueStates()`: Clears the local states of all issues.
- `getIssueIdentifier()`: Returns the identifier of an issue.
- `open()`: Opens the app.
- `close()`: Closes the app.
- `openCategory()`: Opens an specific category.
- `closeCategory()`: Closes an specific category.
- `getCategoryByType()`: Returns the category of that type.
- `getIssue()`: Returns an issue.
- `addBrokenLink()`: Adds a broken link to the issues.
- `addIssue()`: Adds an issue to the list.
- `removeIssue()`: Removes an issue.
- `removeAllIssues()`: Removes all issues.
- `reloadIssues()`: Reloads all issues but doesn't reset local storage.
- `refreshStoredIssues()`: Refreshes all stored issues and resets local storage.
- `setIgnoreFinsweetAttributes()`: Sets the app to ignore Finsweet attributes (fs).
- `setIgnoreCtaAttributes()`: Sets the app to ignore CTA attributes (cta).
- `setIgnoreInteractionElements()`: Sets the app to ignore interaction elements (data-w-id).
- `setIgnoreRefokusShareElements()`: Sets the app to ignore Refokus share elements (r-share).
- `highlightBrokenLink()`: Highlights a broken link.
- `toggleAllPersistentHighlights()`: Toggles all persistent highlights.
- `removeAllHighlightedBrokenLinks()`: Removes all highlighted broken links.
- `updateEmptyState()`: Updates the empty state.
- `updateIssueCount()`: Updates the issue count.
- `checkForLoremIpsum()`: Checks for lorem ipsum placeholder content.
- `checkImages()`: Checks for images without alt text.
- `checkMetaTags()`: Checks for pages without meta tags.
- `checkPageLinks()`: Checks for broken links on the page.
