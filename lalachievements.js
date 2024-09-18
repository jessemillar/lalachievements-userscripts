// ==UserScript==
// @name         Lalachievements Tweaks
// @namespace    https://jessemillar.com
// @version      1.5
// @description  Capitalize names properly on Lalachievements, change account name to "Account" instead of first half of email, and update logo to something better
// @match        https://lalachievements.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to capitalize the first letter of each word in a string following title capitalization rules
  function capitalizeTitle(string) {
    const exceptions = ["a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "with", "yet", "from"];
    const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];

    return string
      .split(/(\s+|\(|\)|\/|／|:)/) // Split by spaces, opening and closing parentheses, regular slashes, full-width slashes, and colons
      .filter((word) => word !== "") // Remove empty strings from the array
      .map((word, index, arr) => {
        if (word === "(" || word === ")" || word === "/" || word === "／" || word === ":") {
          return word;
        }
        if (romanNumerals.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        if (index === 0 || arr[index - 1] === "(" || arr[index - 1] === "/" || arr[index - 1] === "／" || arr[index - 2] === ":" || !exceptions.includes(word.toLowerCase())) {
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

  // Change the inner text of elements with class PageNav-Text if preceded by a fontello-user icon to "Account"
  const pageNavTextElements = document.querySelectorAll(".PageNav-Text");
  pageNavTextElements.forEach((element) => {
    const parent = element.parentElement;
    if (parent && parent.querySelector("i.fontello-user")) {
      element.innerText = "Account";
    }
  });

  // document.querySelector(".PageHeaderName").style.display = "none";
  document.querySelector(".PageNav").style.left = "222px";
})();
