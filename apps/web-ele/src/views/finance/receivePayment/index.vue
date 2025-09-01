<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ReceivePaymentApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteReceivePaymentById, getReceivePaymentList } from '#/api';
import { receivePaymentStatusFlagMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Audit from './modules/audit.vue';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

console.warn('rights', rights);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
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
          return await getReceivePaymentList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            typeName: 1,
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
  } as VxeTableGridOptions<ReceivePaymentApi.ReceivePayment>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InComeApi.InCome }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<ReceivePaymentApi.ReceivePayment>,
});

// function onRefresh() {
//   gridApi.query();
// }

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [AuditModel, auditModelApi] = useVbenModal({
  connectedComponent: Audit,
  destroyOnClose: true,
});

function onEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    if (![1, 5].includes(data.statusFlag)) {
      ElMessage({
        message: `只能修改状态为[草稿,驳回]的数据!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    formModelApi.setData(data).open();
  });
}

function onDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    deleteReceivePaymentById({ id: data.id }).then(() => {
      gridApi.query();
    });
  }, true);
}

function onAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    if (data.statusFlag !== 2) {
      ElMessage({
        message: `只能审批状态为待审批的数据!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    auditModelApi.setData(data).open();
  });
}
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="() => gridApi.query()" />
    <AuditModel @success="() => gridApi.query()" />
    <Grid table-title="免收制单列表">
      <template #statusFlag="{ row }">
        {{ receivePaymentStatusFlagMap[row.statusFlag] || '--' }}
      </template>
      <template #createTime="{ row }">
        {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #managerTime="{ row }">
        {{ row.managerTime ? dayjs(row.managerTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="() => formModelApi.setData({}).open()"
          >
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
          <ElButton type="primary" @click="onAudit">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="icon-park-outline:audit"
            />
            审批
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />打印
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
