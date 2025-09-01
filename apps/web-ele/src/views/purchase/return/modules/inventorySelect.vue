<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCard,
  ElCol,
  ElEmpty,
  ElInput,
  ElRow,
  ElTag,
} from 'element-plus';

import { findPurchaseBalanceList } from '#/api';

const emits = defineEmits(['success', 'select']);

interface InventoryItem {
  id: number;
  actiNum: number;
  baseId: number;
  baseName: string;
  batchPrice: number;
  buyPrice: number;
  createTime: number;
  inventoryLock: number;
  isDefault: boolean;
  priceReference: number;
  productAttachmentIds: string;
  productAttachmentNames: string;
  productId: number;
  productName: string;
  productPlaceId: number;
  productPlaceName: string;
  siteName: string;
  storeId: number;
  storeName: string;
  supplierId: number;
  supplierName: string;
  tradePrice1: number;
  tradePrice2: number;
  tradePrice3: number;
  tradePrice4: number;
  updateTime: number;
  hasRainSensor?: boolean;
  hasNightVision?: boolean;
}

// 内部状态
const searchKeyword = ref('');
const inventoryList = ref<InventoryItem[]>([]);
const loading = ref(false);
const selectedItem = ref<InventoryItem | null>(null);

// 表单数据，从父组件传入
const formData = ref<Record<string, any>>({});

const [Modal, modalApi] = useVbenModal({
  title: '选择库存项目',
  fullscreenButton: true,
  draggable: true,
  centered: true,
  destroyOnClose: true,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      if (data) {
        formData.value = { ...data };
        loadInventoryData();
      }
      searchKeyword.value = '';
      selectedItem.value = null;
    }
  },
});

// 过滤后的库存列表
const filteredInventoryList = computed(() => {
  if (!searchKeyword.value) {
    return inventoryList.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return inventoryList.value.filter(
    (item) =>
      item.productName?.toLowerCase().includes(keyword) ||
      item.supplierName?.toLowerCase().includes(keyword) ||
      item.productPlaceName?.toLowerCase().includes(keyword) ||
      item.storeName?.toLowerCase().includes(keyword),
  );
});

// 获取库存数据
async function loadInventoryData() {
  const { supplierId } = formData.value?.addPurchaseReturnMainParam || {};

  if (!supplierId) {
    console.warn('缺少供应商ID，无法查询库存');
    return;
  }

  try {
    loading.value = true;

    const params = {
      pageNum: 1,
      pageSize: 100,
      productJpm: '',
      productName: '',
      supplierId,
      sortParam: {
        field: 'createTime',
        type: -1, // 按创建时间倒序
      },
    };

    const response = await findPurchaseBalanceList(params);

    if (response.data) {
      // 过滤数量大于0的库存，并处理附件信息
      inventoryList.value = response.data
        .filter((item: any) => item.actiNum > 0)
        .map(transformInventoryItem);
    } else {
      inventoryList.value = [];
      console.warn('查询库存失败:', response.msg);
    }
  } catch (error) {
    console.error('查询库存失败:', error);
    inventoryList.value = [];
  } finally {
    loading.value = false;
  }
}

// 转换库存项目数据
function transformInventoryItem(item: any): InventoryItem {
  // 解析附件信息判断雨感器和夜视系统
  const attachmentNames = item.productAttachmentNames || '';
  const hasRainSensor = attachmentNames.includes('雨感');
  const hasNightVision = attachmentNames.includes('夜视');

  return {
    ...item,
    hasRainSensor,
    hasNightVision,
  };
}

// 选择库存项目
function selectInventoryItem(item: InventoryItem) {
  selectedItem.value = selectedItem.value?.id === item.id ? null : item;
}

// 检查是否选中
function isSelected(item: InventoryItem): boolean {
  return selectedItem.value?.id === item.id;
}

// 确认选择
function handleConfirm() {
  if (selectedItem.value) {
    emits('select', selectedItem.value);
    modalApi.close();
  }
}

// 格式化数量显示
function formatQuantity(quantity: number | undefined): string {
  if (quantity === undefined || quantity === null) {
    return '-';
  }
  return quantity.toString();
}

// 获取附件状态
function getAttachmentStatus(
  item: InventoryItem,
  attachmentName: string,
): {
  text: string;
  type: 'info' | 'success';
} {
  let hasAttachment = false;

  if (attachmentName === '雨感' && item.hasRainSensor !== undefined) {
    hasAttachment = item.hasRainSensor;
  } else if (attachmentName === '夜视' && item.hasNightVision !== undefined) {
    hasAttachment = item.hasNightVision;
  }

  return {
    text: hasAttachment ? '已配置' : '未配置',
    type: hasAttachment ? 'success' : 'info',
  };
}

// 监听搜索关键词变化
watch(searchKeyword, () => {
  selectedItem.value = null;
});
</script>

<template>
  <Modal>
    <div class="inventory-select-container">
      <!-- 搜索框 -->
      <div class="search-section mb-4">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索产品名称、供应商、产地、仓库..."
          clearable
          class="search-input"
        >
          <template #prefix>
            <IconifyIcon icon="material-symbols:search-rounded" />
          </template>
        </ElInput>
      </div>

      <!-- 库存列表 -->
      <div v-loading="loading" class="inventory-list-container">
        <!-- 空数据状态 -->
        <ElEmpty
          v-if="!loading && filteredInventoryList.length === 0"
          description="暂无库存数据"
          :image-size="120"
        />

        <!-- 库存项目列表 -->
        <div v-else class="inventory-grid">
          <ElCard
            v-for="item in filteredInventoryList"
            :key="item.id"
            class="inventory-item-card"
            :class="[{ 'is-selected': isSelected(item) }]"
            shadow="hover"
            @click="selectInventoryItem(item)"
          >
            <!-- 产品名称标题 -->
            <template #header>
              <div class="card-header">
                <span class="product-name">{{
                  item.productName || '未知产品'
                }}</span>
                <IconifyIcon
                  v-if="isSelected(item)"
                  icon="material-symbols:check-circle"
                  class="selected-icon"
                />
              </div>
            </template>

            <!-- 产品信息网格 -->
            <div class="product-info-grid">
              <ElRow :gutter="12">
                <!-- 基本信息 -->
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">产地:</span>
                    <span class="info-value">{{
                      item.productPlaceName || '-'
                    }}</span>
                  </div>
                </ElCol>
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">供应商:</span>
                    <span class="info-value">{{
                      item.supplierName || '-'
                    }}</span>
                  </div>
                </ElCol>

                <!-- 仓储信息 -->
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">仓库:</span>
                    <span class="info-value">{{ item.storeName || '-' }}</span>
                  </div>
                </ElCol>
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">货位:</span>
                    <span class="info-value">{{ item.siteName || '-' }}</span>
                  </div>
                </ElCol>

                <!-- 数量和价格 -->
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">库存数量:</span>
                    <span class="info-value quantity-value">
                      {{ formatQuantity(item.actiNum) }}
                    </span>
                  </div>
                </ElCol>
                <ElCol :span="12">
                  <div class="info-item">
                    <span class="info-label">参考价格:</span>
                    <span class="info-value price-value">
                      ¥{{ item.priceReference?.toFixed(2) || '0.00' }}
                    </span>
                  </div>
                </ElCol>

                <!-- 附件状态 -->
                <ElCol :span="24">
                  <div class="attachment-section">
                    <span class="info-label">附件状态:</span>
                    <div class="attachment-tags">
                      <ElTag
                        :type="getAttachmentStatus(item, '雨感').type"
                        size="small"
                        class="mr-2"
                      >
                        雨感: {{ getAttachmentStatus(item, '雨感').text }}
                      </ElTag>
                      <ElTag
                        :type="getAttachmentStatus(item, '夜视').type"
                        size="small"
                      >
                        夜视: {{ getAttachmentStatus(item, '夜视').text }}
                      </ElTag>
                    </div>
                  </div>
                </ElCol>
              </ElRow>
            </div>
          </ElCard>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="footer-actions mt-4">
        <ElButton @click="modalApi.close()">取消</ElButton>
        <ElButton
          type="primary"
          :disabled="!selectedItem"
          @click="handleConfirm"
        >
          确认选择
        </ElButton>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .inventory-grid {
    grid-template-columns: 1fr;
  }

  .search-section .search-input {
    max-width: 100%;
  }
}

.inventory-select-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.search-section {
  .search-input {
    max-width: 400px;
  }
}

.inventory-list-container {
  flex: 1;
  overflow-y: auto;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  padding: 4px;
}

.inventory-item-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }

  &.is-selected {
    border-color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgb(64 158 255 / 30%);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .product-name {
    flex: 1;
    margin-right: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .selected-icon {
    font-size: 20px;
    color: var(--el-color-primary);
  }
}

.product-info-grid {
  .info-item {
    display: flex;
    align-items: center;
    min-height: 24px;
    margin-bottom: 8px;

    .info-label {
      flex-shrink: 0;
      min-width: 70px;
      font-size: 13px;
      color: var(--el-text-color-regular);
    }

    .info-value {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      word-break: break-all;
    }

    .quantity-value {
      font-weight: 600;
      color: var(--el-color-primary);
    }

    .price-value {
      font-weight: 600;
      color: var(--el-color-success);
    }
  }

  .attachment-section {
    .info-label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      color: var(--el-text-color-regular);
    }

    .attachment-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  }
}

.footer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
