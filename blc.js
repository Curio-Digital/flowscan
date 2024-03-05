class BrokenLinkChecker {
  constructor() {
    this.issues = [];
    this.issueIdCounter = 0;
    this.ignoreFinsweetAttributes = true;
    this.ignoreCtaAttributes = true;
    this.clickedHighlights = {};
    this.hoveredIssue = null;
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
        #blc-fab {
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
#blc-fab.active {
  display: flex;
}
.blc-fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
#blc-fab-count {
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
#blc {
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
#blc.visible {
display: block;
}
#blc h4 {
margin-top: 0;
}
.blc-title-bar {
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
flex-direction: row;
padding: 10px 8px;
border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}
.blc-title {
display: flex;
align-items: center;
justify-content: flex-start;
flex-direction: row;
gap: 8px;
}
.blc-title h4 {
margin: 0;
font-size: 12px;
font-weight: 600;
line-height: 1.33;
}
.blc-icon {
width: 24px;
height: 24px;
border-radius: 2px;
background-color: #6A65FD;
display: flex;
align-items: center;
justify-content: center;
flex-direction: row;
}
.blc-close {
cursor: pointer;
width: 24px;
height: 24px;
display: flex;
align-items: center;
justify-content: center;
}
#blc-issues-list {
  overflow: auto;
  max-height: 355px;
}
#blc-issues-list::-webkit-scrollbar {
  width: 4px;
}
#blc-issues-list::-webkit-scrollbar-thumb {
  background-color: #6A65FD;
  border-radius: 4px;
}
#blc-issues-list::-webkit-scrollbar-track {
  background-color: #1E1E1E;
}
.blc-item {
padding: 8px;
border-bottom: 1px solid rgba(255, 255, 255, 0.13);
border-top: 1px solid rgba(255, 255, 255, 0.13);
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
}
.blc-item h5 {
margin: 0;
font-size: 12.5px;
font-weight: 700;
line-height: 1.25;
color: #F5F5F5;
}
.blc-item p {
margin: 0;
font-size: 11.5px;
line-height: 16px;
letter-spacing: -0.01em;
color: #BDBDBD;
}
.blc-item-icon {
display: flex;
align-items: center;
justify-content: center;
width: 16px;
height: 16px;
color: #BDBDBD66;
cursor: pointer;
transition: color 0.3s ease;
}
.blc-item-icon.active {
color: #BDBDBD;
}
.blc-item-title {
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
    $("#blc").addClass("visible");
  }

  close() {
    $("#blc").removeClass("visible");
  }

  getIssue(id) {
    const issueId = `issue-${id}`;
    return this.issues.find((issue) => issue.id === issueId);
  }

  addBrokenLink(element) {
    const name = $(element).text() || "Empty link";
    $(element).attr("data-page-issue", `issue-${this.issueIdCounter + 1}`);
    this.addIssue(name, "link", $(element)[0]);
  }

  addIssue(name, type, element) {
    const issueId = `issue-${++this.issueIdCounter}`;
    this.issues;
    if (element !== undefined) {
      this.issues.push({
        id: issueId,
        text: name,
        type: type,
        element: element,
      });
    } else {
      this.issues.push({ id: issueId, text: name, type: type });
    }
    this.updateIssueCount();
    this.#createItem(name, type, issueId);
  }

  removeIssue(id, literal = false) {
    let issueId = `issue-${id}`;
    if (literal) {
      issueId = id;
    }
    this.issues = this.issues.filter((issue) => issue.id !== issueId);
    $(`[data-issue-id="${issueId}"]`).remove();
    this.updateIssueCount();
    this.disableHighlightBrokenLink(issueId);
  }

  clearAllIssues() {
    this.issues = [];
    $("#blc-issues-list").empty();
    this.updateIssueCount();
    this.removeAllHighlightedBrokenLinks();
  }

  reloadIssues() {
    this.clearAllIssues();
    this.checkMetaTags();
    this.checkPageLinks("a:visible, button:visible");
  }

  setIgnoreFinsweetAttributes(value) {
    this.ignoreFinsweetAttributes = value;
    this.reloadIssues();
  }

  setIgnoreCtaAttributes(value) {
    this.ignoreCtaAttributes = value;
    this.reloadIssues();
  }

  disableHighlightBrokenLink(id) {
    delete this.clickedHighlights[id];
    var blcItem = $(`[data-issue-id="${id}"]`);
    blcItem.find(".blc-item-icon").removeClass("active");
    $(`[data-page-issue="${id}"]`)
      .css("border", "")
      .css("background-color", "");
  }

  toggleHighlightBrokenLink(id, persist = false) {
    var blcItem = $(`[data-issue-id="${id}"]`);
    var element = $(`[data-page-issue="${id}"]`);
    var isBlcItemActive = blcItem.find(".blc-item-icon").hasClass("active");
    if (persist) {
      this.clickedHighlights[id] = !this.clickedHighlights[id];
    }

    if (isBlcItemActive && (!persist || !this.clickedHighlights[id])) {
      if (id !== this.hoveredIssue) {
        blcItem.find(".blc-item-icon").removeClass("active");
        $(element).css("border", "").css("background-color", "");
      }
    } else if (!isBlcItemActive || (persist && this.clickedHighlights[id])) {
      blcItem.find(".blc-item-icon").addClass("active");
      $(element)
        .css("border", "2px solid red")
        .css("background-color", "rgba(255, 0, 0, 0.4)");
    }
  }

  removeAllHighlightedBrokenLinks() {
    $(".blc-item-icon.active").removeClass("active");
    $("[data-page-issue]").css("border", "").css("background-color", "");
  }

  updateIssueCount() {
    $("#blc-fab-count").text(this.issues.length);
  }

  checkMetaTags() {
    let metaTitle = document.title;
    let metaDescription = $('meta[name="description"]').attr("content");
    let openGraphImage = $('meta[property="og:image"]').attr("content");

    if (!metaTitle || metaTitle === "") {
      this.addIssue("Missing meta title", "meta");
    }
    if (!metaDescription) {
      this.addIssue("Missing meta description", "meta");
    }
    if (!openGraphImage) {
      this.addIssue("Missing Open Graph image", "meta");
    }
  }

  checkPageLinks(selector) {
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

  #createItem(name, type, id) {
    let icon = "";
    let title = "";
    let nameText = name.length > 40 ? name.substring(0, 40) + "..." : name;
    let desc = "";

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
    <div class="blc-item" data-issue-id="${id}" data-issue-type="${type}">
      <div class="blc-item-title">
        <h5>${title}</h5>
        <p>${desc}</p>
      </div>
      <div class="blc-item-icon">
        ${icon}
      </div> 
    </div>`;

    $("#blc-issues-list").append(itemHTML);

    const newItem = $(`[data-issue-id="${id}"]`);
    newItem.find(".blc-item-icon").on("click", () => {
      if (type === "link") {
        this.removeIssue(id, true);
      } else if (type === "meta") {
        this.removeIssue(id, true);
      }
    });
  }

  #getEditorBarHeight() {
    return $(".w-editor-bem-EditorMainMenu").outerHeight() || 0;
  }

  #createIssuesBox(isEditorMode) {
    var box = `<div id="blc">
        <div class='blc-title-bar'>
          <div class='blc-title'>
            <div class='blc-icon'>
              <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.17868 15.625H0.821533V12.3571H5.17868V15.625ZM4.63403 10.1786H1.36618L0.821533 0.375H5.17868L4.63403 10.1786Z" fill="#1E1E1E"/>
              </svg>
            </div>
            <h4>
            Curio Page Audit
            </h4>
          </div>
          <div class='blc-close' id="blc-close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00001L12.3536 4.35356L11.6465 3.64645L8.00004 7.2929L4.35359 3.64645L3.64648 4.35356L7.29293 8.00001L3.64648 11.6465L4.35359 12.3536L8.00004 8.70711L11.6465 12.3536L12.3536 11.6465L8.70714 8.00001Z" fill="#BDBDBD"/>
            </svg>
          </div>
        </div>
        <div id='blc-issues-list'>
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
    <div id="blc-fab" class="active">
      <div class="blc-fab-icon">
      <svg width="10" height="34" viewBox="0 0 10 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.75 33.625H0.25V26.5H9.75V33.625ZM8.5625 21.75H1.4375L0.25 0.375H9.75L8.5625 21.75Z" fill="#676CF8"/>
      </svg>
      </div>
      <div id="blc-fab-count">
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
    $(document).on("click", ".blc-item-title", function () {
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
      self.toggleHighlightBrokenLink(issueId, true);
    });

    $(document).on("mouseenter", ".blc-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (type === "link") {
        self.hoveredIssue = issueId;
        if (!self.clickedHighlights[issueId]) {
          self.toggleHighlightBrokenLink(issueId);
        }
      }
    });

    $(document).on("mouseleave", ".blc-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      const type = $(this).parent().data("issue-type");
      if (type === "link") {
        self.hoveredIssue = null;
        if (!self.clickedHighlights[issueId]) {
          self.toggleHighlightBrokenLink(issueId);
        }
      }
    });

    $(document).on("click", "#blc-close", function () {
      $("#blc").toggleClass("visible");
    });

    $(document).on("click", "#blc-fab", function () {
      $("#blc").toggleClass("visible");
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
        "Broken Links Checker is running in Editor mode. Waiting for 6 seconds to load."
      );
    }

    const localStorage = window.localStorage;

    const shouldRun = new URLSearchParams(window.location.search).get("blc");
    if (shouldRun === "0") {
      console.info("Broken Links Checker is disabled.");
      localStorage.setItem("blc", "0");
      return;
    } else if (shouldRun === "1") {
      console.info("Broken Links Checker is enabled on all page loads.");
      localStorage.setItem("blc", "1");
    } else if (shouldRun === "2") {
      console.info(
        "Broken Links Checker is enabled and running only once. Write blcInstance.init() to run again."
      );
      localStorage.setItem("blc", "0");
    }

    if (!shouldRun && localStorage.getItem("blc") === "0") {
      console.info("Broken Links Checker is disabled.");
      return;
    } else if (!shouldRun && localStorage.getItem("blc") === "2") {
      console.info(
        "Broken Links Checker is enabled and running only once. Write blcInstance.init() to run again."
      );
      localStorage.setItem("blc", "0");
    } else if (!shouldRun && localStorage.getItem("blc") === "1") {
      console.info("Broken Links Checker is enabled on all page loads.");
    }

    setTimeout(() => {
      let baseSelector = isEditorMode ? ".w-editor-edit-fade-in " : "";
      let selector =
        baseSelector + "a:visible, " + baseSelector + "button:visible";

      this.#createIssuesBox(isEditorMode);
      this.#createFloatingActionButton(isEditorMode);
      this.checkMetaTags();
      this.checkPageLinks(selector);
      this.#bindEvents();
      this.#initCss();
    }, delayTime);
  }
}
var blcInstance;

$(document).ready(function () {
  blcInstance = new BrokenLinkChecker();
  blcInstance.init();
});
