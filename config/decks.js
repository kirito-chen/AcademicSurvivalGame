/**
 * 学术 Roguelike —— 学科初始牌组
 * 8 个学科，每个学科有 12 张初始卡牌
 *
 * 学科设计思路:
 *   - 每个学科对应不同的卡牌类型比例
 *   - 计算机科学: 偏分析
 *   - 生物学: 偏实验
 *   - 数学: 偏分析+写作
 *   - 物理学: 均衡偏实验
 *   - 化学: 实验为主
 *   - 电子工程: 分析+实验
 *   - 医学: 实验+社交
 *   - 人工智能: 分析为主
 */

module.exports = [
  {
    id: 'cs',
    name: '计算机科学',
    icon: '💻',
    description: '代码即真理，数据即一切',
    flavor: '你的研究工具是键盘和显示器。实验？不存在的——你跑的是仿真。',
    // 分析6 + 写作3 + 教学2 + 社交1
    cards: [
      { id: 'statistical_test', count: 2 },
      { id: 'code_debugging', count: 2 },
      { id: 'data_mining', count: 1 },
      { id: 'machine_learning', count: 1 },
      { id: 'draft_writing', count: 2 },
      { id: 'latex_formatting', count: 1 },
      { id: 'ta_session', count: 1 },
      { id: 'mentoring', count: 1 },
      { id: 'group_meeting', count: 1 }
    ]
  },
  {
    id: 'biology',
    name: '生物学',
    icon: '🧬',
    description: '生命自有其奥秘，你的任务就是解开它',
    flavor: '实验室是你的第二个家。培养基、显微镜、PCR仪——这些才是你的论文产出工具。',
    // 实验7 + 写作2 + 分析2 + 社交1
    cards: [
      { id: 'controlled_experiment', count: 2 },
      { id: 'pilot_study', count: 2 },
      { id: 'field_study', count: 1 },
      { id: 'replication_study', count: 1 },
      { id: 'collaboration_exp', count: 1 },
      { id: 'draft_writing', count: 1 },
      { id: 'figure_making', count: 1 },
      { id: 'statistical_test', count: 1 },
      { id: 'visualization', count: 1 },
      { id: 'group_meeting', count: 1 }
    ]
  },
  {
    id: 'math',
    name: '数学',
    icon: '📐',
    description: '纸上得来终觉浅？不，证明就写在纸上',
    flavor: '你不需要实验室，一支笔一张纸就是你的全部。哦，还有咖啡——大量的咖啡。',
    // 分析5 + 写作4 + 教学2 + 社交1
    cards: [
      { id: 'statistical_test', count: 2 },
      { id: 'meta_analysis', count: 1 },
      { id: 'code_debugging', count: 1 },
      { id: 'machine_learning', count: 1 },
      { id: 'draft_writing', count: 2 },
      { id: 'literature_review', count: 1 },
      { id: 'abstract_writing', count: 1 },
      { id: 'ta_session', count: 2 },
      { id: 'group_meeting', count: 1 }
    ]
  },
  {
    id: 'physics',
    name: '物理学',
    icon: '⚛️',
    description: '从夸克到宇宙，一切皆可计算',
    flavor: '理论和实验并重。今天推导方程，明天去对撞机取数据。物理学家的日常就是这么朴实无华。',
    // 实验4 + 分析3 + 写作3 + 社交2
    cards: [
      { id: 'controlled_experiment', count: 2 },
      { id: 'lab_rush', count: 1 },
      { id: 'equipment_rental', count: 1 },
      { id: 'statistical_test', count: 1 },
      { id: 'data_mining', count: 1 },
      { id: 'machine_learning', count: 1 },
      { id: 'draft_writing', count: 1 },
      { id: 'polished_manuscript', count: 1 },
      { id: 'latex_formatting', count: 1 },
      { id: 'group_meeting', count: 1 },
      { id: 'conference_talk', count: 1 }
    ]
  },
  {
    id: 'chemistry',
    name: '化学',
    icon: '🧪',
    description: '试剂、反应、合成——化学的浪漫',
    flavor: '你每天的工作就是和各种试剂打交道。有些实验会产生漂亮的颜色，有些会产生难闻的气味。大部分两者都有。',
    // 实验7 + 写作2 + 分析1 + 社交2
    cards: [
      { id: 'controlled_experiment', count: 2 },
      { id: 'pilot_study', count: 2 },
      { id: 'lab_rush', count: 1 },
      { id: 'replication_study', count: 1 },
      { id: 'equipment_rental', count: 1 },
      { id: 'draft_writing', count: 1 },
      { id: 'figure_making', count: 1 },
      { id: 'statistical_test', count: 1 },
      { id: 'group_meeting', count: 1 },
      { id: 'advisor_meeting', count: 1 }
    ]
  },
  {
    id: 'ee',
    name: '电子工程',
    icon: '🔌',
    description: '硬件、软件、固件——全栈工程师的学术版',
    flavor: '你既写代码又焊电路。有时候一个bug花三天找到——原来是线没插好。',
    // 实验3 + 分析5 + 写作2 + 社交2
    cards: [
      { id: 'controlled_experiment', count: 2 },
      { id: 'equipment_rental', count: 1 },
      { id: 'code_debugging', count: 2 },
      { id: 'data_mining', count: 1 },
      { id: 'machine_learning', count: 1 },
      { id: 'visualization', count: 1 },
      { id: 'draft_writing', count: 1 },
      { id: 'latex_formatting', count: 1 },
      { id: 'group_meeting', count: 1 },
      { id: 'collaboration_exp', count: 1 }
    ]
  },
  {
    id: 'medicine',
    name: '医学',
    icon: '🩺',
    description: '临床与科研并行，一边救人一边发论文',
    flavor: '你的"实验室"是病房和诊室。患者的数据就是你的数据，治愈的效果就是你的成果。',
    // 实验5 + 分析2 + 写作3 + 社交2
    cards: [
      { id: 'controlled_experiment', count: 2 },
      { id: 'field_study', count: 2 },
      { id: 'pilot_study', count: 1 },
      { id: 'statistical_test', count: 1 },
      { id: 'meta_analysis', count: 1 },
      { id: 'draft_writing', count: 1 },
      { id: 'literature_review', count: 1 },
      { id: 'polished_manuscript', count: 1 },
      { id: 'group_meeting', count: 1 },
      { id: 'advisor_meeting', count: 1 }
    ]
  },
  {
    id: 'ai',
    name: '人工智能',
    icon: '🤖',
    description: '让机器学会思考，或者至少学会模仿',
    flavor: '调参、炼丹、等待——AI研究的三大步骤。今天又训了个新模型，虽然不知道它学了啥，但准确率挺高的。',
    // 分析6 + 写作3 + 实验1 + 社交2
    cards: [
      { id: 'statistical_test', count: 1 },
      { id: 'data_mining', count: 2 },
      { id: 'code_debugging', count: 1 },
      { id: 'machine_learning', count: 2 },
      { id: 'draft_writing', count: 1 },
      { id: 'latex_formatting', count: 1 },
      { id: 'abstract_writing', count: 1 },
      { id: 'controlled_experiment', count: 1 },
      { id: 'group_meeting', count: 1 },
      { id: 'conference_talk', count: 1 }
    ]
  }
]

module.exports.getById = function(id) {
  return module.exports.find(d => d.id === id)
}
