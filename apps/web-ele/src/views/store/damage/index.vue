<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DamageApi } from '#/api';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteReportLossMain,
  findReportLossMain,
  getReportLossCode,
  getReportLossMainList,
} from '#/api/store/damage';
import BalanceSelectDialog from '#/components/BalanceSelectDialog.vue';

import { useColumns, useGridFormSchema } from './data';
import DamageAudit from './modules/audit.vue';
import DamageDetail from './modules/detail.vue';
import DamageForm from './modules/form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true, // 改为true，支持实时查询
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
          const params: DamageApi.ReportLossMainSearchParam = {
            pageNum: page.currentPage || 1,
            pageSize: page.pageSize || 20,
            ...formValues,
          };

          // 处理日期范围转换
          if (
            params.dateRange &&
            Array.isArray(params.dateRange) &&
            params.dateRange.length === 2
          ) {
            params.startTime = new Date(params.dateRange[0]).getTime();
            params.endTime = new Date(params.dateRange[1]).getTime();
            // 删除dateRange参数，避免API调用错误
            delete params.dateRange;
          }

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

          const result = await getReportLossMainList(params);
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
    // 添加选择配置
    checkboxConfig: {
      reserve: true,
    },
    radioConfig: {
      reserve: true,
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: false, // 移除刷新按钮
      search: false, // 移除搜索按钮
      zoom: true,
    },
  } as VxeTableGridOptions<DamageApi.ReportLossMainItem>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<DamageApi.ReportLossMainItem>,
});

const damageFormVisible = ref(false);
const currentFormData = ref<Partial<DamageApi.ReportLossMainItem>>({});
const balanceSelectVisible = ref(false);
const currentDamageFormRef = ref<null | {
  addBalanceDetail: (balance: any) => void;
}>(null);

// 详情对话框
const [DamageDetailModal, damageDetailModalApi] = useVbenModal({
  connectedComponent: DamageDetail,
  destroyOnClose: true,
  centered: true,
});

// 审核对话框
const [DamageAuditModal, damageAuditModalApi] = useVbenModal({
  connectedComponent: DamageAudit,
  destroyOnClose: true,
  centered: true,
});

// 获取当前用户信息
function getCurrentUser() {
  // 这里应该从用户store或localStorage获取当前用户信息
  // 暂时返回模拟数据，实际项目中需要替换为真实的用户信息获取逻辑
  return {
    id: 1,
    name: '当前用户', // 这里应该获取真实的用户名
    // 其他用户信息...
  };
}

// 获取当前时间戳
function getCurrentTimestamp() {
  return Date.now();
}

async function handleAdd() {
  try {
    // 调用接口获取报损单号
    const response = await getReportLossCode();
    console.log('获取报损单号响应:', response);

    if (response.data) {
      // 获取当前用户信息
      const currentUser = getCurrentUser();

      // 初始化表单数据
      currentFormData.value = {
        code: response.data, // 报损单号
        createTime: getCurrentTimestamp(), // 制单日期（当前时间戳）
        createName: currentUser.name, // 制单人（当前用户）
        moveUserId: currentUser.id, // 移动员工ID
        statusFlag: 1, // 草稿状态
        totalNum: 0,
        totalMoney: 0,
        remark: '',
        storeId: 0,
        storeName: '',
        storeSiteName: '',
        // 添加其他必要字段
        id: undefined,
        moveWorker: currentUser.name,
      };

      console.log('初始化报损单数据:', currentFormData.value);
      damageFormVisible.value = true;
    } else {
      console.error('获取报损单号失败，响应:', response);
      // 即使获取失败，也打开新增对话框，使用默认数据
      const currentUser = getCurrentUser();
      currentFormData.value = {
        code: '',
        createTime: getCurrentTimestamp(),
        createName: currentUser.name,
        statusFlag: 1,
        totalNum: 0,
        totalMoney: 0,
        remark: '',
        storeId: 0,
        storeName: '',
        storeSiteName: '',
      };
      damageFormVisible.value = true;
    }
  } catch (error) {
    console.error('获取报损单号失败:', error);
    // 发生错误时，使用默认数据打开新增对话框
    const currentUser = getCurrentUser();
    currentFormData.value = {
      code: '',
      createTime: getCurrentTimestamp(),
      createName: currentUser.name,
      statusFlag: 1,
      totalNum: 0,
      totalMoney: 0,
      remark: '',
      storeId: 0,
      storeName: '',
      storeSiteName: '',
    };
    damageFormVisible.value = true;
  }
}

function handleEdit() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    // TODO: 显示提示消息
    console.log('请选择要修改的记录');
    return;
  }
  currentFormData.value = selectedRow;
  damageFormVisible.value = true;
}

async function handleDelete() {
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择要删除的报损单');
    return;
  }

  try {
    // 显示确认对话框
    const confirmed = await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.length} 个报损单吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    if (confirmed) {
      // 逐个删除选中的报损单
      for (const row of selectedRows) {
        try {
          // 调用删除API
          await deleteReportLossMain(row.id);
          console.log('删除报损单成功:', row.id);
        } catch (error) {
          console.error('删除报损单失败:', error);
          // 继续删除其他报损单，不中断流程
        }
      }

      ElMessage.success(`成功删除 ${selectedRows.length} 个报损单`);

      // 刷新列表
      gridApi.query();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除报损单失败:', error);
      ElMessage.error('删除报损单失败');
    }
  }
}

async function handleDetail() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要查看的报损单');
    return;
  }

  try {
    // 获取最新的报损单数据
    const response = await findReportLossMain(selectedRow.id);
    if (response.code === 0 && response.data) {
      damageDetailModalApi.setData(response.data).open();
    } else {
      ElMessage.error('获取报损单数据失败');
    }
  } catch (error) {
    ElMessage.error('获取报损单数据失败');
    console.error('获取报损单数据失败:', error);
  }
}

async function handleAudit() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择要审核的报损单');
    return;
  }

  // 检查状态，只有待审核状态才能审核
  if (selectedRow.statusFlag !== 2) {
    ElMessage.warning('只有待审核状态的报损单才能审核');
    return;
  }

  try {
    // 获取最新的报损单数据
    const response = await findReportLossMain(selectedRow.id);
    if (response.code === 0 && response.data) {
      damageAuditModalApi.setData(response.data).open();
    } else {
      ElMessage.error('获取报损单数据失败');
    }
  } catch (error) {
    ElMessage.error('获取报损单数据失败');
    console.error('获取报损单数据失败:', error);
  }
}

function handlePrint() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    // TODO: 显示提示消息
    console.log('请选择要打印的记录');
    return;
  }
  // TODO: 打印逻辑
  console.log('打印记录:', selectedRow);
}

function handleDownloadImage() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    // TODO: 显示提示消息
    console.log('请选择要下载图片的记录');
    return;
  }
  // TODO: 下载图片逻辑
  console.log('下载图片:', selectedRow);
}

// 删除搜索和刷新函数，因为不再需要
// function onSearch() {
//   gridApi.query();
// }

// function onRefresh() {
//   gridApi.query();
// }

function onFormConfirm(data: any) {
  console.log('表单确认数据:', data);
  // TODO: 保存数据并刷新列表
  gridApi.query();
}

// 处理添加明细事件
function handleAddDetail() {
  balanceSelectVisible.value = true;
}

// 库存选择确认回调
function onBalanceSelectConfirm(balance: any) {
  if (!balance) {
    ElMessage.warning('未选择任何库存');
    return;
  }

  // 将选中的库存传递给表单组件
  if (currentDamageFormRef.value) {
    currentDamageFormRef.value.addBalanceDetail(balance);
  }

  // 关闭对话框
  balanceSelectVisible.value = false;
  ElMessage.success('成功添加明细');
}
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="报损单列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="handleAdd">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary" @click="handleEdit">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" @click="handleDelete">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton type="primary" @click="handleDetail">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton type="primary" @click="handleAudit">
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary" @click="handlePrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
          <ElButton type="primary" @click="handleDownloadImage">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载图片
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 新增/编辑报损单对话框 -->
    <DamageForm
      ref="currentDamageFormRef"
      v-model:visible="damageFormVisible"
      :form-data="currentFormData"
      @confirm="onFormConfirm"
      @add-detail="handleAddDetail"
    />

    <!-- 库存选择对话框 -->
    <BalanceSelectDialog
      v-model:open="balanceSelectVisible"
      @success="onBalanceSelectConfirm"
      @cancel="balanceSelectVisible = false"
    />

    <!-- 详情对话框 -->
    <DamageDetailModal />

    <!-- 审核对话框 -->
    <DamageAuditModal @success="onFormConfirm" />
  </Page>
</template>
