// ==UserScript==
// @name         微软语音下载音频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       家豪
// @match        https://speech.microsoft.com/audiocontentcreation
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// ==/UserScript==

(function() {
  "use strict";

  function init() {
    if ( !getDownloadButton() ) return setTimeout(init, 1000);

    run();
  }

  function getDownloadButton() {
    // 官方 "下载" 按钮
    return document.querySelector(".ms-OverflowSet-item");
  }

  function run(){
    const newBtn = document.createElement("button");

    newBtn.textContent = "下载音频";

    const btn = getDownloadButton();

    btn.parentNode.appendChild(newBtn);

    newBtn.addEventListener("click", handleButton, false);
  }

  function getTextarea(){
    return document.querySelector("textarea");
  }

  function handleButton(e){
    e.preventDefault();

    const SSML按钮 = document.querySelector("button[aria-checked]");

    let textarea = getTextarea();

    if (!textarea && SSML按钮) {
      // 开启SSML编辑
      SSML按钮.click();
      // 保存变量
      textarea = getTextarea();
      // 关闭SSML编辑
      SSML按钮.click();
    }

    if ( !textarea ) {
      console.log("不存在 textarea", textarea);
    } else {
      downloadAudio(textarea.textContent);
    }
  }

  async function downloadAudio(ssml_str){
    const body = {
      ttsAudioFormat: "audio-48khz-192kbitrate-mono-mp3",
      ssml: ssml_str,
    };

    const url = "https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak";

    try {
      const res = await fetch(url, {
        "headers": {
          "accept": "*/*",
          "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8,zh-TW;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          "customvoiceconnectionid": "f55c8700-d499-11ed-bd74-8b6e91e86a4e",
          "pragma": "no-cache",
        },
        "referrerPolicy": "no-referrer",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });

      if (res.status !== 200) throw { status: res.status };

      const blob = await res.blob();

      const bUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = bUrl;
      a.download = String(Date.now()) + ".mp3";
      a.click();

      URL.revokeObjectURL(bUrl);
    } catch(err) {
      console.log(err);
    }
  }

  init();
})();
