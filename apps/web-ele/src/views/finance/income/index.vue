<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InComeApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteInComeById, getInComeList, rejectInComeById } from '#/api';
import { inComeStatusFlagMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import Print from './modules/print.vue';

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
          return await getInComeList({
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
  } as VxeTableGridOptions<InComeApi.InCome>,
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
  } as VxeGridListeners<InComeApi.InCome>,
});

// function onRefresh() {
//
// }

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

function onEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    if (data.statusFlag !== 1) {
      ElMessage({
        message: `只能修改状态为草稿的数据!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    formModelApi.setData(data).open();
  });
}

function onDelete() {
  useSelectedRow(gridApi.grid.getRadioRecord())((row) => {
    const hideLoading = ElMessage({
      message: `正在删除!`,
      type: 'info',
      plain: true,
      duration: 0,
    });
    deleteInComeById({ id: row.id })
      .then(() => {
        ElMessage({
          message: `删除成功!`,
          type: 'success',
          plain: true,
        });
        gridApi.query();
      })
      .catch(() => {
        ElMessage({
          message: `删除失败!`,
          type: 'error',
          plain: true,
        });
      })
      .finally(() => {
        hideLoading.close();
      });
  }, true);
}

function onReject() {
  useSelectedRow(gridApi.grid.getRadioRecord())(({ id, version }) => {
    rejectInComeById({ id, version }).then(() => {
      ElMessage({
        message: `结算成功!`,
        type: 'success',
        plain: true,
      });
      gridApi.grid.clearRadioRow();
      gridApi.query();
    });
  }, true);
}

const [PrintModel, printModelApi] = useVbenModal({
  connectedComponent: Print,
  destroyOnClose: true,
});
</script>
<template>
  <Page auto-content-height>
    <FormModel
      @success="
        () => {
          gridApi.grid.clearRadioRow();
          gridApi.query();
        }
      "
    />
    <PrintModel />
    <Grid table-title="应付账款列表">
      <template #statusFlag="{ row }">
        {{ inComeStatusFlagMap[row.statusFlag] || '--' }}
      </template>
      <template #createTime="{ row }">
        {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #approveTime="{ row }">
        {{ row.approveTime ? dayjs(row.approveTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="() => formModelApi.setData({}).open()"
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
            @click="onEdit"
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
            @click="onReject"
            v-if="rights.includes('审核')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:select-all-on-20-regular"
            />
            结算
          </ElButton>
          <ElButton
            type="primary"
            @click="onDelete"
            v-if="rights.includes('删除')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <!-- <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载
          </ElButton> -->
          <ElButton
            type="primary"
            @click="
              () => printModelApi.setData(gridApi.grid.getRadioRecord()).open()
            "
            v-if="rights.includes('打印')"
          >
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
