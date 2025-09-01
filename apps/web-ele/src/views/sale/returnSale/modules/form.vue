<script lang="ts" setup>
import type { BillSubApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBillSubList, getReturnSaleCode } from '#/api';

import { useFormSchema, useSubColumns } from '../data';
import SubForm from './subForm.vue';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
// const id = ref<number | null>(null);
const selectRow = ref();

const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}销售退货`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreen: true,
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
      formApi.resetForm();
      if (values.id) {
        formData.value = values;
        formApi.setValues(values);
        return;
      }
      getReturnSaleCode().then(({ data }) => {
        formApi.setValues({ code: data });
      });
    }
  },
});

const [Form, formApi] = useVbenForm({
  // handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
});
const [Grid, gridApi] = useVbenVxeGrid<BillSubApi.BillSub>({
  gridOptions: {
    columns: useSubColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          return await getBillSubList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            saleId: 0,
            code: '',
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
      custom: false,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<BillSubApi.BillSub>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillSubApi.BillSub }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BillSubApi.BillSub>,
});

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  subFormModalApi.setData({}).open();
}

const [SubFormModal, subFormModalApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
});
</script>
<template>
  <Modal :title="getDrawerTitle" class="w-3/5">
    <Form />
    <SubFormModal @success="onRefresh" />
    <ElButtonGroup class="ml-4">
      <ElButton type="primary" disabled>
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        提交
      </ElButton>
      <ElButton type="primary" @click="onCreate">
        <IconifyIcon
          icon="ant-design:plus-outlined"
          class="size-5"
          style="margin-right: 4px"
        />
        新增明细
      </ElButton>
      <ElButton type="primary" @click="editSelectRow">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="line-md:edit-twotone"
        />
        修改明细
      </ElButton>
      <ElButton type="primary" @click="deleteSelectRow">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="mdi:trash-can-outline"
        />
        删除明细
      </ElButton>
      <ElButton type="primary" @click="() => modalApi.close()">
        <IconifyIcon
          icon="lets-icons:back"
          class="size-5"
          style="margin-right: 4px"
        />
        返回
      </ElButton>
    </ElButtonGroup>
    <Grid table-title="车辆信息列表" />
  </Modal>
</template>
<style lang="css" scoped></style>
