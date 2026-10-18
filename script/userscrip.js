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

  // selector to get the Meskanas convert button
  const convertBtnSelector =
    ".local_bfaltformat-button_span.local-bfaltformat-course-page-icon";
  const goServerUrl = "http://localhost:6767/request";

  runWhenReady(convertBtnSelector, main);

  function main() {
    const buttons = getConvertSpans();
    buttons.forEach((span) => {
      span.id = "";
      var clone = span.cloneNode(true);
      const parent = span.parentElement;
      parent.appendChild(clone);

      var button = clone.querySelector(
        ".btn.btn-link.local-bfaltformat-access-button.theme-meskanas.toggle-modal",
      );
      button.addEventListener("click", function () {
        onConvertButtonClicked(span);
      });
    });
  }

  function getConvertSpans() {
    const btn = document.querySelectorAll(convertBtnSelector);
    return Array.from(btn);
  }

  /**@param {Element} by*/
  async function onConvertButtonClicked(by) {
    if ((!by) instanceof Element) {
      return;
    }

    const parent = by.parentElement;
    const link = parent.firstElementChild;
    const href = link.href;
    const filename = href.replace(/^.*[\\/]/, "");

    const resp = await fetch(href, { method: "GET" });
    const blob = await resp.blob();

    var data = new FormData();
    data.append("file", blob, filename);

    // BUG: Firefox doesnt support targetAddressSpace. Request silently
    // fails without permissions for Local Network Access
    await fetch(goServerUrl, {
      method: "POST",
      body: data,
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
