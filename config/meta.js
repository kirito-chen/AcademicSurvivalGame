/**
 * 学术 Roguelike —— Meta 解锁系统
 *
 * 使用"学术声望"(Academic Prestige, AP)作为 meta 货币
 * 完成一局(无论胜负)获得 AP，用于解锁新内容
 *
 * 解锁内容:
 *   - 新学科
 *   - 新难度
 *   - 新技能卡加入卡池
 *   - 新机遇卡
 */

module.exports = {
  // Meta 货币名称
  currencyName: '学术声望',
  currencyIcon: '⭐',

  // 每局获得的 AP
  // 失败: 基础 AP，按进度加成
  baseAP: 10,
  perAnteAP: 5,        // 每通过 1 个学期 +5 AP
  winBonusAP: 30,      // 通关额外 +30 AP
  achievementBonusAP: 3, // 每解锁 1 个新成就 +3 AP

  // 难度等级 (类似 Balatro 的 Stake)
  difficulties: [
    {
      id: 'normal',
      name: '普通难度',
      description: '标准游戏体验',
      requirement: null,  // 默认解锁
      modifiers: {}
    },
    {
      id: 'hard',
      name: '困难难度',
      description: '关卡目标 +20%，商店价格 +25%',
      requirement: { ap: 50 },
      modifiers: {
        scoreTargetMultiplier: 1.2,
        shopPriceMultiplier: 1.25
      }
    },
    {
      id: 'expert',
      name: '专家难度',
      description: '关卡目标 +50%，Boss 效果翻倍',
      requirement: { ap: 120 },
      modifiers: {
        scoreTargetMultiplier: 1.5,
        bossEffectMultiplier: 2.0
      }
    },
    {
      id: 'nightmare',
      name: '噩梦难度',
      description: '精力消耗 +50%，手牌数量 -1',
      requirement: { ap: 250 },
      modifiers: {
        energyCostMultiplier: 1.5,
        handSizePenalty: 1
      }
    },
    {
      id: 'hell',
      name: '地狱难度',
      description: '所有限制叠加，且技能卡槽位 -1',
      requirement: { ap: 500 },
      modifiers: {
        scoreTargetMultiplier: 1.5,
        shopPriceMultiplier: 1.5,
        energyCostMultiplier: 1.5,
        handSizePenalty: 1,
        skillSlotPenalty: 1
      }
    }
  ],

  // 可解锁的学科 (部分学科需要 AP 解锁)
  lockedDisciplines: [
    {
      id: 'medicine',
      requirement: { ap: 40 },
      unlockMessage: '🔓 解锁新学科：医学！临床与科研并行。'
    },
    {
      id: 'ai',
      requirement: { ap: 80 },
      unlockMessage: '🔓 解锁新学科：人工智能！让机器替你思考。'
    }
  ],

  // 可解锁的技能卡 (加入卡池)
  lockedSkills: [
    {
      id: 'tenure_tracked',
      requirement: { ap: 60 }
    },
    {
      id: 'fields_medal',
      requirement: { ap: 150 }
    },
    {
      id: 'nobel_prize',
      requirement: { ap: 200 }
    },
    {
      id: 'academic_legend',
      requirement: { ap: 300 }
    },
    {
      id: 'singularity',
      requirement: { ap: 400 }
    }
  ],

  // 可解锁的机遇卡
  lockedConsumables: [
    {
      id: 'sabbatical',
      requirement: { ap: 50 }
    },
    {
      id: 'super_upgrade',
      requirement: { ap: 100 }
    },
    {
      id: 'rare_skill_token',
      requirement: { ap: 150 }
    },
    {
      id: 'free_purchase',
      requirement: { ap: 200 }
    }
  ]
}

/**
 * 计算本局获得的 AP
 */
module.exports.calculateAP = function(runResult) {
  let ap = module.exports.baseAP

  // 按进度加成
  if (runResult.anteReached) {
    ap += runResult.anteReached * module.exports.perAnteAP
  }

  // 通关加成
  if (runResult.won) {
    ap += module.exports.winBonusAP
  }

  // 成就加成
  if (runResult.newAchievements) {
    ap += runResult.newAchievements.length * module.exports.achievementBonusAP
  }

  return ap
}
