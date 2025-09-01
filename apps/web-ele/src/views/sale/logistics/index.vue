<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { useColumns, useGridFormSchema } from './data';

// 发货数据接口
interface LogisticsItem {
  id: number;
  sort: number;
  shipmentCode: string;
  shipmentStatus: string;
  createName: string;
  createTime: number;
  approveName?: string;
  approveTime?: number;
  cardNumber: string;
  carPlate: string;
  totalAmount: number;
  totalQuantity: number;
  remark?: string;
}

// 模拟数据 - 根据图片内容创建
const mockData: LogisticsItem[] = [
  {
    id: 1,
    sort: 1,
    shipmentCode: 'FHD152508190000002',
    shipmentStatus: 'draft',
    createName: '叶艳',
    createTime: new Date('2025-08-19').getTime(),
    approveName: '',
    approveTime: 0,
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 7260,
    totalQuantity: 71,
    remark: '',
  },
  {
    id: 2,
    sort: 2,
    shipmentCode: 'FHD152508190000001',
    shipmentStatus: 'draft',
    createName: '叶艳',
    createTime: new Date('2025-08-19').getTime(),
    approveName: '',
    approveTime: 0,
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 320,
    totalQuantity: 11,
    remark: '其他',
  },
  {
    id: 3,
    sort: 3,
    shipmentCode: 'FHD152508180000001',
    shipmentStatus: 'finished',
    createName: '叶艳',
    createTime: new Date('2025-08-18').getTime(),
    approveName: '叶艳',
    approveTime: new Date('2025-08-19').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 5285,
    totalQuantity: 65,
    remark: '',
  },
  {
    id: 4,
    sort: 4,
    shipmentCode: 'FHD152508170000003',
    shipmentStatus: 'finished',
    createName: '叶艳',
    createTime: new Date('2025-08-17').getTime(),
    approveName: '叶艳',
    approveTime: new Date('2025-08-18').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 3145,
    totalQuantity: 20,
    remark: '宇鑫物流',
  },
  {
    id: 5,
    sort: 5,
    shipmentCode: 'FHD152508170000002',
    shipmentStatus: 'finished',
    createName: '叶艳',
    createTime: new Date('2025-08-17').getTime(),
    approveName: '叶艳',
    approveTime: new Date('2025-08-17').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 1985,
    totalQuantity: 25,
    remark: '',
  },
  {
    id: 6,
    sort: 6,
    shipmentCode: 'FHD152508170000001',
    shipmentStatus: 'finished',
    createName: '叶艳',
    createTime: new Date('2025-08-17').getTime(),
    approveName: '叶艳',
    approveTime: new Date('2025-08-18').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 610,
    totalQuantity: 7,
    remark: '其他',
  },
  {
    id: 7,
    sort: 7,
    shipmentCode: 'FHD152508160000003',
    shipmentStatus: 'finished',
    createName: '王丽',
    createTime: new Date('2025-08-16').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-17').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 8065,
    totalQuantity: 81,
    remark: '',
  },
  {
    id: 8,
    sort: 8,
    shipmentCode: 'FHD152508160000002',
    shipmentStatus: 'finished',
    createName: '王丽',
    createTime: new Date('2025-08-16').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-16').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 915,
    totalQuantity: 15,
    remark: '',
  },
  {
    id: 9,
    sort: 9,
    shipmentCode: 'FHD152508160000001',
    shipmentStatus: 'finished',
    createName: '王丽',
    createTime: new Date('2025-08-16').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-16').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 1225,
    totalQuantity: 15,
    remark: '',
  },
  {
    id: 10,
    sort: 10,
    shipmentCode: 'FHD152508150000002',
    shipmentStatus: 'finished',
    createName: '王丽',
    createTime: new Date('2025-08-15').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-16').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 125,
    totalQuantity: 4,
    remark: '',
  },
  {
    id: 11,
    sort: 11,
    shipmentCode: 'FHD152508150000001',
    shipmentStatus: 'finished',
    createName: '王丽',
    createTime: new Date('2025-08-15').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-16').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 5055,
    totalQuantity: 60,
    remark: '',
  },
  {
    id: 12,
    sort: 12,
    shipmentCode: 'FHD152508140000002',
    shipmentStatus: 'finished',
    createName: '叶艳',
    createTime: new Date('2025-08-14').getTime(),
    approveName: '王丽',
    approveTime: new Date('2025-08-15').getTime(),
    cardNumber: '',
    carPlate: '叉车',
    totalAmount: 5255,
    totalQuantity: 54,
    remark: '',
  },
];

// 防止重复请求的标志
const isQuerying = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
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
        query: async ({ page: _page, sort: _sort }, formValues: any) => {
          // 防止重复请求
          if (isQuerying.value) {
            return { data: [], total: 0 };
          }

          try {
            isQuerying.value = true;

            // 这里应该调用真实的API接口
            // 目前使用模拟数据
            let filteredData = [...mockData];

            // 根据表单值过滤数据
            if (formValues.orderCode) {
              filteredData = filteredData.filter((item) =>
                item.shipmentCode.includes(formValues.orderCode),
              );
            }

            if (formValues.carPlate) {
              filteredData = filteredData.filter(
                (item) => item.carPlate === formValues.carPlate,
              );
            }

            if (formValues.shipmentStatus) {
              filteredData = filteredData.filter(
                (item) => item.shipmentStatus === formValues.shipmentStatus,
              );
            }

            // 日期过滤
            if (formValues.startTime) {
              const startTime = new Date(formValues.startTime).getTime();
              filteredData = filteredData.filter(
                (item) => item.createTime >= startTime,
              );
            }

            if (formValues.endTime) {
              const endTime = new Date(formValues.endTime).getTime();
              filteredData = filteredData.filter(
                (item) => item.createTime <= endTime,
              );
            }

            return {
              data: filteredData,
              total: filteredData.length,
            };
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
  } as VxeTableGridOptions<LogisticsItem>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<LogisticsItem>,
});

// function onRefresh() {
//   gridApi.grid.clearRadioRow();
//   if (!isQuerying.value) {
//     gridApi.query();
//   }
// }

// 搜索函数
function onSearch() {
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 新增
function onCreate() {
  ElMessage.info('新增功能待开发');
}

// 修改
function onEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('修改功能待开发');
}

// 删除
function onDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('删除功能待开发');
}

// 详情
function onDetail() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('详情功能待开发');
}

// 审核
function onAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('审核功能待开发');
}

// 驳回
function onReject() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('驳回功能待开发');
}

// 打印
function onPrint() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('打印功能待开发');
}

// 发货
function onShipment() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('发货功能待开发');
}

// 获取发货状态标签类型
function getStatusTagType(
  status: string,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  const statusTypeMap: Record<
    string,
    'danger' | 'info' | 'primary' | 'success' | 'warning'
  > = {
    finished: 'success',
    draft: 'warning',
  };
  return statusTypeMap[status] || 'info';
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="发货流水号管理" class="w-full">
      <template #shipmentStatus="{ row }">
        <ElTag :type="getStatusTagType(row.shipmentStatus)">
          {{
            row.shipmentStatus === 'finished'
              ? '发货结束'
              : row.shipmentStatus === 'draft'
                ? '草稿'
                : row.shipmentStatus
          }}
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
          <ElButton type="primary" @click="onReject">
            <IconifyIcon
              icon="material-symbols:thumb-down-outline-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            驳回
          </ElButton>
          <ElButton type="primary" @click="onPrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
          <ElButton type="primary" @click="onShipment">
            <IconifyIcon
              icon="material-symbols:local-shipping-outline-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            发货
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
