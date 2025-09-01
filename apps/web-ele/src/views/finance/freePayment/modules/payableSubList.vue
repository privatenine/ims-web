<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CustomerApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPayableSubList } from '#/api';

const emits = defineEmits(['select']);
const formData = ref<Record<string, any>>({});
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
      const { value } = modalApi.getData<Record<string, any>>();
      console.warn(3333, value);
      if (value) {
        formData.value = { ...value };
      }
    }
  },
  title: '选择客户',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      // {
      //   component: 'Input',
      //   fieldName: 'shortName',
      //   label: '简拼码',
      //   componentProps: {
      //     clearable: true,
      //     placeholder: '请输入简拼码',
      //   },
      // },
      {
        component: 'Input',
        fieldName: 'code',
        label: '收款流水号',
        componentProps: {
          clearable: true,
          placeholder: '请输入收款流水号',
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
        title: '收款流水号',
        width: 160,
      },
      {
        field: 'formCode',
        title: '收款单据',
        width: 160,
      },
      {
        // field: 'shortName',
        title: '客户名称',
        width: 100,
        formatter: () => {
          return formData.value?.custName;
        },
      },
      // {
      //   field: 'shortName',
      //   title: '应收金额',
      // },
      {
        field: 'amountPaid',
        title: '实收金额',
        width: 80,
      },
      {
        field: 'amountUnpaid',
        title: '未收金额',
        width: 80,
      },
      // {
      //   field: 'shortName',
      //   title: '收款方式',
      // },
      {
        field: 'totalNum',
        title: '单据总数',
        width: 80,
      },
      // {
      //   field: 'shortName',
      //   title: '制单人',
      // },
      {
        field: 'createTime',
        title: '制单日期',
        width: 100,
        formatter: ({ cellValue }) => {
          return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
        },
      },
      {
        field: 'approveName',
        title: '审核员',
        width: 80,
      },
      {
        field: 'approveTime',
        title: '审核日期',
        width: 100,
        formatter: ({ cellValue }) => {
          return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
        },
      },
      {
        field: 'typeNameZh',
        title: '单据类别',
        width: 120,
      },
      // {
      //   field: 'shortName',
      //   title: '年月',
      // },
      {
        field: 'remark',
        title: '备注',
        width: 200,
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
            mainId: formData.value?.formId,
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
  } as VxeTableGridOptions<CustomerApi.Customer>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: PayableApi.Payable }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<CustomerApi.Customer>,
});

function onSelect() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    emits('select', data);
    modalApi.close();
  });
}
</script>
<template>
  <Modal class="w-3/5">
    <Grid table-title="客户列表" class="vp-raw h-[500px] w-full">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="() => gridApi.query()">
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
