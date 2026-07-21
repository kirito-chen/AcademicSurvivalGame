/**
 * 学术生存指南 —— 学科定义
 * 不同学科的研究内容、事件描述差异化
 */
module.exports = [
  {
    id: 'cs',
    name: '计算机科学',
    icon: '💻',
    research: '跑仿真、调参数、改代码',
    experiment: 'debug了一整天，最后发现是少了个分号',
    paper: '投了篇CVPR，祈祷审稿人心情好',
    flavor: {
      experimentSuccess: '代码跑通了！准确率提升了0.5%，可以写论文了。',
      experimentFail: '服务器又崩了……这个月的实验白跑了。',
      meetingTopic: '导师问你的实验baseline为什么选这个'
    }
  },
  {
    id: 'ai',
    name: '人工智能',
    icon: '🤖',
    research: '训练模型、调超参数、等GPU',
    experiment: '模型跑了三天三夜，loss纹丝不动',
    paper: '论文标题：《基于改进Transformer的xxx研究》',
    flavor: {
      experimentSuccess: 'Loss终于降了！虽然只降了0.01，但趋势是对的！',
      experimentFail: '梯度爆炸了……所有结果变成NaN，一切回到原点。',
      meetingTopic: '导师问你为什么不试试大模型'
    }
  },
  {
    id: 'bio',
    name: '生物学',
    icon: '🧬',
    research: '养细胞、跑电泳、做PCR',
    experiment: '细胞污染了，三个月的培养白费了',
    paper: 'Western blot跑了十几遍终于有一条能看的带',
    flavor: {
      experimentSuccess: 'PCR条带完美！这可能是你本月唯一的好消息。',
      experimentFail: '细胞房温度失控，所有细胞全军覆没。你欲哭无泪。',
      meetingTopic: '导师说你这个结果换个角度就是一篇Nature'
    }
  },
  {
    id: 'physics',
    name: '物理学',
    icon: '⚛️',
    research: '推公式、算数据、等机时',
    experiment: '同步辐射的机时又被取消了',
    paper: '理论很美，但实验数据就是不对',
    flavor: {
      experimentSuccess: '实验数据完美吻合理论曲线！导师说可以发PRL。',
      experimentFail: '真空又漏了……这已经是本月第三次了。',
      meetingTopic: '导师在黑板上推了三小时的公式'
    }
  },
  {
    id: 'chem',
    name: '化学',
    icon: '🧪',
    research: '过柱子、打核磁、写报告',
    experiment: '反应产率只有3%，还不够打核磁的',
    paper: '好不容易做出来的产物，表征数据不全被拒了',
    flavor: {
      experimentSuccess: '产率突破80%！你激动得差点打翻反应瓶。',
      experimentFail: '试剂用错了……整个反应体系全是副产物。',
      meetingTopic: '导师让你把过柱子的溶剂换一种试试'
    }
  },
  {
    id: 'math',
    name: '数学',
    icon: '📐',
    research: '推定理、写证明、找反例',
    experiment: '证明写了十页，最后一步发现有个反例',
    paper: '投稿Annals of Mathematics，审稿周期：未知',
    flavor: {
      experimentSuccess: '那个卡了半年的引理终于证出来了！数学之美！',
      experimentFail: '同行在你论文里发现了一个致命漏洞。你无言以对。',
      meetingTopic: '导师说你的证明不够优雅'
    }
  },
  {
    id: 'ee',
    name: '电子工程',
    icon: '🔌',
    research: '画PCB、调电路、写固件',
    experiment: '板子焊好了，但通电就冒烟',
    paper: '实测数据永远比仿真差30%',
    flavor: {
      experimentSuccess: '示波器波形完美！你的电路设计是正确的。',
      experimentFail: '芯片烧了……而且这是最后一片样片。',
      meetingTopic: '导师问你这个指标能不能再优化一点'
    }
  },
  {
    id: 'medicine',
    name: '医学',
    icon: '🩺',
    research: '收病例、做统计、值夜班',
    experiment: '临床样本不够，统计学意义达不到',
    paper: 'Meta分析做到一半发现已经有人发过了',
    flavor: {
      experimentSuccess: 'P值小于0.05！统计学意义成立！可以开始写论文了。',
      experimentFail: '患者脱落率太高，临床试验被迫中止。',
      meetingTopic: '导师让你把样本量再扩大一倍'
    }
  }
]
