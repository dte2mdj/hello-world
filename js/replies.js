/* 无为山房 · 投烦恼回复库（独立维护）
 *
 * 本地：按关键词选题 + 开场/收尾随机组合，避免固定感。
 * AI：可选接入任意 OpenAI 兼容接口（密钥仅存本机）。
 */
(function () {
  const AI_KEYS = {
    enabled: "wuwei-ai-enabled",
    key: "wuwei-ai-key",
    base: "wuwei-ai-base",
    model: "wuwei-ai-model",
  };

  const quickWorryTags = [
    "画饼", "已读不回", "内卷", "周一", "催婚", "房租",
    "假装很好", "焦虑到睡不着", "PUA", "加班", "对比焦虑",
    "讨好型人格", "裁员", "分手", "社交恐惧", "存不下钱",
  ];

  /** 随机一投用的稍长烦恼句，和标签池互补 */
  const randomWorries = [
    "说不清的周一综合征",
    "领导画了张很大的饼",
    "消息已读，人未回",
    "别人都好像过得很好",
    "加班到忘记自己姓什么",
    "房租又要涨了",
    "催婚群消息 99+",
    "讨好了半天还是不对",
    "存钱总差那临门一脚",
    "分手后还在翻聊天记录",
    "裁员传闻在工位上空盘旋",
    "社交软件一打开就想关",
    "假装很好，其实很累",
    "深夜突然开始自我攻击",
    "内卷到连休息都像偷懒",
    "对比完朋友圈更焦虑了",
    "想躺平又有点不甘心",
    "被一句「你怎么还不会」刺到",
    "会议开完，事还在原地",
    "心情像阴天，下不下雨都难受",
  ];

  function pickRandomWorry() {
    const pool = randomWorries.length ? randomWorries : quickWorryTags;
    const a = pool[Math.floor(Math.random() * pool.length)];
    // 偶尔叠两个标签，更像真人随口念叨
    if (Math.random() < 0.28 && quickWorryTags.length > 1) {
      let b;
      do {
        b = quickWorryTags[Math.floor(Math.random() * quickWorryTags.length)];
      } while (b === a);
      return `${a}、${b}`;
    }
    return a;
  }
  const openers = [
    "池水微澜，接住了。",
    "山房已签收。",
    "清心池回执：",
    "道友，听到了。",
    "好，先放这儿。",
    "接到一缕浊气。",
    "系统提示：烦恼入库成功。",
    "无为主进程：已接收。",
  ];

  const closers = [
    "别硬撑，先放下。",
    "知止不殆，今晚先睡。",
    "水善利万物而不争——你也可以先不争这一句。",
    "命在你手里，不在这句话里。",
    "清静经补丁已热更新。",
    "功德 +1（心情版）。",
    "天道不催你回消息。",
    "去喝口水，再决定要不要硬刚。",
  ];

  /** @type {{id:string, keys:string[], lines:string[]}[]} */
  const topics = [
    {
      id: "pie",
      keys: ["画饼", "大饼", "期权", "以后给你", "空头", "愿景", "未来可期"],
      lines: [
        "关于「{w}」：饼香不等于能吃。问发钱没有，没有就是空气。",
        "「{w}」鉴定为空气点心。信言不美，美言多半是饼。",
        "「{w}」已退回厨房。山房菜单不提供画饼套餐。",
        "接到「{w}」。轻诺必寡信——包括别人对你画的饼。",
      ],
    },
    {
      id: "read",
      keys: ["已读不回", "已读", "不回消息", "已读未回", "已读不回"],
      lines: [
        "「{w}」：已读不回有时是冷漠，有时是护心，有时是对方也在修道。",
        "关于「{w}」——柔弱胜刚强。你不追问，比发一百句「在吗」更有道味。",
        "「{w}」沉底了。群消息无权定义你的价值。",
        "收到「{w}」。少则得，多则惑：少盯已读，多留清静。",
      ],
    },
    {
      id: "involution",
      keys: ["内卷", "卷", "加班", "996", "加班到", "卷死"],
      lines: [
        "「{w}」像劈叉：姿势很满，寸步难行。企者不立，跨者不行。",
        "关于「{w}」：无为而无不为——少做蠢事，也是生产力。",
        "「{w}」已归档。大家都卷，不代表天道要求你也卷。",
        "接到「{w}」。飘风不终朝：这阵加班风，也会停。",
      ],
    },
    {
      id: "monday",
      keys: ["周一", "星期一", "周天晚上", "周日晚上", "社畜"],
      lines: [
        "「{w}」已知。出生入死：上班叫入死，下班叫出生——请按时出生。",
        "关于「{w}」：周一不是天命，是日历的阴谋。你可以先喝水再上钟。",
        "「{w}」投入池中。山房建议：先完成「起床」这一章。",
      ],
    },
    {
      id: "marriage",
      keys: ["催婚", "相亲", "结婚", "对象", "剩女", "剩男", "恋爱"],
      lines: [
        "「{w}」：人生不是赛道，伴侣不是 KPI。大器晚成，心没定别被锣鼓带走。",
        "关于「{w}」——少私寡欲也包括少被催婚话术绑架。",
        "「{w}」已超度。你的节奏，不归亲戚委员会审批。",
      ],
    },
    {
      id: "money",
      keys: ["房租", "房贷", "存不下", "没钱", "穷", "工资", "欠债", "理财"],
      lines: [
        "「{w}」压得实。知足不辱：先保本清静，再谈暴富幻觉。",
        "关于「{w}」：稳赚两个字多半是诱饵。先把今晚的饭稳住。",
        "「{w}」收到。钱的事难，但不等于你整个人都「失败」。",
      ],
    },
    {
      id: "anxiety",
      keys: ["焦虑", "睡不着", "失眠", "恐慌", "害怕", "压力大", "内耗"],
      lines: [
        "「{w}」像后台进程占满内存。致虚极，守静笃：先杀几个无用进程。",
        "关于「{w}」——别硬撑。撑破的是心，放下的是枷。",
        "「{w}」沉底了。世界很吵，你的心可以小声一点。",
        "接到「{w}」。先喝水、先躺平五分钟，再谈造命。",
      ],
    },
    {
      id: "pua",
      keys: ["PUA", "pua", "否定", "贬低", "控制", "为你好", "道德绑架"],
      lines: [
        "「{w}」：知人者智，自知者明。识破 PUA，就已经赢一半。",
        "关于「{w}」——「为你好」若不征得同意，常常是控制。",
        "「{w}」已退回发件人。你的边界，不是别人的练功房。",
      ],
    },
    {
      id: "fake",
      keys: ["假装", "伪装", "体面", "撑着", "硬撑", "装没事"],
      lines: [
        "「{w}」好累。别硬撑、先放下——装没事也是一种加班。",
        "关于「{w}」：见素抱朴，先对自己诚实，再对世界表演。",
        "「{w}」投入池中。山房允许你今天不完美。",
      ],
    },
    {
      id: "compare",
      keys: ["对比", "别人都", "同学", "同龄", "落后", "差距"],
      lines: [
        "「{w}」是对比陷阱。你的人生不是短视频，别用完播率考核自己。",
        "关于「{w}」——知足不辱。别人的高光，常常藏着你看不见的发票。",
        "「{w}」已注销。赛道不同，别用别人的成绩单批改自己。",
      ],
    },
    {
      id: "love",
      keys: ["分手", "失恋", "爱情", "渣", "骗感情", "暧昧"],
      lines: [
        "「{w}」疼一下是正常的。祸兮福之所倚：腾出来的位置，留给清静。",
        "关于「{w}」——骗你的人靠不住，骗你的执念更靠不住。",
        "「{w}」沉底。曲则全：退一步，给自己留条活路。",
      ],
    },
    {
      id: "job",
      keys: ["裁员", "失业", "辞退", "炒鱿鱼", "找不到工作", "面试"],
      lines: [
        "「{w}」来了。裁员通知到了，自由通知也可能到了——先喘口气。",
        "关于「{w}」：天地不仁，别替系统背全部的锅。",
        "「{w}」已归档。先吃饭睡觉，再谈下一份合同。",
      ],
    },
    {
      id: "social",
      keys: ["社交恐惧", "社恐", "应酬", "不想说话", "讨好"],
      lines: [
        "「{w}」：不争之德。少回一句，不是罪，是护心。",
        "关于「{w}」——上善若水，不必每场都刷存在感。",
        "「{w}」收到。你可以做一滴安静的水，而不是一场烟花。",
      ],
    },
  ];

  const generalLines = [
    "关于「{w}」——你以为很重要，宇宙连记都没记。松一点。",
    "「{w}」沉底了。能改的去改，不能改的，就当剧情杀。",
    "池水回：放下「{w}」不等于认输，等于你不再给骗子续费。",
    "「{w}」已超度。人生没有客服，但你可以挂断。",
    "道友，关于「{w}」：配不上你今晚的睡眠。",
    "「{w}」化作青烟。无为山房鉴定：执念浓度偏高，建议冷处理。",
    "已注销「{w}」。道家加密文件夹，老板打不开。",
    "接到「{w}」。撑着的不是责任，是执念——先喝口水。",
    "「{w}」被退回发件人。退信理由：配不上你的清净。",
    "关于「{w}」：少则得，多则惑。少想一步，路就宽一步。",
    "「{w}」入库。圣人不积——缓存清了，心也轻一点。",
    "山风说：论「{w}」，你已经处理得够久了，该轮到清静上班。",
    "「{w}」不是你的永久身份证，只是路过的乌云。",
    "关于「{w}」——道法自然。先顺着呼吸，再谈逆天。",
    "「{w}」已投。知止不殆：停一下，你不会因此变成废人。",
  ];

  function fill(tpl, w) {
    return tpl.replace(/\{w\}/g, w);
  }

  function detectTopic(text) {
    const t = text.toLowerCase();
    for (const topic of topics) {
      if (topic.keys.some((k) => t.includes(k.toLowerCase()))) return topic;
    }
    return null;
  }

  function composeLocalReply(worry) {
    const w = worry.length > 28 ? worry.slice(0, 28) + "…" : worry;
    const topic = detectTopic(worry);
    const pool = topic ? topic.lines : generalLines;
    const mid = fill(pickLine(pool), w);
    // 约一半时候加上开场/收尾，增加变化
    const useOpener = Math.random() < 0.55;
    const useCloser = Math.random() < 0.65;
    const head = useOpener ? pickLine(openers) + " " : "";
    const tail = useCloser ? " " + pickLine(closers) : "";
    return (head + mid + tail).replace(/\s+/g, " ").trim();
  }

  function getAiConfig() {
    return {
      enabled: localStorage.getItem(AI_KEYS.enabled) === "1",
      key: localStorage.getItem(AI_KEYS.key) || "",
      base: (localStorage.getItem(AI_KEYS.base) || "https://api.openai.com/v1").replace(/\/$/, ""),
      model: localStorage.getItem(AI_KEYS.model) || "gpt-4o-mini",
    };
  }

  function saveAiConfig(cfg) {
    localStorage.setItem(AI_KEYS.enabled, cfg.enabled ? "1" : "0");
    if (cfg.key != null) localStorage.setItem(AI_KEYS.key, cfg.key.trim());
    if (cfg.base != null) localStorage.setItem(AI_KEYS.base, cfg.base.trim());
    if (cfg.model != null) localStorage.setItem(AI_KEYS.model, cfg.model.trim());
  }

  async function generateAiReply(worry) {
    const cfg = getAiConfig();
    if (!cfg.enabled || !cfg.key) return null;

    const system =
      "你是「无为山房」清心池的回应者。风格：诙谐、短句、贴合道教精神（无为、知止、造命、清静），" +
      "带一点互联网梗，但不阴阳怪气伤人。用简体中文回复 1～2 句，必须点出用户烦恼里的关键词，" +
      "结尾自然落到「别硬撑、先放下」或造命自救，不要说教，不要列表，不要引号堆砌。";

    const res = await fetch(`${cfg.base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.key}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.9,
        max_tokens: 120,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `烦恼：${worry}` },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`AI ${res.status} ${errText.slice(0, 120)}`);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  }

  /**
   * @param {string} worry
   * @returns {Promise<{text:string, source:'ai'|'local', error?:string}>}
   */
  async function generateWorryReply(worry) {
    const raw = (worry || "").trim() || "说不清的闷";
    try {
      const ai = await generateAiReply(raw);
      if (ai) return { text: ai, source: "ai" };
    } catch (e) {
      return {
        text: composeLocalReply(raw),
        source: "local",
        error: e.message || String(e),
      };
    }
    return { text: composeLocalReply(raw), source: "local" };
  }

  window.WuweiReplies = {
    quickWorryTags,
    randomWorries,
    pickRandomWorry,
    composeLocalReply,
    generateWorryReply,
    getAiConfig,
    saveAiConfig,
    detectTopic,
    topics,
  };
})();
