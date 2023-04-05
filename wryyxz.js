// ==UserScript==
// @name         微软语音下载音频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       家豪
// @match        https://speech.microsoft.com/audiocontentcreation
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  "use strict";
  function 初始化() {
    const 按钮 = document.querySelector(".ms-OverflowSet-item.item-153");
    if (!按钮) return setTimeout(初始化, 1000);
    执行();
  }

  function 执行(){
    const 按钮 = document.createElement("button");
    按钮.textContent = "下载音频";
    const 节点 = document.querySelector(".ms-OverflowSet-item.item-153");
    节点.parentNode.appendChild(按钮);

    按钮.addEventListener("click", 处理按钮事件, false);
  }

  function 处理按钮事件(e){
    e.preventDefault();
    const SSML按钮 = document.querySelector("#Toggle48");
    let textarea = document.querySelector("textarea");
    if (!textarea) {
      SSML按钮.click();
      textarea = document.querySelector("textarea");
      console.log(textarea);
    }

    下载音频(textarea.textContent);
  }

  function 下载音频(ssml_str){
    const body = {
      ttsAudioFormat: "audio-24khz-160kbitrate-mono-mp3",
      ssml: ssml_str,
    };
    const url = "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak";
    GM_xmlhttpRequest({
      url: url,
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8,zh-TW;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        origin: "https://azure.microsoft.com",
        pragma: "no-cache",
        referer: "https://azure.microsoft.com/",
        "sec-ch-ua":
        '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      data: JSON.stringify(body),
      method: "POST",
      responseType: "blob",
      onload(res){
        console.log(res.response);
        const bUrl = URL.createObjectURL(res.response);
        const a = document.createElement('a');
        a.href = bUrl;
        a.download = String(Date.now()) + ".mp3";
        a.click();
        URL.revokeObjectURL(bUrl);
      },
    });
  }

  初始化();
})();
