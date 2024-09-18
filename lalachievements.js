// ==UserScript==
// @name         Capitalize Mount Names
// @namespace    https://jessemillar.com
// @version      1.5
// @description  Capitalize mount names in table cells and other elements
// @match        https://lalachievements.com/char/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to capitalize the first letter of each word in a string
  function capitalizeWords(string) {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Array of element class names to search and fix capitalization of
  const classNames = ["MountRow-Name", "CharProfileBox-List-Name"];

  // Function to capitalize text content of elements with specified class names
  function capitalizeElements() {
    // Temporarily disconnect the observer to avoid capturing mutations caused by this function
    observer.disconnect();

    classNames.forEach((className) => {
      // Select all elements with the specified class name
      const elements = document.querySelectorAll(`.${className}`);

      // Loop through each selected element
      elements.forEach((element) => {
        // Capitalize the inner text of the element
        const originalText = element.textContent;
        const capitalizedText = capitalizeWords(originalText.toLowerCase());
        // Replace the original text with the capitalized text
        element.textContent = capitalizedText;
      });
    });

    // Reconnect the observer after making changes
    observePageContent();
  }

  // Function to observe the PageContent div
  function observePageContent() {
    observer.observe(document.querySelector(".PageContent"), { childList: true, subtree: true });
  }

  // Mutation observer to watch for changes in the .PageContent element
  const observer = new MutationObserver(function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        capitalizeElements();
        break;
      }
    }
  });

  // Start observing the PageContent div
  observePageContent();
})();
