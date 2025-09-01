<script lang="ts" setup>
import type { ChangeApi } from '#/api/store/change';

import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElDialog, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBalanceList } from '#/api/store/change';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  success: [balance: ChangeApi.BalanceItem];
  'update:open': [value: boolean];
}>();

// 控制对话框显示的变量
const dialogVisible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

// 仓库选项 - 从本地缓存加载
const storeOptions = ref<Array<{ label: string; value: number }>>([
  { label: '全部仓库', value: 0 },
]);
const storeLoading = ref(false);

// 从本地缓存加载仓库数据
function loadStoreOptionsFromCache() {
  try {
    // 尝试从localStorage获取缓存的仓库数据
    const cachedStorageList = localStorage.getItem('storageList');
    if (cachedStorageList) {
      const storageList = JSON.parse(cachedStorageList);
      if (Array.isArray(storageList) && storageList.length > 0) {
        // 更新仓库选项
        storeOptions.value = [
          { label: '全部仓库', value: 0 },
          ...storageList
            .map((store: any) => ({
              label: store.name || store.storeName || '',
              value: store.id || store.storeId || 0,
            }))
            .filter((option: any) => option.label && option.value > 0),
        ];
        console.log('从缓存加载仓库数据成功:', storeOptions.value);
        return;
      }
    }

    // 如果缓存中没有数据，使用默认数据
    console.log('缓存中没有仓库数据，使用默认数据');
    storeOptions.value = [
      { label: '全部仓库', value: 0 },
      { label: '临时库', value: 1 },
      { label: 'A库', value: 2 },
      { label: 'B库', value: 3 },
      { label: 'C库', value: 4 },
      { label: 'F库', value: 5 },
    ];
  } catch (error) {
    console.error('加载缓存仓库数据失败:', error);
    // 使用默认数据
    storeOptions.value = [
      { label: '全部仓库', value: 0 },
      { label: '临时库', value: 1 },
      { label: 'A库', value: 2 },
      { label: 'B库', value: 3 },
      { label: 'C库', value: 4 },
      { label: 'F库', value: 5 },
    ];
  }
}

// 库存列表数据
const balanceData = ref<ChangeApi.BalanceItem[]>([]);
const loading = ref(false);
const total = ref(0);

// 分页参数
const pageParam = ref({
  pageNum: 1,
  pageSize: 20,
});

// 库存表格
const [BalanceGrid, balanceGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'productJpm',
        label: '产品简拼',
        componentProps: {
          clearable: true,
          placeholder: '请输入产品简拼',
        },
      },
      {
        component: 'Input',
        fieldName: 'productName',
        label: '产品名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入产品名称',
        },
      },
      {
        component: 'Select',
        fieldName: 'storeId',
        label: '仓库',
        componentProps: {
          clearable: true,
          placeholder: '请选择仓库',
          loading: storeLoading,
          options: computed(() => storeOptions.value),
        },
      },
      {
        component: 'Input',
        fieldName: 'siteName',
        label: '货位名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入站点名称',
        },
      },
      {
        component: 'Checkbox',
        fieldName: 'isFuzzy',
        label: '模糊查询',
        componentProps: {},
      },
      {
        component: 'Checkbox',
        fieldName: 'isExcludeZero',
        label: '排除零库存',
        componentProps: {},
      },
    ],
    submitOnChange: false,
    wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
  },
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '排序', type: 'seq', width: 60 },
      {
        field: 'productName',
        title: '产品名称',
        width: 280,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'productAttachmentNames',
        title: '附件',
        width: 120,
        showOverflow: 'tooltip',
      },
      {
        field: 'baseName',
        title: '产品产地',
        width: 100,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'actiNum',
        title: '实际库存',
        width: 100,
        align: 'right',
        sortable: true,
        formatter: ({ cellValue }: { cellValue: number }) => {
          return cellValue || 0;
        },
      },
      {
        field: 'inventoryLock',
        title: '锁定库存',
        width: 100,
        align: 'right',
        sortable: true,
        formatter: ({ cellValue }: { cellValue: number }) => {
          return cellValue || 0;
        },
      },
      {
        field: 'storeName',
        title: '仓库',
        width: 100,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'productPlaceName',
        title: '库位',
        width: 120,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'siteName',
        title: '站点名称',
        width: 120,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'supplierName',
        title: '供应商',
        width: 120,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'buyPrice',
        title: '采购价格',
        width: 100,
        align: 'right',
        sortable: true,
        formatter: ({ cellValue }: { cellValue: number }) => {
          return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
        },
      },
    ],
    height: 500,
    keepSource: true,
    showOverflow: false,
    data: balanceData.value,
    rowConfig: {
      keyField: 'id',
    },
    radioConfig: {
      trigger: 'row',
    },
    pagerConfig: {
      enabled: true,
      pageSize: pageParam.value.pageSize,
      currentPage: pageParam.value.pageNum,
      total: total.value,
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: async ({ page }, formValues) => {
          return await loadBalanceData(
            {
              pageNum: page.currentPage || 1,
              pageSize: page.pageSize || 20,
            },
            formValues,
          );
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
  },
});

// 加载库存数据
async function loadBalanceData(
  params: { pageNum: number; pageSize: number },
  formValues?: any,
) {
  try {
    loading.value = true;
    const searchParams: ChangeApi.BalanceSearchParam = {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      productJpm: formValues?.productJpm || '',
      productName: formValues?.productName || '',
      siteName: formValues?.siteName || '',
      storeId: formValues?.storeId || 0,
      isFuzzy: formValues?.isFuzzy ? 1 : 0,
      isExcludeZero: formValues?.isExcludeZero || false,
    };

    const result = await getBalanceList(searchParams);
    balanceData.value = result.data || [];
    total.value = result.total || 0;

    return {
      data: result.data || [],
      total: result.total || 0,
    };
  } catch (error) {
    console.error('加载库存数据失败:', error);
    ElMessage.error('加载库存数据失败');
    return {
      data: [],
      total: 0,
    };
  } finally {
    loading.value = false;
  }
}

// 查询
const onQuery = () => {
  balanceGridApi.query();
};

// 选择
const onSelect = () => {
  const selectedRow = balanceGridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择库存记录');
    return;
  }

  emit('success', selectedRow);
  emit('update:open', false);
};

// 全选
const onSelectAll = () => {
  ElMessage.info('全选功能待实现');
};

// 取消
const onCancel = () => {
  emit('cancel');
  emit('update:open', false);
};

// 监听props.open变化
watch(
  () => props.open,
  async (open) => {
    if (open) {
      // 从缓存加载仓库数据
      loadStoreOptionsFromCache();
      // 重置表单 - 检查formApi是否已挂载
      if (balanceGridApi.formApi && typeof balanceGridApi.formApi.resetForm === 'function') {
        balanceGridApi.formApi.resetForm();
      }
      // 加载数据
      setTimeout(() => {
        balanceGridApi.query();
      }, 100);
    }
  },
);
</script>

<script lang="ts">
export default { name: 'BalanceSelect' };
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="库存选择"
    width="950px"
    :center="false"
    @close="onCancel"
  >
    <div class="balance-select-dialog">
      <!-- 库存列表 -->
      <BalanceGrid table-title="库存列表" class="w-full">
        <template #toolbar-tools>
          <ElButton
            type="primary"
            @click="onQuery"
            class="mr-2"
            :loading="loading"
          >
            <IconifyIcon
              icon="material-symbols:search-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            查询
          </ElButton>
          <ElButtonGroup class="ml-4">
            <ElButton type="success" @click="onSelect">
              <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
              选择
            </ElButton>
            <ElButton type="warning" @click="onSelectAll">
              <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
              全选
            </ElButton>
          </ElButtonGroup>
        </template>
      </BalanceGrid>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="onCancel">取消</ElButton>
        <ElButton type="primary" @click="onSelect">确定</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.balance-select-dialog {
  padding: 0 0 16px;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

:deep(.vxe-table) {
  border: 1px solid var(--el-border-color);
}

:deep(.vxe-table .vxe-header--column) {
  background-color: var(--el-fill-color-light);
}

:deep(.vxe-table .vxe-body--row.row--current) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.vxe-table .vxe-body--row:hover) {
  background-color: var(--el-color-primary-light-8);
}
</style>
