/**
 * 学术生存指南 —— 结局配置
 * 6 种结局的条件与描述
 */
module.exports = [
  {
    "id": "graduation_honors",
    "name": "光荣毕业",
    "title": "🎓 恭喜毕业！你是学术圈的明日之星！",
    "description": "论文盲审全A通过，答辩委员会一致好评。导师握着你的手说：\"我就知道你可以的。\" 你终于可以微笑着说：\"我毕业了。\"",
    "type": "victory",
    "condition": {
      "paperProgress": 100,
      "phase": "defense",
      "advisorSatisfaction": [70, 100],
      "mentalHealth": [50, 100]
    },
    "grade": "S",
    "flavorText": "你不仅完成了学业，还保持了身心健康和良好的师生关系。你是少数能做到这一点的博士——这本身就是一项成就。"
  },
  {
    "id": "graduation_barely",
    "name": "勉强毕业",
    "title": "😮‍💨 毕业了……但代价是什么？",
    "description": "论文踩着死线提交，答辩时被怼得体无完肤。但最终——你过了。导师拍了拍你的肩膀：\"以后……好好做人吧。\"",
    "type": "victory",
    "condition": {
      "paperProgress": 100,
      "phase": "defense",
      "advisorSatisfaction": [0, 69],
      "mentalHealth": [0, 100]
    },
    "grade": "A",
    "flavorText": "虽然过程艰难，师生关系也走到了冰点，但你拿到了那张纸。至于这段经历给你留下了什么——那是另一个故事了。"
  },
  {
    "id": "energy_exhausted",
    "name": "精力耗尽",
    "title": "💀 你在实验室倒下了……",
    "description": "连续的高强度工作让你的身体终于扛不住了。医生说你必须休息至少三个月。当你躺在病床上时，终于有时间思考：这一切值得吗？",
    "type": "failure",
    "condition": { "trigger": "energy_zero" },
    "flavorText": "学术很重要，但你的命更重要。记住：活着才有输出。"
  },
  {
    "id": "money_bankrupt",
    "name": "经济崩溃",
    "title": "🏚️ 你付不起下个月的房租了……",
    "description": "博士生微薄的补助根本无法支撑你的生活。在连续吃了一个月挂面之后，你终于决定——先找个工作养活自己吧。学术梦，暂时放一放。",
    "type": "failure",
    "condition": { "trigger": "money_zero" },
    "flavorText": "经济基础决定上层建筑。马克思说得对。等你攒够了钱，再来读博也不迟。"
  },
  {
    "id": "advisor_expelled",
    "name": "被迫退学",
    "title": "📋 导师把你退学了……",
    "description": "经过无数次失败的沟通、未完成的Deadline、和一次特别糟糕的组会之后，导师决定不再指导你了。没有导师，就没有学位。你的学术生涯画上了句号。",
    "type": "failure",
    "condition": { "trigger": "advisor_satisfaction_zero" },
    "flavorText": "选导师比选专业更重要——这是无数过来人用血泪换来的教训。下次选导师之前，先跟师兄师姐喝顿酒吧。"
  },
  {
    "id": "time_expired",
    "name": "超过最长年限",
    "title": "⏰ 七年了……你被清退了",
    "description": "学校的博士生最长学习年限到了。你看着堆积如山的实验数据和只写了一半的论文，突然意识到：你在这所学校待了七年，却什么都没带走。",
    "type": "failure",
    "condition": { "trigger": "year_exceeded" },
    "flavorText": "超过六年还没毕业？学术界的\"七年之痒\"不是开玩笑的。也许这条赛道真的不适合你。换个赛道，人生还有无限可能。"
  }
]
