// ==UserScript==
// @name         LoveLive 票券座席本地预览编辑
// @namespace    https://github.com/yuuuiv/lovelive-edit-facepage
// @version      1.0.5
// @description  在本机临时预览自定义座席文字；刷新页面后自动恢复原状。
// @author       yuuuiv
// @license      MIT
// @match        https://lovelive.auth-thru-ticket.net/lovebgps/customer/ticket*
// @match        https://lovelive.auth-thru-ticket.net/lovebgps/customer/face_image*
// @downloadURL  https://raw.githubusercontent.com/yuuuiv/lovelive-edit-facepage/main/LoveLive%20%E7%A5%A8%E5%88%B8%E5%BA%A7%E5%B8%AD%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88%E7%BC%96%E8%BE%91-1.0.4.js
// @updateURL    https://raw.githubusercontent.com/yuuuiv/lovelive-edit-facepage/main/LoveLive%20%E7%A5%A8%E5%88%B8%E5%BA%A7%E5%B8%AD%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88%E7%BC%96%E8%BE%91-1.0.4.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const BUTTON_ID = 'local-seat-preview-button';
  const SELECTING_CLASS = 'local-seat-selecting';
  const MAX_TEXT_LENGTH = 120;

  if (document.getElementById(BUTTON_ID)) return;

  const style = document.createElement('style');
  style.textContent = `
    #${BUTTON_ID} {
      position: fixed;
      right: 14px;
      bottom: 20px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 16px;
      border: 0;
      border-radius: 999px;
      background: #222;
      color: #fff;
      font: 700 14px system-ui, -apple-system, sans-serif;
      box-shadow: 0 3px 12px rgba(0, 0, 0, .3);
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    #${BUTTON_ID} .btn-text { padding: 4px 0; }
    #${BUTTON_ID} .btn-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .15);
      color: #fff;
      font-size: 18px;
      line-height: 1;
      transition: background .2s;
    }
    #${BUTTON_ID} .btn-close:hover { background: rgba(255, 255, 255, .25); }
    #${BUTTON_ID} .btn-close:active { background: rgba(255, 255, 255, .35); }
    .${SELECTING_CLASS} {
      outline: 3px solid #1976d2 !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.type = 'button';
  button.setAttribute('aria-label', '编辑座席预览');
  button.innerHTML = '<span class="btn-text">编辑座席预览</span><span class="btn-close" aria-label="隐藏按钮" role="button">✕</span>';
  document.body.appendChild(button);

  const textSpan = button.querySelector('.btn-text');
  const closeSpan = button.querySelector('.btn-close');
  let selecting = false;
  let hoveredElement = null;

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

  function isButtonTarget(target) {
    return target instanceof Node && button.contains(target);
  }

  function stopSelecting() {
    selecting = false;
    hoveredElement?.classList.remove(SELECTING_CLASS);
    hoveredElement = null;
    document.removeEventListener('touchstart', selectTarget, true);
    document.removeEventListener('click', selectTarget, true);
    document.removeEventListener('pointerover', highlightTarget, true);
    textSpan.textContent = '编辑座席预览';
  }

  function editElement(target) {
    const originalText = target?.textContent.trim();
    if (!originalText || originalText.length > MAX_TEXT_LENGTH) {
      alert('选中的范围过大，请重新操作并直接点击座席番号文字。');
      return;
    }

    const customText = prompt('请输入本地预览文字：', originalText)?.trim();
    if (customText) target.textContent = customText;
  }

  function selectTarget(event) {
    if (!selecting) return;

    const touch = event.changedTouches?.[0];
    const rawTarget = touch
      ? document.elementFromPoint(touch.clientX, touch.clientY)
      : event.target;
    if (!(rawTarget instanceof Element) || isButtonTarget(rawTarget)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const target = getTextElement(rawTarget);
    stopSelecting();
    window.setTimeout(() => editElement(target), 50);
  }

  function highlightTarget(event) {
    if (!selecting || !(event.target instanceof Element) || isButtonTarget(event.target)) return;

    const target = getTextElement(event.target);
    if (hoveredElement === target) return;

    hoveredElement?.classList.remove(SELECTING_CLASS);
    hoveredElement = target;
    hoveredElement.classList.add(SELECTING_CLASS);
  }

  function startSelecting() {
    selecting = true;
    textSpan.textContent = '请点击座席文字';
    document.addEventListener('touchstart', selectTarget, true);
    document.addEventListener('click', selectTarget, true);
    document.addEventListener('pointerover', highlightTarget, true);
  }

  closeSpan.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    stopSelecting();
    button.style.display = 'none';
  });

  textSpan.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (selecting) stopSelecting();
    else startSelecting();
  });

  button.addEventListener('click', (event) => {
    if (event.target === button) textSpan.click();
  });
})();
