<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CompanyApi, PaymentOrderApi } from '#/api';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePaymentOrderById,
  getCompanyList,
  getPaymentOrderList,
} from '#/api';
import { PaymentOrderStatusMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const companyList = ref<CompanyApi.Company[]>([]);
onMounted(() => {
  getCompanyList({}).then(({ data }: { data: CompanyApi.Company[] }) => {
    companyList.value = data;
  });
});
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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
          return await getPaymentOrderList({
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
  } as VxeTableGridOptions<PaymentOrderApi.PaymentOrder>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: PaymentOrderApi.PaymentOrder }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<PaymentOrderApi.PaymentOrder>,
});

function onRefresh() {
  gridApi.query();
}

function editSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: PaymentOrderApi.PaymentOrder | undefined) => void,
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: PaymentOrderApi.PaymentOrder | undefined) => void,
    true,
  );
}

function detailSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    detailModelApi.setData(data).open();
  });
}
function onCreate() {
  formModelApi.setData({}).open();
}
function onEdit(row: PaymentOrderApi.PaymentOrder) {
  formModelApi.setData(row).open();
}
function onDelete(row: PaymentOrderApi.PaymentOrder) {
  const hideLoading = ElMessage({
    message: `正在删除...`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deletePaymentOrderById({ id: row.id })
    .then(() => {
      ElMessage({
        message: `删除成功!`,
        type: 'success',
        plain: true,
      });
      onRefresh();
    })
    .finally(() => {
      hideLoading.close();
    });
}
const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <DetailModel />
    <Grid table-title="付款单列表">
      <template #statusFlag="{ row }">
        <ElTag :type="PaymentOrderStatusMap[row.statusFlag]?.color || 'danger'">
          {{ PaymentOrderStatusMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #createTime="{ row }">
        {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : '--' }}
      </template>
      <template #approveTime="{ row }">
        {{
          row.approveTime ? dayjs(row.approveTime).format('YYYY-MM-DD') : '--'
        }}
      </template>
      <template #typeName="{ row }">
        {{
          companyList &&
          companyList.find((item) => item.balanceType === row.typeName)
            ?.accountName
        }}
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="onCreate"
            v-if="rights.includes('新增')"
          >
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton
            type="primary"
            @click="editSelectRow"
            v-if="rights.includes('修改')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton
            type="primary"
            @click="deleteSelectRow"
            v-if="rights.includes('删除')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton
            type="primary"
            @click="detailSelectRow"
            v-if="rights.includes('详情')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('下载模板')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols-light:download"
            />
            下载模板
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('下载数据')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols-light:download"
            />
            下载数据
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('上传数据')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:upload-rounded"
            />
            上传数据
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
