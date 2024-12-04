class FlowScan {
  constructor() {
    this.issues = [];
    this.issueStates = this.loadIssueStates();
    this.allPersistentHighlights = false;
    this.issueIdCounter = 0;
    this.ignoreFinsweetAttributes =
      localStorage.getItem("flowsIgnoreFinsweetAttributes") !== "false";
    this.ignoreCtaAttributes =
      localStorage.getItem("flowsIgnoreCtatAttributes") !== "false";
    this.ignoreInteractionElements =
      localStorage.getItem("flowsIgnoreInteractionElements") !== "false";
    this.ignoreRefokusShareElements =
      localStorage.getItem("flowsIgnoreRefokusShareElements") !== "false";
    this.ignoreLightboxElements =
      localStorage.getItem("flowsIgnoreLightboxElements") !== "false";
    this.clickedHighlights = {};
    this.hoveredIssue = null;
    this.confirmedRemove =
      localStorage.getItem("flowsConfirmedRemove") === "true";
    this.reorderCategories =
      localStorage.getItem("flowsReorderCategories") !== "false";

    this.categories = {
      SEO: ["meta", "brokenLink", "stagingIndexing"],
      Performance: ["imageSize"],
      Accessibility: ["imageAltText", "lang"],
      Content: ["loremIpsum", "missingLink", "stagingLink"],
    };
  }

  loadIssueStates() {
    const storedStates = localStorage.getItem("flowsIssueStates");
    return storedStates ? JSON.parse(storedStates) : {};
  }

  saveIssueStates() {
    localStorage.setItem("flowsIssueStates", JSON.stringify(this.issueStates));
  }

  clearLocalIssueStates() {
    localStorage.removeItem("flowsIssueStates");
    this.issueStates = {};
  }

  setReorderCategories(value) {
    this.reorderCategories = value;
    localStorage.setItem("flowsReorderCategories", value);
  }

  getIssueIdentifier(element, type) {
    if (type === "brokenLink" || type === "missingLink") {
      const text = $(element)
        .text()
        .trim()
        .replace(/\s/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
      const classes = $(element).attr("class");
      const linkClass = classes
        ? classes.split(" ")[0]
        : $(element).prop("tagName").toLowerCase();
      const index = $(
        `.${linkClass}:contains('${$(element).text().trim()}')`
      ).index(element);
      return `link-${linkClass}-${text}-${index}`;
    } else if (type === "imageAltText") {
      const src = $(element).attr("src");
      let fileName = src.split("/").pop();
      fileName = fileName.slice(0, 15);
      return `alt-${fileName}`;
    } else if (type === "imageSize") {
      const src = $(element).attr("src");
      let fileName = src.split("/").pop();
      fileName = fileName.slice(0, 15);
      return `image-${fileName}`;
    } else if (type === "loremIpsum") {
      return "lorem-ipsum";
    }
    return "unknown";
  }

  #initCss(isEditorMode) {
    let delay = isEditorMode ? 6000 : 0;
    setTimeout(() => {
      let editorBarHeight = this.#getEditorBarHeight();
      let additionalBottomSpace =
        editorBarHeight > 0 ? editorBarHeight + 10 : 0;

      $("<style>")
        .prop("type", "text/css")
        .html(
          `
        #flows-fab {
  font-family: 'Inter', sans-serif;
  position: fixed;
  width: 56px;
  height: 56px;
bottom: ${additionalBottomSpace + 18}px;
  left: 18px;
  background-color: #1E1E1E;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  display: none;
  cursor: pointer;
}
#flows-fab.active {
  display: flex;
}
.flows-fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
#flows-fab-count {
  user-select: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #CB3535;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  right: -4px;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.01em;
  text-align: center;
}
#flows {
font-family: 'Inter', sans-serif;
position: fixed;
bottom: ${additionalBottomSpace + 86}px;
left: 18px;
background-color: #1E1E1E;
color: #F5F5F5;
border-radius: 4px;
max-height: 400px;
height: 100%;
min-width: 300px;
z-index: 1000;
box-shadow: 0px 1px 3px -1px rgba(0,0,0,0.34), 0px 5px 10px -2px rgba(0,0,0,0.32);
display: none;
}
#flows.visible {
display: block;
}
#flows h4 {
margin: 0 !important;
margin-bottom: 0 !important;
margin-top: 0 !important;
}
.flows-title-bar {
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
flex-direction: row;
padding: 10px 8px;
border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}
.flows-title {
display: flex;
align-items: center;
justify-content: flex-start;
flex-direction: row;
gap: 8px;
}
.flows-title span {
font-size: 12px;
font-weight: 600;
line-height: 1.33;
margin: 0 !important;
margin-bottom: 0 !important;
margin-top: 0 !important;
}
.flows-icon {
width: 24px;
height: 24px;
border-radius: 2px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: row;
}
.flows-title-icons {
display: flex;
align-items: center;
justify-content: flex-end;
gap: 8px;
}
.flows-title-icon {
width: 16px;
height: 16px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
}
.flows-bottom-bar {
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
padding: 8px;
}
.flows-bottom-bar a {
color: #BDBDBD;
font-size: 11.5px;
line-height: 16px;
letter-spacing: -0.01em;
transition: color 0.3s ease;
cursor: pointer;
text-decoration: none;
}
.flows-bottom-bar a:hover {
  color: #6A65FD;
}
.flows-bottom-bar span {
color: #BDBDBD;
font-size: 11.5px;
line-height: 16px;
letter-spacing: -0.01em;
}
.flows-empty-state {
display: flex;
align-items: center;
justify-content: center;
padding: 20px;
margin: auto;
height: 100%;
}
.flows-empty-state span {
color: #FFFFFF;
font-size: 12.5px;
line-height: 16px;
text-align: center;
}
#flows-issues-list {
  overflow: auto;
  max-height: 323px;
  height: 100%;
}
#flows-issues-list::-webkit-scrollbar {
  width: 4px;
}
#flows-issues-list::-webkit-scrollbar-thumb {
  background-color: #6A65FD;
  border-radius: 4px;
}
#flows-issues-list::-webkit-scrollbar-track {
  background-color: #1E1E1E;
}
.flows-item {
padding: 8px;
border-top: 1px solid rgba(255, 255, 255, 0.13);
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
}
.flows-item span {
cursor: pointer;
margin: 0 !important;
margin-bottom: 0 !important;
margin-top: 0 !important;
font-size: 11.5px;
font-weight: 400;
line-height: 16px;
color: #BDBDBD;
letter-spacing: -0.01em;
}
.flows-item p {
margin: 0;
margin-bottom: 0;
margin-top: 0;
font-size: 11.5px;
line-height: 16px;
letter-spacing: -0.01em;
color: #BDBDBD;
}
.flows-item-icon {
display: flex;
align-items: center;
justify-content: center;
width: 16px;
height: 16px;
color: #BDBDBD66;
transition: color 0.3s ease;
cursor: pointer;
}
.flows-item-icon.active {
color: #BDBDBD;
}
.flows-item-title {
display: flex;
align-items: flex-start;
justify-content: flex-start;
flex-direction: column;
}
.flows-item-image-preview {
display: none;
position: fixed;
z-index: 10;
padding: 5px;
background: #1E1E1E;
border: 1px solid #6A65FD;
border-radius: 4px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.flows-item-image-preview img {
max-width: 200px;
max-height: 200px;
}
.flows-category {
display: flex;
flex-direction: column;
align-items: stretch;
justify-content: center;
border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}
.flows-category-title-bar {
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
padding: 8px;
}
.flows-category-title-bar span {
font-size: 12.5px;
line-height: 16px;
font-weight: 600;
margin: 0 !important;
margin-bottom: 0 !important;
margin-top: 0 !important;
}
.flows-category-title-right {
display: flex;
align-items: center;
justify-content: flex-end;
gap: 8px;
}
.flows-category-count {
font-size: 12px;
width: 20px;
height: 20px;
border-radius: 50%;
background-color: #CF313B;
display: flex;
align-items: center;
justify-content: center;
}
.flows-category-count.empty {
  background-color: #007A41;
}
.flows-category-toggle {
width: 16px;
height: 16px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
}
.flows-category-issues {
overflow: hidden;
display: flex;
flex-direction: column;
align-items: stretch;
justify-content: center;
transition: height 0.3s ease;
}
.flows-category-issues.collapsed {
  height: 0px;
}
`
        )
        .appendTo("head");
    }, delay);
  }

  open() {
    $("#flows").addClass("visible");
  }

  close() {
    this.removeAllHighlightedBrokenLinks();
    this.toggleAllPersistentHighlights(false);
    $("#flows").removeClass("visible");
  }

  openCategory(category) {
    $(`[data-category="${category}"] .flows-category-issues`).removeClass(
      "collapsed"
    );
    $(`[data-category="${category}"] .flows-category-toggle > svg`).css(
      "transform",
      "rotate(180deg)"
    );
  }

  closeCategory(category) {
    $(`[data-category="${category}"] .flows-category-issues`).addClass(
      "collapsed"
    );
    $(`[data-category="${category}"] .flows-category-toggle > svg`).css(
      "transform",
      "rotate(0deg)"
    );
  }

  toggleCategory(category) {
    const isCollapsed = $(
      `[data-category="${category}"] .flows-category-issues`
    ).hasClass("collapsed");
    if (isCollapsed) {
      $(`[data-category="${category}"] .flows-category-toggle > svg`).css(
        "transform",
        "rotate(0deg)"
      );
    } else {
      $(`[data-category="${category}"] .flows-category-toggle > svg`).css(
        "transform",
        "rotate(180deg)"
      );
    }

    $(`[data-category="${category}"] .flows-category-issues`).toggleClass(
      "collapsed"
    );
  }

  getIssue(issueId) {
    return this.issues.find((issue) => issue.id === issueId);
  }

  getCategoryByType(type) {
    return (
      Object.keys(this.categories).find((category) =>
        this.categories[category].includes(type)
      ) || "Other"
    );
  }

  updateCategoriesCount() {
    clearTimeout(this.updateCategoriesCountTimeout);

    const self = this;
    const categoryOrder = [];
    Object.keys(this.categories).forEach((category) => {
      const count = self.issues.filter((issue) =>
        self.categories[category].includes(issue.type)
      ).length;

      const categoryElement = $(`[data-category="${category}"]`);
      const countElement = categoryElement.find(".flows-category-count");
      countElement.text(count);

      if (count === 0) {
        countElement.addClass("empty");
      } else {
        countElement.removeClass("empty");
      }

      categoryOrder.push({ category, count });
    });

    if (!this.reorderCategories) return;
    categoryOrder.sort((a, b) => b.count - a.count);

    this.updateCategoriesCountTimeout = setTimeout(() => {
      categoryOrder.forEach((item) => {
        const categoryElement = $(`[data-category="${item.category}"]`);
        $("#flows-issues-list").append(categoryElement);
      });
    }, 1000);
  }

  addBrokenLink(element, type) {
    let name = $(element).text().replace(/\n/g, "");
    if (name === "" || name === undefined || name === null) {
      name = "Empty element";
    }
    const identifier = this.getIssueIdentifier(element, type);
    $(element).attr("data-page-issue", `${identifier}`);
    this.addIssue(name, type, $(element)[0]);
  }

  addIssue(name, type, element, id) {
    let identifier;
    if (!id) {
      identifier = this.getIssueIdentifier(element, type);
    } else {
      identifier = id;
    }

    if (!this.issueStates[identifier]) {
      this.issueStates[identifier] = { removed: false, highlighted: false };
    }

    if (
      type === "imageAltText" ||
      type === "imageSize" ||
      type === "loremIpsum"
    ) {
      if ($(element).attr("data-page-issue")) {
        identifier = $(element).attr("data-page-issue");
      } else {
        $(element).attr("data-page-issue", `${identifier}`);
      }
    }

    if (!this.issueStates[identifier].removed) {
      this.issues.push({
        id: identifier,
        text: name,
        type: type,
        element: element,
      });
      this.#createItem(name, type, identifier);
    }

    if (this.issueStates[identifier].highlighted) {
      this.clickedHighlights[identifier] = false;
    }
    this.saveIssueStates();
    this.updateIssueCount();
    this.updateCategoriesCount();
  }

  removeIssue(identifier, confirm) {
    if (confirm && !this.confirmedRemove) {
      var confirmed = window.confirm(
        "Are you sure you want to ignore this issue? Issues can be restored by clicking on Refresh"
      );
      if (!confirmed) return;
      this.confirmedRemove = true;
      localStorage.setItem("flowsConfirmedRemove", "true");
    }

    this.issueStates[identifier].removed = true;
    this.highlightBrokenLink(identifier, false);
    this.saveIssueStates();
    this.issues = this.issues.filter((issue) => issue.id !== identifier);
    $(`[data-issue-id="${identifier}"]`).remove();
    this.updateIssueCount();
    this.updateCategoriesCount();
  }

  removeAllIssues() {
    this.issues = [];
    $(".flows-category-issues").empty();
    this.updateIssueCount();
    this.updateCategoriesCount();
  }

  reloadIssues() {
    this.removeAllIssues();
    this.runChecks();
  }

  refreshStoredIssues() {
    var confirmed = window.confirm(
      "Do you really want to refresh the issues? This will clear all the issues that were ignored."
    );
    if (!confirmed) return;

    this.removeAllIssues();
    this.clearLocalIssueStates();
    this.runChecks();
  }

  setIgnoreFinsweetAttributes(value) {
    this.ignoreFinsweetAttributes = value;
    localStorage.setItem("flowsIgnoreFinsweetAttributes", value);
    this.reloadIssues();
  }

  setIgnoreCtaAttributes(value) {
    this.ignoreCtaAttributes = value;
    localStorage.setItem("flowsIgnoreCtatAttributes", value);
    this.reloadIssues();
  }

  setIgnoreInteractionElements(value) {
    this.ignoreInteractionElements = value;
    localStorage.setItem("flowsIgnoreInteractionElements", value);
    this.reloadIssues();
  }

  setIgnoreRefokusShareElements(value) {
    this.ignoreRefokusShareElements = value;
    localStorage.setItem("flowsIgnoreRefokusShareElements", value);
    this.reloadIssues();
  }

  setIgnoreLightboxElements(value) {
    this.ignoreLightboxElements = value;
    localStorage.setItem("flowsIgnoreLightboxElements", value);
    this.reloadIssues();
  }

  highlightBrokenLink(identifier, on) {
    if (on) {
      this.issueStates[identifier].highlighted = true;
      this.saveIssueStates();
      var flowsItem = $(`[data-issue-id="${identifier}"]`);
      var element = $(`[data-page-issue="${identifier}"]`);
      $(flowsItem).attr("data-issue-highlighted", "true");
      flowsItem.find(".flows-item-icon").addClass("active");
      $(element)
        .css("border", "2px solid red")
        .css("background-color", "rgba(255, 0, 0, 0.4)");
    } else {
      this.issueStates[identifier].highlighted = false;
      this.saveIssueStates();
      var flowsItem = $(`[data-issue-id="${identifier}"]`);
      var element = $(`[data-page-issue="${identifier}"]`);
      $(flowsItem).attr("data-issue-highlighted", "false");
      flowsItem.find(".flows-item-icon").removeClass("active");
      $(element).css("border", "").css("background-color", "");
    }
  }

  toggleAllPersistentHighlights(enable) {
    if (enable === undefined) {
      this.allPersistentHighlights = !this.allPersistentHighlights;
    } else {
      this.allPersistentHighlights = enable;
    }

    this.issues.forEach((issue) => {
      if (
        issue.type === "brokenLink" ||
        issue.type === "missingLink" ||
        issue.type === "loremIpsum"
      ) {
        this.highlightBrokenLink(issue.id, this.allPersistentHighlights);
        this.clickedHighlights[issue.id] = this.allPersistentHighlights;
      }
    });

    if (this.allPersistentHighlights) {
      $(".flows-highlight-icon").show();
      $(".flows-no-highlight-icon").hide();
    } else {
      $(".flows-highlight-icon").hide();
      $(".flows-no-highlight-icon").show();
    }
  }

  removeAllHighlightedBrokenLinks() {
    this.issues.forEach((issue) => {
      this.highlightBrokenLink(issue.id, false);
    });
    this.clickedHighlights = {};
  }

  updateIssueCount() {
    $("#flows-fab-count").text(this.issues.length);
  }

  checkForLoremIpsum() {
    const bodyText = document.body.innerText.toLowerCase();
    if (bodyText.includes("lorem ipsum")) {
      const elements = this.findElementsContainingText("lorem ipsum");
      elements.forEach((element, index) => {
        this.addIssue(
          "Lorem Ipsum detected",
          "loremIpsum",
          element,
          `loremIpsum-${index}`
        );
      });
    }
  }

  findElementsContainingText(text) {
    const elements = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return node.nodeValue.toLowerCase().includes(text)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      },
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      elements.push(node.parentNode);
    }

    return elements;
  }

  checkImages() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      let src = img.src;
      let fileName = src.split("/").pop();
      fileName = fileName.length > 15 ? fileName.slice(-15) : fileName;
      if (fileName === "") {
        fileName = "Image";
      }

      if (!img.alt) {
        this.addIssue(fileName, "imageAltText", img);
      }

      //Removed temporarily due to Rate limit issue
      /*if (
        src.endsWith(".png") ||
        src.endsWith(".jpg") ||
        src.endsWith(".jpeg")
      ) {
        fetch(src)
          .then((response) => {
            const size = parseInt(
              response.headers.get("Content-Length") || "0",
              10
            );
            if (size > 300 * 1024) {
              this.addIssue(fileName, "imageSize", img);
            }
          })
          .catch((error) => {
            console.error("[Flow Scan] Error fetching image:", error);
          });
      }*/
    });
  }

  checkMetaTags() {
    let metaTitle = $('meta[property="og:title"]').attr("content");
    let metaDescription = $('meta[name="description"]').attr("content");
    let openGraphImage = $('meta[property="og:image"]').attr("content");

    if (!metaTitle || metaTitle === "") {
      this.addIssue("Missing meta title", "meta", null, "meta-title");
    }
    if (!metaDescription) {
      this.addIssue(
        "Missing meta description",
        "meta",
        null,
        "meta-description"
      );
    }
    if (!openGraphImage) {
      this.addIssue(
        "Missing Open Graph image",
        "meta",
        null,
        "open-graph-image"
      );
    }
  }

  checkPageLinks() {
    const isEditorMode =
      new URLSearchParams(window.location.search).get("edit") === "1";
    let baseSelector = isEditorMode ? ".w-editor-edit-fade-in " : "";
    let selector = isEditorMode
      ? baseSelector + "a:visible, " + baseSelector + "button:visible"
      : baseSelector + "a, " + baseSelector + "button";

    $(selector)
      .filter((index, element) => {
        if ($(element).attr("data-w-id") && this.ignoreInteractionElements) {
          return false;
        }

        for (let i = 0; i < element.attributes.length; i++) {
          if (
            (this.ignoreFinsweetAttributes &&
              element.attributes[i].name.startsWith("fs")) ||
            (this.ignoreCtaAttributes &&
              element.attributes[i].name.startsWith("cta")) ||
            (this.ignoreRefokusShareElements &&
              element.attributes[i].name.startsWith("r-share")) ||
            (this.ignoreLightboxElements &&
              element.classList.contains("w-lightbox"))
          ) {
            return false;
          }
        }
        return true;
      })
      .each((index, element) => {
        var href = $(element).attr("href");
        if (
          href &&
          href !== "#" &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          !href.includes("webflow.io")
        ) {
          //Removed temporarily due to Rate limit issue
          /*fetch(href, { method: "HEAD", mode: "no-cors" })
            .then((response) => {
              if (
                !response.ok &&
                response.status !== 403 &&
                response.status !== 0
              ) {
                this.addBrokenLink(element, "brokenLink");
              }
            })
            .catch((error) => {
              this.addBrokenLink(element, "brokenLink");
            });*/
        } else if (href === "#" || href === "") {
          this.addBrokenLink(element, "missingLink");
        } else if (href && href.includes("webflow.io")) {
          this.addBrokenLink(element, "stagingLink");
        }
      });
  }

  checkLanguageCode() {
    const lang = $("html").attr("lang");
    if (!lang) {
      this.addIssue("Missing language code", "lang", null, "language-code");
    }
  }

  checkSubdomainIndexing() {
    const robotsUrl = "/robots.txt";
    fetch(robotsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Robots.txt not found");
        }
        return response.text();
      })
      .then((content) => {
        if (content.trim() !== "User-agent: *\nDisallow: /") {
          this.addIssue(
            "Webflow subdomain indexing is enabled",
            "stagingIndexing",
            null,
            "webflow-subdomain-indexing"
          );
        }
      })
      .catch((error) => {
        console.error(
          "[Flow Scan] Error checking Webflow subdomain indexing:",
          error
        );
      });
  }

  #createItem(name, type, identifier) {
    let icon = "";
    let title = "";
    let nameText = name.length > 25 ? name.substring(0, 25) + "..." : name;

    nameText !== "" ? nameText : "Element";

    let isIssueHighlighted = this.issueStates[identifier].highlighted;
    let element = $(`[data-page-issue="${identifier}"]`);

    let defaultIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.79293 7.49998L5.64648 9.64642L6.35359 10.3535L8.50004 8.20708L10.6465 10.3535L11.3536 9.64642L9.20714 7.49998L11.3536 5.35353L10.6465 4.64642L8.50004 6.79287L6.35359 4.64642L5.64648 5.35353L7.79293 7.49998Z" fill="#F5F5F5"/>
        <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="#F5F5F5"/>
        </svg>
        `;

    switch (type) {
      case "missingLink":
        icon = defaultIcon;
        title = `${nameText} is missing link`;
        break;
      case "brokenLink":
        icon = defaultIcon;
        title = `${nameText} link is broken`;
        break;
      case "stagingLink":
        icon = defaultIcon;
        title = `${nameText} links to the staging domain`;
        break;
      case "meta":
        icon = defaultIcon;
        title = nameText;
        break;
      case "imageAltText":
        icon = defaultIcon;
        title = `${nameText} is missing alt text`;
        break;
      case "imageSize":
        icon = defaultIcon;
        title = `${nameText} is over 300KB`;
        break;
      case "loremIpsum":
        icon = defaultIcon;
        title = "Lorem Ipsum detected";
        break;
      case "stagingIndexing":
        icon = defaultIcon;
        title = "Webflow subdomain indexing is enabled";
        break;
      case "lang":
        icon = defaultIcon;
        title = "Language code is not set";
        break;
      default:
        icon: defaultIcon;
        title: "Unknown issue";
        break;
    }

    let itemHTML = `
    <div class="flows-item" data-issue-id="${identifier}" data-issue-type="${type}" data-issue-highlighted="${isIssueHighlighted}">
      <div class="flows-item-title">
        <span>${title}</span>
      </div>
      <div class="flows-item-icon">
        ${icon}
      </div> 
      ${
        type === "imageAltText" || type === "imageSize"
          ? `<div class="flows-item-image-preview"><img src='${$(element).attr(
              "src"
            )}' alt="Image Preview"></div>`
          : ""
      }
    </div>`;

    const category = this.getCategoryByType(type);
    const categoryElement = $(
      `[data-category="${category}"] .flows-category-issues`
    );
    categoryElement.append(itemHTML);

    const newItem = $(`[data-issue-id="${identifier}"]`);
    newItem.find(".flows-item-icon").on("click", () => {
      switch (type) {
        default:
          this.removeIssue(identifier, true);
          break;
      }
    });

    if (type === "imageAltText" || type === "imageSize") {
      newItem.on("mouseenter", ".flows-item-title", function (e) {
        const preview = $(this).siblings(".flows-item-image-preview");
        preview.show();
        updateImagePreviewPosition(e, preview);
      });

      newItem.on("mousemove", ".flows-item-title", function (e) {
        const preview = $(this).siblings(".flows-item-image-preview");
        updateImagePreviewPosition(e, preview);
      });

      newItem.on("mouseleave", ".flows-item-title", function () {
        $(this).siblings(".flows-item-image-preview").hide();
      });
    }

    function updateImagePreviewPosition(e, preview) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const previewWidth = preview.outerWidth();
      const previewHeight = preview.outerHeight();
      const xOffset = 5;
      const yOffset = 5;

      let topPosition = mouseY - previewHeight - yOffset;
      let leftPosition = mouseX + xOffset;

      if (topPosition < 0) {
        topPosition = mouseY + yOffset;
      }
      if (leftPosition + previewWidth > $(window).width()) {
        leftPosition = mouseX - previewWidth - xOffset;
      }

      preview.css({
        top: topPosition + "px",
        left: leftPosition + "px",
      });
    }
  }

  #getEditorBarHeight() {
    return $(".w-editor-bem-EditorMainMenu").outerHeight() || 0;
  }

  #createIssuesBox(isEditorMode) {
    var box = `<div id="flows">
        <div class='flows-title-bar'>
          <div class='flows-title'>
            <div class='flows-icon'>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.8136 10.2789C32.499 10.2789 32.1974 10.1539 31.9749 9.93151C31.7525 9.70908 31.6275 9.4074 31.6275 9.09283V4.34855C31.6267 3.82454 31.4182 3.32222 31.0476 2.95168C30.6771 2.58114 30.1748 2.37261 29.6508 2.37177H24.9065C24.5919 2.37177 24.2902 2.24681 24.0678 2.02438C23.8454 1.80195 23.7204 1.50027 23.7204 1.1857C23.7204 0.871138 23.8454 0.569457 24.0678 0.347025C24.2902 0.124594 24.5919 -0.000366211 24.9065 -0.000366211H29.6508C30.8039 0.000471529 31.9096 0.458929 32.725 1.27433C33.5404 2.08973 33.9988 3.19541 33.9997 4.34855V9.09283C33.9997 9.4074 33.8747 9.70908 33.6523 9.93151C33.4299 10.1539 33.1282 10.2789 32.8136 10.2789ZM1.18509 10.2789C0.870528 10.2789 0.568846 10.1539 0.346415 9.93151C0.123984 9.70908 -0.000976562 9.4074 -0.000976562 9.09283V4.34855C-0.000138823 3.19541 0.458319 2.08973 1.27372 1.27433C2.08912 0.458929 3.1948 0.000471529 4.34794 -0.000366211H9.09222C9.40679 -0.000366211 9.70847 0.124594 9.9309 0.347025C10.1533 0.569457 10.2783 0.871138 10.2783 1.1857C10.2783 1.50027 10.1533 1.80195 9.9309 2.02438C9.70847 2.24681 9.40679 2.37177 9.09222 2.37177H4.34794C3.82393 2.37261 3.32161 2.58114 2.95107 2.95168C2.58053 3.32222 2.372 3.82454 2.37116 4.34855V9.09283C2.37116 9.4074 2.2462 9.70908 2.02377 9.93151C1.80134 10.1539 1.49966 10.2789 1.18509 10.2789ZM9.09222 34.0003H4.34794C3.1948 33.9994 2.08912 33.541 1.27372 32.7256C0.458319 31.9102 -0.000138823 30.8045 -0.000976562 29.6514V24.9071C-0.000976562 24.5925 0.123984 24.2908 0.346415 24.0684C0.568846 23.846 0.870528 23.721 1.18509 23.721C1.49966 23.721 1.80134 23.846 2.02377 24.0684C2.2462 24.2908 2.37116 24.5925 2.37116 24.9071V29.6514C2.372 30.1754 2.58053 30.6777 2.95107 31.0482C3.32161 31.4188 3.82393 31.6273 4.34794 31.6281H9.09222C9.40679 31.6281 9.70847 31.7531 9.9309 31.9755C10.1533 32.198 10.2783 32.4996 10.2783 32.8142C10.2783 33.1288 10.1533 33.4305 9.9309 33.6529C9.70847 33.8753 9.40679 34.0003 9.09222 34.0003ZM29.6508 34.0003H24.9065C24.5919 34.0003 24.2902 33.8753 24.0678 33.6529C23.8454 33.4305 23.7204 33.1288 23.7204 32.8142C23.7204 32.4996 23.8454 32.198 24.0678 31.9755C24.2902 31.7531 24.5919 31.6281 24.9065 31.6281H29.6508C30.1748 31.6273 30.6771 31.4188 31.0476 31.0482C31.4182 30.6777 31.6267 30.1754 31.6275 29.6514V24.9071C31.6275 24.5925 31.7525 24.2908 31.9749 24.0684C32.1974 23.846 32.499 23.721 32.8136 23.721C33.1282 23.721 33.4299 23.846 33.6523 24.0684C33.8747 24.2908 33.9997 24.5925 33.9997 24.9071V29.6514C33.9988 30.8045 33.5404 31.9102 32.725 32.7256C31.9096 33.541 30.8039 33.9994 29.6508 34.0003Z" fill="#6A65FD"/>
              <path d="M20 28H14V23.2857H20V28ZM19.25 20.1429H14.75L14 6H20L19.25 20.1429Z" fill="#676CF8"/>
              </svg>
            </div>
            <span>
            Flow Scan
            </span>
          </div>
          <div class='flows-title-icons'>
            <div class='flows-title-icon' id="flows-highlight-all">
              <svg class="flows-highlight-icon" style="display: none;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99988 9.5C8.82831 9.5 9.49988 8.82843 9.49988 8C9.49988 7.17157 8.82831 6.5 7.99988 6.5C7.17145 6.5 6.49988 7.17157 6.49988 8C6.49988 8.82843 7.17145 9.5 7.99988 9.5Z" fill="#BDBDBD"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99992 4C5.37585 4 3.11601 5.55492 2.08952 7.79148C2.02875 7.92388 2.02875 8.07621 2.08952 8.20861C3.11603 10.4451 5.37585 12 7.99988 12C10.624 12 12.8838 10.4451 13.9103 8.20852C13.9711 8.07612 13.9711 7.92379 13.9103 7.79139C12.8838 5.55488 10.624 4 7.99992 4ZM7.99988 11C5.86334 11 4.01036 9.78173 3.09949 8.00004C4.01035 6.21831 5.86335 5 7.99992 5C10.1365 5 11.9894 6.21827 12.9003 7.99996C11.9895 9.78169 10.1365 11 7.99988 11Z" fill="#BDBDBD"/>
              </svg>
              <svg class="flows-no-highlight-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.705 11.4122L13.6465 14.3536L14.3536 13.6465L2.35359 1.64648L1.64648 2.35359L4.38813 5.09524C3.39358 5.76124 2.59323 6.69436 2.08968 7.79152C2.02891 7.92392 2.02891 8.07624 2.08968 8.20865C3.11619 10.4452 5.37601 12 8.00004 12C8.96543 12 9.88153 11.7896 10.705 11.4122ZM9.94077 10.6479L5.11155 5.81865C4.25768 6.3466 3.55891 7.10172 3.09965 8.00007C4.01052 9.78177 5.8635 11 8.00004 11C8.68311 11 9.33719 10.8755 9.94077 10.6479Z" fill="#BDBDBD"/>
              <path d="M13.9104 8.20856C13.5777 8.93353 13.1154 9.58688 12.5531 10.1389L11.8461 9.43184C12.2703 9.01685 12.6276 8.5337 12.9005 8C11.9896 6.21831 10.1366 5.00004 8.00008 5.00004C7.81177 5.00004 7.62565 5.0095 7.4422 5.02798L6.5717 4.15749C7.0313 4.05443 7.50932 4.00004 8.00008 4.00004C10.6241 4.00004 12.8839 5.55491 13.9104 7.79143C13.9712 7.92383 13.9712 8.07616 13.9104 8.20856Z" fill="#BDBDBD"/>
              </svg>
            </div>
            <div class='flows-title-icon' id="flows-close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00001L12.3536 4.35356L11.6465 3.64645L8.00004 7.2929L4.35359 3.64645L3.64648 4.35356L7.29293 8.00001L3.64648 11.6465L4.35359 12.3536L8.00004 8.70711L11.6465 12.3536L12.3536 11.6465L8.70714 8.00001Z" fill="#BDBDBD"/>
              </svg>
            </div>
          </div>
        </div>
        <div id='flows-issues-list'>
        </div>
        <div class="flows-bottom-bar">
          <a href="https://curio-digital.canny.io/flow-scan-feature-requests" target="_blank">Request a Feature</a>
          <a id="flows-refresh">Refresh</a>
        </div>
      </div>`;
    if (isEditorMode) {
      $(".w-editor-edit-fade-in").append(box);
    } else {
      $("body").append(box);
    }
  }

  #createFloatingActionButton(isEditorMode) {
    let fab = `
    <div id="flows-fab" class="active">
      <div class="flows-fab-icon">
        <svg width="32" height="32" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32.8136 10.2789C32.499 10.2789 32.1974 10.1539 31.9749 9.93151C31.7525 9.70908 31.6275 9.4074 31.6275 9.09283V4.34855C31.6267 3.82454 31.4182 3.32222 31.0476 2.95168C30.6771 2.58114 30.1748 2.37261 29.6508 2.37177H24.9065C24.5919 2.37177 24.2902 2.24681 24.0678 2.02438C23.8454 1.80195 23.7204 1.50027 23.7204 1.1857C23.7204 0.871138 23.8454 0.569457 24.0678 0.347025C24.2902 0.124594 24.5919 -0.000366211 24.9065 -0.000366211H29.6508C30.8039 0.000471529 31.9096 0.458929 32.725 1.27433C33.5404 2.08973 33.9988 3.19541 33.9997 4.34855V9.09283C33.9997 9.4074 33.8747 9.70908 33.6523 9.93151C33.4299 10.1539 33.1282 10.2789 32.8136 10.2789ZM1.18509 10.2789C0.870528 10.2789 0.568846 10.1539 0.346415 9.93151C0.123984 9.70908 -0.000976562 9.4074 -0.000976562 9.09283V4.34855C-0.000138823 3.19541 0.458319 2.08973 1.27372 1.27433C2.08912 0.458929 3.1948 0.000471529 4.34794 -0.000366211H9.09222C9.40679 -0.000366211 9.70847 0.124594 9.9309 0.347025C10.1533 0.569457 10.2783 0.871138 10.2783 1.1857C10.2783 1.50027 10.1533 1.80195 9.9309 2.02438C9.70847 2.24681 9.40679 2.37177 9.09222 2.37177H4.34794C3.82393 2.37261 3.32161 2.58114 2.95107 2.95168C2.58053 3.32222 2.372 3.82454 2.37116 4.34855V9.09283C2.37116 9.4074 2.2462 9.70908 2.02377 9.93151C1.80134 10.1539 1.49966 10.2789 1.18509 10.2789ZM9.09222 34.0003H4.34794C3.1948 33.9994 2.08912 33.541 1.27372 32.7256C0.458319 31.9102 -0.000138823 30.8045 -0.000976562 29.6514V24.9071C-0.000976562 24.5925 0.123984 24.2908 0.346415 24.0684C0.568846 23.846 0.870528 23.721 1.18509 23.721C1.49966 23.721 1.80134 23.846 2.02377 24.0684C2.2462 24.2908 2.37116 24.5925 2.37116 24.9071V29.6514C2.372 30.1754 2.58053 30.6777 2.95107 31.0482C3.32161 31.4188 3.82393 31.6273 4.34794 31.6281H9.09222C9.40679 31.6281 9.70847 31.7531 9.9309 31.9755C10.1533 32.198 10.2783 32.4996 10.2783 32.8142C10.2783 33.1288 10.1533 33.4305 9.9309 33.6529C9.70847 33.8753 9.40679 34.0003 9.09222 34.0003ZM29.6508 34.0003H24.9065C24.5919 34.0003 24.2902 33.8753 24.0678 33.6529C23.8454 33.4305 23.7204 33.1288 23.7204 32.8142C23.7204 32.4996 23.8454 32.198 24.0678 31.9755C24.2902 31.7531 24.5919 31.6281 24.9065 31.6281H29.6508C30.1748 31.6273 30.6771 31.4188 31.0476 31.0482C31.4182 30.6777 31.6267 30.1754 31.6275 29.6514V24.9071C31.6275 24.5925 31.7525 24.2908 31.9749 24.0684C32.1974 23.846 32.499 23.721 32.8136 23.721C33.1282 23.721 33.4299 23.846 33.6523 24.0684C33.8747 24.2908 33.9997 24.5925 33.9997 24.9071V29.6514C33.9988 30.8045 33.5404 31.9102 32.725 32.7256C31.9096 33.541 30.8039 33.9994 29.6508 34.0003Z" fill="#6A65FD"/>
        <path d="M20 28H14V23.2857H20V28ZM19.25 20.1429H14.75L14 6H20L19.25 20.1429Z" fill="#676CF8"/>
        </svg>
      </div>
      <div id="flows-fab-count">
        ${this.issues.length}
      </div>
    </div>`;
    if (isEditorMode) {
      $(".w-editor-edit-fade-in").append(fab);
    } else {
      $("body").append(fab);
    }
  }

  runChecks() {
    this.checkImages();
    this.checkMetaTags();
    this.checkPageLinks();
    this.checkForLoremIpsum();
    //Removed temporarily due to Rate limit issue
    //this.checkSubdomainIndexing();
    this.checkLanguageCode();
  }

  #createCategories() {
    const self = this;
    Object.keys(this.categories).forEach((category) => {
      let html = `
      <div class="flows-category" data-category="${category}">
        <div class="flows-category-title-bar">
          <span>${category}</span>
          <div class="flows-category-title-right">
            <div class="flows-category-count empty">0</div>
            <div class="flows-category-toggle">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99996 9.79293L11.6464 6.14648L12.3535 6.85359L7.99996 11.2071L3.64641 6.85359L4.35352 6.14648L7.99996 9.79293Z" fill="#F5F5F5"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="flows-category-issues">
        </div>
      </div>
      `;

      $("#flows-issues-list").append(html);
    });

    $(document).on("click", ".flows-category-title-bar", function () {
      let category = $(this).parent().data("category");
      self.toggleCategory(category);
    });
  }

  #bindEvents() {
    const self = this;
    $(document).on("click", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");

      if (
        type === "imageAltText" ||
        type === "imageSize" ||
        type === "brokenLink" ||
        type === "missingLink" ||
        type === "meta" ||
        type === "stagingLink" ||
        type === "loremIpsum"
      ) {
        $("html, body").animate(
          {
            scrollTop:
              $(`[data-page-issue=${issueId}]`).offset().top -
              window.innerHeight / 2,
          },
          500
        );
      }

      if (
        type === "brokenLink" ||
        type === "missingLink" ||
        type === "stagingLink" ||
        type === "loremIpsum"
      ) {
        if (self.allPersistentHighlights) {
          self.toggleAllPersistentHighlights();
        }
        const shouldBeHighlighted = !self.clickedHighlights[issueId];
        self.removeAllHighlightedBrokenLinks();
        self.clickedHighlights[issueId] = shouldBeHighlighted;
        self.highlightBrokenLink(issueId, shouldBeHighlighted);
      }
    });

    $(document).on("mouseenter", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (
        type === "brokenLink" ||
        type === "missingLink" ||
        type === "stagingLink" ||
        type === "loremIpsum"
      ) {
        self.hoveredIssue = issueId;
        if (!self.clickedHighlights[issueId]) {
          self.highlightBrokenLink(issueId, true);
        }
      }
    });

    $(document).on("mouseleave", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (
        type === "brokenLink" ||
        type === "missingLink" ||
        type === "stagingLink" ||
        type === "loremIpsum"
      ) {
        self.hoveredIssue = null;
        if (!self.clickedHighlights[issueId]) {
          self.highlightBrokenLink(issueId, false);
        }
      }
    });

    $(document).on("click", "#flows-refresh", function () {
      self.refreshStoredIssues();
    });

    $(document).on("click", "#flows-highlight-all", function () {
      self.toggleAllPersistentHighlights();
    });

    $(document).on("click", "#flows-close", function () {
      self.removeAllHighlightedBrokenLinks();
      self.toggleAllPersistentHighlights(false);
      $("#flows").toggleClass("visible");
    });

    $(document).on("click", "#flows-fab", function () {
      self.removeAllHighlightedBrokenLinks();
      self.toggleAllPersistentHighlights(false);
      $("#flows").toggleClass("visible");
    });
  }

  init() {
    console.info("Flow Scan v1.0.6");

    const isEditorMode =
      new URLSearchParams(window.location.search).get("edit") === "1";
    const delayTime = isEditorMode ? 6000 : 0;

    if (isEditorMode) {
      console.info(
        "Flow Scan is running in Editor mode. Waiting for 6 seconds to load."
      );
    }

    const shouldRun = new URLSearchParams(window.location.search).get(
      "flowscan"
    );
    if (shouldRun === "0") {
      console.info("Flow Scan is disabled.");
      localStorage.setItem("flows", "0");
      return;
    } else if (shouldRun === "1") {
      console.info("Flow Scan is enabled on all page loads.");
      localStorage.setItem("flows", "1");
    } else if (shouldRun === "2") {
      console.info(
        "Flow Scan is enabled and running only once. Write flowsInstance.init() to run again."
      );
      localStorage.setItem("flows", "0");
    }

    if (!shouldRun && localStorage.getItem("flows") === "0") {
      console.info("Flow Scan is disabled.");
      return;
    } else if (!shouldRun && localStorage.getItem("flows") === "2") {
      console.info(
        "Flow Scan is enabled and running only once. Write flowsInstance.init() to run again."
      );
      localStorage.setItem("flows", "0");
    } else if (!shouldRun && localStorage.getItem("flows") === "1") {
      console.info("Flow Scan is enabled on all page loads.");
    }

    if (!shouldRun && !localStorage.getItem("flows")) {
      console.info("Flow Scan is enabled on all page loads.");
      localStorage.setItem("flows", "1");
    }

    setTimeout(() => {
      this.#createIssuesBox(isEditorMode);
      this.#createFloatingActionButton(isEditorMode);
      this.#createCategories();
      this.runChecks();
      this.#bindEvents();
      this.#initCss();
    }, delayTime);
  }
}
var flowScan;

$(document).ready(function () {
  flowScan = new FlowScan();
  flowScan.init();
});
