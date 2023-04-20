// ==UserScript==
// @name         nyaa.si tag color
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       家豪
// @match        https://nyaa.si/*
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
      a.parentNode.appendChild(span);
    }
  });

  function checkQuality(str) {
    const quality = ["1080", "720", "480"];

    str = str.toLowerCase();

    const has = (str, q) => {
      return str.includes(`${q}p`) || str.includes(`x${q}`);
    };

    for (let i = 0; i < quality.length; i++) {
      const q = quality[i];

      if ( has(str, q) ) {
        return q + "p";
      }
    }
  }
})();
