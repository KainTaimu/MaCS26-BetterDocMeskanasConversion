// ==UserScript==
// @name         Better meskanas
// @namespace    http://tampermonkey.net/
// @version      2026-10-18
// @description  Provides a faster and more convenient document-to-pdf converter on Meskanas
// @author       Erwin Panergo
// @match        https://meskanas.macewan.ca/course/view.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=macewan.ca
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const iconSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning" viewBox="0 0 16 16">   <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1z"/> </svg>';

  // selector to get the Meskanas convert button
  const convertBtnSpanSelector =
    ".local_bfaltformat-button_span.local-bfaltformat-course-page-icon";
  const convertBtnSelector =
    ".btn.btn-link.local-bfaltformat-access-button.theme-meskanas.toggle-modal";
  const btnIconSelector = ".local-bfaltformat-access-icon.theme-meskanas.icon";

  const goServerUrl = "http://localhost:6767/request";

  // wait till the Meskanas buttons are ready
  runWhenReady(convertBtnSpanSelector, main);

  function main() {
    const buttons = getConvertSpans();
    buttons.forEach((span) => {
      span.id = "";
      const clone = span.cloneNode(true);
      const parent = span.parentElement;
      parent.appendChild(clone);

      const icon = clone.querySelector(btnIconSelector);

      // CREDIT: https://icons.getbootstrap.com/icons/lightning/
      const newIconDiv = document.createElement("div");
      newIconDiv.innerHTML = iconSvg;
      const newIcon = newIconDiv.firstElementChild;
      icon.replaceWith(newIcon);

      const button = clone.querySelector(convertBtnSelector);
      button.addEventListener("click", function () {
        onConvertButtonClicked(span);
      });
    });
  }

  // get the span parents of the Meskanas buttons
  function getConvertSpans() {
    const btn = document.querySelectorAll(convertBtnSpanSelector);
    return Array.from(btn);
  }

  /**@param {Element} by*/
  async function onConvertButtonClicked(by) {
    if ((!by) instanceof Element) {
      return;
    }

    // find the href to the file to convert
    const parent = by.parentElement;
    const link = parent.firstElementChild;
    const href = link.href;

    // download the file
    const resp = await fetch(href, { method: "GET" });
    const blob = await resp.blob();

    // CREDIT: https://stackoverflow.com/a/71195901
    // get filename
    const header = resp.headers.get("Content-Disposition");
    var filename = header.split(/;(.+)/)[1].split(/=(.+)/)[1];
    if (filename.toLowerCase().startsWith("utf-8''")) {
      filename = decodeURIComponent(filename.replace(/utf-8''/i, ""));
    } else {
      filename = filename.replace(/['"]/g, "");
    }

    var data = new FormData();
    data.append("file", blob, filename);

    // BUG: Firefox doesnt support targetAddressSpace. Request silently
    // fails when macewan.ca does not have permissions for Local Network
    // Access
    await fetch(goServerUrl, {
      method: "POST",
      body: data,
      targetAddressSpace: "local",
    });
  }

  // CREDIT: https://github.com/Tampermonkey/tampermonkey/issues/1279#issuecomment-875386821
  // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
  // Example: runWhenReady('.search-result', augmentSearchResults);
  // Gives up after 1 minute.
  function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function () {
      var elem = document.querySelector(readySelector);
      if (elem) {
        callback(elem);
      } else {
        numAttempts++;
        if (numAttempts >= 34) {
          console.warn(
            "Giving up after 34 attempts. Could not find: " + readySelector,
          );
        } else {
          setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
        }
      }
    };
    tryNow();
  }
})();
