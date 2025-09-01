<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BillApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBillList } from '#/api';

const selectRow = ref<BillApi.Bill>({});

const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
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
      if (values) {}
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid<BillApi.Bill>({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'custName',
        label: '简拼码',
        componentProps: {
          clearable: true,
          placeholder: '请输入简拼码',
        },
      },
      {
        component: 'Input',
        fieldName: 'custName',
        label: '名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入名称',
        },
      },

      {
        component: 'Checkbox',
        fieldName: 'custName',
        label: '模糊',
        componentProps: {
          clearable: true,
        },
      },

      {
        component: 'Input',
        fieldName: 'custName',
        label: '单号',
        componentProps: {
          clearable: true,
        },
      },
    ],
    submitOnChange: true,
  },
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'code',
        title: '出库编码',
      },
      {
        field: 'code',
        title: '客户',
      },
      {
        field: 'code',
        title: '产品名称',
      },
      {
        field: 'code',
        title: '单价',
      },
      {
        field: 'code',
        title: '实际出货',
      },
      {
        field: 'code',
        title: '仓库',
      },
      {
        field: 'code',
        title: '库位',
      },
      {
        field: 'code',
        title: '商标',
      },
      {
        field: 'code',
        title: '胶条',
      },
      {
        field: 'code',
        title: '支架',
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
          return await getBillList({
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
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<BillApi.Bill>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillApi.Bill }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BillApi.Bill>,
});
</script>
<template>
  <Modal title="新增明细" class="h-[500px] w-3/5">
    <Grid>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" disabled>
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
