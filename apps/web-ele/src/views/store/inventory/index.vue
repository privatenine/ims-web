<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CheckApi } from '#/api';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { findIm2List, getInventory2Code } from '#/api/store/check';
import BalanceSelectDialog from '#/components/BalanceSelectDialog.vue';

import { useColumns, useGridFormSchema } from './data';
import Audit from './modules/audit.vue';
import Detail from './modules/detail.vue';
import InventoryForm from './modules/form.vue';

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
          const params: CheckApi.InventoryMain2SearchParam = {
            pageNum: page.currentPage || 1,
            pageSize: page.pageSize || 20,
            ...formValues,
          };

          // 处理日期转换
          if (params.startTime) {
            params.startTime = new Date(
              params.startTime as unknown as string,
            ).getTime();
          }
          if (params.endTime) {
            params.endTime = new Date(
              params.endTime as unknown as string,
            ).getTime();
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

          const result = await findIm2List(params);
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
    // 添加选择配置
    checkboxConfig: {
      reserve: true,
    },
    radioConfig: {
      reserve: true,
      trigger: 'row',
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
  } as VxeTableGridOptions<CheckApi.InventoryMain2RespVO>,

  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<CheckApi.InventoryMain2RespVO>,
});

const inventoryFormVisible = ref(false);
const currentFormData = ref<Partial<CheckApi.InventoryMain2RespVO>>({});
const balanceSelectVisible = ref(false);
const currentInventoryFormRef = ref<null | {
  addBalanceDetail: (balance: any) => void;
}>(null);

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
    // 调用接口获取盘盈盘亏单号
    const response = await getInventory2Code();
    console.log('获取盘盈盘亏单号响应:', response);

    if (response.data) {
      // 获取当前用户信息
      const currentUser = getCurrentUser();

      // 初始化表单数据
      currentFormData.value = {
        code: response.data, // 盘盈盘亏单号
        createTime: getCurrentTimestamp(), // 制单日期（当前时间戳）
        createName: currentUser.name, // 制单人（当前用户）
        statusFlag: 1, // 草稿状态
        totalNum: 0,
        totalPrice: 0,
        remark: '',
        storeId: undefined, // 仓库ID，需要用户选择
        storeName: '',
        storeSiteName: '',
      };

      console.log('初始化盘盈盘亏单数据:', currentFormData.value);
      inventoryFormVisible.value = true;
    } else {
      console.error('获取盘盈盘亏单号失败，响应:', response);
      // 即使获取失败，也打开新增对话框，使用默认数据
      const currentUser = getCurrentUser();
      currentFormData.value = {
        code: '',
        createTime: getCurrentTimestamp(),
        createName: currentUser.name,
        statusFlag: 1,
        totalNum: 0,
        totalPrice: 0,
        remark: '',
        storeId: undefined,
        storeName: '',
        storeSiteName: '',
      };
      inventoryFormVisible.value = true;
    }
  } catch (error) {
    console.error('获取盘盈盘亏单号失败:', error);
    // 发生错误时，使用默认数据打开新增对话框
    const currentUser = getCurrentUser();
    currentFormData.value = {
      code: '',
      createTime: getCurrentTimestamp(),
      createName: currentUser.name,
      statusFlag: 1,
      totalNum: 0,
      totalPrice: 0,
      remark: '',
      storeId: undefined,
      storeName: '',
      storeSiteName: '',
    };
    inventoryFormVisible.value = true;
  }
}

function handleEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((row: any) => {
    if (row.statusFlag && ![1, 5].includes(row.statusFlag)) {
      ElMessage({
        message: `只能修改草稿状态的盘盈盘亏单!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    currentFormData.value = row || {};
    inventoryFormVisible.value = true;
  });
}

function handleDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((row: any) => {
    if (row.statusFlag && ![1, 5].includes(row.statusFlag)) {
      ElMessage({
        message: `只能删除草稿状态的盘盈盘亏单!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    // TODO: 删除确认和API调用
    console.log('删除选中记录:', row);
  });
}

const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
});

function handleDetail() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    detailModelApi.setData(data).open(),
  );
}

const [AuditModel, auditModelApi] = useVbenModal({
  connectedComponent: Audit,
  destroyOnClose: true,
  centered: true,
});

function handleApproval() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data: any) => {
    if (data.statusFlag && [1, 5].includes(data.statusFlag)) {
      ElMessage.warning('请先提交');
      return;
    }
    auditModelApi.setData(data).open();
  });
}

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

  console.log('选中的库存数据:', balance);

  // 将选中的库存传递给表单组件
  if (currentInventoryFormRef.value) {
    currentInventoryFormRef.value.addBalanceDetail(balance);
  } else {
    ElMessage.error('表单组件引用不存在');
  }
}

// function onRefresh() {
//   gridApi.query();
// }
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="盘盈盘亏列表">
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
          <ElButton type="primary" @click="handleApproval">
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审批
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 新增/编辑盘盈盘亏对话框 -->
    <InventoryForm
      ref="currentInventoryFormRef"
      v-model:visible="inventoryFormVisible"
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
    <DetailModel />

    <!-- 审核对话框 -->
    <AuditModel @success="gridApi.query()" />
  </Page>
</template>
