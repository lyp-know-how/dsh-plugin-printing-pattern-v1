window.__ModuleLoader__.load({
  id: '@local/yinran-pattern-assistant',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useRef, useState } = React;

    const NS = 'yinran-pattern-assistant';
    const KEY = 'yinran-pattern-assistant';
    const API = '/yinran-assistant/generate';
    const TOKEN_META = 'yinran-pattern-token';

    const NEED_EXAMPLES = ['法式复古碎花', '新中式水墨', '美式复古格纹', '日系小碎花'];
    const FABRIC_EXAMPLES = ['真丝', '涤纶', '棉麻', '针织'];

    const ZH = {
      'nav.label': '印染花型防坑助手',
      'page.eyebrow': '东莞印花一线经验 · 设计 × 工艺',
      'page.title': '印染花型防坑助手',
      'page.subtitle': '客户要感觉，大货要落地。先出 Prompt，再排版权雷，最后过工艺关。',
      'page.badgeValue': '15Y',
      'page.badgeLabel': '一线经验',
      'form.needLabel': '客户需求',
      'form.needPlaceholder': '例如：法式复古碎花，低饱和，适合春夏连衣裙',
      'form.needHint': '风格、花型大小、使用场景、颜色偏好，写得越具体越好。',
      'form.fabricLabel': '面料材质',
      'form.fabricPlaceholder': '例如：真丝 / 涤纶 / 棉麻 / 针织',
      'form.fabricHint': '成分和克重越明确，工艺排雷越准。',
      'form.needError': '请先填写客户需求，至少 2 个字。',
      'form.fabricError': '请先填写面料材质，至少 2 个字。',
      'form.submit': '生成方案',
      'form.loading': '正在排雷…',
      'form.loadingTitle': '正在按四个维度生成',
      'form.loadingHint': '通常需要 10–30 秒，请不要关闭页面。',
      'form.shortcut': 'Ctrl / ⌘ + Enter 快速生成',
      'form.examplesNeed': '快速填入',
      'form.examplesFabric': '常用面料',
      'empty.title': '一次生成，四个维度',
      'empty.subtitle': '不只有一张图的方向，还有版权和工艺兜底。',
      'dimension.prompt.title': 'AI 生图 Prompt',
      'dimension.prompt.desc': '中英双语，可直接粘贴到 Midjourney',
      'dimension.copyright.title': '版权防雷',
      'dimension.copyright.desc': '强制风险提示 + 2 条具体改图建议',
      'dimension.process.title': '工艺可行性',
      'dimension.process.desc': '按面料判断印花方式与量产风险',
      'dimension.delivery.title': '交付话术',
      'dimension.delivery.desc': '可直接发给客户的初稿说明',
      'result.eyebrow': 'AI 初稿 · 待打样确认',
      'result.copyAll': '复制全部',
      'result.copied': '已复制',
      'result.copy': '复制',
      'result.regenerate': '再生成一版',
      'result.promptEnLabel': 'Midjourney · English',
      'result.promptZhLabel': '中文释义',
      'result.fabricTag': '面料',
      'result.modelTag': '模型',
      'result.riskBadge': '必看',
      'result.processHint': '第一条先看面料，其余看花型与上机条件。',
      'result.deliveryHint': '可直接复制发给客户',
      'result.warningFallback': '工艺提醒',
      'result.suggestionFallback': '改图建议',
      'result.disclaimer': 'AI 初稿仅供打样参考。版权与工艺结论需结合实物打样、对色和法务检索确认。',
      'result.modelLine': '本方案由',
      'error.title': '生成失败',
      'error.retry': '重试',
      'error.generic': '生成失败，请稍后重试。',
      'error.INVALID_INPUT': '输入不完整，请检查客户需求和面料材质。',
      'error.BUSY': '当前生成任务较多，请等几秒再试。',
      'error.NO_MODEL': '还没有可用的默认模型，请先在设置里配置模型。',
      'error.MODEL_ERROR': '模型调用失败，请检查网络或模型配置后重试。',
      'error.MODEL_TIMEOUT': '模型响应超时，请再生成一次。',
      'error.BAD_FORMAT': '模型返回格式异常，请再生成一次。',
      'error.BAD_ORIGIN': '请求来源校验失败，请从 DSH 页面内使用。',
      'error.UNAUTHORIZED': '页面授权已过期，请刷新 DSH 页面后再试。',
      'error.INVALID_METHOD': '请求方式不正确。',
      'error.BAD_CONTENT_TYPE': '请求格式不正确。',
      'error.BODY_TOO_LARGE': '输入内容过长，请精简后再试。',
      'error.INVALID_JSON': '请求格式不正确。',
      'error.INTERNAL': '助手内部出错，请稍后重试。',
    };

    const EN = {
      'nav.label': 'Pattern guard',
      'page.eyebrow': 'Dongguan print-floor experience · design × production',
      'page.title': 'Print pattern guard',
      'page.subtitle': 'Turn a client brief into something the mill can actually run: a prompt, a copyright check, and a production reality check.',
      'page.badgeValue': '15Y',
      'page.badgeLabel': 'on the floor',
      'form.needLabel': 'Client brief',
      'form.needPlaceholder': 'e.g. French vintage floral, low saturation, for a spring dress',
      'form.needHint': 'Be specific about style, scale, end use, and colour direction.',
      'form.fabricLabel': 'Fabric',
      'form.fabricPlaceholder': 'e.g. silk / polyester / cotton-linen / knit',
      'form.fabricHint': 'Fiber content and gsm make the production notes sharper.',
      'form.needError': 'Enter a client brief with at least 2 characters.',
      'form.fabricError': 'Enter a fabric with at least 2 characters.',
      'form.submit': 'Generate plan',
      'form.loading': 'Checking risks…',
      'form.loadingTitle': 'Building all four sections',
      'form.loadingHint': 'Usually 10–30 seconds. Please keep this page open.',
      'form.shortcut': 'Ctrl / ⌘ + Enter to generate',
      'form.examplesNeed': 'Try',
      'form.examplesFabric': 'Common fabrics',
      'empty.title': 'One brief, four checks',
      'empty.subtitle': 'Not just an image direction — copyright and production covered too.',
      'dimension.prompt.title': 'Image prompt',
      'dimension.prompt.desc': 'Bilingual, ready to paste into Midjourney',
      'dimension.copyright.title': 'Copyright check',
      'dimension.copyright.desc': 'Mandatory warning plus 2 concrete edits',
      'dimension.process.title': 'Production check',
      'dimension.process.desc': 'Print route and bulk risks for this fabric',
      'dimension.delivery.title': 'Client message',
      'dimension.delivery.desc': 'A draft message you can send as-is',
      'result.eyebrow': 'AI first draft · pending sample',
      'result.copyAll': 'Copy all',
      'result.copied': 'Copied',
      'result.copy': 'Copy',
      'result.regenerate': 'Generate another',
      'result.promptEnLabel': 'Midjourney · English',
      'result.promptZhLabel': 'Chinese meaning',
      'result.fabricTag': 'Fabric',
      'result.modelTag': 'Model',
      'result.riskBadge': 'Read this',
      'result.processHint': 'The first item is fabric-specific; the rest cover pattern and machine setup.',
      'result.deliveryHint': 'Ready to copy and send',
      'result.warningFallback': 'Production note',
      'result.suggestionFallback': 'Edit suggestion',
      'result.disclaimer': 'AI drafts are for sampling reference only. Copyright and production decisions still require physical sampling, shade matching, and legal review.',
      'result.modelLine': 'Generated with',
      'error.title': 'Generation failed',
      'error.retry': 'Try again',
      'error.generic': 'Generation failed. Please try again.',
      'error.INVALID_INPUT': 'The input is incomplete. Check the client brief and fabric.',
      'error.BUSY': 'Another generation is running. Try again in a few seconds.',
      'error.NO_MODEL': 'No default model is available. Configure one in Settings first.',
      'error.MODEL_ERROR': 'The model call failed. Check the network or model settings.',
      'error.MODEL_TIMEOUT': 'The model timed out. Generate again.',
      'error.BAD_FORMAT': 'The model returned an unexpected format. Generate again.',
      'error.BAD_ORIGIN': 'Request origin rejected. Use this from the DSH page.',
      'error.UNAUTHORIZED': 'This page authorization has expired. Refresh the DSH page and try again.',
      'error.INVALID_METHOD': 'Invalid request method.',
      'error.BAD_CONTENT_TYPE': 'Invalid request format.',
      'error.BODY_TOO_LARGE': 'The input is too long. Shorten it and try again.',
      'error.INVALID_JSON': 'Invalid request format.',
      'error.INTERNAL': 'The assistant hit an internal error. Try again later.',
    };

    const CSS = `
      .yr-root {
        min-height: 100%;
        overflow: auto;
        color: var(--dsw-alias-label-primary);
        background:
          radial-gradient(circle at 14% 0%, color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent), transparent 32%),
          var(--dsw-alias-bg-base);
        font-family: inherit;
      }
      .yr-root * { box-sizing: border-box; }
      .yr-shell {
        width: min(1080px, 100%);
        margin: 0 auto;
        padding: 34px 30px 52px;
      }
      .yr-hero {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 26px;
        padding: 26px 30px 28px;
        background:
          radial-gradient(circle at 88% 12%, color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent), transparent 30%),
          linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, var(--dsw-alias-bg-layer-1)), var(--dsw-alias-bg-layer-1) 64%);
      }
      .yr-hero::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .45;
        background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--dsw-alias-brand-primary) 20%, transparent) 1px, transparent 0);
        background-size: 15px 15px;
        mask-image: linear-gradient(100deg, transparent 42%, #000 100%);
      }
      .yr-heroTop {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .yr-eyebrow {
        color: var(--dsw-alias-brand-primary);
        font-size: 11px;
        line-height: 1.4;
        font-weight: 700;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .yr-badge {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        padding: 6px 11px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 28%, transparent);
        border-radius: 999px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent);
        color: var(--dsw-alias-label-secondary);
        white-space: nowrap;
      }
      .yr-badge strong {
        color: var(--dsw-alias-brand-primary);
        font-size: 17px;
        letter-spacing: .02em;
      }
      .yr-badge span { font-size: 11px; }
      .yr-title {
        position: relative;
        z-index: 1;
        margin: 18px 0 8px;
        font-family: Georgia, "Songti SC", "SimSun", serif;
        font-size: clamp(29px, 4.4vw, 44px);
        line-height: 1.15;
        letter-spacing: -.015em;
        font-weight: 700;
      }
      .yr-subtitle {
        position: relative;
        z-index: 1;
        max-width: 640px;
        margin: 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 14px;
        line-height: 1.75;
      }
      .yr-formCard {
        margin-top: 18px;
        padding: 20px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 20px;
        background: var(--dsw-alias-bg-layer-1);
        box-shadow: 0 16px 40px color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);
      }
      .yr-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }
      .yr-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
      .yr-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
      }
      .yr-label::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--dsw-alias-brand-primary);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);
      }
      .yr-input {
        width: 100%;
        min-height: 106px;
        resize: vertical;
        padding: 12px 13px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        outline: none;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font: inherit;
        font-size: 13.5px;
        line-height: 1.65;
        transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
      }
      .yr-input::placeholder { color: var(--dsw-alias-state-idle-primary); }
      .yr-input:hover { border-color: var(--dsw-alias-border-l2); }
      .yr-input:focus {
        border-color: var(--dsw-alias-brand-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 13%, transparent);
        background: var(--dsw-alias-bg-layer-1);
      }
      .yr-help { color: var(--dsw-alias-label-secondary); font-size: 11.5px; line-height: 1.5; }
      .yr-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 1px; }
      .yr-chipLabel { margin-right: 2px; color: var(--dsw-alias-state-idle-primary); font-size: 10.5px; }
      .yr-chip {
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        padding: 4px 9px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
        font: inherit;
        font-size: 11px;
        line-height: 1.3;
        transition: color .15s ease, border-color .15s ease, background .15s ease;
      }
      .yr-chip:hover {
        border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, var(--dsw-alias-border-l1));
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent);
        color: var(--dsw-alias-brand-primary);
      }
      .yr-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px dashed var(--dsw-alias-border-l1);
      }
      .yr-shortcut { color: var(--dsw-alias-state-idle-primary); font-size: 11px; }
      .yr-submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 152px;
        min-height: 42px;
        padding: 10px 18px;
        border: 0;
        border-radius: 12px;
        background: var(--dsw-alias-brand-primary);
        color: var(--dsw-alias-bg-base);
        box-shadow: 0 8px 20px color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, transparent);
        cursor: pointer;
        font: inherit;
        font-size: 13.5px;
        font-weight: 700;
        transition: transform .15s ease, filter .15s ease, opacity .15s ease;
      }
      .yr-submit:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.06); }
      .yr-submit:active:not(:disabled) { transform: translateY(0); }
      .yr-submit:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 3px; }
      .yr-submit:disabled { cursor: wait; opacity: .64; }
      .yr-spinner {
        width: 15px;
        height: 15px;
        border: 2px solid color-mix(in srgb, var(--dsw-alias-bg-base) 35%, transparent);
        border-top-color: var(--dsw-alias-bg-base);
        border-radius: 50%;
        animation: yrSpin .8s linear infinite;
      }
      .yr-error {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-top: 14px;
        padding: 13px 15px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 34%, transparent);
        border-radius: 13px;
        background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 9%, var(--dsw-alias-bg-layer-1));
        color: var(--dsw-alias-label-primary);
        font-size: 12.5px;
        line-height: 1.6;
      }
      .yr-error strong { display: block; margin-bottom: 2px; color: var(--dsw-alias-state-error-primary); font-size: 12px; }
      .yr-error svg { flex: 0 0 auto; margin-top: 2px; color: var(--dsw-alias-state-error-primary); }
      .yr-loading, .yr-empty {
        margin-top: 18px;
        padding: 24px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 20px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .yr-loading {
        display: flex;
        align-items: center;
        gap: 16px;
        min-height: 150px;
      }
      .yr-loadingOrb {
        position: relative;
        flex: 0 0 auto;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: 1px solid var(--dsw-alias-border-l1);
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);
        animation: yrPulse 1.8s ease-in-out infinite;
      }
      .yr-loadingOrb::before, .yr-loadingOrb::after {
        content: "";
        position: absolute;
        border-radius: 50%;
        background: var(--dsw-alias-brand-primary);
      }
      .yr-loadingOrb::before { width: 8px; height: 8px; top: 13px; left: 23px; box-shadow: 0 20px 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 52%, transparent); }
      .yr-loadingOrb::after { width: 8px; height: 8px; top: 23px; left: 13px; box-shadow: 20px 0 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 72%, transparent); }
      .yr-loading h3 { margin: 0 0 5px; font-size: 15px; }
      .yr-loading p { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12.5px; line-height: 1.6; }
      .yr-loadingLines { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 11px; }
      .yr-loadingLines span {
        height: 5px;
        border-radius: 99px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, var(--dsw-alias-bg-layer-2));
        animation: yrSweep 1.4s ease-in-out infinite;
      }
      .yr-loadingLines span:nth-child(1) { width: 66px; animation-delay: 0s; }
      .yr-loadingLines span:nth-child(2) { width: 96px; animation-delay: .12s; }
      .yr-loadingLines span:nth-child(3) { width: 78px; animation-delay: .24s; }
      .yr-loadingLines span:nth-child(4) { width: 112px; animation-delay: .36s; }
      .yr-emptyHead { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 15px; }
      .yr-emptyHead h3 { margin: 2px 0 0; font-size: 15px; }
      .yr-emptyHead p { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; }
      .yr-emptyGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .yr-emptyItem {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l1) 74%, transparent);
        border-radius: 13px;
        background: color-mix(in srgb, var(--dsw-alias-bg-base) 48%, transparent);
      }
      .yr-emptyNo {
        flex: 0 0 auto;
        width: 25px;
        height: 25px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);
        color: var(--dsw-alias-brand-primary);
        font-size: 10px;
        font-weight: 700;
      }
      .yr-emptyItem strong { display: block; font-size: 12.5px; line-height: 1.45; }
      .yr-emptyItem span { display: block; margin-top: 2px; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.5; }
      .yr-result { margin-top: 18px; animation: yrFade .3s ease both; }
      .yr-resultHead {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        padding: 8px 2px 14px;
      }
      .yr-resultHead h2 {
        margin: 5px 0 8px;
        font-family: Georgia, "Songti SC", "SimSun", serif;
        font-size: clamp(21px, 2.7vw, 29px);
        line-height: 1.3;
        letter-spacing: -.01em;
      }
      .yr-meta { display: flex; flex-wrap: wrap; gap: 6px 12px; color: var(--dsw-alias-label-secondary); font-size: 11px; }
      .yr-meta b { color: var(--dsw-alias-label-primary); font-weight: 600; }
      .yr-resultTools { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; padding-top: 8px; }
      .yr-ghostButton {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 33px;
        padding: 6px 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
        font: inherit;
        font-size: 11.5px;
        transition: border-color .15s ease, color .15s ease, background .15s ease;
      }
      .yr-ghostButton:hover { border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, var(--dsw-alias-border-l1)); color: var(--dsw-alias-brand-primary); }
      .yr-ghostButton:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .yr-resultGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
      .yr-card {
        position: relative;
        overflow: hidden;
        min-width: 0;
        padding: 18px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 17px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .yr-card::before {
        content: "";
        position: absolute;
        inset: 17px auto 17px 0;
        width: 3px;
        border-radius: 0 3px 3px 0;
        background: var(--dsw-alias-brand-primary);
        opacity: .8;
      }
      .yr-card--wide { grid-column: 1 / -1; }
      .yr-card--warning::before { background: var(--dsw-alias-state-warn-primary); }
      .yr-card--process::before { background: var(--dsw-alias-state-success-primary); }
      .yr-cardHead { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 13px; }
      .yr-cardIcon {
        flex: 0 0 auto;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, transparent);
        color: var(--dsw-alias-brand-primary);
      }
      .yr-card--warning .yr-cardIcon { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 10%, transparent); color: var(--dsw-alias-state-warn-primary); }
      .yr-card--process .yr-cardIcon { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent); color: var(--dsw-alias-state-success-primary); }
      .yr-cardHeadText { min-width: 0; flex: 1; }
      .yr-cardHead h3 { margin: 0; font-size: 13.5px; line-height: 1.4; }
      .yr-cardHead p { margin: 2px 0 0; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.45; }
      .yr-cardNo { flex: 0 0 auto; color: var(--dsw-alias-state-idle-primary); font-family: Georgia, serif; font-size: 11px; letter-spacing: .08em; }
      .yr-promptBox {
        padding: 13px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 12px;
        background: var(--dsw-alias-bg-base);
      }
      .yr-promptTop { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
      .yr-promptLabel { color: var(--dsw-alias-brand-primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
      .yr-mono {
        margin: 0;
        color: var(--dsw-alias-label-primary);
        font-family: "Cascadia Code", Consolas, "Courier New", monospace;
        font-size: 12px;
        line-height: 1.75;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        user-select: text;
      }
      .yr-copyButton {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        flex: 0 0 auto;
        padding: 4px 8px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 7px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
        font: inherit;
        font-size: 10.5px;
        transition: color .15s ease, border-color .15s ease, background .15s ease;
      }
      .yr-copyButton:hover { color: var(--dsw-alias-brand-primary); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 42%, var(--dsw-alias-border-l1)); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, transparent); }
      .yr-copyButton.is-copied { color: var(--dsw-alias-state-success-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, var(--dsw-alias-border-l1)); }
      .yr-promptZh {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--dsw-alias-border-l1);
      }
      .yr-promptZhLabel { display: block; margin-bottom: 5px; color: var(--dsw-alias-label-secondary); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .yr-promptZh p { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 1.7; }
      .yr-warning {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        padding: 12px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 26%, transparent);
        border-radius: 11px;
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 8%, transparent);
        color: var(--dsw-alias-label-primary);
        font-size: 12px;
        line-height: 1.68;
      }
      .yr-warning svg { flex: 0 0 auto; margin-top: 2px; color: var(--dsw-alias-state-warn-primary); }
      .yr-riskBadge {
        display: inline-flex;
        align-items: center;
        height: 18px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 14%, transparent);
        color: var(--dsw-alias-state-warn-primary);
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: .04em;
      }
      .yr-suggestions { margin: 12px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
      .yr-suggestions li { display: flex; gap: 9px; align-items: flex-start; }
      .yr-suggestionNo {
        flex: 0 0 auto;
        width: 19px;
        height: 19px;
        display: grid;
        place-items: center;
        margin-top: 1px;
        border-radius: 6px;
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-secondary);
        font-size: 9.5px;
        font-weight: 700;
      }
      .yr-suggestions p { margin: 0; font-size: 12px; line-height: 1.65; }
      .yr-processHint { margin: 0 0 10px; color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 1.55; }
      .yr-processList { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
      .yr-processList li { display: flex; gap: 9px; align-items: flex-start; }
      .yr-processNo {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        display: grid;
        place-items: center;
        margin-top: 1px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent);
        border-radius: 50%;
        color: var(--dsw-alias-state-success-primary);
        font-size: 9px;
        font-weight: 700;
      }
      .yr-processList strong { display: block; font-size: 12px; line-height: 1.5; }
      .yr-processList p { margin: 2px 0 0; color: var(--dsw-alias-label-secondary); font-size: 11.5px; line-height: 1.65; }
      .yr-pitch {
        position: relative;
        padding: 14px 15px 14px 38px;
        border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, transparent);
        border-radius: 12px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, transparent);
      }
      .yr-pitch svg { position: absolute; left: 13px; top: 14px; color: var(--dsw-alias-brand-primary); opacity: .7; }
      .yr-pitch p { margin: 0; color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.78; }
      .yr-pitchFooter { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; }
      .yr-pitchHint { color: var(--dsw-alias-label-secondary); font-size: 10.5px; }
      .yr-disclaimer {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin: 14px 2px 0;
        color: var(--dsw-alias-state-idle-primary);
        font-size: 10.5px;
        line-height: 1.6;
      }
      .yr-disclaimer svg { flex: 0 0 auto; margin-top: 1px; }
      @keyframes yrSpin { to { transform: rotate(360deg); } }
      @keyframes yrFade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes yrPulse { 0%, 100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.04); opacity: 1; } }
      @keyframes yrSweep { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
      @media (max-width: 820px) {
        .yr-shell { padding: 22px 18px 40px; }
        .yr-hero { padding: 22px 20px; border-radius: 20px; }
        .yr-grid, .yr-emptyGrid, .yr-resultGrid { grid-template-columns: 1fr; }
        .yr-card--wide { grid-column: auto; }
        .yr-resultHead { flex-direction: column; gap: 4px; }
        .yr-resultTools { justify-content: flex-start; padding-top: 2px; }
        .yr-actions { align-items: stretch; flex-direction: column; }
        .yr-submit { width: 100%; }
        .yr-shortcut { text-align: center; }
      }
      @media (prefers-reduced-motion: reduce) {
        .yr-result, .yr-loadingOrb, .yr-loadingLines span, .yr-spinner { animation: none; }
        .yr-submit { transition: none; }
      }
    `;

    function IconSpark(props) {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor',
        'aria-hidden': true, ...props,
      }, h('path', { d: 'M12 2.6l1.95 6.25 6.25 1.95-6.25 1.95L12 19l-1.95-6.25L3.8 10.8l6.25-1.95L12 2.6Z' }));
    }

    function IconCopy() {
      return h('svg', {
        width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }),
      h('path', { d: 'M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1' }));
    }

    function IconCheck() {
      return h('svg', {
        width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      }, h('path', { d: 'm5 12 4 4L19 6' }));
    }

    function IconAlert() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('path', { d: 'M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z' }),
      h('path', { d: 'M12 9v4' }),
      h('path', { d: 'M12 17h.01' }));
    }

    function IconShield() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('path', { d: 'M12 3 19 6v5.2c0 4.3-2.9 7.9-7 9.4-4.1-1.5-7-5.1-7-9.4V6l7-3Z' }),
      h('path', { d: 'm9.1 11.6 2 2 3.8-4' }));
    }

    function IconLoom() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }),
      h('path', { d: 'M7 4v16M11 4v16M15 4v16M19 4v5M3 9h16M3 13h16M3 17h16' }));
    }

    function IconPen() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('path', { d: 'M12 20h9' }),
      h('path', { d: 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z' }));
    }

    function IconQuote() {
      return h('svg', {
        width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor',
        'aria-hidden': true,
      },
      h('path', { d: 'M9.6 5.5C6 7.2 3.9 10 3.9 13.8c0 3 1.6 4.9 4 4.9 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.2-3.4-.4 0-.8 0-1 .1.3-1.7 1.8-3.4 3.9-4.4L9.6 5.5Zm9.2 0c-3.6 1.7-5.7 4.5-5.7 8.3 0 3 1.6 4.9 4 4.9 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.2-3.4-.4 0-.8 0-1 .1.3-1.7 1.8-3.4 3.9-4.4l-1.7-1.9Z' }));
    }

    function CopyButton(props) {
      const copied = props.copied;
      return h('button', {
        type: 'button',
        className: `yr-copyButton${copied ? ' is-copied' : ''}`,
        onClick: props.onCopy,
        'aria-label': copied ? props.copiedLabel : props.label,
      },
      copied ? h(IconCheck) : h(IconCopy),
      h('span', null, copied ? props.copiedLabel : props.label));
    }

    function SectionHead(props) {
      return h('div', { className: 'yr-cardHead' },
        h('div', { className: 'yr-cardIcon' }, props.icon),
        h('div', { className: 'yr-cardHeadText' },
          h('h3', null, props.title),
          h('p', null, props.desc)),
        h('span', { className: 'yr-cardNo' }, props.no));
    }

    function EmptyState(props) {
      const items = [
        ['01', props.t('dimension.prompt.title'), props.t('dimension.prompt.desc')],
        ['02', props.t('dimension.copyright.title'), props.t('dimension.copyright.desc')],
        ['03', props.t('dimension.process.title'), props.t('dimension.process.desc')],
        ['04', props.t('dimension.delivery.title'), props.t('dimension.delivery.desc')],
      ];
      return h('section', { className: 'yr-empty', 'aria-label': props.t('empty.title') },
        h('div', { className: 'yr-emptyHead' },
          h('div', null,
            h('div', { className: 'yr-eyebrow' }, props.t('empty.subtitle')),
            h('h3', null, props.t('empty.title'))),
          h(IconSpark, { style: { color: 'var(--dsw-alias-brand-primary)' } })),
        h('div', { className: 'yr-emptyGrid' },
          items.map(([no, title, desc]) => h('div', { className: 'yr-emptyItem', key: no },
            h('span', { className: 'yr-emptyNo' }, no),
            h('div', null,
              h('strong', null, title),
              h('span', null, desc))))));
    }

    function LoadingState(props) {
      return h('section', { className: 'yr-loading', 'aria-live': 'polite', 'aria-busy': 'true' },
        h('div', { className: 'yr-loadingOrb', 'aria-hidden': 'true' }),
        h('div', null,
          h('h3', null, props.t('form.loadingTitle')),
          h('p', null, props.t('form.loadingHint')),
          h('div', { className: 'yr-loadingLines', 'aria-hidden': 'true' },
            h('span'), h('span'), h('span'), h('span'))));
    }

    function readPageToken() {
      if (typeof document === 'undefined') return '';
      const meta = document.querySelector(`meta[name="${TOKEN_META}"]`);
      return meta && typeof meta.content === 'string' ? meta.content : '';
    }

    function normalizePlan(raw, need, fabric) {
      const source = raw && typeof raw === 'object' ? raw : {};
      const strings = (value) => Array.isArray(value)
        ? value.map((item) => typeof item === 'string' ? item.trim() : '').filter(Boolean)
        : [];
      const warnings = Array.isArray(source.processWarnings)
        ? source.processWarnings.map((item, index) => {
            if (typeof item === 'string') return { title: '', detail: item.trim() };
            if (item && typeof item === 'object') {
              return {
                title: typeof item.title === 'string' ? item.title.trim() : '',
                detail: typeof item.detail === 'string' ? item.detail.trim() : '',
              };
            }
            return { title: '', detail: '' };
          }).filter((item) => item.title || item.detail)
        : [];
      const suggestions = strings(source.copyrightSuggestions).slice(0, 2);
      return {
        title: typeof source.title === 'string' && source.title.trim() ? source.title.trim() : `${need} · ${fabric}`,
        promptEn: typeof source.promptEn === 'string' ? source.promptEn.trim() : '',
        promptZh: typeof source.promptZh === 'string' ? source.promptZh.trim() : '',
        copyrightWarning: typeof source.copyrightWarning === 'string' ? source.copyrightWarning.trim() : '',
        copyrightSuggestions: suggestions,
        processWarnings: warnings,
        deliveryPitch: typeof source.deliveryPitch === 'string' ? source.deliveryPitch.trim() : '',
        need,
        fabric,
      };
    }

    function AssistantPage(props) {
      const t = props.tr || props.t || ((key) => key);
      const [need, setNeed] = useState('');
      const [fabric, setFabric] = useState('');
      const [status, setStatus] = useState('idle');
      const [errorCode, setErrorCode] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
      const [plan, setPlan] = useState(null);
      const [meta, setMeta] = useState(null);
      const [copiedKey, setCopiedKey] = useState('');
      const formRef = useRef(null);
      const resultRef = useRef(null);
      const abortRef = useRef(null);
      const timerRef = useRef(null);
      const mountedRef = useRef(true);

      useEffect(() => {
        mountedRef.current = true;
        return () => {
          mountedRef.current = false;
          if (abortRef.current) abortRef.current.abort();
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, []);

      useEffect(() => {
        if (plan && resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, [plan]);

      const errorText = (code, fallback) => {
        const key = `error.${code}`;
        const value = t(key);
        return value === key ? (fallback || t('error.generic')) : value;
      };

      const copyText = async (text, key) => {
        if (!text) return;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            document.body.removeChild(area);
          }
        } catch {
          return;
        }
        setCopiedKey(key);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (mountedRef.current) setCopiedKey('');
        }, 1600);
      };

      const submit = async (event) => {
        if (event) event.preventDefault();
        if (status === 'loading') return;
        const cleanNeed = need.trim();
        const cleanFabric = fabric.trim();
        if (cleanNeed.length < 2) {
          setStatus('error');
          setErrorCode('INVALID_INPUT');
          setErrorMessage(t('form.needError'));
          return;
        }
        if (cleanFabric.length < 2) {
          setStatus('error');
          setErrorCode('INVALID_INPUT');
          setErrorMessage(t('form.fabricError'));
          return;
        }

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setStatus('loading');
        setPlan(null);
        setMeta(null);
        setErrorCode('');
        setErrorMessage('');

        try {
          const response = await fetch(API, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'x-yinran-token': readPageToken(),
            },
            body: JSON.stringify({ customerNeed: cleanNeed, fabric: cleanFabric }),
            signal: controller.signal,
          });
          let payload = null;
          try {
            payload = await response.json();
          } catch {
            payload = null;
          }
          if (!response.ok || !payload || payload.ok !== true) {
            const code = payload && payload.error && payload.error.code ? payload.error.code : 'INTERNAL';
            throw new Error(errorText(code, payload && payload.error && payload.error.message));
          }
          if (!mountedRef.current) return;
          setPlan(normalizePlan(payload.data, cleanNeed, cleanFabric));
          setMeta(payload.meta || null);
          setStatus('done');
        } catch (error) {
          if (!mountedRef.current || error.name === 'AbortError') return;
          setStatus('error');
          setErrorCode('INTERNAL');
          setErrorMessage(error.message || t('error.generic'));
        } finally {
          abortRef.current = null;
        }
      };

      const onKeyDown = (event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          if (formRef.current) formRef.current.requestSubmit();
        }
      };

      const allText = plan ? [
        `【${t('dimension.prompt.title')}】`,
        `${t('result.promptEnLabel')}:`,
        plan.promptEn,
        '',
        `${t('result.promptZhLabel')}:`,
        plan.promptZh,
        '',
        `【${t('dimension.copyright.title')}】`,
        plan.copyrightWarning,
        ...plan.copyrightSuggestions.map((item, index) => `${index + 1}. ${item}`),
        '',
        `【${t('dimension.process.title')}】`,
        ...plan.processWarnings.map((item, index) => `${index + 1}. ${item.title}${item.title ? '：' : ''}${item.detail}`),
        '',
        `【${t('dimension.delivery.title')}】`,
        plan.deliveryPitch,
        '',
        t('result.disclaimer'),
      ].join('\n') : '';

      const busy = status === 'loading';

      return h('div', { className: 'yr-root' },
        h('style', null, CSS),
        h('main', { className: 'yr-shell' },
          h('header', { className: 'yr-hero' },
            h('div', { className: 'yr-heroTop' },
              h('div', { className: 'yr-eyebrow' }, t('page.eyebrow')),
              h('div', { className: 'yr-badge', title: t('page.badgeLabel') },
                h('strong', null, t('page.badgeValue')),
                h('span', null, t('page.badgeLabel')))),
            h('h1', { className: 'yr-title' }, t('page.title')),
            h('p', { className: 'yr-subtitle' }, t('page.subtitle'))),

          h('form', { className: 'yr-formCard', ref: formRef, onSubmit: submit, 'aria-busy': busy ? 'true' : 'false' },
            h('div', { className: 'yr-grid' },
              h('div', { className: 'yr-field' },
                h('label', { className: 'yr-label', htmlFor: 'yr-customer-need' }, t('form.needLabel')),
                h('textarea', {
                  id: 'yr-customer-need',
                  className: 'yr-input',
                  value: need,
                  maxLength: 300,
                  rows: 3,
                  placeholder: t('form.needPlaceholder'),
                  onChange: (event) => setNeed(event.target.value),
                  onKeyDown,
                  disabled: busy,
                }),
                h('span', { className: 'yr-help' }, t('form.needHint')),
                h('div', { className: 'yr-chips' },
                  h('span', { className: 'yr-chipLabel' }, t('form.examplesNeed')),
                  NEED_EXAMPLES.map((value) => h('button', {
                    key: value, type: 'button', className: 'yr-chip',
                    onClick: () => setNeed(value), disabled: busy,
                  }, value)))),
              h('div', { className: 'yr-field' },
                h('label', { className: 'yr-label', htmlFor: 'yr-fabric' }, t('form.fabricLabel')),
                h('textarea', {
                  id: 'yr-fabric',
                  className: 'yr-input',
                  value: fabric,
                  maxLength: 300,
                  rows: 3,
                  placeholder: t('form.fabricPlaceholder'),
                  onChange: (event) => setFabric(event.target.value),
                  onKeyDown,
                  disabled: busy,
                }),
                h('span', { className: 'yr-help' }, t('form.fabricHint')),
                h('div', { className: 'yr-chips' },
                  h('span', { className: 'yr-chipLabel' }, t('form.examplesFabric')),
                  FABRIC_EXAMPLES.map((value) => h('button', {
                    key: value, type: 'button', className: 'yr-chip',
                    onClick: () => setFabric(value), disabled: busy,
                  }, value))))),
            h('div', { className: 'yr-actions' },
              h('span', { className: 'yr-shortcut' }, t('form.shortcut')),
              h('button', { type: 'submit', className: 'yr-submit', disabled: busy },
                busy ? h('span', { className: 'yr-spinner', 'aria-hidden': 'true' }) : h(IconSpark),
                h('span', null, busy ? t('form.loading') : t('form.submit'))))),

          status === 'error' ? h('div', { className: 'yr-error', role: 'alert' },
            h(IconAlert),
            h('div', null,
              h('strong', null, t('error.title')),
              h('span', null, errorMessage || errorText(errorCode)))) : null,

          busy ? h(LoadingState, { t }) : null,
          !busy && !plan && status !== 'error' ? h(EmptyState, { t }) : null,

          plan ? h('section', { className: 'yr-result', ref: resultRef, 'aria-live': 'polite' },
            h('div', { className: 'yr-resultHead' },
              h('div', null,
                h('div', { className: 'yr-eyebrow' }, t('result.eyebrow')),
                h('h2', null, plan.title),
                h('div', { className: 'yr-meta' },
                  h('span', null, h('b', null, t('result.fabricTag')), ` ${plan.fabric}`),
                  meta && meta.model ? h('span', null, h('b', null, t('result.modelTag')), ` ${meta.model}`) : null)),
              h('div', { className: 'yr-resultTools' },
                h('button', {
                  type: 'button',
                  className: 'yr-ghostButton',
                  onClick: () => copyText(allText, 'all'),
                },
                copiedKey === 'all' ? h(IconCheck) : h(IconCopy),
                h('span', null, copiedKey === 'all' ? t('result.copied') : t('result.copyAll'))),
                h('button', {
                  type: 'button',
                  className: 'yr-ghostButton',
                  onClick: submit,
                  disabled: busy,
                },
                h(IconSpark),
                h('span', null, t('result.regenerate'))))),

            h('div', { className: 'yr-resultGrid' },
              h('article', { className: 'yr-card yr-card--wide' },
                h(SectionHead, {
                  no: '01', icon: h(IconSpark), title: t('dimension.prompt.title'), desc: t('dimension.prompt.desc'),
                }),
                h('div', { className: 'yr-promptBox' },
                  h('div', { className: 'yr-promptTop' },
                    h('span', { className: 'yr-promptLabel' }, t('result.promptEnLabel')),
                    h(CopyButton, {
                      copied: copiedKey === 'promptEn',
                      label: t('result.copy'),
                      copiedLabel: t('result.copied'),
                      onCopy: () => copyText(plan.promptEn, 'promptEn'),
                    })),
                  h('p', { className: 'yr-mono' }, plan.promptEn),
                  h('div', { className: 'yr-promptZh' },
                    h('span', { className: 'yr-promptZhLabel' }, t('result.promptZhLabel')),
                    h('p', null, plan.promptZh)))),

              h('article', { className: 'yr-card yr-card--warning' },
                h(SectionHead, {
                  no: '02', icon: h(IconShield), title: t('dimension.copyright.title'), desc: t('dimension.copyright.desc'),
                }),
                h('div', { className: 'yr-warning' },
                  h(IconAlert),
                  h('div', null,
                    h('span', { className: 'yr-riskBadge' }, t('result.riskBadge')),
                    h('p', { style: { margin: '6px 0 0' } }, plan.copyrightWarning))),
                h('ul', { className: 'yr-suggestions' },
                  plan.copyrightSuggestions.map((item, index) => h('li', { key: index },
                    h('span', { className: 'yr-suggestionNo' }, `0${index + 1}`),
                    h('p', null, item))))),

              h('article', { className: 'yr-card yr-card--process' },
                h(SectionHead, {
                  no: '03', icon: h(IconLoom), title: t('dimension.process.title'), desc: t('dimension.process.desc'),
                }),
                h('p', { className: 'yr-processHint' }, t('result.processHint')),
                h('ol', { className: 'yr-processList' },
                  plan.processWarnings.map((item, index) => h('li', { key: index },
                    h('span', { className: 'yr-processNo' }, String(index + 1).padStart(2, '0')),
                    h('div', null,
                      item.title ? h('strong', null, item.title) : null,
                      h('p', null, item.detail)))))),
              h('article', { className: 'yr-card yr-card--wide' },
                h(SectionHead, {
                  no: '04', icon: h(IconPen), title: t('dimension.delivery.title'), desc: t('dimension.delivery.desc'),
                }),
                h('div', { className: 'yr-pitch' },
                  h(IconQuote),
                  h('p', null, plan.deliveryPitch)),
                h('div', { className: 'yr-pitchFooter' },
                  h('span', { className: 'yr-pitchHint' }, t('result.deliveryHint')),
                  h(CopyButton, {
                    copied: copiedKey === 'delivery',
                    label: t('result.copy'),
                    copiedLabel: t('result.copied'),
                    onCopy: () => copyText(plan.deliveryPitch, 'delivery'),
                  })))),

            h('p', { className: 'yr-disclaimer' },
              h(IconShield),
              h('span', null, t('result.disclaimer')))) : null));

    }

    function PanelIcon(props) {
      const size = props && Number.isFinite(props.size) ? props.size : 20;
      const active = props && props.active;
      const petals = [0, 72, 144, 216, 288].map((angle) => h('circle', {
        key: angle,
        cx: 12 + 3.1 * Math.cos((angle - 90) * Math.PI / 180),
        cy: 12 + 3.1 * Math.sin((angle - 90) * Math.PI / 180),
        r: 3.25,
        fill: 'currentColor',
        opacity: 0.34,
      }));
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        role: 'img',
        'aria-hidden': true,
        style: { display: 'block', opacity: active ? 1 : 0.82 },
      },
      ...petals,
      h('circle', { cx: 12, cy: 12, r: 2.4, fill: 'currentColor' }));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'zh', ZH));
        ctx.effect(() => ctx.locale.register(NS, 'en', EN));
        const t = ctx.locale.bind(NS);

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: KEY,
          order: 20,
          label: () => t('nav.label'),
        }, PanelIcon));

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: KEY,
          locale: NS,
          inject: () => ({ tr: t }),
        }, AssistantPage));
      },
    };
  },
});
