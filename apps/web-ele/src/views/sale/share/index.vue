<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ShareApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  findCategoryInfo,
  findOrderDetails,
  findPurchaseOrders,
  findShareInventoryList,
} from '#/api';
import { useMenuRights } from '#/utils';

import {
  rainSensorMap,
  sealantMap,
  useColumns,
  useGridFormSchema,
} from './data';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

// 定义一个标志来防止重复初始化
let isInitialized = false;

onMounted(() => {
  if (!isInitialized) {
    isInitialized = true;
    // 延迟初始化数据
    nextTick(() => {
      initializeData();
    });
  }
});

// 防止重复请求的标志
const isQuerying = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false, // 关闭自动提交，改为手动控制
    wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-6',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 20,
      pageSizes: [10, 20, 30, 50, 100],
    },
    proxyConfig: {
      response: {
        result: 'result',
        total: 'page.total',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          // 防止重复请求
          if (isQuerying.value) {
            console.warn(
              'Query already in progress, skipping duplicate request',
            );
            return {
              result: [],
              page: { total: 0 },
            };
          }

          try {
            isQuerying.value = true;
            console.log('执行查询:', { page, sort, formValues });

            // 构建查询参数
            const params: ShareApi.ShareInventorySearchParam = {
              pageNum: page.currentPage || 1,
              pageSize: page.pageSize || 20,
              productJpm: formValues.productJpm || undefined,
              productName: formValues.productName || undefined,
              specification: formValues.specification || undefined,
              productPlaceId: formValues.productPlaceId || undefined,
              supplierName: formValues.supplierName || undefined,
              source: formValues.source || undefined,
              storeName: formValues.storeName || undefined,
              siteName: formValues.siteName || undefined,
              // 处理排序参数
              sortParam:
                sort && sort.field
                  ? {
                      field: sort.field,
                      type: sort.order === 'asc' ? 1 : -1,
                    }
                  : undefined,
            };

            const response = await findShareInventoryList(params);

            // 检查响应是否成功并返回正确格式给 vxe-table
            if (response && (response as any).code === 1) {
              return {
                result: (response as any).data || [],
                page: {
                  total: (response as any).total || 0,
                },
              };
            } else {
              ElMessage.error((response as any).msg || '查询失败');
              return {
                result: [],
                page: {
                  total: 0,
                },
              };
            }
          } catch (error) {
            console.error('查询共享库存失败:', error);
            ElMessage.error('查询失败，请稍后重试');
            return {
              result: [],
              page: {
                total: 0,
              },
            };
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
  } as VxeTableGridOptions<ShareApi.ShareInventoryItem>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<ShareApi.ShareInventoryItem>,
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

// 详情模态框
const [DetailModel, detailModelApi] = useVbenModal({
  // connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
  title: '产品详情',
});

function openDetail() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    // 这里可以实现详情弹窗逻辑
    ElMessage.info(`查看产品详情: ${data.productName}`);
    // detailModelApi.setData(data).open();
  });
}

// 订单详情查询
async function queryOrderDetails() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      const response = await findOrderDetails(data.productId);
      if (response && (response as any).code === 1) {
        ElMessage.success('订单详情查询成功');
        // 这里可以打开订单详情弹窗
        console.log('订单详情:', response.data);
      } else {
        ElMessage.error((response as any).msg || '查询订单详情失败');
      }
    } catch (error) {
      console.error('查询订单详情失败:', error);
      ElMessage.error('查询订单详情失败');
    }
  });
}

// 采购订单查询
async function queryPurchaseOrders() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      const response = await findPurchaseOrders(data.productId);
      if (response && (response as any).code === 1) {
        ElMessage.success('采购订单查询成功');
        // 这里可以打开采购订单弹窗
        console.log('采购订单:', response.data);
      } else {
        ElMessage.error((response as any).msg || '查询采购订单失败');
      }
    } catch (error) {
      console.error('查询采购订单失败:', error);
      ElMessage.error('查询采购订单失败');
    }
  });
}

// 大类号查询
async function queryCategoryInfo() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      const response = await findCategoryInfo(data.productId);
      if (response && (response as any).code === 1) {
        ElMessage.success('大类号查询成功');
        // 这里可以打开大类号信息弹窗
        console.log('大类号信息:', response.data);
      } else {
        ElMessage.error((response as any).msg || '查询大类号失败');
      }
    } catch (error) {
      console.error('查询大类号失败:', error);
      ElMessage.error('查询大类号失败');
    }
  });
}

// 获取标签类型的函数
function getTagType(
  color?: string,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  const validTypes = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ] as const;
  return validTypes.includes(color as any) ? (color as any) : 'info';
}
</script>

<template>
  <Page auto-content-height>
    <DetailModel />
    <Grid table-title="共享库存列表" class="w-full">
      <!-- 操作列模板 -->
      <template #operation="{ row }">
        <ElButton size="small" type="primary" link @click="openDetail">
          详情
        </ElButton>
      </template>

      <!-- 库位列模板 -->
      <template #siteName="{ row }">
        {{ row.siteName ? `#${row.siteName}` : '-' }}
      </template>

      <!-- 雨感器状态模板 -->
      <template #rainSensor="{ row }">
        <ElTag
          :type="getTagType(rainSensorMap[row.rainSensor || '']?.color)"
          size="small"
        >
          {{ rainSensorMap[row.rainSensor || '']?.name || '-' }}
        </ElTag>
      </template>

      <!-- 胶条状态模板 -->
      <template #sealant="{ row }">
        <ElTag
          :type="getTagType(sealantMap[row.sealant || '']?.color)"
          size="small"
        >
          {{ sealantMap[row.sealant || '']?.name || '-' }}
        </ElTag>
      </template>

      <template #toolbar-tools>
        <ElButton
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
        </ElButton>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="queryOrderDetails"
            v-if="rights.includes('订单详情')"
          >
            <IconifyIcon
              icon="fluent:apps-list-detail-20-regular"
              class="size-5"
              style="margin-right: 4px"
            />
            订单详情
          </ElButton>
          <ElButton
            type="primary"
            @click="queryPurchaseOrders"
            v-if="rights.includes('采购订单')"
          >
            <IconifyIcon
              icon="material-symbols:shopping-cart-outline"
              class="size-5"
              style="margin-right: 4px"
            />
            采购订单
          </ElButton>
          <ElButton
            type="primary"
            @click="queryCategoryInfo"
            v-if="rights.includes('大类号查询')"
          >
            <IconifyIcon
              icon="material-symbols:category-outline"
              class="size-5"
              style="margin-right: 4px"
            />
            大类号查询
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            导出数据
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="css">
.el-button-group .el-button--primary:last-child {
  border-radius: 0;
}

:deep(.el-button-group .el-button--primary:first-child) {
  border-left: var(--el-button-divide-border-color) 1px solid;
  border-radius: 0;
}
</style>
