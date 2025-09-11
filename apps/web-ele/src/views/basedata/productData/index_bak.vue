<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProductApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProductByIds,
  getProductList,
  updateProjectDisable,
  updateProjectEnable,
  updateProjectJPM,
} from '#/api';
import { productDataEnableMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  centered: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    commonConfig: {
      // 在label后显示一个冒号
      colon: true,
      // 所有表单项
      componentProps: {
        class: 'w-full',
      },
      labelClass: 'w-2/6',
    },
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
          return await getProductList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            sortParam: {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            },
          });
        },
      },
    },
    rowConfig: {
      keyField: 'dataId',
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
  } as VxeTableGridOptions<ProductApi.Product>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: ProductApi.Product }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<ProductApi.Product>,
});

function onRefresh() {
  gridApi.grid.clearRadioRow();
  gridApi.query();
}

function onCreate() {
  formModelApi.setData({}).open();
}

function editSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())((row) => {
    formModelApi
      .setData({
        ...row,
        id: row.dataId,
        remark: row.dataRemark,
        settingRemark: row.settingsRemark,
        enable: row.settingsEnable,
      })
      .open();
  });
}

function uptStatus() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    (row) => {
      (row.settingsEnable
        ? updateProjectDisable({ id: row.dataId })
        : updateProjectEnable({ id: row.dataId })
      ).then(() => onRefresh());
    },
    true,
    '确定要更改当前数据的启用状态吗?',
  );
}
function uptProjectJPM() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    (row) => {
      updateProjectJPM({
        id: row?.dataId,
      }).then(() => onRefresh());
    },
    true,
    '确定要重新生成简拼码吗?',
  );
}
const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
});

function openDetail() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    detailModelApi
      .setData({
        ...data,
        remark: data.dataRemark,
        settingRemark: data.settingsRemark,
      })
      .open(),
  );
}
function onDelete() {
  useSelectedRow(gridApi.grid.getRadioRecord())((row) => {
    const hideLoading = ElMessage({
      message: `正在删除...`,
      type: 'info',
      plain: true,
      duration: 0,
    });
    deleteProductByIds({ ids: [row.dataId] })
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
  }, true);
}
</script>
<template>
  <Page auto-content-height class="text-lg">
    <FormModel @success="onRefresh" class="custom-modal-width" />
    <DetailModel class="custom-modal-width" />
    <Grid table-title="产品资料列表" class="text-lg">
      <template #dataEnable="{ row }">
        <ElTag :type="productDataEnableMap[row.dataEnable]?.color || 'danger'">
          {{ productDataEnableMap[row.dataEnable]?.name || '未知' }}
        </ElTag>
      </template>
      <template #settingsEnable="{ row }">
        <ElTag
          :type="productDataEnableMap[row.settingsEnable]?.color || 'danger'"
        >
          {{ productDataEnableMap[row.settingsEnable]?.name || '未知' }}
        </ElTag>
      </template>
      <template #dataUpdateTime="{ row }">
        {{ dayjs(row.dataUpdateTime).format('YYYY-MM-DD') }}
      </template>
      <template #settingsCreateTime="{ row }">
        {{ dayjs(row.settingsCreateTime).format('YYYY-MM-DD') }}
      </template>
      <template #settingsUpdateTime="{ row }">
        {{ dayjs(row.settingsUpdateTime).format('YYYY-MM-DD') }}
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
            @click="uptProjectJPM"
            v-if="rights.includes('重生拼音码')"
          >
            <IconifyIcon
              icon="material-symbols:language-pinyin-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            重新生成拼音
          </ElButton>
          <ElButton
            type="primary"
            @click="editSelectRow"
            v-if="rights.includes('修改')"
          >
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />
            修改
          </ElButton>
          <ElButton
            type="primary"
            @click="openDetail"
            v-if="rights.includes('详情')"
          >
            <IconifyIcon
              icon="fluent:apps-list-detail-20-regular"
              class="size-5"
              style="margin-right: 4px"
            />
            详情
          </ElButton>
          <!-- <ElButton type="primary" disabled>
            <IconifyIcon
              icon="material-symbols:download-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            下载模板
          </ElButton> -->

          <ElButton type="primary" disabled v-if="rights.includes('下载')">
            <IconifyIcon
              icon="material-symbols:download-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            下载数据
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('上传')">
            <IconifyIcon
              icon="material-symbols:upload-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            上传数据
          </ElButton>
          <ElButton
            type="primary"
            @click="onDelete"
            v-if="rights.includes('删除')"
          >
            <IconifyIcon
              icon="mdi:trash-can-outline"
              class="size-5"
              style="margin-right: 4px"
            />
            删除
          </ElButton>
          <ElButton
            type="primary"
            @click="uptStatus"
            v-if="rights.includes('启用/停用')"
          >
            <IconifyIcon
              icon="mdi:list-status"
              class="size-5"
              style="margin-right: 4px"
            />
            启用/停用
          </ElButton>
          <ElButton type="primary" v-if="rights.includes('提交公用')" disabled>
            <IconifyIcon
              icon="mdi:list-status"
              class="size-5"
              style="margin-right: 4px"
            />
            提前到产品资料
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
<style scoped>
:deep(.custom-modal-width .vben-modal .ant-modal) {
  width: calc(80% - 100px) !important;
}
</style>
