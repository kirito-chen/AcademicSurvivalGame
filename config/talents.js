/**
 * 学术生存指南 —— 技能特长配置
 * 选择学科后选择一项个人特长，影响整局游戏的策略方向
 * modifiers 在 DecisionResolver 中应用
 */
module.exports = [
  {
    id: 'iron_man',
    name: '铁人',
    icon: '💪',
    description: '精力消耗减少20%，但论文进度增长减慢15%',
    flavor: '你在健身房撸铁的时间比在实验室还多。身体是革命的本钱——至少你一直这么安慰自己。',
    modifiers: {
      energyCost: 0.8,        // 精力消耗乘以 0.8
      paperGain: 0.85         // 论文进度增益乘以 0.85
    }
  },
  {
    id: 'genius',
    name: '天才学者',
    icon: '🧠',
    description: '论文进度增长+25%，但精力消耗+15%',
    flavor: '你智商超群，看论文一目十行。但脑子太活跃也有副作用——你经常失眠到凌晨三点。',
    modifiers: {
      paperGain: 1.25,        // 论文进度增益乘以 1.25
      energyCost: 1.15         // 精力消耗乘以 1.15
    }
  },
  {
    id: 'social_expert',
    name: '社交达人',
    icon: '🤝',
    description: '开会/社交效果翻倍，但做实验效率-20%',
    flavor: '你可能是全学院人脉最广的博士生。从院长到食堂阿姨，没有你不认识的人。不过实验室里的时间自然就少了。',
    modifiers: {
      socialGain: 2.0,         // 社交资本增益翻倍
      advisorGain: 1.5,        // 导师满意度增益+50%
      experimentEffect: 0.8    // 做实验的论文收益-20%
    }
  },
  {
    id: 'money_maker',
    name: '理财高手',
    icon: '💰',
    description: '副业收入+50%，但精力消耗+20%',
    flavor: '你对赚钱有天然的嗅觉。帮人写代码、做咨询、甚至倒卖二手设备——博士生的工资不够花？那就自己赚。',
    modifiers: {
      moneyGain: 1.5,          // 金钱增益+50%
      energyCost: 1.2          // 精力消耗+20%
    }
  },
  {
    id: 'lucky_dog',
    name: '锦鲤体质',
    icon: '🍀',
    description: '好运事件概率+40%，但初始存款-2000',
    flavor: '你从小到大运气都不错——高考超常发挥、考研压线录取、博士也侥幸上岸。但你不太会管钱，存款总是莫名其妙就没了。',
    modifiers: {
      luckGain: 1.4,           // 正面随机事件概率+40%
      initialMoney: -2000      // 初始存款减少
    }
  }
]
