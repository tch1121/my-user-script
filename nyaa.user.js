// ==UserScript==
// @name         nyaa.si tag color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       家豪
// @match        https://nyaa.si/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  "use strict";
  GM_addStyle(`
  .torrent-list > tbody > tr > td { white-space: unset; }
  .color {
    border-radius: 10px;
    padding: 0 5px;
    margin-left: 5px;
    color: #fff;
  }
  ._1080p {
    background-color: #ff6800;
  }
  ._720p {
    background-color: #e800ff;
  }
  ._480p {
    background-color: #007eff;
  }
  `);

  const aList = document.querySelectorAll('a[href*="/view/"]');

  aList.forEach(a => {
    const q = checkQuality(a.textContent);
    if (q) {
      const span = document.createElement("span");
      span.textContent = q;
      span.className = `color _${q}`;
      a.appendChild(span);
    }
  });

  function checkQuality(str) {
    const quality = {
      "1080": (str, q) => {
        return str.includes(`${q}p`) || str.includes(`x${q}`);
      },
      "720": (str, q) => {
        return str.includes(`${q}p`) || str.includes(`x${q}`);
      },
      "480": (str, q) => {
        return str.includes(`${q}p`) || str.includes(`x${q}`);
      },
    };

    for (const q in quality) {
      if ( quality[q](str.toLowerCase(), q) ) {
        return q + "p";
      }
    }
  }
})();
