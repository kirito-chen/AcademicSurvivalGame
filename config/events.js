/**
 * 学术生存指南 —— 随机事件配置
 * 含触发条件、选项与效果
 */
module.exports = [
  {
    "id": "data_disaster",
    "name": "数据灾难",
    "title": "💥 实验数据炸了！",
    "description": "你辛苦跑了一个月的实验数据，因为硬盘坏了全部丢失。你感到一阵眩晕，想起了那个每次组会都在提醒你\"记得备份\"的人……",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research", "writing"],
      "minMonth": 3,
      "probability": 0.08,
      "excludeFlag": "backup_habit"
    },
    "options": [
      {
        "id": "cry_and_restart",
        "text": "大哭一场，然后从头再来",
        "effects": { "energy": -30, "paperProgress": -10, "mentalHealth": -20 },
        "message": "你哭了一整晚，第二天红着眼睛重新开始实验。这就是科研的日常吧。"
      },
      {
        "id": "ask_advisor_help",
        "text": "找导师求助（需要导师满意度≥30）",
        "effects": { "energy": -5, "advisorSatisfaction": -15, "paperProgress": 5 },
        "message": "导师叹了口气，帮你从邮件里翻出了三个月前发他的数据草稿。虽然不完全，但总比没有强。",
        "requirements": { "advisorSatisfaction": 30 }
      }
    ]
  },
  {
    "id": "surprise_meeting",
    "name": "突然组会",
    "title": "📢 导师突然要开组会！",
    "description": "晚上十点，微信群响了。导师：\"明天早上8点组会，每个人汇报本周进展。\" ——你看了看自己本周的进展：零。",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research", "writing"],
      "probability": 0.12
    },
    "options": [
      {
        "id": "rush_prepare",
        "text": "通宵赶PPT",
        "effects": { "energy": -25, "paperProgress": 5, "advisorSatisfaction": 5, "mentalHealth": -15 },
        "message": "你喝了两杯咖啡，凌晨四点做好了PPT。虽然内容全靠编，但PPT做得挺好看的。"
      },
      {
        "id": "skip_and_pray",
        "text": "装死不去",
        "effects": { "energy": 10, "advisorSatisfaction": -20, "mentalHealth": -5 },
        "message": "你关了手机，假装已经睡了。第二天导师的脸色比咖啡还黑。"
      }
    ]
  },
  {
    "id": "paper_rejected",
    "name": "期刊拒稿",
    "title": "📧 收到期刊拒稿信",
    "description": "你颤抖着点开邮件：\"Dear Author, we regret to inform you...\" —— 这是你第三次收到这句话了。",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research", "writing", "defense"],
      "minMonth": 10,
      "probability": 0.10
    },
    "options": [
      {
        "id": "revise_and_resubmit",
        "text": "修改后重投",
        "effects": { "energy": -15, "paperProgress": 8, "mentalHealth": -10, "luck": 5 },
        "message": "你按照审稿人的意见（包括那些明显是瞎提的建议）修改了论文。学术界的游戏规则，你越来越懂了。"
      },
      {
        "id": "switch_journal",
        "text": "转投其他期刊",
        "effects": { "energy": -5, "paperProgress": 0, "mentalHealth": -5, "luck": 10 },
        "message": "此处不留爷，自有留爷处。你换了个影响因子低一些的期刊，这次应该能中……吧？"
      }
    ]
  },
  {
    "id": "funding_news",
    "name": "经费来袭",
    "title": "🎉 导师申请到了新经费！",
    "description": "导师兴高采烈地在群里宣布，新项目经费批下来了。你的补助终于有着落了。",
    "type": "positive",
    "triggerConditions": {
      "phase": ["research", "writing"],
      "minMonth": 6,
      "probability": 0.06
    },
    "options": [
      {
        "id": "celebrate",
        "text": "庆祝一下！",
        "effects": { "energy": -5, "money": 500, "mentalHealth": 15, "advisorSatisfaction": 10 },
        "message": "导师请大家吃了顿饭，席间居然说\"辛苦大家了\"。你怀疑导师是不是被夺舍了。"
      }
    ]
  },
  {
    "id": "conference_opportunity",
    "name": "学术会议",
    "title": "🎤 国际学术会议投稿机会！",
    "description": "领域顶会开始征稿了。导师问你要不要投一篇——这是展示成果的好机会，但也意味着更紧的Deadline。",
    "type": "neutral",
    "triggerConditions": {
      "phase": ["research"],
      "minMonth": 12,
      "probability": 0.07
    },
    "options": [
      {
        "id": "submit_paper",
        "text": "冲刺投稿（需要论文进度≥30）",
        "effects": { "energy": -30, "paperProgress": 15, "socialCapital": 15, "mentalHealth": -10, "luck": 10 },
        "message": "你通宵两周赶出了论文。虽然黑眼圈重得可以去演熊猫，但被录取的成就感让一切值得。",
        "requirements": { "paperProgress": 30 }
      },
      {
        "id": "skip_this_time",
        "text": "算了，下次再说",
        "effects": { "energy": 0, "advisorSatisfaction": -5, "mentalHealth": 5 },
        "message": "你决定不给自己增加压力。导师有点失望，但也没有强求。有时候，放过自己也是一种智慧。"
      }
    ]
  },
  {
    "id": "equipment_broken",
    "name": "设备故障",
    "title": "🔧 实验室核心设备坏了！",
    "description": "实验室的XX仪器（就是你做实验必备的那台）突然罢工了。维修需要两周，排队的人已经排到下个月。",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research"],
      "probability": 0.09
    },
    "options": [
      {
        "id": "wait_patiently",
        "text": "耐心等待维修",
        "effects": { "energy": 5, "paperProgress": -5, "mentalHealth": -5, "luck": 5 },
        "message": "你利用这段时间整理了文献。虽然实验没进展，但你的EndNote库终于不再是一团乱麻了。"
      },
      {
        "id": "borrow_equipment",
        "text": "借用其他课题组的设备",
        "effects": { "energy": -15, "paperProgress": 10, "socialCapital": 10, "money": -100 },
        "message": "你请隔壁组的大师兄吃了顿饭，成功借到了设备。学术圈的人情往来，也是一门学问。"
      }
    ]
  },
  {
    "id": "good_sleep",
    "name": "睡了个好觉",
    "title": "😴 昨晚睡满了8小时！",
    "description": "难得没有熬夜的一天。你醒来时感觉整个人都是新的——原来睡眠是这种感觉啊。",
    "type": "positive",
    "triggerConditions": {
      "phase": ["coursework", "research", "writing"],
      "minMonth": 2,
      "probability": 0.10,
      "excludeFlag": "insomnia"
    },
    "options": [
      {
        "id": "enjoy_the_day",
        "text": "精神饱满地开始新的一天",
        "effects": { "energy": 20, "mentalHealth": 15, "paperProgress": 5, "luck": 5 },
        "message": "你感觉今天能做之前两倍的工作。事实证明，充足的睡眠是最好的学术生产力工具。"
      }
    ]
  },
  {
    "id": "advisor_praise",
    "name": "导师表扬",
    "title": "🌟 导师居然表扬了你！",
    "description": "在今天的组会上，导师当着所有人的面说你\"最近有进步\"。——这可能是你这辈子听到的最动听的话了。",
    "type": "positive",
    "triggerConditions": {
      "phase": ["research", "writing", "defense"],
      "minMonth": 6,
      "probability": 0.06
    },
    "options": [
      {
        "id": "feel_motivated",
        "text": "感到前所未有的动力",
        "effects": { "energy": 15, "mentalHealth": 20, "advisorSatisfaction": 10, "paperProgress": 10, "luck": 10 },
        "message": "导师的一句话，能让你开心一整天。也许这就是学术PUA的反面——学术激励？"
      }
    ]
  },
  {
    "id": "family_pressure",
    "name": "家庭压力",
    "title": "📞 家里来电话了",
    "description": "妈妈来电：\"你什么时候毕业啊？隔壁老王的儿子都工作三年了，你还在读书？那个……博士是读几年的来着？\"",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research", "writing", "defense"],
      "minMonth": 15,
      "probability": 0.08
    },
    "options": [
      {
        "id": "explain_patiently",
        "text": "耐心解释（第100遍）",
        "effects": { "energy": -5, "mentalHealth": -10, "luck": -5 },
        "message": "你再次解释了博士不是\"读书\"，是一份研究工作。妈妈似懂非懂：\"那你工资多少？\" ——你沉默了。"
      },
      {
        "id": "change_topic",
        "text": "转移话题",
        "effects": { "energy": 0, "mentalHealth": -5, "luck": 5 },
        "message": "你成功把话题转移到了表妹的婚恋问题上。虽然也不太开心，但至少不是你在被审问了。"
      }
    ]
  },
  {
    "id": "overtime_collapse",
    "name": "过劳预警",
    "title": "🚨 身体发出警报",
    "description": "连续熬夜让你的身体开始抗议——头晕、心悸、注意力无法集中。再这样下去，恐怕要出大事。",
    "type": "negative",
    "triggerConditions": {
      "phase": ["research", "writing", "defense"],
      "minMonth": 10,
      "probability": 0.10
    },
    "options": [
      {
        "id": "rest_properly",
        "text": "好好休息一天",
        "effects": { "energy": 30, "mentalHealth": 15, "paperProgress": 0, "luck": 10 },
        "message": "你在宿舍/家里躺了一天，什么都不想。虽然学术进展为零，但你的身体感谢你。",
        "setFlags": { "well_rested": true }
      },
      {
        "id": "push_through",
        "text": "硬撑过去（咖啡+意志力）",
        "effects": { "energy": -20, "mentalHealth": -25, "paperProgress": 5, "luck": -10 },
        "message": "你又灌了一杯咖啡继续干。凌晨三点，你觉得自己像个没有感情的工作机器——然后眼睛一黑。",
        "setFlags": { "insomnia": true }
      }
    ]
  }
]
