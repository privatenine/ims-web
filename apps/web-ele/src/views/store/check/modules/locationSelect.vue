<script lang="ts" setup>
import type { StoreSiteItem, StoreSiteSearchParam } from '#/api/store/check';

import { computed, ref, watch } from 'vue';

import { VbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElDialog,
  ElInput,
  ElMessage,
  ElOption,
  ElPagination,
  ElSelect,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { findStoreSiteList } from '#/api/store/check';
import { getStorageOptions } from '#/utils/storage';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  success: [locations: StoreSiteItem[]];
  'update:open': [value: boolean];
}>();

// 筛选条件
const filterData = ref({
  warehouse: '全部',
  siteName: '',
});

// 分页参数
const pagination = ref({
  pageNum: 1,
  pageSize: 20,
  total: 0,
});

// 加载状态
const loading = ref(false);

// 仓库选项 - 使用缓存中的仓库数据
const warehouseOptions = computed(() => {
  const storageOptions = getStorageOptions();
  return [
    { label: '全部', value: '全部' },
    ...storageOptions.map((option) => ({
      label: option.label,
      value: option.value,
    })),
  ];
});

// 库位数据
const locationData = ref<StoreSiteItem[]>([]);

// 库位表格
const [LocationGrid, locationGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        align: 'center',
        title: '',
        type: 'checkbox',
        width: 50,
        fixed: 'left',
      },
      {
        title: '排序',
        type: 'seq',
        width: 80,
        align: 'center',
      },
      {
        field: 'storeName',
        title: '仓库',
        width: 200,
        align: 'center',
        showOverflow: 'tooltip',
        sortable: true,
      },
      {
        field: 'siteName',
        title: '库位',
        width: 200,
        align: 'center',
        sortable: true,
        showOverflow: 'tooltip',
      },
    ],
    height: 350,
    keepSource: true,
    showOverflow: false,
    data: locationData.value,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    checkboxConfig: {
      trigger: 'row',
    },
    toolbarConfig: {
      custom: false,
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
    border: true,
    stripe: true,
  },
});

// 加载库位数据
const loadLocationData = async () => {
  try {
    loading.value = true;

    const params: StoreSiteSearchParam = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      siteName: filterData.value.siteName || undefined,
      storeId:
        filterData.value.warehouse === '全部'
          ? undefined
          : warehouseOptions.value.find(
              (opt) => opt.label === filterData.value.warehouse,
            )?.value,
      sortParam: {
        field: 'siteName',
        type: 1, // 正序
      },
    };

    const response = await findStoreSiteList(params);

    if (response.data) {
      locationData.value = response.data;
      pagination.value.total = response.total || 0;

      // 更新表格数据
      locationGridApi.grid.loadData(locationData.value);
    }
  } catch (error) {
    console.error('加载库位数据失败:', error);
    ElMessage.error('加载库位数据失败');
  } finally {
    loading.value = false;
  }
};

// 查询
const onQuery = async () => {
  pagination.value.pageNum = 1; // 重置到第一页
  await loadLocationData();
};

// 选择
const onSelect = () => {
  const selectedRows = locationGridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择库位');
    return;
  }

  emit('update:open', false);
  emit('success', selectedRows);
};

// 取消
const onCancel = () => {
  emit('update:open', false);
  emit('cancel');
};

// 分页变化
const onPageChange = async (page: number, size: number) => {
  pagination.value.pageNum = page;
  pagination.value.pageSize = size;
  await loadLocationData();
};

// 监听筛选条件变化
const handleFilterChange = () => {
  // 筛选条件变化时，延迟查询以避免频繁请求
  clearTimeout(filterTimeout.value);
  filterTimeout.value = setTimeout(() => {
    onQuery();
  }, 500);
};

// 筛选防抖定时器
const filterTimeout = ref<NodeJS.Timeout>();

// 监听props.open变化
watch(
  () => props.open,
  (open) => {
    if (open) {
      // 重置筛选条件和分页
      filterData.value = {
        warehouse: '全部',
        siteName: '',
      };
      pagination.value.pageNum = 1;
      pagination.value.pageSize = 20;

      // 加载数据
      loadLocationData();
    }
  },
);
</script>

<script lang="ts">
export default { name: 'LocationSelect' };
</script>

<template>
  <ElDialog
    :model-value="props.open"
    title="库位选择"
    width="80%"
    :center="true"
    :destroy-on-close="true"
    @update:model-value="(value) => emit('update:open', value)"
    @close="onCancel"
  >
    <div class="location-select-dialog">
      <!-- 筛选区域 -->
      <div class="filter-section mb-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">仓库:</label>
            <ElSelect
              v-model="filterData.warehouse"
              placeholder="全部"
              style="width: 120px"
              @change="handleFilterChange"
            >
              <ElOption
                v-for="option in warehouseOptions"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </ElSelect>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">库位:</label>
            <ElInput
              v-model="filterData.siteName"
              placeholder="全部"
              style="width: 120px"
              @input="handleFilterChange"
            />
          </div>
          <div class="flex gap-2">
            <ElButton
              type="primary"
              size="small"
              @click="onQuery"
              :loading="loading"
            >
              <IconifyIcon
                icon="material-symbols:search-rounded"
                class="size-4"
                style="margin-right: 4px"
              />
              查询
            </ElButton>
            <ElButton type="primary" size="small" @click="onSelect">
              <IconifyIcon
                icon="ant-design:check-outlined"
                class="size-4"
                style="margin-right: 4px"
              />
              选择
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 库位列表 -->
      <div class="location-list">
        <LocationGrid />

        <!-- 分页组件 -->
        <div class="mt-4 flex justify-end">
          <ElPagination
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            @current-change="(page) => onPageChange(page, pagination.pageSize)"
            @size-change="(size) => onPageChange(1, size)"
            :small="true"
            :background="true"
            layout="total, sizes, prev, pager, next"
          />
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="css" scoped></style>
