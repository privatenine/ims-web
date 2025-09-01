<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DeliveryApi } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveDeliveryOrder,
  deleteDeliveryOrderById,
  getDeliveryCode,
  getDeliveryOrderList,
  reverseApproveDeliveryOrder,
} from '#/api';

import { useColumns, useGridFormSchema } from './data';
import DeliveryForm from './modules/form.vue';

// 防止重复请求的标志
const isQuerying = ref(false);

// 选中行数据
const selectedRow = ref<DeliveryApi.DeliveryOrderMainRespVO | null>(null);

// 表单状态
const deliveryFormVisible = ref(false);
const currentFormData = ref<Partial<DeliveryApi.DeliveryOrderMainRespVO>>({});

const [Grid, gridApi] = useVbenVxeGrid<DeliveryApi.DeliveryOrderMainRespVO>({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'X']],
    wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: async ({ page, sort }, formValues: any) => {
          // 防止重复请求
          if (isQuerying.value) {
            return { data: [], total: 0 };
          }

          try {
            isQuerying.value = true;

            // 处理日期范围
            let endTime, startTime;
            if (formValues.startTime) {
              startTime = new Date(formValues.startTime).getTime();
            }
            if (formValues.endTime) {
              endTime = new Date(formValues.endTime).getTime();
            }

            const response = await getDeliveryOrderList({
              ...formValues,
              startTime,
              endTime,
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              sortParam: {
                field: sort.field || 'createTime',
                type: sort.order === 'asc' ? 1 : -1,
              },
            });

            return {
              data: response.data || [],
              total: response.total || 0,
            };
          } catch (error) {
            console.error('获取配送订单列表失败:', error);
            ElMessage.error('获取数据失败');
            return { data: [], total: 0 };
          } finally {
            isQuerying.value = false;
          }
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
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
  } as VxeTableGridOptions<DeliveryApi.DeliveryOrderMainRespVO>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
    radioChange({ row }) {
      selectedRow.value = row;
    },
  } as VxeGridListeners<DeliveryApi.DeliveryOrderMainRespVO>,
});

// function onRefresh() {
//   gridApi.grid.clearRadioRow();
//   if (!isQuerying.value) {
//     gridApi.query();
//   }
// }

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

// 搜索函数
function onSearch() {
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 新增
async function onCreate() {
  try {
    // 调用接口获取配送流水号
    const response = await getDeliveryCode();
    console.log('获取配送流水号响应:', response);

    if (response.data) {
      // 获取当前用户信息
      const currentUser = getCurrentUser();

      // 初始化表单数据
      currentFormData.value = {
        code: response.data, // 配送流水号
        createTime: getCurrentTimestamp(), // 制单日期（当前时间戳）
        createName: currentUser.name, // 制单人（当前用户）
        statusFlag: 1, // 草稿状态
        totalNum: 0,
        totalMoney: 0,
        remark: '',
        carNum: '',
        logisticsName: '',
        logisticsNumber: '',
      };

      console.log('初始化配送单数据:', currentFormData.value);
      deliveryFormVisible.value = true;
    } else {
      console.error('获取配送流水号失败，响应:', response);
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
        carNum: '',
        logisticsName: '',
        logisticsNumber: '',
      };
      deliveryFormVisible.value = true;
    }
  } catch (error) {
    console.error('获取配送流水号失败:', error);
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
      carNum: '',
      logisticsName: '',
      logisticsNumber: '',
    };
    deliveryFormVisible.value = true;
  }
}

// 修改
function onEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.info('修改功能待开发');
  });
}

// 删除
async function onDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      await deleteDeliveryOrderById({ id: data.id! });
      ElMessage.success('删除成功');
      gridApi.query();
    } catch (error) {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  });
}

// 详情
function onDetail() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.info('详情功能待开发');
  });
}

// 审核
async function onAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    if (data.statusFlag !== 2) {
      ElMessage.warning('只有待审批状态的订单才能审核');
      return;
    }

    try {
      await approveDeliveryOrder({
        id: data.id!,
        version: data.version!,
      });
      ElMessage.success('审核成功');
      gridApi.query();
    } catch (error) {
      console.error('审核失败:', error);
      ElMessage.error('审核失败');
    }
  });
}

// 反审
async function onReverseAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    if (data.statusFlag !== 3) {
      ElMessage.warning('只有配送结束状态的订单才能反审');
      return;
    }

    try {
      await reverseApproveDeliveryOrder({
        id: data.id!,
        version: data.version!,
      });
      ElMessage.success('反审成功');
      gridApi.query();
    } catch (error) {
      console.error('反审失败:', error);
      ElMessage.error('反审失败');
    }
  });
}

// 打印
function onPrint() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.info('打印功能待开发');
  });
}

// 获取配送状态标签类型
function getStatusTagType(
  status: number,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  const statusTypeMap: Record<
    number,
    'danger' | 'info' | 'primary' | 'success' | 'warning'
  > = {
    1: 'warning', // 草稿
    2: 'info', // 待审批
    3: 'success', // 配送结束
    4: 'danger', // 驳回
  };
  return statusTypeMap[status] || 'info';
}

// 获取配送状态文本
function getStatusText(status: number): string {
  const statusTextMap: Record<number, string> = {
    1: '草稿',
    2: '待审批',
    3: '配送结束',
    4: '驳回',
  };
  return statusTextMap[status] || '未知';
}

// 表单确认处理
function onFormConfirm(data: any) {
  console.log('表单确认数据:', data);
  // TODO: 保存数据并刷新列表
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="配送流水号管理" class="w-full">
      <template #statusFlag="{ row }">
        <ElTag :type="getStatusTagType(row.statusFlag)">
          {{ getStatusText(row.statusFlag) }}
        </ElTag>
      </template>

      <template #toolbar-tools>
        <ElButton
          type="primary"
          @click="onSearch"
          class="mr-2"
          :loading="isQuerying"
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          查询
        </ElButton>
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
          <ElButton type="primary" @click="onReverseAudit">
            <IconifyIcon
              icon="material-symbols:undo-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            反审
          </ElButton>
          <ElButton type="primary" @click="onPrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 新增/编辑配送单对话框 -->
    <DeliveryForm
      v-model:visible="deliveryFormVisible"
      :form-data="currentFormData"
      @confirm="onFormConfirm"
    />
  </Page>
</template>
