<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SupplierApi } from '#/api';
import type { PurchaseOrderApi } from '#/api/purchase/order';

import { nextTick, onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPurchaseOrderList } from '#/api/purchase/order';

import SupplierList from '../inStorage/modules/supplierList.vue';
import { useColumns, useGridFormSchema } from './data';
import OrderDetail from './modules/orderDetail.vue';

// const selectRow = ref<PurchaseOrderApi.PurchaseOrder | null>();
const selectedSupplier = ref<null | SupplierApi.Supplier>(null);

// 定义一个标志来防止重复初始化
let isInitialized = false;

onMounted(() => {
  if (!isInitialized) {
    isInitialized = true;

    // 延迟更新schema，避免立即触发查询
    nextTick(() => {
      gridApi.formApi.updateSchema([
        {
          fieldName: 'supplierName',
          componentProps: {
            onClick: () => {
              supplierModelApi.open();
            },
          },
        },
      ]);
    });
  }
});

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
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          return await getPurchaseOrderList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            sortParam: {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            },
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
      // labelField: 'name',
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
  } as VxeTableGridOptions<PurchaseOrderApi.PurchaseOrder>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: PurchaseOrderApi.PurchaseOrder }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<PurchaseOrderApi.PurchaseOrder>,
});

function onRefresh() {
  gridApi.query();
}

const [SupplierModel, supplierModelApi] = useVbenModal({
  connectedComponent: SupplierList,
  destroyOnClose: true,
  centered: true,
});

// 详情对话框
const [OrderDetailModal, orderDetailModalApi] = useVbenModal({
  connectedComponent: OrderDetail,
  destroyOnClose: true,
  centered: true,
  title: '采购订单详情',
});

// 查看详情
function onDetail() {
  const selectData = gridApi.grid.getRadioRecord();
  if (!selectData) {
    ElMessage.warning('请先选择一行数据');
    return;
  }

  orderDetailModalApi
    .setData({
      orderData: selectData,
    })
    .open();
}
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="采购订单列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" disabled>
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
          <ElButton type="primary">
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols-light:download-rounded"
            />
            下载
          </ElButton>
          <ElButton type="primary">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:select-all-on-20-regular"
            />
            强制完成
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 供应商选择对话框 -->
    <SupplierModel
      @select="
        (data) => {
          gridApi.formApi.setValues({
            supplierId: data?.id || '',
            supplierName: data?.fullName || '',
          });
        }
      "
    />

    <!-- 订单详情对话框 -->
    <OrderDetailModal />
  </Page>
</template>
