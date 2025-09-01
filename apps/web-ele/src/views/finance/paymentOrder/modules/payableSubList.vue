<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { EmployeeApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPayableSubList } from '#/api';

const emits = defineEmits(['select']);
const formData = ref<null | Record<string, any>>(null);
const selectRow = ref<EmployeeApi.Employee | null>();
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      // formApi.resetForm();
      if (values) {
        formData.value = values;
        // formApi.setValues(values);
      }
    }
  },
  title: '选择核销单据',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'code',
        label: '付款流水号',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'formCode',
        label: '核销单据',
        componentProps: {
          clearable: true,
        },
      },
    ],
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-3',
  },
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'code',
        title: '付款流水号',
        width: 160,
      },
      {
        field: 'formCode',
        title: '核销单据',
        width: 160,
      },
      {
        field: 'supplierName',
        title: '供应商',
        formatter: () => formData.value?.supplierName,
      },
      {
        field: 'typeNameZh',
        title: '单据类型',
      },
      {
        field: 'totalNum',
        title: '单据总量',
      },
      {
        field: 'balanceMoney',
        title: '应付金额(元)',
      },
      {
        field: 'amountPaid',
        title: '已付金额(元)',
      },
      {
        field: 'amountUnpaid',
        title: '未付金额(元)',
      },
      {
        field: 'remark',
        title: '备注',
      },
    ],
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
          // console.log('formValues', formValues);
          return await getPayableSubList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            mainId: formData.value?.mainId,
            supplierId: formData.value?.supplierId,
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
  } as VxeTableGridOptions<EmployeeApi.Employee>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: EmployeeApi.Employee }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<EmployeeApi.Employee>,
});

function onSelect() {
  useSelectedRow(selectRow.value)(() => {
    emits('select', selectRow.value);
    modalApi.close();
  });
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Modal class="w-3/5">
    <Grid table-title="应付款单列表" class="vp-raw h-[500px] w-full">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onRefresh">
            <IconifyIcon
              icon="material-symbols-light:search-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            查询
          </ElButton>
          <ElButton type="primary" @click="onSelect">
            <IconifyIcon
              icon="ep:select"
              class="size-5"
              style="margin-right: 4px"
            />
            选择
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
