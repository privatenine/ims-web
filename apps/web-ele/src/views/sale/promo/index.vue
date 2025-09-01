<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PromoApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
// import {
//   deletePromoInfo,
//   findPromoList,
//   publishPromoInfo
// } from '#/api';
import { useMenuRights } from '#/utils';

import { publishStatusMap, useColumns, useGridFormSchema } from './data';
import PromoForm from './modules/form.vue';

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

// 表单数据
const formData = ref({});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'X']],
    wrapperClass: 'grid-cols-1 md:grid-cols-5 lg:grid-cols-5',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 20,
      pageSizes: [10, 20, 50, 100],
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

            // 演示数据
            const mockData = [
              {
                id: 1,
                productName: '高强度混凝土',
                publishQuantity: 500,
                contactPhone: '13800138001',
                status: 1,
                category: '新增商品',
                deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后
                publishTime: Date.now() - 24 * 60 * 60 * 1000, // 1天前
                remark: '质量优良，价格优惠',
              },
              {
                id: 2,
                productName: '钢筋',
                publishQuantity: 1000,
                contactPhone: '13800138002',
                status: 1,
                category: '积压处理',
                deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5天后
                publishTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
                remark: '规格齐全，急需处理',
              },
              {
                id: 3,
                productName: '水泥',
                publishQuantity: 300,
                contactPhone: '13800138003',
                status: 0,
                category: '促销活动',
                deadline: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3天后
                publishTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3天前
                remark: '优质水泥，价格实惠',
              },
              {
                id: 4,
                productName: '砂石',
                publishQuantity: 800,
                contactPhone: '13800138004',
                status: 1,
                category: '清仓处理',
                deadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10天后
                publishTime: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5天前
                remark: '清仓特价，数量有限',
              },
              {
                id: 5,
                productName: '防水材料',
                publishQuantity: 200,
                contactPhone: '13800138005',
                status: 1,
                category: '限时特惠',
                deadline: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2天后
                publishTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1天前
                remark: '限时特惠，机会难得',
              },
            ];

            // 应用筛选条件
            let filteredData = [...mockData];
            if (formValues.productName) {
              filteredData = filteredData.filter((item) =>
                item.productName.includes(formValues.productName),
              );
            }
            if (formValues.contactPhone) {
              filteredData = filteredData.filter((item) =>
                item.contactPhone.includes(formValues.contactPhone),
              );
            }
            if (formValues.publishStatus !== undefined) {
              filteredData = filteredData.filter(
                (item) => item.status === formValues.publishStatus,
              );
            }
            if (formValues.category) {
              filteredData = filteredData.filter(
                (item) => item.category === formValues.category,
              );
            }

            // 应用排序
            if (sort && sort.field) {
              filteredData.sort((a, b) => {
                const aVal = (a as any)[sort.field];
                const bVal = (b as any)[sort.field];
                const result = aVal > bVal ? 1 : (aVal < bVal ? -1 : 0);
                return sort.order === 'asc' ? result : -result;
              });
            }

            // 模拟分页
            const pageSize = page.pageSize || 20;
            const currentPage = page.currentPage || 1;
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const pageData = filteredData.slice(startIndex, endIndex);

            // 模拟延迟
            await new Promise((resolve) => setTimeout(resolve, 300));

            return {
              result: pageData,
              page: {
                total: filteredData.length,
              },
            };
          } catch (error) {
            console.error('查询促销信息失败:', error);
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
  } as VxeTableGridOptions<PromoApi.PromoInfo>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<PromoApi.PromoInfo>,
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

// 对话框显示状态
const formVisible = ref(false);
const isEditMode = ref(false);

// 新增
function onCreate() {
  const initialData = {
    productName: '',
    publishQuantity: undefined,
    contactPhone: '',
    deadline: undefined,
    category: '新增商品',
    remark: '',
    status: 1,
  };

  formData.value = initialData;
  isEditMode.value = false;
  formVisible.value = true;
}

// 修改
function onEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    formData.value = data;
    isEditMode.value = true;
    formVisible.value = true;
  });
}

// 关闭对话框
function handleFormCancel() {
  formVisible.value = false;
}

// 表单提交成功
function handleFormSuccess() {
  formVisible.value = false;
  onRefresh();
}

// 删除
async function onDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      await ElMessageBox.confirm('您确定要删除这条数据？', '系统提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      // 演示数据 - 模拟删除成功
      ElMessage.success('删除成功');
      onRefresh();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error);
        ElMessage.error('删除失败');
      }
    }
  });
}

// 发布/下架
async function onPublish() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      const newStatus = data.status === 1 ? 0 : 1;
      const actionText = newStatus === 1 ? '发布' : '下架';

      await ElMessageBox.confirm(
        `您确定要${actionText}这条数据？`,
        '系统提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      );

      // 演示数据 - 模拟发布/下架成功
      ElMessage.success(`${actionText}成功`);
      onRefresh();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('发布/下架失败:', error);
        ElMessage.error('操作失败');
      }
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
    <Grid table-title="促销信息管理" class="w-full">
      <!-- 状态列模板 -->
      <template #status="{ row }">
        <ElTag :type="getTagType(publishStatusMap[row.status]?.color)">
          {{ publishStatusMap[row.status]?.name || '未知' }}
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
          <ElButton
            type="primary"
            @click="onPublish"
            v-if="rights.includes('发布')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:publish-rounded"
            />
            发布/下架
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
    <!-- 新增/编辑促销信息对话框 -->
    <PromoForm
      v-model:visible="formVisible"
      :form-data="formData"
      :title="isEditMode ? '编辑促销信息' : '新增促销信息'"
      @success="handleFormSuccess"
      @cancel="handleFormCancel"
    />
  </Page>
</template>
