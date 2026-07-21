/**
 * 学术生存指南 —— 里程碑事件配置
 * 阶段过渡时触发的关键事件，有实际后果
 */
module.exports = {
  // 入学适应 → 课程学习（month 3）
  qualifying_exam: {
    id: 'qualifying_exam',
    title: '📋 博士生资格考试',
    description: '入学三个月了，导师通知你参加博士生资格考试。这是读博的第一道关卡——考不过就得打包走人。',
    icon: '📋',
    type: 'milestone',
    triggerPhase: 'enrollment',
    options: [
      {
        id: 'prepare_hard',
        text: '认真准备一个月',
        effects: { energy: -20, paperProgress: 8, mentalHealth: -5, advisorSatisfaction: 5 },
        message: '你泡在图书馆一个月，把该看的文献都啃完了。考试顺利通过，导师点点头表示认可。',
        setFlags: { qualifying_exam: 'passed' }
      },
      {
        id: 'cram_last_minute',
        text: '临时抱佛脚',
        effects: { energy: -8, paperProgress: 2, mentalHealth: -10, advisorSatisfaction: -5 },
        message: '你考前三天才开始复习，差点没答完题。虽然擦线过了，但导师对你印象打了折扣。',
        setFlags: { qualifying_exam: 'passed_barely' }
      },
      {
        id: 'ask_seniors',
        text: '找师兄师姐要往年题（需要社交资本≥20）',
        effects: { energy: -10, paperProgress: 12, advisorSatisfaction: 10, socialCapital: 5 },
        message: '师兄师姐给了你近五年的真题，你发现出题套路万年不变。轻松高分通过，导师对你刮目相看！',
        setFlags: { qualifying_exam: 'passed_honors' },
        requirements: { socialCapital: 20 }
      }
    ]
  },

  // 科研攻关 → 论文写作（paper ≥ 50 且 month ≥ 20）
  proposal_defense: {
    id: 'proposal_defense',
    title: '📄 学位论文开题答辩',
    description: '你的开题答辩定在下周。实验室三年的研究方向，将由五位教授在半小时内评判是否值得继续。',
    icon: '📄',
    type: 'milestone',
    triggerPhase: 'research',
    options: [
      {
        id: 'prepare_perfect',
        text: '精心准备PPT和演讲稿',
        effects: { energy: -25, paperProgress: 15, advisorSatisfaction: 15, mentalHealth: -10 },
        message: '你在镜子前练了十遍，答辩当天自信流利。五位教授频频点头，一致通过！',
        setFlags: { proposal: 'excellent' }
      },
      {
        id: 'data_focused',
        text: '重点展示数据，少说废话',
        effects: { energy: -15, paperProgress: 8, advisorSatisfaction: 5 },
        message: '你用了大量的图表和数据。虽然表达平淡，但扎实的数据让教授们挑不出毛病。通过！',
        setFlags: { proposal: 'passed' }
      },
      {
        id: 'mock_defense',
        text: '找人帮忙模拟答辩（需要社交资本≥30）',
        effects: { energy: -10, paperProgress: 12, advisorSatisfaction: 10, socialCapital: 10, luck: 10 },
        message: '师兄师姐帮你模拟了三轮，把所有可能的问题都预演了。正式答辩时你对答如流，教授们非常满意！',
        setFlags: { proposal: 'excellent' },
        requirements: { socialCapital: 30 }
      }
    ]
  },

  // 论文写作 → 答辩冲刺（paper ≥ 90 且 month ≥ 30）
  pre_defense: {
    id: 'pre_defense',
    title: '🎤 博士预答辩',
    description: '正式答辩前，导师安排了预答辩。这是最后的演练机会——也是导师最后一次在公开场合骂你的机会。',
    icon: '🎤',
    type: 'milestone',
    triggerPhase: 'writing',
    options: [
      {
        id: 'go_all_out',
        text: '全力以赴打磨论文和PPT',
        effects: { energy: -30, paperProgress: 15, mentalHealth: -15, advisorSatisfaction: 10 },
        message: '你整整两周没出实验室。预答辩上你的表现让导师罕见地露出了微笑。正式答辩应该没问题了！',
        setFlags: { pre_defense: 'excellent', defense_confidence: 20 }
      },
      {
        id: 'moderate_prep',
        text: '适度准备，保持心态',
        effects: { energy: -15, paperProgress: 5, mentalHealth: 5, advisorSatisfaction: 5 },
        message: '你没有过度消耗自己，PPT做完了就按时睡觉。导师觉得你再努力一点会更好，但你自己很满意。',
        setFlags: { pre_defense: 'passed', defense_confidence: 10 }
      },
      {
        id: 'senior_advice',
        text: '请教学长学姐答辩经验（需要社交资本≥25）',
        effects: { energy: -10, paperProgress: 10, socialCapital: 10, luck: 15 },
        message: '学长们给了你一堆实用建议：哪个教授喜欢问什么问题、什么时候该喝水拖延时间……你感觉自己已经掌握了答辩的精髓。',
        setFlags: { pre_defense: 'excellent', defense_confidence: 25 },
        requirements: { socialCapital: 25 }
      }
    ]
  },

  // 答辩阶段随机触发
  blind_review: {
    id: 'blind_review',
    title: '📧 论文盲审结果返回',
    description: '你的毕业论文盲审意见回来了。三份评审意见摆在你面前——这将决定你能否参加最终答辩。',
    icon: '📧',
    type: 'milestone',
    triggerPhase: 'defense',
    options: [
      {
        id: 'minor_revision',
        text: '按意见认真修改',
        effects: { energy: -15, paperProgress: 5, mentalHealth: -5, luck: 10 },
        message: '评审意见总体正面，你花了一周修改。修改后的论文更加完善，导师也说"这下稳了"。',
        setFlags: { blind_review: 'passed' }
      },
      {
        id: 'argue_back',
        text: '对不合理意见提出申诉',
        effects: { energy: -10, paperProgress: 2, mentalHealth: -10, luck: 5 },
        message: '有一条评审意见明显是没仔细看论文的结果。你礼貌地回复了申辩，最终被接受了。',
        setFlags: { blind_review: 'argued' }
      }
    ]
  }
}
