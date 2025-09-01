<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CheckApi } from '#/api/store/check';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteInventoryMain,
  findImList,
  getInventoryCode,
  getInventoryMain,
} from '#/api/store/check';

import { statusFlagMap, useColumns, useGridFormSchema } from './data';
import InventoryCheckForm from './modules/form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: async ({ page, sorts }, formValues: any) => {
          const params: CheckApi.InventoryMainSearchParam = {
            pageNum: page.currentPage || 1,
            pageSize: page.pageSize || 20,
            ...formValues,
          };

          // 处理排序
          if (sorts && sorts.length > 0) {
            const sort = sorts[0];
            if (sort) {
              params.sortParam = {
                field: sort.field,
                type: sort.order === 'asc' ? 1 : -1,
              };
            }
          }

          const result = await findImList(params);
          return {
            data: result.data || [],
            total: result.total || 0,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<CheckApi.InventoryMain>,

  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<CheckApi.InventoryMain>,
});

// 新增对话框
const [InventoryCheckFormModal, inventoryCheckFormModalApi] = useVbenModal({
  connectedComponent: InventoryCheckForm,
  destroyOnClose: true,
  centered: true,
  width: 1100, // 加宽100像素，从默认的1000px增加到1100px
});

// 新增
const onCreate = async () => {
  try {
    // 调用接口获取盘点单号
    const response = await getInventoryCode();
    console.log('获取盘点单号响应:', response); // 添加日志查看响应结构

    // 根据实际API响应，code为1表示成功
    if (response.data) {
      // 将获取到的盘点单号传递给新增对话框
      inventoryCheckFormModalApi.setData({ code: response.data }).open();
      console.log('成功获取盘点单号:', response.data);
    } else {
      console.error('获取盘点单号失败，响应:', response);
      ElMessage.error(response.msg || '获取盘点单号失败');
      // 即使获取失败，也打开新增对话框
      inventoryCheckFormModalApi.setData({}).open();
    }
  } catch (error) {
    console.error('获取盘点单号失败:', error);
    ElMessage.error('获取盘点单号失败');
    // 即使获取失败，也打开新增对话框
    inventoryCheckFormModalApi.setData({}).open();
  }
};

// 新增成功
const onFormSuccess = () => {
  gridApi.query();
  ElMessage.success('创建成功');
};

// 修改
const onEdit = async () => {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要修改的盘点单');
    return;
  }

  try {
    // 调用接口获取盘点单详情
    const response = await getInventoryMain(selectedRow.id);
    if (response.data) {
      // 打开修改对话框，传递盘点单数据和模式
      inventoryCheckFormModalApi
        .setData({
          ...response.data,
          mode: 'edit',
        })
        .open();
    } else {
      ElMessage.error('获取盘点单详情失败');
    }
  } catch (error) {
    console.error('获取盘点单详情失败:', error);
    ElMessage.error('获取盘点单详情失败');
  }
};

// 删除
const onDelete = async () => {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要删除的盘点单');
    return;
  }

  // 检查状态，已完成的盘点单不允许删除
  if (selectedRow.statusFlag === 3) {
    ElMessage.warning('盘点完成的订单不允许删除');
    return;
  }

  try {
    // 显示确认对话框
    const confirmed = await ElMessageBox.confirm(
      `确定要删除盘点单 "${selectedRow.code}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    if (confirmed) {
      // 调用删除API
      await deleteInventoryMain(selectedRow.id);
      ElMessage.success('删除成功');

      // 刷新列表
      gridApi.query();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  }
};

// 详情
const onDetail = async () => {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要查看的盘点单');
    return;
  }

  try {
    // 调用接口获取盘点单详情
    const response = await getInventoryMain(selectedRow.id);
    if (response.data) {
      // 打开详情对话框，传递盘点单数据和模式
      inventoryCheckFormModalApi
        .setData({
          ...response.data,
          mode: 'detail',
        })
        .open();
    } else {
      ElMessage.error('获取盘点单详情失败');
    }
  } catch (error) {
    console.error('获取盘点单详情失败:', error);
    ElMessage.error('获取盘点单详情失败');
  }
};

// 审核
const onAudit = async () => {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要审核的盘点单');
    return;
  }

  try {
    // 调用接口获取盘点单详情
    const response = await getInventoryMain(selectedRow.id);
    if (response.data) {
      // 打开审核对话框，传递盘点单数据和模式
      inventoryCheckFormModalApi
        .setData({
          ...response.data,
          mode: 'audit',
        })
        .open();
    } else {
      ElMessage.error('获取盘点单详情失败');
    }
  } catch (error) {
    console.error('获取盘点单详情失败:', error);
    ElMessage.error('获取盘点单详情失败');
  }
};

// 打印
const onPrint = () => {
  ElMessage.info('打印功能待实现');
};

// 下载
const onDownload = () => {
  ElMessage.info('下载功能待实现');
};
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="盘点列表">
      <template #statusFlag="{ row }">
        <ElTag :type="statusFlagMap[row.statusFlag]?.color || 'danger'">
          {{ statusFlagMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onCreate">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary" @click="onEdit">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" @click="onDelete">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton type="primary" @click="onDetail">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton type="primary" @click="onAudit">
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary" @click="onPrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
          <ElButton type="primary" @click="onDownload">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 新增对话框 -->
    <InventoryCheckFormModal @success="onFormSuccess" />
  </Page>
</template>
