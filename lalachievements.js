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

  // Function to capitalize the first letter of each word in a string following title capitalization rules
  function capitalizeTitle(string) {
    const exceptions = ["a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "with", "yet", "from"];

    return string
      .split(/(\s+|\(|\)|\/)/) // Split by spaces, opening and closing parentheses, and slashes
      .map((word, index, arr) => {
        if (word === "(" || word === ")" || word === "/") {
          return word;
        }
        if (index === 0 || arr[index - 1] === "(" || arr[index - 1].trim() === "/" || !exceptions.includes(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word.toLowerCase();
        }
      })
      .join("");
  }

  // Array of element class names to search and fix capitalization of
  const classNames = ["MountRow-Name", "CharProfileBox-List-Name", "TimelineRow-Text"];

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
        const capitalizedText = capitalizeTitle(originalText.toLowerCase());
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

  // Hide the badglobalerror div if it contains the phrase "ReferenceError: capitalizeWords is not defined"
  const badGlobalErrorDiv = document.getElementById("badglobalerror");
  if (badGlobalErrorDiv && badGlobalErrorDiv.textContent.includes("ReferenceError: capitalizeWords is not defined")) {
    badGlobalErrorDiv.style.display = "none";
  }
})();
