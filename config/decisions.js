/**
 * 学术生存指南 —— 每月决策配置
 * 5 种决策的消耗/收益定义
 */
module.exports = [
  {
    "id": "run_experiment",
    "name": "做实验",
    "icon": "🔬",
    "category": "academic",
    "description": "在实验室埋头苦干，跑数据、调参数。可能出成果，也可能只是浪费了试剂。",
    "baseEffects": {
      "energy": -20,
      "paperProgress": [5, 15],
      "advisorSatisfaction": [0, 5],
      "money": 0,
      "mentalHealth": -5,
      "socialCapital": 0,
      "luck": 0
    },
    "randomModifier": {
      "successRate": 0.55,
      "onSuccess": {
        "effects": {
          "paperProgress": 15,
          "advisorSatisfaction": 10,
          "luck": 10
        },
        "message": "数据非常漂亮！导师在组会上公开表扬了你。这一刻，你觉得科研真有意思。"
      },
      "onFailure": {
        "effects": {
          "energy": -10,
          "mentalHealth": -15,
          "luck": -10
        },
        "message": "仪器又坏了……这已经是本月第三次了。你在实验室角落默默流泪。"
      }
    },
    "requirements": { "minEnergy": 15, "minMoney": 0 },
    "dailyLimit": 3,
    "eventChanceModifier": 0.8
  },
  {
    "id": "write_paper",
    "name": "写论文",
    "icon": "📝",
    "category": "academic",
    "description": "坐在电脑前，面对LaTeX模板。写三行删两行，今天也是高效的一天呢。",
    "baseEffects": {
      "energy": -15,
      "paperProgress": [10, 20],
      "advisorSatisfaction": [2, 5],
      "money": 0,
      "mentalHealth": -8,
      "socialCapital": 0,
      "luck": 0
    },
    "randomModifier": {
      "successRate": 0.5,
      "onSuccess": {
        "effects": {
          "paperProgress": 20,
          "mentalHealth": 10,
          "luck": 5
        },
        "message": "灵感爆发！一口气写了三页，而且居然没有报错。今天是高产的一天。"
      },
      "onFailure": {
        "effects": {
          "energy": -10,
          "mentalHealth": -10,
          "paperProgress": -5
        },
        "message": "写了一整天，最后发现自己一直在改格式。学术写作的精髓就是——格式。"
      }
    },
    "requirements": { "minEnergy": 10, "minMoney": 0 },
    "dailyLimit": 2,
    "eventChanceModifier": 0.6
  },
  {
    "id": "meeting",
    "name": "和导师开会",
    "icon": "👨‍🏫",
    "category": "academic",
    "description": "每周一次的'审判日'。带上你的PPT和一颗坚强的心。",
    "baseEffects": {
      "energy": -10,
      "paperProgress": [0, 5],
      "advisorSatisfaction": [8, 15],
      "money": 0,
      "mentalHealth": [-10, 5],
      "socialCapital": 3,
      "luck": 0
    },
    "randomModifier": {
      "successRate": 0.7,
      "onSuccess": {
        "effects": {
          "advisorSatisfaction": 15,
          "paperProgress": 10,
          "mentalHealth": 10
        },
        "message": "导师对你的进展很满意，甚至给你发了个👍的表情包。难得的好会！"
      },
      "onFailure": {
        "effects": {
          "advisorSatisfaction": -10,
          "mentalHealth": -20,
          "energy": -10
        },
        "message": "导师：\"你这个进度……我当年一周就搞定了。\" ——你的内心：那你来啊。"
      }
    },
    "requirements": { "minEnergy": 5, "minMoney": 0 },
    "dailyLimit": 1,
    "eventChanceModifier": 0.3
  },
  {
    "id": "slack_off",
    "name": "摸鱼",
    "icon": "🎮",
    "category": "rest",
    "description": "刷B站、逛知乎、打游戏……总之就是不想搞学术。适当的摸鱼是为了更好地科研（大概）。",
    "baseEffects": {
      "energy": 25,
      "paperProgress": [-5, 0],
      "advisorSatisfaction": [-5, 0],
      "money": [-30, 0],
      "mentalHealth": 15,
      "socialCapital": 0,
      "luck": [-5, 5]
    },
    "randomModifier": {
      "successRate": 0.3,
      "onSuccess": {
        "effects": {
          "mentalHealth": 20,
          "luck": 15,
          "energy": 15
        },
        "message": "刷到了一篇Nature上的神文……虽然不是你写的，但你决定把它转发到朋友圈装一下。"
      },
      "onFailure": {
        "effects": {
          "mentalHealth": -10,
          "advisorSatisfaction": -15,
          "paperProgress": -10
        },
        "message": "正摸鱼到一半，导师突然出现在你身后。空气凝固了。"
      }
    },
    "requirements": { "minEnergy": 0, "minMoney": 0 },
    "dailyLimit": 2,
    "eventChanceModifier": 1.2
  },
  {
    "id": "side_hustle",
    "name": "做副业",
    "icon": "💰",
    "category": "side_hustle",
    "description": "帮人写代码、做数据分析、翻译论文……博士生也得恰饭啊。",
    "baseEffects": {
      "energy": -25,
      "paperProgress": [-3, 0],
      "advisorSatisfaction": [-3, 0],
      "money": [200, 500],
      "mentalHealth": [-5, 5],
      "socialCapital": 2,
      "luck": 0
    },
    "randomModifier": {
      "successRate": 0.6,
      "onSuccess": {
        "effects": {
          "money": 500,
          "socialCapital": 10,
          "mentalHealth": 10
        },
        "message": "接了个大单！虽然用了你的科研技能帮别人写PPT，但挣钱嘛，不寒碜。"
      },
      "onFailure": {
        "effects": {
          "energy": -15,
          "mentalHealth": -15,
          "money": -100
        },
        "message": "甲方改了十八遍需求，最后说\"还是第一版好\"。你失去了金钱、精力和对人类的信任。"
      }
    },
    "requirements": { "minEnergy": 15, "minMoney": 0 },
    "dailyLimit": 1,
    "eventChanceModifier": 0.5
  }
]
