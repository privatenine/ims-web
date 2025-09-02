<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi, SupplierApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElTag,
} from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteInStorageById, getInStorageCode, getInStorageList } from '#/api';
import { statusFlagMap, unloadingMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Audit from './modules/audit.vue';
import Detail from './modules/detail.vue';
import DetailPrint from './modules/detailPrint.vue';
import Form from './modules/form.vue';
import SettlementForm from './modules/settlementForm.vue';
import StoreForm from './modules/storeForm.vue';
import SupplierList from './modules/supplierList.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

console.warn('rights', rights);

// 定义一个标志来防止重复初始化
let isInitialized = false;

onMounted(() => {
  if (!isInitialized) {
    isInitialized = true;

    // 延迟更新schema，避免立即触发查询
    nextTick(() => {
      gridApi.formApi.updateSchema([
        {
          fieldName: 'supplierName',
          componentProps: {
            onClick: () => {
              supplierModelApi.open();
            },
          },
        },
      ]);

      // Schema更新完成后再初始化数据
      nextTick(() => {
        initializeData();
      });
    });
  }
});
// 防止重复请求的标志
const isQuerying = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false, // 关闭自动提交，改为手动控制
    fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'X']],
    wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 40,
      pageSizes: [10, 15, 20, 40, 50, 100],
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort, sorts }, formValues) => {
          // 防止重复请求
          if (isQuerying.value) {
            console.warn(
              'Query already in progress, skipping duplicate request',
            );
            return { data: [], total: 0 };
          }

          try {
            isQuerying.value = true;
            console.warn('Executing query:', { page, sort, sorts, formValues });

            const result = await getInStorageList({
              ...formValues,
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              sortParam: sort.field
                ? {
                    field: sort.field,
                    type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
                  }
                : undefined,
            });

            return result;
          } finally {
            isQuerying.value = false;
          }
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
  } as VxeTableGridOptions<InStorageApi.InStorage>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InStorageApi.InStorage }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<InStorageApi.InStorage>,
});

function onRefresh() {
  gridApi.grid.clearRadioRow();
  // 添加防重复检查
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 手动搜索函数
function onSearch() {
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 初始化页面数据
function initializeData() {
  if (!isQuerying.value) {
    // 延迟执行，确保表单初始化完成
    setTimeout(() => {
      gridApi.query();
    }, 100);
  }
}

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  centered: true,
});
function onCreate() {
  getInStorageCode().then(({ data }: { data: string }) => {
    formModelApi
      .setData({
        code: data,
        rights: [...rights.value],
      })
      .open();
  });
}
function editSelectRow() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((row) => {
    if (![1, 5].includes(row.statusFlag)) {
      ElMessage({
        message: `只能修改草稿状态的入库单!`,
        type: 'warning',
        plain: true,
      });
      return;
    }
    formModelApi.setData({ ...row, rights: [...rights.value] }).open();
  });
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: InStorageApi.InStorage | undefined) => void,
    true,
  );
}
function onDelete(row: InStorageApi.InStorage) {
  const hideLoading = ElMessage({
    message: `正在删除!`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteInStorageById({ id: row.id })
    .then(() => {
      ElMessage({
        message: `删除成功!`,
        type: 'success',
        plain: true,
      });
      onRefresh();
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
}

const [SupplierModel, supplierModelApi] = useVbenModal({
  connectedComponent: SupplierList,
  destroyOnClose: true,
  centered: true,
});

const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
});

function openDetail() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    detailModelApi.setData(data).open(),
  );
}

const [StoreFormModel, storeFormModelApi] = useVbenModal({
  connectedComponent: StoreForm,
  centered: true,
});
function openStoreForm() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    storeFormModelApi.setData(data).open(),
  );
}

const [DetailPrintModel, detailPrintModelApi] = useVbenModal({
  connectedComponent: DetailPrint,
  destroyOnClose: true,
  centered: true,
});
function openDetailPrint() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    detailPrintModelApi.setData(data).open(),
  );
}

const [AuditModel, auditModelApi] = useVbenModal({
  connectedComponent: Audit,
  destroyOnClose: true,
  centered: true,
});

function openAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    if ([1, 5].includes(data.statusFlag)) {
      ElMessage.warning('请先提交');
      return;
    }
    auditModelApi.setData(data).open();
  });
}

const [SettlementFormModel, settlementFormModelApi] = useVbenModal({
  connectedComponent: SettlementForm,
  destroyOnClose: true,
  centered: true,
});
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <SupplierModel
      @select="
        (data: SupplierApi.Supplier) => {
          gridApi.formApi.setValues({
            supplierId: data?.id || '',
            supplierName: data?.fullName || '',
          });
        }
      "
    />
    <StoreFormModel @success="onRefresh" />
    <DetailModel />
    <DetailPrintModel />
    <AuditModel @success="onRefresh" />
    <SettlementFormModel @success="onRefresh" />
    <Grid table-title="产品入库列表" class="w-full">
      <template #statusFlag="{ row }">
        <ElTag :type="statusFlagMap[row.statusFlag]?.color || 'danger'">
          {{ statusFlagMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #createTime="{ row }">
        {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
      </template>

      <template #unloadingId="{ row }">
        {{ unloadingMap[row.unloadingId] || '未知' }}
      </template>
      <template #storeSiteName="{ row }">
        {{ row.storeSiteName ? `#${row.storeSiteName}` : '' }}
      </template>
      <template #toolbar-tools>
        <!-- <ElButton
          type="primary"
          @click="onSearch"
          class="mr-2"
          :loading="isQuerying"
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          查询
        </ElButton> -->
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
            @click="editSelectRow"
            v-if="rights.includes('修改')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载数据
          </ElButton>
          <ElButton
            type="primary"
            @click="openDetail"
            v-if="rights.includes('详情')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton
            type="primary"
            @click="openAudit"
            v-if="rights.includes('审核')"
          >
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('订单查询')">
            <IconifyIcon
              icon="material-symbols:search-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            订单查询
          </ElButton>
          <ElButton
            type="primary"
            @click="openStoreForm"
            v-if="rights.includes('改货位')"
          >
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />
            改货位
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
          <ElButton
            type="primary"
            @click="
              () =>
                useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
                  if (3 !== data.statusFlag) {
                    ElMessage.warning('只有完成入库才可以结算');
                    return;
                  }
                  settlementFormModelApi.setData(data).open();
                })
            "
            v-if="rights.includes('付款')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:select-all-on-20-regular"
            />
            结算
          </ElButton>
        </ElButtonGroup>
        <ElDropdown
          split-button
          type="primary"
          v-if="
            rights.includes('带价单据') ||
            rights.includes('数量单据') ||
            rights.includes('单一标签') ||
            rights.includes('整单标签')
          "
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="material-symbols:print-outline-rounded"
          />
          打印
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                @click="openDetailPrint"
                v-if="rights.includes('带价单据')"
              >
                价格入库
              </ElDropdownItem>
              <ElDropdownItem
                @click="openDetailPrint"
                v-if="rights.includes('数量单据')"
              >
                一般入库
              </ElDropdownItem>
              <ElDropdownItem
                @click="openDetailPrint"
                v-if="rights.includes('单一标签')"
              >
                单一标签
              </ElDropdownItem>
              <ElDropdownItem
                @click="openDetailPrint"
                v-if="rights.includes('整单标签')"
              >
                整个标签
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </Grid>
  </Page>
</template>
<style scoped lang="css">
.el-button-group .el-button--primary:last-child {
  border-radius: 0;
}

:deep(.el-dropdown .el-button-group .el-button--primary:first-child) {
  border-left: var(--el-button-divide-border-color) 1px solid;
  border-radius: 0;
}
</style>
