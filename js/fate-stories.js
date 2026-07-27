/* 无为山房 · 逆天改命剧情库（小说式，非固定四步） */
(function () {
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fill(tpl, ctx) {
    return tpl
      .replace(/\{rank\}/g, ctx.rank || "下下签")
      .replace(/\{sign\}/g, ctx.sign || "坏签")
      .replace(/\{round\}/g, String(ctx.round || 1))
      .replace(/\{hero\}/g, ctx.hero || "道友");
  }

  /** 每条剧情线：开场池 / 发展池 / 转折池 / 收束池，每次随机抽组合 */
  const arcs = [
    {
      name: "天道谈判录",
      tag: "玄幻公案",
      openings: [
        { title: "传票到山", mood: "ominous", fx: "flash", ms: 1400, line: "天道发来一纸传票：「{rank}」判定生效。你在山房门口把传票折成纸飞机。" },
        { title: "命簿翻页", mood: "ominous", fx: "ash", ms: 1300, line: "命簿自动翻到「{rank}」一栏，墨迹发烫。你吹了口气：墨，可以改。" },
      ],
      middles: [
        { title: "与天对坐", mood: "rewriting", fx: "orb", ms: 1600, line: "茶桌上坐着一位不说话的影子。它推来坏签，你推回一句：命由己造，请重审。" },
        { title: "条款拉扯", mood: "rewriting", fx: "none", ms: 1400, line: "天道坚持「概率」，你坚持「主权」。第 {round} 回合，会议室的云开始漏雨。" },
        { title: "证人出庭", mood: "rewriting", fx: "ash", ms: 1500, line: "你的失眠、加班和已读不回出庭作证。法官打哈欠：这些不够判你认栽。" },
        { title: "庭外和解", mood: "rewriting", fx: "none", ms: 1300, line: "有人劝你认了「{rank}」少折腾。你笑：折腾才是修行的加班费。" },
      ],
      twists: [
        { title: "突发：执念假扮天道", mood: "ominous", fx: "flash", ms: 1500, line: "对方摘下面具——竟是你自己的执念。它说：我比天道更懂你。你回：那就更该炒了你。" },
        { title: "突发：旁听席起哄", mood: "rewriting", fx: "ash", ms: 1400, line: "旁听席全是网络评论。你把弹幕关了：改命不需要完播率。" },
      ],
      endings: [
        { title: "改判", mood: "blessed", fx: "seal", ms: 1200, line: "朱砂落下。天道在笔录末尾加注：当事人不同意认栽，准予改命。" },
        { title: "撤案", mood: "blessed", fx: "seal", ms: 1200, line: "案子撤了。不是天道输了，是你不再把坏签当判决书。" },
      ],
    },
    {
      name: "青灯夜话",
      tag: "山中志怪",
      openings: [
        { title: "灯花爆了", mood: "ominous", fx: "flash", ms: 1300, line: "山房青灯爆出一朵花，花心写着「{rank}」。灯芯说：别信字，信你。" },
        { title: "窗外有人拍窗", mood: "ominous", fx: "ash", ms: 1400, line: "雨夜，坏签贴在窗上像一张人脸。你拉开窗：进来坐，别装神。" },
      ],
      middles: [
        { title: "与旧我下棋", mood: "rewriting", fx: "none", ms: 1500, line: "棋盘另一侧是昨天的你。它非要走「认命」那步。你把棋子推回去：这步无解，重下。" },
        { title: "灶王偷看", mood: "rewriting", fx: "orb", ms: 1400, line: "灶王探头：凡人改命，厨房要不要加鸡腿？你说：加清静就行。" },
        { title: "山鬼借火", mood: "rewriting", fx: "ash", ms: 1500, line: "山鬼说愿用三年好运换你的「{rank}」。你拒绝：好运要自己挣，坏签不外卖。" },
        { title: "竹简自燃", mood: "rewriting", fx: "ash", ms: 1300, line: "记载倒霉的竹简自燃。烟里隐约有人喊「剧情杀」。你回：作者是我。" },
      ],
      twists: [
        { title: "突发：签文活了", mood: "ominous", fx: "flash", ms: 1500, line: "「{sign}」爬起来要跟你打架。你不接招，只丢一句：别硬撑，先放下——它愣住，自己散了。" },
      ],
      endings: [
        { title: "灯重新亮", mood: "blessed", fx: "seal", ms: 1200, line: "青灯稳住。窗外雨停。山鬼在远处鼓掌，像个看完大结局的书童。" },
        { title: "夜话终章", mood: "blessed", fx: "seal", ms: 1200, line: "你合上命簿当故事集：这一章标题，从「认栽」改成「我改」。" },
      ],
    },
    {
      name: "打工人修真传",
      tag: "赛博修真",
      openings: [
        { title: "系统弹窗", mood: "ominous", fx: "flash", ms: 1300, line: "脑内系统弹出：您已获得「{rank}」debuff。是否一键认栽？你点了自定义。" },
        { title: "工位异变", mood: "ominous", fx: "ash", ms: 1400, line: "工位灯管闪成符咒。同事问你看啥。你说：在改命，别划水。" },
      ],
      middles: [
        { title: "副本：画饼林", mood: "rewriting", fx: "none", ms: 1500, line: "你走进画饼林，每棵树都挂着「以后再说」。你掏出斧头：先砍空头支票。" },
        { title: "副本：已读迷宫", mood: "rewriting", fx: "orb", ms: 1500, line: "迷宫墙上全是「已读」。你不找出口，直接把墙拆了——出口是你自己。" },
        { title: "Boss：内卷魔", mood: "rewriting", fx: "ash", ms: 1600, line: "内卷魔喊：大家都会！你回：那大家都可以不。Boss 血条掉了一截。" },
        { title: "组队：清静", mood: "rewriting", fx: "none", ms: 1300, line: "你把「清静」加进队伍。它不会输出，但能减伤。第 {round} 波杂兵散了。" },
      ],
      twists: [
        { title: "突发：假任务", mood: "ominous", fx: "flash", ms: 1400, line: "系统又推送「再撑一下就好了」。你举报：话术诈骗。客服是天道，显示正在输入。" },
      ],
      endings: [
        { title: "通关结算", mood: "blessed", fx: "seal", ms: 1200, line: "结算画面跳出：debuff 已清除。隐藏成就「命由己造」点亮。" },
        { title: "退出副本", mood: "blessed", fx: "seal", ms: 1200, line: "你退出修真副本，回到人间。背包里多了一枚印章：已改命，可固本。" },
      ],
    },
    {
      name: "茶馆说书",
      tag: "话本传奇",
      openings: [
        { title: "开书", mood: "ominous", fx: "none", ms: 1300, line: "话说道友抽得「{rank}」，四座哗然。说书人一拍惊堂木：且听他如何逆天！" },
        { title: "客官起哄", mood: "ominous", fx: "flash", ms: 1400, line: "茶客喊：认了吧！你把茶杯一顿：故事要是只会认栽，茶钱谁付？" },
      ],
      middles: [
        { title: "第一回：撕签", mood: "rewriting", fx: "ash", ms: 1400, line: "你不当众哭，不当众跪，只当众把坏签撕开。纸屑像雪，落进茶汤里。" },
        { title: "第二回：问路", mood: "rewriting", fx: "none", ms: 1400, line: "路边老人问：怕不怕天道。你说：怕内耗更甚。老人笑：可教也。" },
        { title: "第三回：过关", mood: "rewriting", fx: "orb", ms: 1500, line: "关卡写着「必须完美」。你写了个「不」贴上去。关卡bug了，只好放行。" },
        { title: "插科打诨", mood: "rewriting", fx: "none", ms: 1200, line: "副角冲出来说教。你把剧本递还：我是主角，不是工具人。" },
      ],
      twists: [
        { title: "书中书", mood: "ominous", fx: "flash", ms: 1500, line: "你发现自己写在别人的故事里当反派。你提笔把「反派」改成「觉醒者」。" },
      ],
      endings: [
        { title: "收书", mood: "blessed", fx: "seal", ms: 1200, line: "说书人收惊堂木：此回完。下回预告——固本、喝茶、继续做人。" },
        { title: "茶钱免了", mood: "blessed", fx: "seal", ms: 1200, line: "掌柜说：改命成功，茶钱免单。你说：那清静也给我续一杯。" },
      ],
    },
    {
      name: "心魔讨伐战",
      tag: "战斗爽文",
      openings: [
        { title: "宣战", mood: "ominous", fx: "flash", ms: 1300, line: "「{rank}」化形为心魔，血条很长。你把「别硬撑」当成起手式。" },
        { title: "战场展开", mood: "ominous", fx: "ash", ms: 1400, line: "焦虑当箭，自我否定当盾。你侧身：这些武器过期了。" },
      ],
      middles: [
        { title: "第一式：放下", mood: "rewriting", fx: "none", ms: 1400, line: "你不是躺平，是卸甲。心魔一刺落空，开始骂你不讲武德。" },
        { title: "第二式：知止", mood: "rewriting", fx: "orb", ms: 1500, line: "你停手三秒。心魔以为你怯。其实你在读条：清静爆发。" },
        { title: "连招：造命", mood: "rewriting", fx: "ash", ms: 1500, line: "你不求暴击，只求每一击都由自己决定。第 {round} 回合，心魔护甲裂了。" },
        { title: "援军：山房", mood: "rewriting", fx: "none", ms: 1300, line: "远处木鱼声传来。不是外挂，是节奏。你跟着节奏打，越打越轻。" },
      ],
      twists: [
        { title: "心魔求和", mood: "ominous", fx: "flash", ms: 1400, line: "心魔说：留我一条，保你警醒。你说：可以留提醒，不留绑架。" },
      ],
      endings: [
        { title: "胜利结算", mood: "blessed", fx: "seal", ms: 1200, line: "心魔散作纸灰。你没欢呼，只盖章：此战胜在不认栽。" },
        { title: "收刀", mood: "blessed", fx: "seal", ms: 1200, line: "刀收回心中。战场复原成山房。你发现手心有一行字：命，已改。" },
      ],
    },
  ];

  function mapChapter(ch, i, ctx) {
    return {
      index: i + 1,
      title: ch.title,
      mood: ch.mood,
      fx: ch.fx,
      ms: (ch.ms || 1400) + Math.floor(Math.random() * 300),
      text: fill(ch.line, ctx),
    };
  }

  /**
   * 生成一次逆天改命：正文 + 收束分开。
   * 收束必须等好签落定后再播，避免「剧情已改判、签面还是中平」。
   * @param {{rank:string, sign:string, round:number, hero?:string}} ctx
   */
  function buildFateJourney(ctx) {
    const arc = pick(arcs);
    const opening = pick(arc.openings);
    const endingRaw = pick(arc.endings);
    const midCount = 2 + Math.floor(Math.random() * 3); // 2-4
    const middles = shuffle(arc.middles).slice(0, Math.min(midCount, arc.middles.length));
    const body = [opening, ...middles];
    if (Math.random() < 0.7 && arc.twists.length) {
      const insertAt = 1 + Math.floor(Math.random() * Math.max(1, body.length - 1));
      body.splice(insertAt, 0, pick(arc.twists));
    }

    return {
      arcName: arc.name,
      arcTag: arc.tag,
      chapters: body.map((ch, i) => mapChapter(ch, i, ctx)),
      /** 好签确定后调用，填入终局 rank/sign */
      buildEnding(endCtx) {
        const merged = { ...ctx, ...endCtx };
        return mapChapter(endingRaw, body.length, merged);
      },
    };
  }

  window.WuweiFateStories = { arcs, buildFateJourney, pick, fill };
})();
