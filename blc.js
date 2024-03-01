$(document).ready(function () {
  console.info("Broken Links Checker is running...");
  let params = new URLSearchParams(window.location.search);
  let isEditorMode = params.get("editor") === "1";
  let delayTime = isEditorMode ? 6000 : 0;

  setTimeout(function () {
    let staging = window.location.host.includes("webflow.io");

    if (!staging) return;

    let brokenLinks = [];
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

    function highlightBrokenLink(element, index) {
      var brokenLinkId = "broken-link-" + index;
      $(element)
        .attr("id", brokenLinkId)
        .css("border", "2px solid red")
        .css("background-color", "rgba(255, 0, 0, 0.4)");
      brokenLinks.push({ text: $(element).text(), id: brokenLinkId });
      updateLinkList();
    }

    function updateLinkList() {
      if ($("#broken-links-box").length > 0) {
        $("#broken-links-box").remove();
      }
      var box = $(
        '<div id="broken-links-box"><h4>Broken Links Checker</h4></div>'
      );
      $("body").append(box);
      brokenLinks.forEach(function (link) {
        $("#broken-links-box").append(
          '<p class="broken-link-item" data-broken-link-id="' +
            link.id +
            '">' +
            link.text +
            "</p>"
        );
      });

      $(".broken-link-item").click(function () {
        var linkId = $(this).data("broken-link-id");
        $("html, body").animate(
          {
            scrollTop: $("#" + linkId).offset().top,
          },
          500
        );
      });
    }

    if (brokenLinks.length > 0) {
      updateLinkList();
    }

    let editorBarHeight = $(".w-editor-bem-EditorMainMenu").outerHeight() || 0;
    let additionalBottomSpace = editorBarHeight > 0 ? editorBarHeight + 10 : 0;

    $("<style>")
      .prop("type", "text/css")
      .html(
        "\
#broken-links-box {\
position: fixed;\
bottom: " +
          additionalBottomSpace +
          "px;\
left: 0;\
background-color: white;\
border: 1px solid black;\
padding: 10px;\
max-height: 200px;\
overflow-y: auto;\
z-index: 1000;\
}\
#broken-links-box h4 {\
margin-top: 0;\
}\
.broken-link-item {\
cursor: pointer;\
text-decoration: underline;\
color: red;\
}"
      )
      .appendTo("head");
  }, delayTime);
});
