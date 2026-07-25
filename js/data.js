/* 无为山房 · 文案与数据 */
function pickLine(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const oracles = [
  { t: "道可道，非常道。饼可画，非常饼。", m: "道德经 · 打工人注", scamId: "pie" },
  { t: "上善若水。水善利万物而不争，也不回工作消息。", m: "第八章 · 摸鱼版", scamId: "msg" },
  { t: "知人者智，自知者明。知道自己在被 PUA，就已经赢一半。", m: "第三十三章 · 觉醒", scamId: "foryou" },
  { t: "大直若屈，大巧若拙。你的「躺平」，其实叫「合道」。", m: "第四十五章 · 正名", scamId: "effort" },
  { t: "飘风不终朝，骤雨不终日。老板的怒气，同理。", m: "第二十三章 · 气象学", scamId: "push" },
  { t: "少则得，多则惑。消息免打扰，就是当代辟谷。", m: "第二十二章 · 数码修行", scamId: "msg" },
  { t: "天地不仁，以万物为刍狗。系统不仁，以用户为数据。", m: "第五章 · 赛博注", scamId: "effort" },
  { t: "致虚极，守静笃。先把手机扣上，静一分钟再说。", m: "第十六章 · 实操" },
  { t: "企者不立，跨者不行。内卷像劈叉，姿势很满，寸步难行。", m: "第二十四章 · 体态", scamId: "capable" },
  { t: "信言不美，美言不信。画饼的都美，真发钱的都闷。", m: "第八十一章 · 识人", scamId: "pie" },
  { t: "无为而无不为。今天什么都不干，也是一种生产力。", m: "第三十七章 · KPI 解构", scamId: "push" },
  { t: "知足不辱，知止不殆。群已读不回？那是别人在修道。", m: "第四十四章 · 社交", scamId: "msg" },
  { t: "柔弱胜刚强。你不回消息，比硬刚更有杀伤力。", m: "第三十六章 · 兵法", scamId: "msg" },
  { t: "出生入死。上班叫入死，下班叫出生。请按时出生。", m: "第五十章 · 通勤", scamId: "everyone" },
  { t: "道生一，一生二，二生三，三生万物。你只生焦虑，偏科了。", m: "第四十二章 · 劝学", scamId: "fomo" },
  { t: "见素抱朴，少私寡欲。购物车清一清，心就轻一轻。", m: "第十九章 · 消费观", scamId: "buy" },
  { t: "天下难事，必作于易。先喝口水，再考虑辞职。", m: "第六十三章 · 步骤" },
  { t: "圣人不积。缓存清了，执念也会轻一点。", m: "第八十一章 · 清理大师" },
  { t: "别硬撑、先放下。撑破的是心，放下的是枷。", m: "山房心法 · 总纲", scamId: "push" },
  { t: "祸兮福之所倚。裁员通知来了，自由通知也到了。", m: "第五十八章 · 职场", scamId: "effort" },
  { t: "轻诺必寡信。说过「下次一定」的，多半没有下次。", m: "第六十三章 · 识人补", scamId: "laterpay" },
  { t: "大器晚成。你的人生不是短视频，别用完播率考核自己。", m: "第四十一章 · 节奏", scamId: "love" },
  { t: "知者不博，博者不知。什么都刷，什么都不剩。", m: "第八十一章 · 信息斋" },
  { t: "曲则全。退一步不是怂，是给你自己留条活路。", m: "第二十二章 · 退路", scamId: "circle" },
];

/* 诙谐道语：贴合无为、造命、祸福相倚，但不装神弄鬼 */
const wittyPo = [
  "妄者，妄也。信它，它就真；拆它，它就纸。",
  "下下签来报到？很好，靶子出现了，方便改。",
  "天若有命，也要过你这关。你不同意，流程走不下去。",
  "道德经没写「认栽」两章。倒是写了很多「知止」。",
  "签凶，人不凶。人若软，签才硬。",
];
const wittyBurn = [
  "旧签火化，功德——不，是痛快——无量。",
  "烧的不是运气，是那句「我就这样了」。",
  "灰飞之后，执念交社保：缴不起，自动停保。",
  "庄子说薪尽火传。我们说：坏签尽，心火传。",
  "化为灰烬合格证：已不具备定义你的资质。",
];
const wittyQi = [
  "炁在聚。你坐着就行，天道加班你别掺和。",
  "无为不是躺平，是少做蠢事，专做改命的事。",
  "聚炁中：把散掉的注意力，从短视频里赎回来。",
  "上善若水。水能载舟，也能把坏签冲走。",
  "炁满则灵。灵的不是神仙，是你突然想清楚了。",
];
const wittyQiTick = [
  "一炁：先把慌收回来",
  "二炁：骗子信号变弱",
  "三炁：执念开始掉线",
  "四炁：清静上线",
  "五炁：命盘可编辑",
  "六炁：天道排队中",
  "七炁：轮到你发言",
];
const wittySeal = [
  "印落处，权在人。天道旁观，请勿插嘴。",
  "命由己造——山房官方章，防伪：心安即真。",
  "封印不是求神，是你跟自己签劳动合同：甲方乙方都是你。",
  "一印定乾坤？不。一印定：从今天起不交智商税。",
  "朱砂为证：坏签无效，好签生效，心情备案。",
];
const wittyRetry = [
  "半成品命运，山房拒收。再改。",
  "中平像温水。温水煮青蛙，热油改命运——继续。",
  "还行？不行。道友配得上更清爽的签。",
  "祸兮福之所倚。这福还没倚稳，再推一把。",
  "差不多得了？差不多就是还没到。再来。",
];
const wittySuccess = [
  "改命成功。天道表示：行吧，你说了算。",
  "坏签已下岗，好签入职。试用期：你的每一天。",
  "无为而无不为——刚才什么都没干，命已经更好了。",
  "恭喜：你没有跪着求运，你站着把运改了。",
  "上吉/上上不是赏赐，是你拒绝认栽的收据。",
  "庄子笑了：天地与我并生，坏签与我无关。",
];

/* 核心：签只是提醒，命由人改。差签 → 给出可做的「逆天改命」功课。 */
const lots = [
  {
    rank: "上上签",
    t: "今日宜放下。不宜硬撑、不宜回怼、不宜把别人的焦虑当KPI。",
    advice: "上上如清风：来了就享，走了不追。知足不辱，知止不殆——止住瞎忙，运才留得住。",
  },
  {
    rank: "上上签",
    t: "心一静，事就小。山房认证：你值得被善待，包括被自己善待。",
    advice: "清静不是摆烂，是高级生产力。致虚极，守静笃——先静，再决定要不要卷。",
  },
  {
    rank: "上吉签",
    t: "有贵人相助——贵人可能是你自己，睡个好觉就算上钟。",
    advice: "贵人迟到没关系，你别先把自己炒了。上善若水：润物，不必刷存在感。",
  },
  {
    rank: "上吉签",
    t: "所求皆顺。前提是你别去求不该求的人，也别求不该求的饼。",
    advice: "顺境里少许愿、多兑现。轻诺必寡信——包括你对自己许的「明天一定」。",
  },
  {
    rank: "上吉签",
    t: "偏财运一般，清静运爆棚。少刷短视频，多看远处的山。",
    advice: "见素抱朴：眼睛歇一歇，心就不容易被带去加班。",
  },
  {
    rank: "中平签",
    t: "不好不坏，正适合摸鱼。过分努力，有时是不懂道。",
    advice: "中平像白开水：不甜，但能活。想更好？改一件小事就行，别一次改命改成过劳。",
  },
  {
    rank: "中平签",
    t: "静观其变。变的是别人，你负责喝茶——茶凉了再倒。",
    advice: "旁观不是怂，是蓄力。飘风不终朝：等风停，再出门，发型更稳。",
  },
  {
    rank: "中平签",
    t: "半信半疑最养生：信好事，疑骗子，更疑自我感动。",
    advice: "信言不美，美言不信。谁把你夸上天，先查他有没有降落伞给你。",
  },
  {
    rank: "中平签",
    t: "今日宜「已读不回」。不是冷漠，是护心，也是当代不争。",
    advice: "柔弱胜刚强：你不回，比回一百句「我解释一下」更有道味。",
  },
  {
    rank: "下下签",
    t: "小心画饼。闻到焦香的不一定是机遇，可能是路边烧烤摊。",
    remedy: "今天拒绝一个空口承诺。你一拒绝，天道都觉得你专业。",
    action: "drop",
    actionLabel: "把画饼扔进池子",
  },
  {
    rank: "下下签",
    t: "今日宜防诈骗：情感的、职场的，还有自己骗自己的。",
    remedy: "列一条正在消耗你的人和事，降级或切断。命不由骗子写，由你按删除键。",
    action: "drop",
    actionLabel: "写下要切断的消耗",
  },
  {
    rank: "下下签",
    t: "诸事不宜硬刚。但认栽更不宜——那叫把主权交给坏签。",
    remedy: "把硬刚改成清楚的一句「不」。命运最怕边界清晰的人。",
    action: "muyu",
    actionLabel: "敲木鱼压惊改运",
  },
  {
    rank: "下下签",
    t: "心绪易乱，容易被带节奏。乱不是命，是临时的信号干扰。",
    remedy: "先调息，再决策。心定了，下下签只是路过的乌云。",
    action: "breathe",
    actionLabel: "立刻调息改命",
  },
  {
    rank: "下下签",
    t: "今日易自我审判。苛责自己，比外面的骗子更伤运。",
    remedy: "对自己说「别硬撑、先放下」，再做一件对身体好的小事。身体动了，命就开始改合同条款。",
    action: "muyu",
    actionLabel: "敲木鱼换口气",
  },
];

const scams = [
  {
    title: "「我们是一家人」",
        id: "family",
    tag: "亲情绑架",
    verdict: "一家人不会用亲情绑架你的边界。真家人给你饭，假家人给你罪。道曰：少私寡欲，也少被「我们」绑架。",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「再撑一下就好了」",
        id: "push",
    tag: "透支话术",
    verdict: "撑一下可以，撑一辈子叫透支。别硬撑、先放下——哪怕只放下今天。知止不殆。",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「给你画个大饼」",
        id: "pie",
    tag: "空头支票",
    verdict: "饼香不等于能吃。问一句：发钱没有？没有，就是空气。信言不美，美言不信。",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你怎么这么矫情」",
        id: "drama",
    tag: "感受抹杀",
    verdict: "不舒服叫感受，不是矫情。谁让你闭嘴，谁就在骗你的神经。知人者智，自知者明。",
    img: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「错过这村没这店」",
        id: "fomo",
    tag: "制造焦虑",
    verdict: "真正的好机会，不靠恐吓成交。急着让你点头的，多半不干净。飘风不终朝，别被风速绑走。",
    img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「大家都这样」",
        id: "everyone",
    tag: "从众压迫",
    verdict: "大家都加班，不代表加班是道。众人皆醉时，清醒叫不合群，也叫救命。见素抱朴。",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「我这都是为你好」",
        id: "foryou",
    tag: "控制包装",
    verdict: "为你好的人，会问你要不要。不征得同意的「好」，常常是控制。上善若水，不硬灌。",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你不努力才会惨」",
        id: "effort",
    tag: "甩锅结构",
    verdict: "惨有很多原因。把结构性问题甩给你一个人，是最省事的骗局。天地不仁，别替系统背锅。",
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「跟我对赌一下未来」",
        id: "option",
    tag: "期权幻觉",
    verdict: "未来很贵，口头期权很便宜。道生一，一生二——二生不了你的房贷。先问现金流。",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你看别人都买了」",
        id: "buy",
    tag: "消费绑架",
    verdict: "别人购物车满，不代表你的心要空。少私寡欲：想清楚「需要」还是「被种草」。",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「保密协议签一下哈」",
        id: "nda",
    tag: "封口套路",
    verdict: "真公道不怕说。急着让你闭嘴的，往往有鬼。信言不美——美得像封条的，更要当心。",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你优秀，所以多干点」",
        id: "capable",
    tag: "能干者多劳",
    verdict: "奖励勤奋的方式不该是惩罚更多活。无为而无不为：会推，也是一种道。",
    img: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「先做事，钱的事好说」",
        id: "laterpay",
    tag: "先干活后画饼",
    verdict: "好说的通常是空话。先把价说清，再动手——轻诺必寡信，自古如此。",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你不回消息就是不在乎」",
        id: "msg",
    tag: "情绪勒索",
    verdict: "不回可能是在修道，也可能是在睡觉。把沉默定罪，是最低成本的控制术。柔弱胜刚强。",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「这个圈子就这样」",
        id: "circle",
    tag: "潜规则洗脑",
    verdict: "圈子潜规则，不是天道。道法自然，不法潜规则。待不住就走，走也是一种造命。",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「信任我，别查了」",
        id: "trust",
    tag: "阻止核验",
    verdict: "真信任不怕查。阻止你核实的，多半经不起核实。你要的是真相，不是故事。",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「你不恋爱就落后了」",
        id: "love",
    tag: "婚恋焦虑",
    verdict: "人生不是赛道，伴侣不是KPI。大器晚成：心没定，先别被催婚的锣鼓带跑。",
    img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
  {
    title: "「内幕消息，稳赚」",
        id: "insider",
    tag: "投机诱饵",
    verdict: "稳赚两个字，通常是诱饵。知足不辱：保本的清静，大过暴富的幻觉。",
    img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&h=450&q=80",
    credit: "Photo: Unsplash",
  },
];

const muyuLines = [
  [1, "木鱼初响，心念一震。"],
  [10, "十声。杂念开始排队退场。"],
  [30, "三十下。群消息暂时无权进入。"],
  [66, "六六大顺。但你敲的是清静，不是彩票。"],
  [108, "一百零八。传统功课达成，当代人罕见。"],
  [200, "二百。山房怀疑你在摸鱼，但支持。"],
  [500, "五百。建议申请「无为」职称。"],
  [999, "九百九十九。差不多得了，去喝口水。"],
];


const daoToasts = [
  "道行 +{n}。清静值略有上升。",
  "道行 +{n}。天道记了一笔，但不发朋友圈。",
  "道行 +{n}。无为山房盖章：今日有功。",
  "道行 +{n}。比刷短视频更像修行。",
];

window.WuweiData = {
  oracles,
  pickLine,
  wittyPo,
  wittyBurn,
  wittyQi,
  wittyQiTick,
  wittySeal,
  wittyRetry,
  wittySuccess,
  lots,
  scams,
  muyuLines,
  daoToasts,
};
