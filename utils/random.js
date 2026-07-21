/**
 * 学术生存指南 —— 随机数工具
 * 提供加权随机、范围随机、概率判定等核心随机功能
 */

/**
 * 生成 [min, max] 范围内的随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成 [min, max] 范围内的随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机浮点数
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * 按概率判定是否触发
 * @param {number} probability - 概率值 (0~1)
 * @returns {boolean} 是否触发
 */
function rollChance(probability) {
  return Math.random() < probability
}

/**
 * 加权随机抽取
 * @param {Array<{item: any, weight: number}>} weightedList - 带权重的列表
 * @returns {any} 被选中的 item，若列表为空则返回 null
 */
function weightedRandom(weightedList) {
  if (!weightedList || weightedList.length === 0) return null

  const totalWeight = weightedList.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0)
  if (totalWeight <= 0) return null

  let random = Math.random() * totalWeight
  for (const entry of weightedList) {
    random -= Math.max(0, entry.weight)
    if (random <= 0) return entry.item
  }

  // 兜底：返回最后一个
  return weightedList[weightedList.length - 1].item
}

/**
 * 从数组中随机抽取一个元素
 * @param {Array} arr - 数组
 * @returns {any} 随机元素
 */
function randomPick(arr) {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 打乱数组（Fisher-Yates 洗牌）
 * @param {Array} arr - 数组
 * @returns {Array} 打乱后的新数组
 */
function shuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 解析范围值，若为数组则取随机值，否则返回原值
 * @param {number|Array<number>} rangeValue - 固定值或 [min, max] 范围
 * @returns {number} 解析后的数值
 */
function resolveRange(rangeValue) {
  if (Array.isArray(rangeValue)) {
    return randomInt(rangeValue[0], rangeValue[1])
  }
  return rangeValue
}

module.exports = {
  randomInt,
  randomFloat,
  rollChance,
  weightedRandom,
  randomPick,
  shuffle,
  resolveRange
}
