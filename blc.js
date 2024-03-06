class FlowScan {
  constructor() {
    this.issues = [];
    this.issueStates = this.loadIssueStates();
    this.issueIdCounter = 0;
    this.ignoreFinsweetAttributes =
      localStorage.getItem("flowsIgnoreFinsweetAttributes") !== "false";
    this.ignoreCtaAttributes =
      localStorage.getItem("flowsIgnoreCtatAttributes") !== "false";
    this.clickedHighlights = {};
    this.hoveredIssue = null;
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

  getIssueIdentifier(element, type) {
    if (type === "link") {
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
  cursor: pointer;
  z-index: 1001;
  display: none;
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
margin-top: 0;
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
.flows-title h4 {
margin: 0;
font-size: 12px;
font-weight: 600;
line-height: 1.33;
}
.flows-icon {
width: 24px;
height: 24px;
border-radius: 2px;
background-color: #6A65FD;
display: flex;
align-items: center;
justify-content: center;
flex-direction: row;
}
.flows-title-icons {
display: flex;
align-items: center;
justify-content: flex-end;
gap: 4px;
}
.flows-title-icon {
cursor: pointer;
width: 24px;
height: 24px;
display: flex;
align-items: center;
justify-content: center;
}
#flows-issues-list {
  overflow: auto;
  max-height: 355px;
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
border-bottom: 1px solid rgba(255, 255, 255, 0.13);
border-top: 1px solid rgba(255, 255, 255, 0.13);
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
}
.flows-item h5 {
margin: 0;
font-size: 12.5px;
font-weight: 700;
line-height: 1.25;
color: #F5F5F5;
}
.flows-item p {
margin: 0;
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
cursor: pointer;
transition: color 0.3s ease;
}
.flows-item-icon.active {
color: #BDBDBD;
}
.flows-item-title {
display: flex;
align-items: flex-start;
justify-content: flex-start;
flex-direction: column;
cursor: pointer;
}`
        )
        .appendTo("head");
    }, delay);
  }

  open() {
    $("#flows").addClass("visible");
  }

  close() {
    $("#flows").removeClass("visible");
  }

  getIssue(issueId) {
    return this.issues.find((issue) => issue.id === issueId);
  }

  addBrokenLink(element) {
    const name = $(element).text() || "Empty link";
    const identifier = this.getIssueIdentifier(element, "link");
    $(element).attr("data-page-issue", `${identifier}`);
    this.addIssue(name, "link", $(element)[0]);
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
      this.highlightBrokenLink(identifier, true);
      this.clickedHighlights[identifier] = true;
    }
    this.saveIssueStates();
    this.updateIssueCount();
  }

  removeIssue(identifier) {
    this.issueStates[identifier].removed = true;
    this.highlightBrokenLink(identifier, false);
    this.saveIssueStates();
    this.issues = this.issues.filter((issue) => issue.id !== identifier);
    $(`[data-issue-id="${identifier}"]`).remove();
    this.updateIssueCount();
  }

  removeAllIssues() {
    this.issues = [];
    $("#flows-issues-list").empty();
    this.updateIssueCount();
  }

  reloadIssues() {
    this.removeAllIssues();
    this.checkMetaTags();
    this.checkPageLinks();
  }

  refreshStoredIssues() {
    var confirmed = window.confirm(
      "Do you really want to refresh the issues? This will clear all the issues that were ignored."
    );
    if (!confirmed) return;

    $("#flows-issues-list").empty();
    this.clearLocalIssueStates();
    this.checkMetaTags();
    this.checkPageLinks();
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

  removeAllHighlightedBrokenLinks() {
    this.issues.forEach((issue) => {
      this.highlightBrokenLink(issue.id, false);
    });
  }

  updateIssueCount() {
    $("#flows-fab-count").text(this.issues.length);
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
    let selector =
      baseSelector + "a:visible, " + baseSelector + "button:visible";
    $(selector)
      .filter((index, element) => {
        for (let i = 0; i < element.attributes.length; i++) {
          if (
            (this.ignoreFinsweetAttributes &&
              element.attributes[i].name.startsWith("fs")) ||
            (this.ignoreCtaAttributes &&
              element.attributes[i].name.startsWith("cta"))
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
          !href.startsWith("tel:")
        ) {
          fetch(href, { method: "HEAD", mode: "no-cors" })
            .then((response) => {
              if (
                !response.ok &&
                response.status !== 403 &&
                response.status !== 0
              ) {
                this.addBrokenLink(element);
              }
            })
            .catch((error) => {
              this.addBrokenLink(element);
            });
        } else if (href === "#" || href === "") {
          this.addBrokenLink(element);
        }
      });
  }

  #createItem(name, type, identifier) {
    let icon = "";
    let title = "";
    let nameText = name.length > 40 ? name.substring(0, 40) + "..." : name;
    let desc = "";

    let isIssueHighlighted = this.issueStates[identifier].highlighted;

    switch (type) {
      case "link":
        icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.79293 7.49998L5.64648 9.64642L6.35359 10.3535L8.50004 8.20708L10.6465 10.3535L11.3536 9.64642L9.20714 7.49998L11.3536 5.35353L10.6465 4.64642L8.50004 6.79287L6.35359 4.64642L5.64648 5.35353L7.79293 7.49998Z" fill="#F5F5F5"/>
        <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="#F5F5F5"/>
        </svg>
        `;
        title = `${nameText} is missing link`;
        desc = "Set link in Editor or Designer";
        break;
      case "meta":
        icon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.79293 7.49998L5.64648 9.64642L6.35359 10.3535L8.50004 8.20708L10.6465 10.3535L11.3536 9.64642L9.20714 7.49998L11.3536 5.35353L10.6465 4.64642L8.50004 6.79287L6.35359 4.64642L5.64648 5.35353L7.79293 7.49998Z" fill="#F5F5F5"/>
<path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="#F5F5F5"/>
</svg>
`;
        title = nameText;
        desc = "Update in Page Settings";
        break;
      default:
        title: "Unknown issue";
        desc: "Please report this issue to the developer.";
        break;
    }

    let itemHTML = `
    <div class="flows-item" data-issue-id="${identifier}" data-issue-type="${type}" data-issue-highlighted="${isIssueHighlighted}">
      <div class="flows-item-title">
        <h5>${title}</h5>
        <p>${desc}</p>
      </div>
      <div class="flows-item-icon">
        ${icon}
      </div> 
    </div>`;

    $("#flows-issues-list").append(itemHTML);

    const newItem = $(`[data-issue-id="${identifier}"]`);
    newItem.find(".flows-item-icon").on("click", () => {
      if (type === "link") {
        this.removeIssue(identifier, true);
      } else if (type === "meta") {
        this.removeIssue(identifier, true);
      }
    });
  }

  #getEditorBarHeight() {
    return $(".w-editor-bem-EditorMainMenu").outerHeight() || 0;
  }

  #createIssuesBox(isEditorMode) {
    var box = `<div id="flows">
        <div class='flows-title-bar'>
          <div class='flows-title'>
            <div class='flows-icon'>
              <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.17868 15.625H0.821533V12.3571H5.17868V15.625ZM4.63403 10.1786H1.36618L0.821533 0.375H5.17868L4.63403 10.1786Z" fill="#1E1E1E"/>
              </svg>
            </div>
            <h4>
            Flow Scan
            </h4>
          </div>
          <div class='flows-title-icons'>
            <div class='flows-title-icon' id="flows-refresh">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C6.76241 2.5 5.61898 2.90936 4.69971 3.59985L5.30029 4.39942C6.05234 3.83453 6.98638 3.5 8 3.5C10.4853 3.5 12.5 5.51472 12.5 8V8.79298L10.8535 7.14649L10.1464 7.8536L13 10.7072L15.8535 7.8536L15.1464 7.14649L13.5 8.7929V8Z" fill="#BDBDBD"/>
              <path d="M3.5 7.2071L5.14641 8.85351L5.85352 8.1464L2.99996 5.29285L0.146409 8.1464L0.853516 8.85351L2.5 7.20702V8C2.5 11.0376 4.96243 13.5 8 13.5C9.23759 13.5 10.381 13.0906 11.3003 12.4001L10.6997 11.6006C9.94766 12.1655 9.01362 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8V7.2071Z" fill="#BDBDBD"/>
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
      <svg width="10" height="34" viewBox="0 0 10 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.75 33.625H0.25V26.5H9.75V33.625ZM8.5625 21.75H1.4375L0.25 0.375H9.75L8.5625 21.75Z" fill="#676CF8"/>
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

  #bindEvents() {
    const self = this;
    $(document).on("click", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (type !== "link") {
        return;
      }
      $("html, body").animate(
        {
          scrollTop:
            $(`[data-page-issue=${issueId}]`).offset().top -
            window.innerHeight / 2,
        },
        500
      );
      const shouldBeHighlighted = !self.clickedHighlights[issueId];
      self.clickedHighlights[issueId] = shouldBeHighlighted;
      self.highlightBrokenLink(issueId, shouldBeHighlighted);
    });

    $(document).on("mouseenter", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (type === "link") {
        self.hoveredIssue = issueId;
        if (!self.clickedHighlights[issueId]) {
          self.highlightBrokenLink(issueId, true);
        }
      }
    });

    $(document).on("mouseleave", ".flows-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (type === "link") {
        self.hoveredIssue = null;
        if (!self.clickedHighlights[issueId]) {
          self.highlightBrokenLink(issueId, false);
        }
      }
    });

    $(document).on("click", "#flows-refresh", function () {
      self.refreshStoredIssues();
    });

    $(document).on("click", "#flows-close", function () {
      $("#flows").toggleClass("visible");
    });

    $(document).on("click", "#flows-fab", function () {
      $("#flows").toggleClass("visible");
    });
  }

  init() {
    if (!window.location.host.includes("webflow.io")) {
      return;
    }

    const isEditorMode =
      new URLSearchParams(window.location.search).get("edit") === "1";
    const delayTime = isEditorMode ? 6000 : 0;

    if (isEditorMode) {
      console.info(
        "Flow Scan is running in Editor mode. Waiting for 6 seconds to load."
      );
    }

    const shouldRun = new URLSearchParams(window.location.search).get("flows");
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

    setTimeout(() => {
      this.#createIssuesBox(isEditorMode);
      this.#createFloatingActionButton(isEditorMode);
      this.checkMetaTags();
      this.checkPageLinks();
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
