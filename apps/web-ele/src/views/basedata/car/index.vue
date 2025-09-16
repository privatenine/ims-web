<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CarApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCarByIds, getCarList } from '#/api';
import { useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  centered: true,
});

const [Grid, gridApi] = useVbenVxeGrid<CarApi.Car>({
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
        query: async (_, { name, carNum }) => {
          // console.log('formValues', formValues);
          return await getCarList(name, carNum);
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
  } as VxeTableGridOptions<CarApi.Car>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: CarApi.Car }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<CarApi.Car>,
});

// onmounted(() => {
//   gridApi.updateGridFormSchema();
// });

function handleUpdate() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: CarApi.Car | undefined) => void,
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: CarApi.Car | undefined) => void,
    true,
  );
}

function onEdit(row: CarApi.Car) {
  formModalApi.setData(row).open();
}

function onDelete(row: CarApi.Car) {
  const hideLoading = ElMessage({
    message: `正在删除...`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteCarByIds({ ids: [row.id] })
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

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formModalApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid table-title="车辆信息列表">
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
            @click="handleUpdate"
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
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
