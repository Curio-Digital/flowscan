class BrokenLinkChecker {
  constructor() {
    this.issues = [];
    this.issueIdCounter = 0;
    this.ignoreFinsweetAttributes = true;
    this.ignoreCtaAttributes = true;
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
  position: fixed;
  width: 80px;
  height: 80px;
bottom: ${additionalBottomSpace + 18}px;
  left: 18px;
  background-color: #6A65FD;
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
  position: relative;
  bottom: 6px;
}
#blc {
font-family: 'Inter', sans-serif;
position: fixed;
bottom: ${additionalBottomSpace + 110}px;
left: 18px;
background-color: #1E1E1E;
color: #F5F5F5;
border-radius: 4px;
max-height: 400px;
height: 100%;
min-width: 260px;
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
width: 20px;
height: 20px;
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
  width: 8px;
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
color: #BDBDBD;
opacity: 0.4;
cursor: pointer;
transition: opacity 0.3s ease;
}
.blc-item-icon.active {
opacity: 1;
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
    this.#createItem(name, type, issueId);
  }

  removeIssue(id) {
    let issueId = `issue-${id}`;
    this.issues = this.issues.filter((issue) => issue.id !== issueId);
    $(`[data-issue-id="${issueId}"]`).remove();
  }

  removeIssueByLiteralId(id) {
    let issueId = id;
    this.issues = this.issues.filter((issue) => issue.id !== issueId);
    $(`[data-issue-id="${issueId}"]`).remove();
  }

  clearAllIssues() {
    this.issues = [];
    $("#blc-issues-list").empty();
    this.removeAllHighlightedBrokenLink();
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

  toggleHighlightBrokenLink(id) {
    var blcItem = $(`[data-issue-id="${id}"]`);
    var element = $(`[data-page-issue="${id}"]`);
    var isBlcItemActive = blcItem.find(".blc-item-icon").hasClass("active");
    if (isBlcItemActive) {
      blcItem.find(".blc-item-icon").removeClass("active");
      $(element).css("border", "").css("background-color", "");
    } else {
      blcItem.find(".blc-item-icon").addClass("active");
      $(element)
        .css("border", "2px solid red")
        .css("background-color", "rgba(255, 0, 0, 0.4)");
    }
  }

  removeAllHighlightedBrokenLink() {
    $(".blc-item-icon.active").removeClass("active");
    $("[data-page-issue]").css("border", "").css("background-color", "");
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
        icon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.70504 10.4121L12.6465 13.3536L13.3536 12.6465L1.35359 0.646454L0.646484 1.35356L3.38813 4.09521C2.39358 4.7612 1.59323 5.69433 1.08968 6.79149C1.02891 6.92389 1.02891 7.07621 1.08968 7.20862C2.11619 9.44513 4.37601 11 7.00004 11C7.96543 11 8.88153 10.7896 9.70504 10.4121ZM8.94077 9.64784L4.11155 4.81862C3.25768 5.34657 2.55891 6.10169 2.09965 7.00004C3.01052 8.78174 4.8635 10 7.00004 10C7.68311 10 8.33719 9.87549 8.94077 9.64784Z" fill="currentColor"/>
          <path d="M12.9104 7.20853C12.5777 7.9335 12.1154 8.58685 11.5531 9.13884L10.8461 8.43181C11.2703 8.01682 11.6276 7.53367 11.9005 6.99997C10.9896 5.21828 9.13663 4.00001 7.00008 4.00001C6.81177 4.00001 6.62565 4.00947 6.4422 4.02795L5.5717 3.15746C6.0313 3.05439 6.50932 3.00001 7.00008 3.00001C9.62411 3.00001 11.8839 4.55488 12.9104 6.7914C12.9712 6.9238 12.9712 7.07612 12.9104 7.20853Z" fill="currentColor"/>
          </svg>`;
        title = `${nameText} is missing link`;
        desc = "Set link in Editor or Designer";
        this.toggleHighlightBrokenLink(id);
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
      <div class="blc-item-icon active">
        ${icon}
      </div> 
    </div>`;

    $("#blc-issues-list").append(itemHTML);

    const newItem = $(`[data-issue-id="${id}"]`);
    newItem.find(".blc-item-icon").on("click", () => {
      if (type === "link") {
        this.toggleHighlightBrokenLink(id);
      } else if (type === "meta") {
        this.removeIssueByLiteralId(id);
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
            <svg width="20" height="4" viewBox="0 0 20 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0.500015L20 1.76118C20 2.72058 19.4207 3.50001 18.7076 3.50001L13.5238 3.50001C12.8107 3.50001 12.2313 2.72058 12.2313 1.76118L12.2313 0.500015L20 0.500015Z" fill="white"/>
            <path d="M6.6292 3.49866L8.38254e-05 3.49866L8.39233e-05 0.500015L7.92163 0.500015L7.92163 1.75983C7.92163 2.72058 7.3423 3.49866 6.6292 3.49866Z" fill="white"/>
            <ellipse cx="6.47134" cy="1.91519" rx="0.46646" ry="0.624327" fill="#161616"/>
            <ellipse cx="18.4955" cy="1.91519" rx="0.46646" ry="0.624327" fill="#161616"/>
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
        <svg width="68" height="8" viewBox="0 0 68 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M67.9524 0.340454L67.9524 3.53281C67.9524 5.96134 65.9896 7.9343 63.5737 7.9343L46.0112 7.9343C43.5952 7.9343 41.6325 5.96134 41.6325 3.53281L41.6325 0.340453L67.9524 0.340454Z" fill="white"/>
        <path d="M22.6523 7.93088L0.19313 7.93088L0.19313 0.340453L27.031 0.340454L27.031 3.52939C27.031 5.96134 25.0683 7.93088 22.6523 7.93088Z" fill="white"/>
        <circle cx="22.1175" cy="3.92275" r="1.58035" fill="#161616"/>
        <circle cx="62.8552" cy="3.92275" r="1.58035" fill="#161616"/>
        </svg>
      </div>
    </div>`;
    if (isEditorMode) {
      $(".w-editor-edit-fade-in").append(fab);
    } else {
      $("body").append(fab);
    }
  }

  #bindEvents() {
    $(document).on("click", ".blc-item-title", function () {
      const issueId = $(this).parent().data("issue-id");
      $("html, body").animate(
        {
          scrollTop:
            $(`[data-page-issue=${issueId}]`).offset().top -
            window.innerHeight / 2,
        },
        500
      );
    });

    $(document).on("click", "#blc-close", function () {
      $("#blc").toggleClass("visible");
    });

    $(document).on("click", "#blc-fab", function () {
      $("#blc").toggleClass("visible");
    });
  }

  init() {
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
      if (!window.location.host.includes("webflow.io")) {
        console.info(
          "Broken Links Checker is only available on staging or Editor."
        );
        return;
      }

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
