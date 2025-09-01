interface TreeNode {
  id: number;
  children?: TreeNode[];
  [key: string]: any; // 其他属性
}

/**
 * 在树形结构中根据 id 数组查找所有匹配的节点
 * @param tree 树形结构数组
 * @param ids 要查找的 id 数组
 * @returns 返回所有匹配的节点数组
 */
export function findNodesByIds(tree: TreeNode[], ids: number[]): TreeNode[] {
  const result: TreeNode[] = [];

  function traverse(node: TreeNode) {
    if (
      ids.includes(node.id) &&
      (!node.childList || node.childList.length === 0)
    ) {
      result.push(node);
    }

    if (node.childList && node.childList.length > 0) {
      for (const item of node.childList) {
        traverse(item);
      }
    }
  }

  for (const node of tree) {
    traverse(node);
  }

  return result;
}
