/**
 * Host half of 印染花型防坑助手.
 *
 * One authenticated endpoint turns the two form fields into a model request
 * and returns the four-part plan. The Client half owns every visual concern.
 */

const ROUTE = '/yinran-assistant/generate';
const MAX_BODY_BYTES = 8 * 1024;
const MAX_FIELD_CHARS = 300;
const MAX_CONCURRENT_GENERATIONS = 2;
const GENERATION_TIMEOUT_MS = 90_000;

const SYSTEM_PROMPT = `你是“印染花型防坑助手”，一位在东莞虎门/中大布匹市场干了 15 年的资深印花设计师兼工艺工程师。
你既懂客户想要的“感觉”，也懂花稿上大货时会死在哪一步：分色、网目、渗化、缩水、色牢度、套色、后整理、对色，全都见过。
你的表达要像一个靠谱的老师傅：判断直接，理由具体，不堆术语，不吓唬人，也不打包票。

请只输出一个合法 JSON 对象，不要输出 Markdown 代码块，不要输出 JSON 以外的任何解释。所有字段都必须存在，所有字符串都用中文（promptEn 除外）：
{
  "title": "方案标题，12 字以内，带客户需求和面料特征",
  "promptEn": "可直接粘贴到 Midjourney 的英文提示词。必须包含 seamless pattern，写清花型风格、主色与辅色、构图密度、绘画媒介、面料/印花质感；不要出现品牌名、在世艺术家名或具体设计师名；末尾必须带 --tile --ar 3:4 --stylize 200",
  "promptZh": "对英文提示词的中文解释，说明风格、配色、构图和工艺质感，不要逐词硬翻",
  "copyrightWarning": "强制版权警告：AI 生成图案可能与他人在先作品实质相似，商用前必须做版权检索和原创化修改；不能承诺无侵权风险，责任由使用方承担",
  "copyrightSuggestions": ["第一条具体改图建议", "第二条具体改图建议"],
  "processWarnings": [
    { "title": "短标题，8 字以内", "detail": "针对这款面料的生产限制、印花方式、色牢度、缩水、渗化、套色或后整理风险，给出可执行判断" }
  ],
  "deliveryPitch": "一句可以直接发给客户的专业话术，说明这是初稿、上机需要对色，语气自然不老派"
}

硬性要求：
1. copyrightSuggestions 必须恰好 2 条，而且要具体到能改图：例如改变花瓣密度、替换主色调、重排花头方向、改变枝叶走向、加入原创肌理。不要写“注意版权”这种空话。
2. processWarnings 给 3 到 5 条，第一条必须直接针对输入的面料材质。要区分数码印花、圆网印花、平网印花、热转印等工艺的适用性；该面料容易出什么问题，就写什么。
3. 如果面料是真丝，重点看数码印花、酸性染料、色牢度、缩水率、渗化和蒸化水洗；如果是涤纶，重点看分散染料、热转印/直喷、升华迁移和高温定型；如果是棉麻，重点看前处理、活性染料、缩水和渗化；如果是针织，重点看张力、纬斜和拉伸；其他面料按真实工艺常识判断。
4. 不要声称你已经做过版权检索、没有侵权风险、或者保证大货颜色一次到位。相反，要明确“需检索/需打样/需对色”。
5. deliveryPitch 只写一句，不要分行，不要带“话术：”前缀，控制在 90 字以内。
6. promptEn 用英文，其余全部用简体中文。不要输出 null 或空数组。`;

class RequestError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
    this.status = status;
  }
}

function sendJson(res, status, payload) {
  if (res.writableEnded) return;
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  res.end(body);
}

function firstHeader(value) {
  return Array.isArray(value) ? value[0] : value;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let total = 0;
    let tooLarge = false;
    const chunks = [];
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });
    req.on('end', () => {
      resolve({ tooLarge, text: Buffer.concat(chunks).toString('utf8') });
    });
    req.on('error', reject);
  });
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseRequest(body) {
  const customerNeed = readString(body?.customerNeed);
  const fabric = readString(body?.fabric);
  if (customerNeed.length < 2) {
    throw new RequestError('INVALID_INPUT', 'customerNeed must contain at least 2 characters');
  }
  if (fabric.length < 2) {
    throw new RequestError('INVALID_INPUT', 'fabric must contain at least 2 characters');
  }
  if (customerNeed.length > MAX_FIELD_CHARS || fabric.length > MAX_FIELD_CHARS) {
    throw new RequestError('INVALID_INPUT', `each field must be at most ${MAX_FIELD_CHARS} characters`);
  }
  return { customerNeed, fabric };
}

function parseModelJson(text) {
  let cleaned = String(text).replace(/^\uFEFF/, '').trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new RequestError('BAD_FORMAT', 'model response did not contain a JSON object', 502);
  }
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    throw new RequestError('BAD_FORMAT', 'model response was not valid JSON', 502);
  }
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        const title = cleanString(item.title ?? item.point ?? item.risk);
        const detail = cleanString(item.detail ?? item.description ?? item.suggestion);
        if (title && detail) return { title, detail };
        if (detail) return { title: '', detail };
        if (title) return { title, detail: '' };
      }
      return '';
    })
    .filter(Boolean);
}

function fabricBaseline(fabric) {
  const value = fabric.toLowerCase();
  if (value.includes('真丝') || value.includes('桑蚕丝') || value.includes('silk')) {
    return {
      title: '真丝先按数码印花排',
      detail: '真丝轻薄、易渗化，常规大货优先数码印花；上机前要确认酸性染料适配、蒸化水洗条件、色牢度和缩水率，复杂渐变不要硬上圆网。',
    };
  }
  if (value.includes('涤纶') || value.includes('聚酯') || value.includes('polyester')) {
    return {
      title: '涤纶注意升华迁移',
      detail: '涤纶常用分散染料，热转印或数码直喷更稳；后道高温定型、压褶和复合前要确认染料升华迁移，深色大面积和浅色拼接尤其要留样。',
    };
  }
  if (value.includes('棉') || value.includes('麻') || value.includes('cotton') || value.includes('linen')) {
    return {
      title: '棉麻先做前处理',
      detail: '棉麻天然纤维批次差异大，前处理、毛效和缩水率会直接影响得色与花型尺寸；活性染料印花后要充分皂洗，深色和艳色先做色牢度打样。',
    };
  }
  if (value.includes('针织') || value.includes('knit')) {
    return {
      title: '针织防纬斜拉伸',
      detail: '针织上机张力控制不好会纬斜、花型变形；印花前确认坯布回缩和门幅稳定，轻薄弹力布优先低张力数码印花，圆网要评估拉伸对花。',
    };
  }
  if (value.includes('雪纺') || value.includes('chiffon')) {
    return {
      title: '雪纺防渗化糊边',
      detail: '雪纺轻薄透明，印花易渗化和糊边；数码印花需控制上浆量与墨滴，圆网要降低给浆量，后道水洗和定型张力要轻。',
    };
  }
  if (value.includes('羊毛') || value.includes('wool')) {
    return {
      title: '羊毛防缩绒变形',
      detail: '羊毛印花要关注酸性染料、蒸化固色和缩绒性；水温、机械作用和后整理张力都会改变花型尺寸，必须先小样确认手感与缩率。',
    };
  }
  return {
    title: `${fabric}先打小样再上大货`,
    detail: `不同成分和克重的${fabric}上机表现差异很大，先确认印花方式、前处理、缩水率、色牢度和后整理条件，再安排 1–2 米打样对色。`,
  };
}

function fabricFallbackPrompt(fabric) {
  const safeFabric = fabric.replace(/[\r\n]+/g, ' ').slice(0, 60);
  return `Seamless pattern for printed ${safeFabric} fabric, refined botanical floral motif, elegant French vintage mood, muted rose and sage palette, balanced half-drop repeat, fine hand-painted gouache texture, clean negative space, commercial textile print, no text --tile --ar 3:4 --stylize 200`;
}

function normalizePlan(raw, customerNeed, fabric) {
  const source = raw && typeof raw === 'object' ? raw : {};

  let promptEn = cleanString(source.promptEn ?? source.prompt ?? source.midjourneyPrompt);
  if (!promptEn) promptEn = fabricFallbackPrompt(fabric);
  if (!/seamless\s+pattern/i.test(promptEn)) promptEn = `Seamless pattern, ${promptEn}`;
  if (!/--tile\b/i.test(promptEn)) promptEn = `${promptEn} --tile`;
  if (!/--ar\s+\d+:\d+/i.test(promptEn)) promptEn = `${promptEn} --ar 3:4`;
  if (!/--stylize\s+\d+/i.test(promptEn)) promptEn = `${promptEn} --stylize 200`;

  const promptZh = cleanString(source.promptZh) ||
    `以「${customerNeed}」为方向的无缝印花图案：主花与辅花错落排布，留出呼吸感，配色克制，带手绘笔触和适合${fabric}的印花质感，可四方连续循环。`;

  const copyrightWarning = cleanString(source.copyrightWarning) ||
    'AI 生成图案可能与他人在先作品实质相似，不能直接视为原创。商用前请做版权检索并完成原创化修改，本工具不承诺无侵权风险，相关责任由使用方承担。';

  const suggestions = cleanList(source.copyrightSuggestions).filter((item) => typeof item === 'string');
  const defaults = [
    '改变花瓣密度和花头朝向：拉开主花间距、调整大小比例，避免与参考花稿形成相同的单位循环。',
    '替换主色调并重排枝叶走向：保留风格但换掉核心配色比例，把叶脉和枝干重新走线，加入原创肌理。',
  ];
  const copyrightSuggestions = suggestions.slice(0, 2);
  while (copyrightSuggestions.length < 2) {
    copyrightSuggestions.push(defaults[copyrightSuggestions.length]);
  }

  const warnings = cleanList(source.processWarnings)
    .map((item) => {
      if (typeof item === 'string') return { title: '工艺提醒', detail: item };
      return item;
    })
    .filter((item) => item && (item.title || item.detail))
    .slice(0, 5);

  const baseline = fabricBaseline(fabric);
  const fabricTokens = fabric
    .split(/[\s/、,，+＋&]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
  const fabricMentioned = fabricTokens.some((token) =>
    warnings.some((item) => `${item.title}${item.detail}`.includes(token)),
  );
  if (!fabricMentioned) warnings.unshift(baseline);
  if (warnings.length === 0) warnings.push(baseline);
  while (warnings.length < 3) {
    warnings.push({
      title: '上机前先打样',
      detail: '确认花回尺寸、分色、套色和网目后再上大货；深浅色拼接、复杂渐变和细线条要先看小样，避免大货返工。',
    });
  }

  const deliveryPitch = cleanString(source.deliveryPitch) ||
    `X总，这是按您说的「${customerNeed}」先做的${fabric}花型初稿，上机工艺我也同步排过了。您先看整体方向，确认后我们安排打样，最终大货颜色要上机对色，以对色样为准。`;

  const title = cleanString(source.title) || `「${customerNeed}」${fabric}印花方案`;

  return {
    title: title.slice(0, 40),
    promptEn,
    promptZh,
    copyrightWarning,
    copyrightSuggestions,
    processWarnings: warnings,
    deliveryPitch,
  };
}

async function generatePlan(ctx, selection, customerNeed, fabric) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
  let text = '';
  let finish;
  try {
    const options = {
      provider: selection.provider,
      model: selection.model,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `客户需求：${customerNeed}\n面料材质：${fabric}\n\n请严格按系统要求输出四维方案 JSON。`,
            },
          ],
        },
      ],
      temperature: 0.75,
      maxTokens: 3000,
      signal: controller.signal,
    };
    if (selection.reasoningEffort !== undefined) {
      options.reasoningEffort = selection.reasoningEffort;
    }

    for await (const chunk of ctx.llm.stream(options)) {
      if (chunk.type === 'text-delta') {
        text += chunk.text;
      } else if (chunk.type === 'finish') {
        finish = chunk.reason;
      }
    }
  } finally {
    clearTimeout(timer);
  }

  if (finish && (finish.kind === 'error' || finish.kind === 'aborted')) {
    const message = finish.failure?.message || 'model request failed';
    throw new RequestError(finish.kind === 'aborted' ? 'MODEL_TIMEOUT' : 'MODEL_ERROR', message, 502);
  }
  if (!text.trim()) {
    throw new RequestError('MODEL_ERROR', 'model returned an empty response', 502);
  }
  return normalizePlan(parseModelJson(text), customerNeed, fabric);
}

export const inject = ['webServer', 'llm', 'agentDefaultModel', 'connection'];

export function apply(ctx) {
  let inFlight = 0;

  const handle = async (req, res) => {
    try {
      const rejection = ctx.connection.requestRejection({ headers: req.headers });
      if (rejection !== undefined) {
        sendJson(res, rejection, {
          ok: false,
          error: {
            code: rejection === 401 ? 'UNAUTHORIZED' : 'BAD_ORIGIN',
            message: rejection === 401 ? 'DSH session authentication required' : 'request origin rejected',
          },
        });
        return;
      }
      if (req.method !== 'POST') {
        sendJson(res, 405, { ok: false, error: { code: 'INVALID_METHOD', message: 'POST required' } });
        return;
      }
      const contentType = firstHeader(req.headers['content-type']) || '';
      if (!contentType.toLowerCase().startsWith('application/json')) {
        sendJson(res, 415, { ok: false, error: { code: 'BAD_CONTENT_TYPE', message: 'application/json required' } });
        return;
      }
      if (inFlight >= MAX_CONCURRENT_GENERATIONS) {
        sendJson(res, 429, { ok: false, error: { code: 'BUSY', message: 'another generation is still running' } });
        return;
      }

      const raw = await readBody(req);
      if (raw.tooLarge) {
        sendJson(res, 413, { ok: false, error: { code: 'BODY_TOO_LARGE', message: 'request body is too large' } });
        return;
      }

      let body;
      try {
        body = JSON.parse(raw.text);
      } catch {
        sendJson(res, 400, { ok: false, error: { code: 'INVALID_JSON', message: 'request body must be valid JSON' } });
        return;
      }

      let input;
      try {
        input = parseRequest(body);
      } catch (error) {
        if (error instanceof RequestError) {
          sendJson(res, error.status, { ok: false, error: { code: error.code, message: error.message } });
          return;
        }
        throw error;
      }

      let selection;
      try {
        selection = ctx.agentDefaultModel.currentSelection();
      } catch (error) {
        console.error('[yinran-pattern-assistant] cannot read default model:', error);
        sendJson(res, 503, { ok: false, error: { code: 'NO_MODEL', message: 'no default model selection is available' } });
        return;
      }
      if (!selection?.provider || !selection?.model) {
        sendJson(res, 503, { ok: false, error: { code: 'NO_MODEL', message: 'no default model selection is available' } });
        return;
      }

      inFlight += 1;
      try {
        const data = await generatePlan(ctx, selection, input.customerNeed, input.fabric);
        sendJson(res, 200, {
          ok: true,
          data,
          meta: { provider: selection.provider, model: selection.model },
        });
      } catch (error) {
        if (error instanceof RequestError) {
          sendJson(res, error.status, { ok: false, error: { code: error.code, message: error.message } });
          return;
        }
        console.error('[yinran-pattern-assistant] generation failed:', error);
        sendJson(res, 502, { ok: false, error: { code: 'INTERNAL', message: 'generation failed' } });
      } finally {
        inFlight -= 1;
      }
    } catch (error) {
      console.error('[yinran-pattern-assistant] request failed:', error);
      sendJson(res, 500, { ok: false, error: { code: 'INTERNAL', message: 'request failed' } });
    }
  };

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: ROUTE,
      handler: handle,
    }),
  );
}
