<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { EmployeeApi } from '#/api';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStorageEmployeeList } from '#/api';

const emits = defineEmits(['success']);

// const selectRow = ref<EmployeeApi.Employee | null>();
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
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
      // const values = modalApi.getData<Record<string, any>>();
      // formApi.resetForm();
      // if (values) {
      //   formData.value = values;
      //   formApi.setValues(values);
      // }
    }
  },
  title: '驾驶员列表',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'username',
        label: '登录名',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'realName',
        label: '用户名',
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
        field: 'username',
        title: '登录名',
        width: 80,
      },
      {
        field: 'realName',
        title: '用户名',
        width: 80,
      },
      {
        field: 'phoneNum',
        title: '手机',
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
          return await getStorageEmployeeList({
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
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    emits('success', data);
    modalApi.close();
  });
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Modal class="w-2/5">
    <Grid table-title="驾驶员列表" class="vp-raw h-[500px] w-full">
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
