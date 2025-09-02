export * from './date';
export * from './enum';
export * from './treeNode';
export * from './useMenuRights';

// 回显数据字典
export function selectDictLabel(datas: any[], value, labelName = 'label', valueName = 'value') {
  if (!datas) {
    return
  }
  var actions = []
  // debugger
  Object.keys(datas).some((key) => {
    if (datas[key][valueName] === ('' + value) || datas[key][valueName] === value) {
      actions.push(datas[key][labelName])
      return true
    }
  })
  return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, valueStr, labelName = 'label', valueName = 'value') {
  if (!datas || datas.length === 0) return
  if (!valueStr) return
  const labels = []
  const valueArr = (valueStr + '').split(',')
  datas.forEach(row => {
    const v = row[valueName]
    if (valueArr.indexOf(v.toString()) !== -1) {
      labels.push(row[labelName] || null)
    }
  })
  return labels.join(',')
}

