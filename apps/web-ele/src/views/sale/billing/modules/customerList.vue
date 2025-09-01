<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CustomerApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCustomerList } from '#/api';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  onClosed() {
    // emits('success', {});
  },
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
      if (values) {
        formData.value = { ...formData.value, ...values };
      }
    } else {
      emits('success', gridApi.grid.getRadioRecord());
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid<CustomerApi.Customer>({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'shortName',
        label: '简拼码',
        componentProps: {
          clearable: true,
          placeholder: '请输入简拼码',
        },
      },
      {
        component: 'Input',
        fieldName: 'fullName',
        label: '名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入名称',
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
        field: 'fullName',
        title: '客户名称',
        sortable: true,
        width: 160,
      },
      {
        field: 'shortName',
        title: '简拼码',
        width: 220,
        sortable: true,
      },
      {
        field: 'address',
        title: '客户地址',
        sortable: true,
        width: 220,
      },
      {
        field: 'priceLevel',
        title: '价格级别',
        sortable: true,
        width: 100,
      },
      {
        field: 'fax',
        title: '传真',
        sortable: true,
        width: 160,
      },
      {
        field: 'mobilePhone',
        title: '电话',
        sortable: true,
        width: 160,
      },
      {
        field: 'telephone',
        title: '手机',
        sortable: true,
        width: 100,
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
          return await getCustomerList({
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
  } as VxeTableGridOptions<CustomerApi.Customer>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillApi.Bill }) {
    //   selectRow.value = row;
    // },
    cellDblclick({ row, column }) {
      console.warn(` 双击列：${column.title}`, row);
      // emits('success', row);
      modalApi.close();
    },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<CustomerApi.Customer>,
});
</script>
<template>
  <Modal title="选择客户" class="max-h-5/6 mb-0 mr-0 w-4/5">
    <Grid class="p-raw h-[700px]">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="
              () => {
                useSelectedRow(gridApi.grid.getRadioRecord())(() => {
                  // emits('success', data);
                  modalApi.close();
                });
              }
            "
          >
            <IconifyIcon
              icon="ep:select"
              class="size-5"
              style="margin-right: 4px"
            />
            选择
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary" @click="() => modalApi.close()">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="lets-icons:back"
            />
            返回
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
