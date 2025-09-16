<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { EmployeeApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteEmployeeByIds,
  getEmployeeList,
  uptEmployeeAuthorizeById,
  uptEmployeeStatusById,
  uptEmployeeStatusResignById,
  uptEmployeeUnAuthorizeById,
} from '#/api';
import {
  EmployedStatusMap,
  GenderMap,
  IsSignedContractMap,
  useMenuRights,
} from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/model.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [FormDrawer, formDrawerApi] = useVbenModal({
  connectedComponent: Form,
});
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-6',
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
          return await getEmployeeList({
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
      keyField: 'employeeId',
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
  } as VxeTableGridOptions<EmployeeApi.EmployeeVo>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: EmployeeApi.EmployeeVo }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<EmployeeApi.EmployeeVo>,
});

function handleUpdate() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: EmployeeApi.EmployeeVo | undefined) => void,
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: EmployeeApi.EmployeeVo | undefined) => void,
    true,
  );
}

function onEdit(row: EmployeeApi.EmployeeVo) {
  formDrawerApi.setData({ values: row }).open();
}

function onDelete(row: EmployeeApi.EmployeeVo) {
  const hideLoading = ElMessage({
    message: `正在删除${row.username}`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteEmployeeByIds({ ids: [row.employeeId] })
    .then(() => {
      ElMessage({
        message: `删除成功,${row.username}`,
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
  formDrawerApi.setData({}).open();
}

function uptStatus(status: number = 1) {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    (data: EmployeeApi.EmployeeVo | undefined) => {
      if (data?.userId && status === 1) {
        uptEmployeeStatusById({ userId: data.userId, employedStatus: status });
      }
      if (data?.userId && status === 0) {
        uptEmployeeStatusResignById({
          userId: data.userId,
          employedStatus: status,
        });
      }
      setTimeout(onRefresh, 100);
    },
  );
}

function uptEmployeeAuthorize(isLocked: boolean = false) {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    (data: EmployeeApi.EmployeeVo | undefined) => {
      if (data?.userId) {
        isLocked
          ? uptEmployeeAuthorizeById({ userId: data.userId, isLocked })
          : uptEmployeeUnAuthorizeById({ userId: data.userId, isLocked });
        setTimeout(onRefresh, 100);
      }
    },
  );
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="员工档案列表">
      <template #gender="{ row }">
        <ElTag :type="GenderMap[row.gender]?.color || 'danger'">
          {{ GenderMap[row.gender]?.name || '未知' }}
        </ElTag>
      </template>
      <template #employedStatus="{ row }">
        <ElTag :type="EmployedStatusMap[row.employedStatus]?.color || 'danger'">
          {{ EmployedStatusMap[row.employedStatus]?.name || '未知' }}
        </ElTag>
      </template>
      <template #isSignedContract="{ row }">
        <ElTag
          :type="IsSignedContractMap[row.isSignedContract]?.color || 'danger'"
        >
          {{ IsSignedContractMap[row.isSignedContract]?.name || '未知' }}
        </ElTag>
      </template>
      <template #departTime="{ row }">
        {{ dayjs(row.departTime).format('YYYY-MM-DD') }}
      </template>
      <template #entryTime="{ row }">
        {{ dayjs(row.entryTime).format('YYYY-MM-DD') }}
      </template>
      <template #contractExpirationTime="{ row }">
        {{ dayjs(row.contractExpirationTime).format('YYYY-MM-DD') }}
      </template>
      <template #isLocked="{ row }">
        {{ row.isLocked ? '可登录' : '不可登录' }}
      </template>
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
            @click="uptStatus(0)"
            v-if="rights.includes('离职')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            员工离职
          </ElButton>
          <ElButton
            type="primary"
            @click="uptStatus(1)"
            v-if="rights.includes('复职')"
          >
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />
            员工复职
          </ElButton>
          <ElButton
            type="primary"
            @click="uptEmployeeAuthorize(false)"
            v-if="rights.includes('授权/授权')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            收权
          </ElButton>
          <ElButton
            type="primary"
            @click="uptEmployeeAuthorize(true)"
            v-if="rights.includes('授权/授权')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            授权
          </ElButton>
          <!-- 先不做 -->
          <ElButton
            type="primary"
            @click="deleteSelectRow"
            disabled
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
