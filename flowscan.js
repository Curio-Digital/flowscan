class FlowScan{constructor(){this.issues=[],this.issueStates=this.loadIssueStates(),this.allPersistentHighlights=!1,this.issueIdCounter=0,this.ignoreFinsweetAttributes="false"!==localStorage.getItem("flowsIgnoreFinsweetAttributes"),this.ignoreCtaAttributes="false"!==localStorage.getItem("flowsIgnoreCtatAttributes"),this.ignoreInteractionElements="false"!==localStorage.getItem("flowsIgnoreInteractionElements"),this.ignoreRefokusShareElements="false"!==localStorage.getItem("flowsIgnoreRefokusShareElements"),this.ignoreLightboxElements="false"!==localStorage.getItem("flowsIgnoreLightboxElements"),this.clickedHighlights={},this.hoveredIssue=null,this.confirmedRemove="true"===localStorage.getItem("flowsConfirmedRemove"),this.reorderCategories="false"!==localStorage.getItem("flowsReorderCategories"),this.categories={SEO:["meta","brokenLink","stagingIndexing"],Performance:["imageSize"],Accessibility:["imageAltText","lang"],Content:["loremIpsum","missingLink","stagingLink"]}}loadIssueStates(){const e=localStorage.getItem("flowsIssueStates");return e?JSON.parse(e):{}}saveIssueStates(){localStorage.setItem("flowsIssueStates",JSON.stringify(this.issueStates))}clearLocalIssueStates(){localStorage.removeItem("flowsIssueStates"),this.issueStates={}}setReorderCategories(e){this.reorderCategories=e,localStorage.setItem("flowsReorderCategories",e)}getIssueIdentifier(e,t){if("brokenLink"===t||"missingLink"===t){const t=$(e).text().trim().replace(/\s/g,"-").replace(/[^a-zA-Z0-9-]/g,""),n=$(e).attr("class"),i=n?n.split(" ")[0]:$(e).prop("tagName").toLowerCase();return`link-${i}-${t}-${$(`.${i}:contains('${$(e).text().trim()}')`).index(e)}`}if("imageAltText"===t){let t=$(e).attr("src").split("/").pop();return t=t.slice(0,15),`alt-${t}`}if("imageSize"===t){let t=$(e).attr("src").split("/").pop();return t=t.slice(0,15),`image-${t}`}return"loremIpsum"===t?"lorem-ipsum":"unknown"}#e(e){setTimeout((()=>{let e=this.#t(),t=e>0?e+10:0;$("<style>").prop("type","text/css").html(`\n        #flows-fab {\n  font-family: 'Inter', sans-serif;\n  position: fixed;\n  width: 56px;\n  height: 56px;\nbottom: ${t+18}px;\n  left: 18px;\n  background-color: #1E1E1E;\n  border-radius: 50%;\n  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1001;\n  display: none;\n  cursor: pointer;\n}\n#flows-fab.active {\n  display: flex;\n}\n.flows-fab-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n#flows-fab-count {\n  user-select: none;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background-color: #CB3535;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 0px;\n  right: -4px;\n  font-size: 10px;\n  line-height: 14px;\n  letter-spacing: -0.01em;\n  text-align: center;\n}\n#flows {\nfont-family: 'Inter', sans-serif;\nposition: fixed;\nbottom: ${t+86}px;\nleft: 18px;\nbackground-color: #1E1E1E;\ncolor: #F5F5F5;\nborder-radius: 4px;\nmax-height: 400px;\nheight: 100%;\nmin-width: 300px;\nz-index: 1000;\nbox-shadow: 0px 1px 3px -1px rgba(0,0,0,0.34), 0px 5px 10px -2px rgba(0,0,0,0.32);\ndisplay: none;\n}\n#flows.visible {\ndisplay: block;\n}\n#flows h4 {\nmargin: 0 !important;\nmargin-bottom: 0 !important;\nmargin-top: 0 !important;\n}\n.flows-title-bar {\ndisplay: flex;\nalign-items: center;\njustify-content: space-between;\ngap: 8px;\nflex-direction: row;\npadding: 10px 8px;\nborder-bottom: 1px solid rgba(255, 255, 255, 0.13);\n}\n.flows-title {\ndisplay: flex;\nalign-items: center;\njustify-content: flex-start;\nflex-direction: row;\ngap: 8px;\n}\n.flows-title span {\nfont-size: 12px;\nfont-weight: 600;\nline-height: 1.33;\nmargin: 0 !important;\nmargin-bottom: 0 !important;\nmargin-top: 0 !important;\n}\n.flows-icon {\nwidth: 24px;\nheight: 24px;\nborder-radius: 2px;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\nflex-direction: row;\n}\n.flows-title-icons {\ndisplay: flex;\nalign-items: center;\njustify-content: flex-end;\ngap: 8px;\n}\n.flows-title-icon {\nwidth: 16px;\nheight: 16px;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ncursor: pointer;\n}\n.flows-bottom-bar {\ndisplay: flex;\nalign-items: center;\njustify-content: space-between;\ngap: 8px;\npadding: 8px;\n}\n.flows-bottom-bar a {\ncolor: #BDBDBD;\nfont-size: 11.5px;\nline-height: 16px;\nletter-spacing: -0.01em;\ntransition: color 0.3s ease;\ncursor: pointer;\ntext-decoration: none;\n}\n.flows-bottom-bar a:hover {\n  color: #6A65FD;\n}\n.flows-bottom-bar span {\ncolor: #BDBDBD;\nfont-size: 11.5px;\nline-height: 16px;\nletter-spacing: -0.01em;\n}\n.flows-empty-state {\ndisplay: flex;\nalign-items: center;\njustify-content: center;\npadding: 20px;\nmargin: auto;\nheight: 100%;\n}\n.flows-empty-state span {\ncolor: #FFFFFF;\nfont-size: 12.5px;\nline-height: 16px;\ntext-align: center;\n}\n#flows-issues-list {\n  overflow: auto;\n  max-height: 323px;\n  height: 100%;\n}\n#flows-issues-list::-webkit-scrollbar {\n  width: 4px;\n}\n#flows-issues-list::-webkit-scrollbar-thumb {\n  background-color: #6A65FD;\n  border-radius: 4px;\n}\n#flows-issues-list::-webkit-scrollbar-track {\n  background-color: #1E1E1E;\n}\n.flows-item {\npadding: 8px;\nborder-top: 1px solid rgba(255, 255, 255, 0.13);\ndisplay: flex;\nalign-items: center;\njustify-content: space-between;\ngap: 16px;\n}\n.flows-item span {\ncursor: pointer;\nmargin: 0 !important;\nmargin-bottom: 0 !important;\nmargin-top: 0 !important;\nfont-size: 11.5px;\nfont-weight: 400;\nline-height: 16px;\ncolor: #BDBDBD;\nletter-spacing: -0.01em;\n}\n.flows-item p {\nmargin: 0;\nmargin-bottom: 0;\nmargin-top: 0;\nfont-size: 11.5px;\nline-height: 16px;\nletter-spacing: -0.01em;\ncolor: #BDBDBD;\n}\n.flows-item-icon {\ndisplay: flex;\nalign-items: center;\njustify-content: center;\nwidth: 16px;\nheight: 16px;\ncolor: #BDBDBD66;\ntransition: color 0.3s ease;\ncursor: pointer;\n}\n.flows-item-icon.active {\ncolor: #BDBDBD;\n}\n.flows-item-title {\ndisplay: flex;\nalign-items: flex-start;\njustify-content: flex-start;\nflex-direction: column;\n}\n.flows-item-image-preview {\ndisplay: none;\nposition: fixed;\nz-index: 10;\npadding: 5px;\nbackground: #1E1E1E;\nborder: 1px solid #6A65FD;\nborder-radius: 4px;\nbox-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.flows-item-image-preview img {\nmax-width: 200px;\nmax-height: 200px;\n}\n.flows-category {\ndisplay: flex;\nflex-direction: column;\nalign-items: stretch;\njustify-content: center;\nborder-bottom: 1px solid rgba(255, 255, 255, 0.13);\n}\n.flows-category-title-bar {\ndisplay: flex;\nalign-items: center;\njustify-content: space-between;\ngap: 8px;\npadding: 8px;\n}\n.flows-category-title-bar span {\nfont-size: 12.5px;\nline-height: 16px;\nfont-weight: 600;\nmargin: 0 !important;\nmargin-bottom: 0 !important;\nmargin-top: 0 !important;\n}\n.flows-category-title-right {\ndisplay: flex;\nalign-items: center;\njustify-content: flex-end;\ngap: 8px;\n}\n.flows-category-count {\nfont-size: 12px;\nwidth: 20px;\nheight: 20px;\nborder-radius: 50%;\nbackground-color: #CF313B;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\n}\n.flows-category-count.empty {\n  background-color: #007A41;\n}\n.flows-category-toggle {\nwidth: 16px;\nheight: 16px;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\ncursor: pointer;\n}\n.flows-category-issues {\noverflow: hidden;\ndisplay: flex;\nflex-direction: column;\nalign-items: stretch;\njustify-content: center;\ntransition: height 0.3s ease;\n}\n.flows-category-issues.collapsed {\n  height: 0px;\n}\n`).appendTo("head")}),e?6e3:0)}open(){$("#flows").addClass("visible")}close(){this.removeAllHighlightedBrokenLinks(),this.toggleAllPersistentHighlights(!1),$("#flows").removeClass("visible")}openCategory(e){$(`[data-category="${e}"] .flows-category-issues`).removeClass("collapsed"),$(`[data-category="${e}"] .flows-category-toggle > svg`).css("transform","rotate(180deg)")}closeCategory(e){$(`[data-category="${e}"] .flows-category-issues`).addClass("collapsed"),$(`[data-category="${e}"] .flows-category-toggle > svg`).css("transform","rotate(0deg)")}toggleCategory(e){$(`[data-category="${e}"] .flows-category-issues`).hasClass("collapsed")?$(`[data-category="${e}"] .flows-category-toggle > svg`).css("transform","rotate(0deg)"):$(`[data-category="${e}"] .flows-category-toggle > svg`).css("transform","rotate(180deg)"),$(`[data-category="${e}"] .flows-category-issues`).toggleClass("collapsed")}getIssue(e){return this.issues.find((t=>t.id===e))}getCategoryByType(e){return Object.keys(this.categories).find((t=>this.categories[t].includes(e)))||"Other"}updateCategoriesCount(){clearTimeout(this.updateCategoriesCountTimeout);const e=this,t=[];Object.keys(this.categories).forEach((n=>{const i=e.issues.filter((t=>e.categories[n].includes(t.type))).length,s=$(`[data-category="${n}"]`).find(".flows-category-count");s.text(i),0===i?s.addClass("empty"):s.removeClass("empty"),t.push({category:n,count:i})})),this.reorderCategories&&(t.sort(((e,t)=>t.count-e.count)),this.updateCategoriesCountTimeout=setTimeout((()=>{t.forEach((e=>{const t=$(`[data-category="${e.category}"]`);$("#flows-issues-list").append(t)}))}),1e3))}addBrokenLink(e,t){let n=$(e).text().replace(/\n/g,"");""!==n&&null!=n||(n="Empty element");const i=this.getIssueIdentifier(e,t);$(e).attr("data-page-issue",`${i}`),this.addIssue(n,t,$(e)[0])}addIssue(e,t,n,i){let s;s=i||this.getIssueIdentifier(n,t),this.issueStates[s]||(this.issueStates[s]={removed:!1,highlighted:!1}),"imageAltText"!==t&&"imageSize"!==t&&"loremIpsum"!==t||($(n).attr("data-page-issue")?s=$(n).attr("data-page-issue"):$(n).attr("data-page-issue",`${s}`)),this.issueStates[s].removed||(this.issues.push({id:s,text:e,type:t,element:n}),this.#n(e,t,s)),this.issueStates[s].highlighted&&(this.clickedHighlights[s]=!1),this.saveIssueStates(),this.updateIssueCount(),this.updateCategoriesCount()}removeIssue(e,t){if(t&&!this.confirmedRemove){if(!window.confirm("Are you sure you want to ignore this issue? Issues can be restored by clicking on Refresh"))return;this.confirmedRemove=!0,localStorage.setItem("flowsConfirmedRemove","true")}this.issueStates[e].removed=!0,this.highlightBrokenLink(e,!1),this.saveIssueStates(),this.issues=this.issues.filter((t=>t.id!==e)),$(`[data-issue-id="${e}"]`).remove(),this.updateIssueCount(),this.updateCategoriesCount()}removeAllIssues(){this.issues=[],$(".flows-category-issues").empty(),this.updateIssueCount(),this.updateCategoriesCount()}reloadIssues(){this.removeAllIssues(),this.runChecks()}refreshStoredIssues(){window.confirm("Do you really want to refresh the issues? This will clear all the issues that were ignored.")&&(this.removeAllIssues(),this.clearLocalIssueStates(),this.runChecks())}setIgnoreFinsweetAttributes(e){this.ignoreFinsweetAttributes=e,localStorage.setItem("flowsIgnoreFinsweetAttributes",e),this.reloadIssues()}setIgnoreCtaAttributes(e){this.ignoreCtaAttributes=e,localStorage.setItem("flowsIgnoreCtatAttributes",e),this.reloadIssues()}setIgnoreInteractionElements(e){this.ignoreInteractionElements=e,localStorage.setItem("flowsIgnoreInteractionElements",e),this.reloadIssues()}setIgnoreRefokusShareElements(e){this.ignoreRefokusShareElements=e,localStorage.setItem("flowsIgnoreRefokusShareElements",e),this.reloadIssues()}setIgnoreLightboxElements(e){this.ignoreLightboxElements=e,localStorage.setItem("flowsIgnoreLightboxElements",e),this.reloadIssues()}highlightBrokenLink(e,t){if(t){this.issueStates[e].highlighted=!0,this.saveIssueStates();var n=$(`[data-issue-id="${e}"]`),i=$(`[data-page-issue="${e}"]`);$(n).attr("data-issue-highlighted","true"),n.find(".flows-item-icon").addClass("active"),$(i).css("border","2px solid red").css("background-color","rgba(255, 0, 0, 0.4)")}else{this.issueStates[e].highlighted=!1,this.saveIssueStates();n=$(`[data-issue-id="${e}"]`),i=$(`[data-page-issue="${e}"]`);$(n).attr("data-issue-highlighted","false"),n.find(".flows-item-icon").removeClass("active"),$(i).css("border","").css("background-color","")}}toggleAllPersistentHighlights(e){this.allPersistentHighlights=void 0===e?!this.allPersistentHighlights:e,this.issues.forEach((e=>{"brokenLink"!==e.type&&"missingLink"!==e.type&&"loremIpsum"!==e.type||(this.highlightBrokenLink(e.id,this.allPersistentHighlights),this.clickedHighlights[e.id]=this.allPersistentHighlights)})),this.allPersistentHighlights?($(".flows-highlight-icon").show(),$(".flows-no-highlight-icon").hide()):($(".flows-highlight-icon").hide(),$(".flows-no-highlight-icon").show())}removeAllHighlightedBrokenLinks(){this.issues.forEach((e=>{this.highlightBrokenLink(e.id,!1)})),this.clickedHighlights={}}updateIssueCount(){$("#flows-fab-count").text(this.issues.length)}checkForLoremIpsum(){if(document.body.innerText.toLowerCase().includes("lorem ipsum")){this.findElementsContainingText("lorem ipsum").forEach(((e,t)=>{this.addIssue("Lorem Ipsum detected","loremIpsum",e,`loremIpsum-${t}`)}))}}findElementsContainingText(e){const t=[],n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:t=>t.nodeValue.toLowerCase().includes(e)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT},!1);let i;for(;i=n.nextNode();)t.push(i.parentNode);return t}checkImages(){document.querySelectorAll("img").forEach((e=>{let t=e.src,n=t.split("/").pop();n=n.length>15?n.slice(-15):n,""===n&&(n="Image"),e.alt||this.addIssue(n,"imageAltText",e),(t.endsWith(".png")||t.endsWith(".jpg")||t.endsWith(".jpeg"))&&fetch(t).then((t=>{parseInt(t.headers.get("Content-Length")||"0",10)>307200&&this.addIssue(n,"imageSize",e)})).catch((e=>{console.error("[Flow Scan] Error fetching image:",e)}))}))}checkMetaTags(){let e=$('meta[property="og:title"]').attr("content"),t=$('meta[name="description"]').attr("content"),n=$('meta[property="og:image"]').attr("content");e&&""!==e||this.addIssue("Missing meta title","meta",null,"meta-title"),t||this.addIssue("Missing meta description","meta",null,"meta-description"),n||this.addIssue("Missing Open Graph image","meta",null,"open-graph-image")}checkPageLinks(){const e="1"===new URLSearchParams(window.location.search).get("edit");let t=e?".w-editor-edit-fade-in ":"";$(e?t+"a:visible, "+t+"button:visible":t+"a, "+t+"button").filter(((e,t)=>{if($(t).attr("data-w-id")&&this.ignoreInteractionElements)return!1;for(let e=0;e<t.attributes.length;e++)if(this.ignoreFinsweetAttributes&&t.attributes[e].name.startsWith("fs")||this.ignoreCtaAttributes&&t.attributes[e].name.startsWith("cta")||this.ignoreRefokusShareElements&&t.attributes[e].name.startsWith("r-share")||this.ignoreLightboxElements&&t.classList.contains("w-lightbox"))return!1;return!0})).each(((e,t)=>{var n=$(t).attr("href");!n||"#"===n||n.startsWith("mailto:")||n.startsWith("tel:")||n.includes("webflow.io")?"#"===n||""===n?this.addBrokenLink(t,"missingLink"):n&&n.includes("webflow.io")&&this.addBrokenLink(t,"stagingLink"):fetch(n,{method:"HEAD",mode:"no-cors"}).then((e=>{e.ok||403===e.status||0===e.status||this.addBrokenLink(t,"brokenLink")})).catch((e=>{this.addBrokenLink(t,"brokenLink")}))}))}checkLanguageCode(){$("html").attr("lang")||this.addIssue("Missing language code","lang",null,"language-code")}checkSubdomainIndexing(){fetch("/robots.txt").then((e=>{if(!e.ok)throw new Error("Robots.txt not found");return e.text()})).then((e=>{"User-agent: *\nDisallow: /"!==e.trim()&&this.addIssue("Webflow subdomain indexing is enabled","stagingIndexing",null,"webflow-subdomain-indexing")})).catch((e=>{console.error("[Flow Scan] Error checking Webflow subdomain indexing:",e)}))}#n(e,t,n){let i="",s="",o=e.length>25?e.substring(0,25)+"...":e,l=this.issueStates[n].highlighted,a=$(`[data-page-issue="${n}"]`),r='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M7.79293 7.49998L5.64648 9.64642L6.35359 10.3535L8.50004 8.20708L10.6465 10.3535L11.3536 9.64642L9.20714 7.49998L11.3536 5.35353L10.6465 4.64642L8.50004 6.79287L6.35359 4.64642L5.64648 5.35353L7.79293 7.49998Z" fill="#F5F5F5"/>\n        <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z" fill="#F5F5F5"/>\n        </svg>\n        ';switch(t){case"missingLink":i=r,s=`${o} is missing link`;break;case"brokenLink":i=r,s=`${o} link is broken`;break;case"stagingLink":i=r,s=`${o} links to the staging domain`;break;case"meta":i=r,s=o;break;case"imageAltText":i=r,s=`${o} is missing alt text`;break;case"imageSize":i=r,s=`${o} is over 300KB`;break;case"loremIpsum":i=r,s="Lorem Ipsum detected";break;case"stagingIndexing":i=r,s="Webflow subdomain indexing is enabled";break;case"lang":i=r,s="Language code is not set"}let c=`\n    <div class="flows-item" data-issue-id="${n}" data-issue-type="${t}" data-issue-highlighted="${l}">\n      <div class="flows-item-title">\n        <span>${s}</span>\n      </div>\n      <div class="flows-item-icon">\n        ${i}\n      </div> \n      ${"imageAltText"===t||"imageSize"===t?`<div class="flows-item-image-preview"><img src='${$(a).attr("src")}' alt="Image Preview"></div>`:""}\n    </div>`;const g=this.getCategoryByType(t);$(`[data-category="${g}"] .flows-category-issues`).append(c);const d=$(`[data-issue-id="${n}"]`);function h(e,t){const n=e.clientX,i=e.clientY,s=t.outerWidth();let o=i-t.outerHeight()-5,l=n+5;o<0&&(o=i+5),l+s>$(window).width()&&(l=n-s-5),t.css({top:o+"px",left:l+"px"})}d.find(".flows-item-icon").on("click",(()=>{this.removeIssue(n,!0)})),"imageAltText"!==t&&"imageSize"!==t||(d.on("mouseenter",".flows-item-title",(function(e){const t=$(this).siblings(".flows-item-image-preview");t.show(),h(e,t)})),d.on("mousemove",".flows-item-title",(function(e){h(e,$(this).siblings(".flows-item-image-preview"))})),d.on("mouseleave",".flows-item-title",(function(){$(this).siblings(".flows-item-image-preview").hide()})))}#t(){return $(".w-editor-bem-EditorMainMenu").outerHeight()||0}#i(e){var t='<div id="flows">\n        <div class=\'flows-title-bar\'>\n          <div class=\'flows-title\'>\n            <div class=\'flows-icon\'>\n              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path d="M32.8136 10.2789C32.499 10.2789 32.1974 10.1539 31.9749 9.93151C31.7525 9.70908 31.6275 9.4074 31.6275 9.09283V4.34855C31.6267 3.82454 31.4182 3.32222 31.0476 2.95168C30.6771 2.58114 30.1748 2.37261 29.6508 2.37177H24.9065C24.5919 2.37177 24.2902 2.24681 24.0678 2.02438C23.8454 1.80195 23.7204 1.50027 23.7204 1.1857C23.7204 0.871138 23.8454 0.569457 24.0678 0.347025C24.2902 0.124594 24.5919 -0.000366211 24.9065 -0.000366211H29.6508C30.8039 0.000471529 31.9096 0.458929 32.725 1.27433C33.5404 2.08973 33.9988 3.19541 33.9997 4.34855V9.09283C33.9997 9.4074 33.8747 9.70908 33.6523 9.93151C33.4299 10.1539 33.1282 10.2789 32.8136 10.2789ZM1.18509 10.2789C0.870528 10.2789 0.568846 10.1539 0.346415 9.93151C0.123984 9.70908 -0.000976562 9.4074 -0.000976562 9.09283V4.34855C-0.000138823 3.19541 0.458319 2.08973 1.27372 1.27433C2.08912 0.458929 3.1948 0.000471529 4.34794 -0.000366211H9.09222C9.40679 -0.000366211 9.70847 0.124594 9.9309 0.347025C10.1533 0.569457 10.2783 0.871138 10.2783 1.1857C10.2783 1.50027 10.1533 1.80195 9.9309 2.02438C9.70847 2.24681 9.40679 2.37177 9.09222 2.37177H4.34794C3.82393 2.37261 3.32161 2.58114 2.95107 2.95168C2.58053 3.32222 2.372 3.82454 2.37116 4.34855V9.09283C2.37116 9.4074 2.2462 9.70908 2.02377 9.93151C1.80134 10.1539 1.49966 10.2789 1.18509 10.2789ZM9.09222 34.0003H4.34794C3.1948 33.9994 2.08912 33.541 1.27372 32.7256C0.458319 31.9102 -0.000138823 30.8045 -0.000976562 29.6514V24.9071C-0.000976562 24.5925 0.123984 24.2908 0.346415 24.0684C0.568846 23.846 0.870528 23.721 1.18509 23.721C1.49966 23.721 1.80134 23.846 2.02377 24.0684C2.2462 24.2908 2.37116 24.5925 2.37116 24.9071V29.6514C2.372 30.1754 2.58053 30.6777 2.95107 31.0482C3.32161 31.4188 3.82393 31.6273 4.34794 31.6281H9.09222C9.40679 31.6281 9.70847 31.7531 9.9309 31.9755C10.1533 32.198 10.2783 32.4996 10.2783 32.8142C10.2783 33.1288 10.1533 33.4305 9.9309 33.6529C9.70847 33.8753 9.40679 34.0003 9.09222 34.0003ZM29.6508 34.0003H24.9065C24.5919 34.0003 24.2902 33.8753 24.0678 33.6529C23.8454 33.4305 23.7204 33.1288 23.7204 32.8142C23.7204 32.4996 23.8454 32.198 24.0678 31.9755C24.2902 31.7531 24.5919 31.6281 24.9065 31.6281H29.6508C30.1748 31.6273 30.6771 31.4188 31.0476 31.0482C31.4182 30.6777 31.6267 30.1754 31.6275 29.6514V24.9071C31.6275 24.5925 31.7525 24.2908 31.9749 24.0684C32.1974 23.846 32.499 23.721 32.8136 23.721C33.1282 23.721 33.4299 23.846 33.6523 24.0684C33.8747 24.2908 33.9997 24.5925 33.9997 24.9071V29.6514C33.9988 30.8045 33.5404 31.9102 32.725 32.7256C31.9096 33.541 30.8039 33.9994 29.6508 34.0003Z" fill="#6A65FD"/>\n              <path d="M20 28H14V23.2857H20V28ZM19.25 20.1429H14.75L14 6H20L19.25 20.1429Z" fill="#676CF8"/>\n              </svg>\n            </div>\n            <span>\n            Flow Scan\n            </span>\n          </div>\n          <div class=\'flows-title-icons\'>\n            <div class=\'flows-title-icon\' id="flows-highlight-all">\n              <svg class="flows-highlight-icon" style="display: none;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path d="M7.99988 9.5C8.82831 9.5 9.49988 8.82843 9.49988 8C9.49988 7.17157 8.82831 6.5 7.99988 6.5C7.17145 6.5 6.49988 7.17157 6.49988 8C6.49988 8.82843 7.17145 9.5 7.99988 9.5Z" fill="#BDBDBD"/>\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99992 4C5.37585 4 3.11601 5.55492 2.08952 7.79148C2.02875 7.92388 2.02875 8.07621 2.08952 8.20861C3.11603 10.4451 5.37585 12 7.99988 12C10.624 12 12.8838 10.4451 13.9103 8.20852C13.9711 8.07612 13.9711 7.92379 13.9103 7.79139C12.8838 5.55488 10.624 4 7.99992 4ZM7.99988 11C5.86334 11 4.01036 9.78173 3.09949 8.00004C4.01035 6.21831 5.86335 5 7.99992 5C10.1365 5 11.9894 6.21827 12.9003 7.99996C11.9895 9.78169 10.1365 11 7.99988 11Z" fill="#BDBDBD"/>\n              </svg>\n              <svg class="flows-no-highlight-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.705 11.4122L13.6465 14.3536L14.3536 13.6465L2.35359 1.64648L1.64648 2.35359L4.38813 5.09524C3.39358 5.76124 2.59323 6.69436 2.08968 7.79152C2.02891 7.92392 2.02891 8.07624 2.08968 8.20865C3.11619 10.4452 5.37601 12 8.00004 12C8.96543 12 9.88153 11.7896 10.705 11.4122ZM9.94077 10.6479L5.11155 5.81865C4.25768 6.3466 3.55891 7.10172 3.09965 8.00007C4.01052 9.78177 5.8635 11 8.00004 11C8.68311 11 9.33719 10.8755 9.94077 10.6479Z" fill="#BDBDBD"/>\n              <path d="M13.9104 8.20856C13.5777 8.93353 13.1154 9.58688 12.5531 10.1389L11.8461 9.43184C12.2703 9.01685 12.6276 8.5337 12.9005 8C11.9896 6.21831 10.1366 5.00004 8.00008 5.00004C7.81177 5.00004 7.62565 5.0095 7.4422 5.02798L6.5717 4.15749C7.0313 4.05443 7.50932 4.00004 8.00008 4.00004C10.6241 4.00004 12.8839 5.55491 13.9104 7.79143C13.9712 7.92383 13.9712 8.07616 13.9104 8.20856Z" fill="#BDBDBD"/>\n              </svg>\n            </div>\n            <div class=\'flows-title-icon\' id="flows-close">\n              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70714 8.00001L12.3536 4.35356L11.6465 3.64645L8.00004 7.2929L4.35359 3.64645L3.64648 4.35356L7.29293 8.00001L3.64648 11.6465L4.35359 12.3536L8.00004 8.70711L11.6465 12.3536L12.3536 11.6465L8.70714 8.00001Z" fill="#BDBDBD"/>\n              </svg>\n            </div>\n          </div>\n        </div>\n        <div id=\'flows-issues-list\'>\n        </div>\n        <div class="flows-bottom-bar">\n          <a href="https://curio-digital.canny.io/flow-scan-feature-requests" target="_blank">Request a Feature</a>\n          <a id="flows-refresh">Refresh</a>\n        </div>\n      </div>';e?$(".w-editor-edit-fade-in").append(t):$("body").append(t)}#s(e){let t=`\n    <div id="flows-fab" class="active">\n      <div class="flows-fab-icon">\n        <svg width="32" height="32" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M32.8136 10.2789C32.499 10.2789 32.1974 10.1539 31.9749 9.93151C31.7525 9.70908 31.6275 9.4074 31.6275 9.09283V4.34855C31.6267 3.82454 31.4182 3.32222 31.0476 2.95168C30.6771 2.58114 30.1748 2.37261 29.6508 2.37177H24.9065C24.5919 2.37177 24.2902 2.24681 24.0678 2.02438C23.8454 1.80195 23.7204 1.50027 23.7204 1.1857C23.7204 0.871138 23.8454 0.569457 24.0678 0.347025C24.2902 0.124594 24.5919 -0.000366211 24.9065 -0.000366211H29.6508C30.8039 0.000471529 31.9096 0.458929 32.725 1.27433C33.5404 2.08973 33.9988 3.19541 33.9997 4.34855V9.09283C33.9997 9.4074 33.8747 9.70908 33.6523 9.93151C33.4299 10.1539 33.1282 10.2789 32.8136 10.2789ZM1.18509 10.2789C0.870528 10.2789 0.568846 10.1539 0.346415 9.93151C0.123984 9.70908 -0.000976562 9.4074 -0.000976562 9.09283V4.34855C-0.000138823 3.19541 0.458319 2.08973 1.27372 1.27433C2.08912 0.458929 3.1948 0.000471529 4.34794 -0.000366211H9.09222C9.40679 -0.000366211 9.70847 0.124594 9.9309 0.347025C10.1533 0.569457 10.2783 0.871138 10.2783 1.1857C10.2783 1.50027 10.1533 1.80195 9.9309 2.02438C9.70847 2.24681 9.40679 2.37177 9.09222 2.37177H4.34794C3.82393 2.37261 3.32161 2.58114 2.95107 2.95168C2.58053 3.32222 2.372 3.82454 2.37116 4.34855V9.09283C2.37116 9.4074 2.2462 9.70908 2.02377 9.93151C1.80134 10.1539 1.49966 10.2789 1.18509 10.2789ZM9.09222 34.0003H4.34794C3.1948 33.9994 2.08912 33.541 1.27372 32.7256C0.458319 31.9102 -0.000138823 30.8045 -0.000976562 29.6514V24.9071C-0.000976562 24.5925 0.123984 24.2908 0.346415 24.0684C0.568846 23.846 0.870528 23.721 1.18509 23.721C1.49966 23.721 1.80134 23.846 2.02377 24.0684C2.2462 24.2908 2.37116 24.5925 2.37116 24.9071V29.6514C2.372 30.1754 2.58053 30.6777 2.95107 31.0482C3.32161 31.4188 3.82393 31.6273 4.34794 31.6281H9.09222C9.40679 31.6281 9.70847 31.7531 9.9309 31.9755C10.1533 32.198 10.2783 32.4996 10.2783 32.8142C10.2783 33.1288 10.1533 33.4305 9.9309 33.6529C9.70847 33.8753 9.40679 34.0003 9.09222 34.0003ZM29.6508 34.0003H24.9065C24.5919 34.0003 24.2902 33.8753 24.0678 33.6529C23.8454 33.4305 23.7204 33.1288 23.7204 32.8142C23.7204 32.4996 23.8454 32.198 24.0678 31.9755C24.2902 31.7531 24.5919 31.6281 24.9065 31.6281H29.6508C30.1748 31.6273 30.6771 31.4188 31.0476 31.0482C31.4182 30.6777 31.6267 30.1754 31.6275 29.6514V24.9071C31.6275 24.5925 31.7525 24.2908 31.9749 24.0684C32.1974 23.846 32.499 23.721 32.8136 23.721C33.1282 23.721 33.4299 23.846 33.6523 24.0684C33.8747 24.2908 33.9997 24.5925 33.9997 24.9071V29.6514C33.9988 30.8045 33.5404 31.9102 32.725 32.7256C31.9096 33.541 30.8039 33.9994 29.6508 34.0003Z" fill="#6A65FD"/>\n        <path d="M20 28H14V23.2857H20V28ZM19.25 20.1429H14.75L14 6H20L19.25 20.1429Z" fill="#676CF8"/>\n        </svg>\n      </div>\n      <div id="flows-fab-count">\n        ${this.issues.length}\n      </div>\n    </div>`;e?$(".w-editor-edit-fade-in").append(t):$("body").append(t)}runChecks(){this.checkImages(),this.checkMetaTags(),this.checkPageLinks(),this.checkForLoremIpsum(),this.checkSubdomainIndexing(),this.checkLanguageCode()}#o(){const e=this;Object.keys(this.categories).forEach((e=>{let t=`\n      <div class="flows-category" data-category="${e}">\n        <div class="flows-category-title-bar">\n          <span>${e}</span>\n          <div class="flows-category-title-right">\n            <div class="flows-category-count empty">0</div>\n            <div class="flows-category-toggle">\n              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99996 9.79293L11.6464 6.14648L12.3535 6.85359L7.99996 11.2071L3.64641 6.85359L4.35352 6.14648L7.99996 9.79293Z" fill="#F5F5F5"/>\n              </svg>\n            </div>\n          </div>\n        </div>\n        <div class="flows-category-issues">\n        </div>\n      </div>\n      `;$("#flows-issues-list").append(t)})),$(document).on("click",".flows-category-title-bar",(function(){let t=$(this).parent().data("category");e.toggleCategory(t)}))}#l(){const e=this;$(document).on("click",".flows-item-title",(function(){const t=$(this).parent().data("issue-id"),n=$(this).parent().data("issue-type");if("imageAltText"!==n&&"imageSize"!==n&&"brokenLink"!==n&&"missingLink"!==n&&"meta"!==n&&"stagingLink"!==n&&"loremIpsum"!==n||$("html, body").animate({scrollTop:$(`[data-page-issue=${t}]`).offset().top-window.innerHeight/2},500),"brokenLink"===n||"missingLink"===n||"stagingLink"===n||"loremIpsum"===n){e.allPersistentHighlights&&e.toggleAllPersistentHighlights();const n=!e.clickedHighlights[t];e.removeAllHighlightedBrokenLinks(),e.clickedHighlights[t]=n,e.highlightBrokenLink(t,n)}})),$(document).on("mouseenter",".flows-item-title",(function(){const t=$(this).parent().data("issue-id"),n=$(this).parent().data("issue-type");"brokenLink"!==n&&"missingLink"!==n&&"stagingLink"!==n&&"loremIpsum"!==n||(e.hoveredIssue=t,e.clickedHighlights[t]||e.highlightBrokenLink(t,!0))})),$(document).on("mouseleave",".flows-item-title",(function(){const t=$(this).parent().data("issue-id"),n=$(this).parent().data("issue-type");"brokenLink"!==n&&"missingLink"!==n&&"stagingLink"!==n&&"loremIpsum"!==n||(e.hoveredIssue=null,e.clickedHighlights[t]||e.highlightBrokenLink(t,!1))})),$(document).on("click","#flows-refresh",(function(){e.refreshStoredIssues()})),$(document).on("click","#flows-highlight-all",(function(){e.toggleAllPersistentHighlights()})),$(document).on("click","#flows-close",(function(){e.removeAllHighlightedBrokenLinks(),e.toggleAllPersistentHighlights(!1),$("#flows").toggleClass("visible")})),$(document).on("click","#flows-fab",(function(){e.removeAllHighlightedBrokenLinks(),e.toggleAllPersistentHighlights(!1),$("#flows").toggleClass("visible")}))}init(){console.info("Flow Scan v1.0.6");const e="1"===new URLSearchParams(window.location.search).get("edit"),t=e?6e3:0;e&&console.info("Flow Scan is running in Editor mode. Waiting for 6 seconds to load.");const n=new URLSearchParams(window.location.search).get("flowscan");if("0"===n)return console.info("Flow Scan is disabled."),void localStorage.setItem("flows","0");"1"===n?(console.info("Flow Scan is enabled on all page loads."),localStorage.setItem("flows","1")):"2"===n&&(console.info("Flow Scan is enabled and running only once. Write flowsInstance.init() to run again."),localStorage.setItem("flows","0")),n||"0"!==localStorage.getItem("flows")?(n||"2"!==localStorage.getItem("flows")?n||"1"!==localStorage.getItem("flows")||console.info("Flow Scan is enabled on all page loads."):(console.info("Flow Scan is enabled and running only once. Write flowsInstance.init() to run again."),localStorage.setItem("flows","0")),n||localStorage.getItem("flows")||(console.info("Flow Scan is enabled on all page loads."),localStorage.setItem("flows","1")),setTimeout((()=>{this.#i(e),this.#s(e),this.#o(),this.runChecks(),this.#l(),this.#e()}),t)):console.info("Flow Scan is disabled.")}}var flowScan;$(document).ready((function(){(flowScan=new FlowScan).init()}));