let brokenLinks = [];

function toggleHighlightBrokenLink(id) {
  var blcItem = $(`[data-broken-link-id="${id}"]`);
  var element = $(`#${id}`);
  var isBlcItemActive = blcItem.find(".blc-item-icon").hasClass("active");
  if (isBlcItemActive) {
    blcItem.find(".blc-item-icon").removeClass("active");
    $(element).css("border", "").css("background-color", "");
    console.info(
      "Broken Links Checker - Disabled highlight for broken link: " + id
    );
  } else {
    blcItem.find(".blc-item-icon").addClass("active");
    $(element)
      .css("border", "2px solid red")
      .css("background-color", "rgba(255, 0, 0, 0.4)");
    console.info(
      "Broken Links Checker - Enabled highlight for broken link: " + id
    );
  }
}

function highlightBrokenLink(element, index) {
  var brokenLinkId = "broken-link-" + index;
  var elText = $(element).text();
  if (elText === "") {
    elText = "Empty link";
  }
  $(element)
    .attr("id", brokenLinkId)
    .css("border", "2px solid red")
    .css("background-color", "rgba(255, 0, 0, 0.4)");
  brokenLinks.push({ text: elText, id: brokenLinkId });
  updateLinkList();
}

function createItem(id, name, type) {
  let icon = "";
  let title = "";
  let desc = "";
  let clickFunction = "";
  switch (type) {
    case "link":
      icon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.70504 10.4121L12.6465 13.3536L13.3536 12.6465L1.35359 0.646454L0.646484 1.35356L3.38813 4.09521C2.39358 4.7612 1.59323 5.69433 1.08968 6.79149C1.02891 6.92389 1.02891 7.07621 1.08968 7.20862C2.11619 9.44513 4.37601 11 7.00004 11C7.96543 11 8.88153 10.7896 9.70504 10.4121ZM8.94077 9.64784L4.11155 4.81862C3.25768 5.34657 2.55891 6.10169 2.09965 7.00004C3.01052 8.78174 4.8635 10 7.00004 10C7.68311 10 8.33719 9.87549 8.94077 9.64784Z" fill="currentColor"/>
          <path d="M12.9104 7.20853C12.5777 7.9335 12.1154 8.58685 11.5531 9.13884L10.8461 8.43181C11.2703 8.01682 11.6276 7.53367 11.9005 6.99997C10.9896 5.21828 9.13663 4.00001 7.00008 4.00001C6.81177 4.00001 6.62565 4.00947 6.4422 4.02795L5.5717 3.15746C6.0313 3.05439 6.50932 3.00001 7.00008 3.00001C9.62411 3.00001 11.8839 4.55488 12.9104 6.7914C12.9712 6.9238 12.9712 7.07612 12.9104 7.20853Z" fill="currentColor"/>
          </svg>`;
      title = `${name} is missing link`;
      desc = "Set link in Editor or Designer";
      clickFunction = `toggleHighlightBrokenLink('${id}')`;
      break;
  }
  return $("#blc-issues-list").append(
    `<div class="blc-item" data-broken-link-id="${id}">
        <div class="blc-item-title">
          <h5>${title}</h5>
          <p>${desc}</p>
        </div>
        <div class="blc-item-icon active" onclick="${clickFunction}">
          ${icon}
        </div> 
        </div>`
  );
}

function updateLinkList() {
  if ($("#broken-links-box").length > 0) {
    $("#broken-links-box").remove();
  }
  var box = `<div id="broken-links-box">
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
  $("body").append(box);
  $("#blc-close").click(function () {
    $("#broken-links-box").toggleClass("visible");
  });
  brokenLinks.forEach(function (link) {
    createItem(link.id, link.text, "link");
  });

  $(".blc-item-title").click(function () {
    var linkId = $(this).parent().data("broken-link-id");
    $("html, body").animate(
      {
        scrollTop: $("#" + linkId).offset().top - window.innerHeight / 2,
      },
      500
    );
  });
}

function getEditorBarHeight() {
  return $(".w-editor-bem-EditorMainMenu").outerHeight() || 0;
}

$(document).ready(function () {
  console.info("Broken Links Checker is running...");
  let params = new URLSearchParams(window.location.search);
  let isEditorMode = params.get("editor") === "1";
  let delayTime = isEditorMode ? 6000 : 0;

  function createFloatingActionButton() {
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
    $("body").append(fab);
    $("#blc-fab").click(function () {
      $("#broken-links-box").toggleClass("visible");
    });
  }

  setTimeout(function () {
    let staging = window.location.host.includes("webflow.io");

    if (!staging) return;

    createFloatingActionButton();

    let baseSelector = isEditorMode ? ".w-editor-edit-fade-in " : "";
    let selector =
      baseSelector + "a:visible, " + baseSelector + "button:visible";

    $(selector)
      .filter(function () {
        for (let i = 0; i < this.attributes.length; i++) {
          if (this.attributes[i].name.startsWith("fs")) {
            return false;
          }
        }
        return true;
      })
      .each(function (index) {
        var href = $(this).attr("href");
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
                console.log(response.status);
                highlightBrokenLink(this, index);
              } else {
                console.log("Link is OK: " + href);
              }
            })
            .catch((error) => {
              highlightBrokenLink(this, index);
            });
        } else if (href === "#" || href === "") {
          highlightBrokenLink(this, index);
        }
      });

    if (brokenLinks.length > 0) {
      updateLinkList();
    }

    let editorBarHeight = getEditorBarHeight();
    let additionalBottomSpace = editorBarHeight > 0 ? editorBarHeight + 10 : 0;

    $("<style>")
      .prop("type", "text/css")
      .html(
        `
        #blc-fab {
  position: fixed;
  width: 80px;
  height: 80px;
  bottom: 18px;
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
#broken-links-box {
position: fixed;
bottom: ${additionalBottomSpace + 110}px;
left: 18px;
background-color: #1E1E1E;
color: #F5F5F5;
border-radius: 4px;
max-height: 400px;
height: 100%;
z-index: 1000;
box-shadow: 0px 1px 3px -1px rgba(0,0,0,0.34), 0px 5px 10px -2px rgba(0,0,0,0.32);
display: none;
}
#broken-links-box.visible {
display: block;
}
#broken-links-box h4 {
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
font-weight: 500;
line-height: 1.33;
position: relative;
top: 1px;
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
font-weight: 600;
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
  }, delayTime);
});
