<script lang="ts" setup>
import type { StorageApi } from '#/api';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCheckbox,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { getStorageList } from '#/api';

const emits = defineEmits(['success', 'select']);

interface StorageLocationItem {
  id: number;
  sortOrder: number;
  warehouseName: string;
  location: string;
  storeId: number;
}

// 内部状态
const selectedWarehouse = ref('全部');
const locationFilter = ref('全部');
const storageLocationList = ref<StorageLocationItem[]>([]);
const warehouseOptions = ref<Array<{ label: string; value: string }>>([]);
const selectedItems = ref<StorageLocationItem[]>([]);
const loading = ref(false);

const [Modal, modalApi] = useVbenModal({
  title: '选择仓库库位',
  width: 800,
  fullscreenButton: true,
  draggable: true,
  centered: true,
  destroyOnClose: true,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      loadWarehouseData();
      loadStorageLocationData();
      selectedItems.value = [];
    }
  },
});

// 获取仓库数据
async function loadWarehouseData() {
  try {
    const response = await getStorageList({
      pageNum: 1,
      pageSize: 100,
      status: 1, // 只获取在用的仓库
    });

    if (response.code === 1 && response.data) {
      const options = [
        { label: '全部', value: '全部' },
        ...response.data.map((item: StorageApi.Storage) => ({
          label: item.name || '',
          value: item.name || '',
        })),
      ];
      warehouseOptions.value = options;
    }
  } catch (error) {
    console.error('获取仓库列表失败:', error);
    ElMessage.error('获取仓库列表失败');
  }
}

// 获取仓库库位数据
async function loadStorageLocationData() {
  try {
    loading.value = true;

    // 模拟数据，实际应该调用相应的API
    const mockData: StorageLocationItem[] = [
      {
        id: 1,
        sortOrder: 1,
        warehouseName: '临时库',
        location: '#0',
        storeId: 1,
      },
      {
        id: 2,
        sortOrder: 2,
        warehouseName: '临时库',
        location: '#1',
        storeId: 1,
      },
      {
        id: 3,
        sortOrder: 3,
        warehouseName: '临时库',
        location: '#5',
        storeId: 1,
      },
      {
        id: 4,
        sortOrder: 4,
        warehouseName: '临时库',
        location: '#a',
        storeId: 1,
      },
      {
        id: 5,
        sortOrder: 5,
        warehouseName: '临时库',
        location: '#o',
        storeId: 1,
      },
      {
        id: 6,
        sortOrder: 6,
        warehouseName: '临时库',
        location: '##1',
        storeId: 1,
      },
      {
        id: 7,
        sortOrder: 7,
        warehouseName: '临时库',
        location: '##2',
        storeId: 1,
      },
    ];

    storageLocationList.value = mockData;
  } catch (error) {
    console.error('获取库位数据失败:', error);
    ElMessage.error('获取库位数据失败');
  } finally {
    loading.value = false;
  }
}

// 过滤后的库位列表
const filteredLocationList = computed(() => {
  let filtered = [...storageLocationList.value];

  // 按仓库筛选
  if (selectedWarehouse.value !== '全部') {
    filtered = filtered.filter(
      (item) => item.warehouseName === selectedWarehouse.value,
    );
  }

  // 按库位筛选（这里简化处理，实际可能需要更复杂的筛选逻辑）
  if (locationFilter.value !== '全部' && locationFilter.value.trim()) {
    filtered = filtered.filter((item) =>
      item.location.toLowerCase().includes(locationFilter.value.toLowerCase()),
    );
  }

  return filtered;
});

// 全选状态
const isAllSelected = computed(() => {
  return (
    filteredLocationList.value.length > 0 &&
    filteredLocationList.value.every((item) =>
      selectedItems.value.some((selected) => selected.id === item.id),
    )
  );
});

// 部分选中状态
const isIndeterminate = computed(() => {
  const selectedCount = filteredLocationList.value.filter((item) =>
    selectedItems.value.some((selected) => selected.id === item.id),
  ).length;
  return selectedCount > 0 && selectedCount < filteredLocationList.value.length;
});

// 处理全选
function handleSelectAll(checked: boolean) {
  if (checked) {
    // 添加当前筛选结果中未选中的项
    const newItems = filteredLocationList.value.filter(
      (item) =>
        !selectedItems.value.some((selected) => selected.id === item.id),
    );
    selectedItems.value.push(...newItems);
  } else {
    // 移除当前筛选结果中的项
    const filteredIds = new Set(
      filteredLocationList.value.map((item) => item.id),
    );
    selectedItems.value = selectedItems.value.filter(
      (item) => !filteredIds.has(item.id),
    );
  }
}

// 处理单项选择
function handleItemSelect(item: StorageLocationItem, checked: boolean) {
  if (checked) {
    if (!selectedItems.value.some((selected) => selected.id === item.id)) {
      selectedItems.value.push(item);
    }
  } else {
    selectedItems.value = selectedItems.value.filter(
      (selected) => selected.id !== item.id,
    );
  }
}

// 检查是否选中
function isItemSelected(item: StorageLocationItem): boolean {
  return selectedItems.value.some((selected) => selected.id === item.id);
}

// 查询
function onSearch() {
  loadStorageLocationData();
}

// 确认选择
function handleConfirm() {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择库位');
    return;
  }

  // 触发父组件的选择事件
  emits('select', selectedItems.value);
  modalApi.close();
}

// 取消
function handleCancel() {
  modalApi.close();
}

// 重置筛选
function resetFilters() {
  selectedWarehouse.value = '全部';
  locationFilter.value = '全部';
  loadStorageLocationData();
}

// 监听筛选条件变化
watch([selectedWarehouse, locationFilter], () => {
  // 可以在这里添加自动查询逻辑
});
</script>

<template>
  <Modal>
    <div class="storage-location-select">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>仓库:</label>
            <ElSelect
              v-model="selectedWarehouse"
              placeholder="请选择仓库"
              style="width: 200px"
            >
              <ElOption
                v-for="option in warehouseOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>

          <div class="filter-item">
            <label>库位:</label>
            <ElInput
              v-model="locationFilter"
              placeholder="全部"
              style="width: 200px"
              clearable
            />
          </div>

          <div class="filter-actions">
            <ElButton type="primary" @click="onSearch">
              <IconifyIcon
                icon="material-symbols:search-rounded"
                class="mr-1"
              />
              查询
            </ElButton>
            <ElButton type="success" @click="handleConfirm">
              <IconifyIcon icon="material-symbols:check-rounded" class="mr-1" />
              选择
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <ElTable
          :data="filteredLocationList"
          v-loading="loading"
          height="400"
          border
          stripe
        >
          <!-- 选择列 -->
          <ElTableColumn width="50" align="center">
            <template #header>
              <ElCheckbox
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
              />
            </template>
            <template #default="{ row }">
              <ElCheckbox
                :model-value="isItemSelected(row)"
                @change="(checked: boolean) => handleItemSelect(row, checked)"
              />
            </template>
          </ElTableColumn>

          <!-- 排序列 -->
          <ElTableColumn
            prop="sortOrder"
            label="排序"
            width="80"
            align="center"
          />

          <!-- 仓库列 -->
          <ElTableColumn
            prop="warehouseName"
            label="仓库"
            width="200"
            show-overflow-tooltip
          />

          <!-- 库位列 -->
          <ElTableColumn
            prop="location"
            label="库位"
            min-width="150"
            show-overflow-tooltip
          />
        </ElTable>
      </div>

      <!-- 底部操作区 -->
      <div class="footer-actions">
        <div class="selected-info">已选择 {{ selectedItems.length }} 项</div>
        <div class="action-buttons">
          <ElButton @click="resetFilters"> 重置 </ElButton>
          <ElButton @click="handleCancel"> 取消 </ElButton>
          <ElButton type="primary" @click="handleConfirm"> 确认选择 </ElButton>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
// 响应式设计
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    margin-top: 12px;
    margin-left: 0;
  }

  .footer-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

.storage-location-select {
  padding: 16px 0;
}

.filter-section {
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;

  label {
    font-size: 14px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.table-section {
  margin-bottom: 16px;
}

.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.selected-info {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

// 表格样式调整
:deep(.el-table) {
  .el-table__header {
    background-color: var(--el-fill-color-light);
  }

  .el-table__row {
    &:hover {
      background-color: var(--el-fill-color-lighter);
    }
  }
}
</style>
