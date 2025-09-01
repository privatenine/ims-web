<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SupplierApi } from '#/api';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSupplierList } from '#/api';
import Form from '#/views/contactUnits/supplier/modules/form.vue';

const emits = defineEmits(['select']);
// const formData = ref();
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  showConfirmButton: false,
  centered: true,
  draggable: true,
  // onClosed() {
  //   emits('select', {});
  //   modalApi.close();
  // },
  onCancel() {
    // emits('select', {});
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // const values = modalApi.getData<Record<string, any>>();
      // modalApi.formApi.resetForm();
      // if (values) {
      // formData.value = values;
      //   formApi.setValues(values);
      // }
    } else {
      emits('select', gridApi.grid.getRadioRecord());
    }
  },
  title: '供应商列表',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'shortName',
        label: '简拼码',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'fullName',
        label: '供应商名称',
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
        field: 'fullName',
        title: '供应商名称',
        width: 100,
        sortable: true,
      },
      {
        field: 'creditLimit',
        title: '合计金额',
        width: 100,
        sortable: true,
      },
      {
        field: 'shortName',
        title: '简称',
        sortable: true,
      },
      {
        field: 'address',
        title: '供应商地址',
        sortable: true,
      },
      {
        field: 'fax',
        title: '传真',
        sortable: true,
      },
      {
        field: 'telephone',
        title: '电话',
        sortable: true,
      },
      {
        field: 'mobilePhone',
        title: '手机',
        sortable: true,
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
          return await getSupplierList({
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
  } as VxeTableGridOptions<SupplierApi.Supplier>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: SupplierApi.Supplier }) {
    //   selectRow.value = row;
    // },
    cellDblclick({ row }) {
      emits('select', row);
      modalApi.close();
    },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<SupplierApi.Supplier>,
});

function onSelect() {
  const selectedRow = gridApi.grid.getRadioRecord();
  useSelectedRow(selectedRow)(() => {
    emits('select', selectedRow);
    modalApi.close();
  });
}

function onRefresh() {
  gridApi.query();
}

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

function onCreate() {
  formModelApi.setData({}).open();
}
</script>
<template>
  <Modal class="max-h-5/6 h-5/6 w-[850px]">
    <FormModel @success="onRefresh" />
    <Grid table-title="供应商列表" class="p-raw h-full">
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
          <ElButton type="primary" @click="onCreate">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
