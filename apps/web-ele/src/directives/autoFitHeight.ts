import type { Directive } from 'vue';

const vAutoFitHeight: Directive = {
  mounted(el: HTMLElement) {
    const tableContainer = el.closest('.table-container');
    if (tableContainer) {
      // 获取表单容器和按钮容器的高度
      const queryFormContainer = document.querySelector(
        '.query-form-container',
      );
      const queryBtnContainer = document.querySelector('.query-btn-container');
      const paginationContainer = document.querySelector(
        '.pagination-container',
      );

      const updateTableHeight = () => {
        const formHeight = queryFormContainer?.clientHeight || 0;
        const btnHeight = queryBtnContainer?.clientHeight || 0;
        const paginationHeight = paginationContainer?.clientHeight || 0;
        const windowHeight = window.innerHeight;

        // 计算表格容器可用高度
        const availableHeight =
          windowHeight - formHeight - btnHeight - paginationHeight - 150; // 一些边距

        // 设置表格容器高度
        tableContainer.style.height = `${availableHeight}px`;
        tableContainer.style.overflow = 'hidden';

        // 查找并设置表头固定
        const tableHeader = tableContainer.querySelector(
          '.el-table__header-wrapper',
        );
        const tableBody = tableContainer.querySelector(
          '.el-table__body-wrapper',
        );

        if (tableHeader) {
          tableHeader.style.position = 'sticky';
          tableHeader.style.top = '0';
          tableHeader.style.zIndex = '10';
          tableHeader.style.background = 'white';
        }

        if (tableBody) {
          tableBody.style.maxHeight = `${availableHeight - (tableHeader?.clientHeight || 0)}px`;
          tableBody.style.overflowY = 'auto';
          // 设置底部padding为tableHeader的高度
          tableBody.style.paddingBottom = `40px`;
        }
      };

      updateTableHeight();

      // 监听窗口大小变化
      window.addEventListener('resize', updateTableHeight);

      // 在元素卸载时移除事件监听
      const removeListener = () => {
        window.removeEventListener('resize', updateTableHeight);
        el.removeEventListener('DOMNodeRemoved', removeListener);
      };
      el.addEventListener('DOMNodeRemoved', removeListener);
    }
  },
};

export default vAutoFitHeight;
