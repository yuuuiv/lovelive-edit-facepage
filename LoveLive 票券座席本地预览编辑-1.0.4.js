// ==UserScript==

// @name         LoveLive 票券座席本地预览编辑

// @namespace    local-ticket-preview

// @version      1.0.4

// @description  在本机临时预览自定义座席文字，刷新后恢复；点击 ✕ 可隐藏按钮

// @match        https://lovelive.auth-thru-ticket.net/lovebgps/customer/ticket*

// @match        https://lovelive.auth-thru-ticket.net/lovebgps/customer/face_image*

// @grant        none

// @run-at       document-idle

// ==/UserScript==

(() => {

  'use strict';

  const BUTTON_ID = 'local-seat-preview-button';

  const STYLE_ID = 'local-seat-preview-style';

  if (document.getElementById(BUTTON_ID)) return;

  const style = document.createElement('style');

  style.id = STYLE_ID;

  style.textContent = `

    #${BUTTON_ID} {

      position: fixed;

      right: 14px;

      bottom: 20px;

      z-index: 2147483647;

      padding: 6px 8px 6px 16px;

      border: 0;

      border-radius: 999px;

      background: #222;

      color: #fff;

      font-size: 14px;

      font-weight: 700;

      box-shadow: 0 3px 12px rgba(0,0,0,.3);

      cursor: pointer;

      user-select: none;

      -webkit-tap-highlight-color: transparent;

      display: flex;

      align-items: center;

      gap: 8px;

      font-family: system-ui, -apple-system, sans-serif;

    }

    #${BUTTON_ID} .btn-text {

      padding: 4px 0;

    }

    #${BUTTON_ID} .btn-close {

      display: flex;

      align-items: center;

      justify-content: center;

      width: 28px;

      height: 28px;

      border-radius: 50%;

      background: rgba(255,255,255,0.15);

      font-size: 18px;

      line-height: 1;

      transition: background 0.2s;

      color: #fff;

    }

    #${BUTTON_ID} .btn-close:hover {

      background: rgba(255,255,255,0.25);

    }

    #${BUTTON_ID} .btn-close:active {

      background: rgba(255,255,255,0.35);

    }

    .local-seat-selecting {

      outline: 3px solid #1976d2 !important;

      outline-offset: 2px !important;

    }

  `;

  document.head.appendChild(style);

  const button = document.createElement('button');

  button.id = BUTTON_ID;

  button.innerHTML = `

    <span class="btn-text">编辑座席预览</span>

    <span class="btn-close" aria-label="隐藏按钮">✕</span>

  `;

  document.body.appendChild(button);

  let selecting = false;

  let hovered = null;

  const textSpan = button.querySelector('.btn-text');

  const closeSpan = button.querySelector('.btn-close');

  // ---- 隐藏功能 ----

  function hideButton() {

    if (selecting) {

      stopSelecting();

    }

    button.style.display = 'none';

  }

  closeSpan.addEventListener('click', (e) => {

    e.preventDefault();

    e.stopPropagation();

    hideButton();

  });

  // ---- 座席编辑功能 ----

  function getTextElement(element) {

    let current = element;

    while (

      current &&

      current !== document.body &&

      current.children.length === 1 &&

      current.textContent.trim() === current.children[0].textContent.trim()

    ) {

      current = current.children[0];

    }

    return current;

  }

  function stopSelecting() {

    selecting = false;

    if (hovered) {

      hovered.classList.remove('local-seat-selecting');

      hovered = null;

    }

    document.removeEventListener('touchstart', selectTarget, true);

    document.removeEventListener('click', selectTarget, true);

    document.removeEventListener('pointerover', highlightTarget, true);

    textSpan.textContent = '编辑座席预览';

  }

  function editElement(target) {

    const originalText = target.textContent.trim();

    if (!originalText || originalText.length > 120) {

      alert('选中的范围过大，请重新操作并直接点击座席番号文字。');

      return;

    }

    const customText = prompt('请输入本地预览文字：', originalText);

    if (customText === null || !customText.trim()) return;

    target.textContent = customText.trim();

  }

  function selectTarget(event) {

    if (!selecting) return;

    const rawTarget =

      event.changedTouches?.[0]

        ? document.elementFromPoint(

            event.changedTouches[0].clientX,

            event.changedTouches[0].clientY

          )

        : event.target;

    if (!rawTarget || rawTarget === button || rawTarget === closeSpan) return;

    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();

    const target = getTextElement(rawTarget);

    stopSelecting();

    setTimeout(() => {

      editElement(target);

    }, 50);

  }

  function highlightTarget(event) {

    if (!selecting || !event.target || event.target === button || event.target === closeSpan) return;

    const target = getTextElement(event.target);

    if (hovered !== target) {

      hovered?.classList.remove('local-seat-selecting');

      hovered = target;

      hovered.classList.add('local-seat-selecting');

    }

  }

  // 点击文字区域（而非关闭图标）触发编辑模式

  textSpan.addEventListener('click', (event) => {

    event.preventDefault();

    event.stopPropagation();

    if (selecting) {

      stopSelecting();

      return;

    }

    selecting = true;

    textSpan.textContent = '请点击座席文字';

    document.addEventListener('touchstart', selectTarget, true);

    document.addEventListener('click', selectTarget, true);

    document.addEventListener('pointerover', highlightTarget, true);

  });

  // 按钮整体点击由文字部分处理，避免关闭图标误触

  button.addEventListener('click', (e) => {

    // 如果点击的是按钮本身（背景区域）或文字，但文字已有单独监听，所以这里不重复处理

    // 但以防万一，如果点击的是按钮空白区域，也触发文字点击逻辑

    if (e.target === button) {

      textSpan.click();

    }

  });

})();