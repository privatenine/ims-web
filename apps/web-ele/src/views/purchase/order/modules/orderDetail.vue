<script setup lang="ts">
import type { PurchaseOrderApi } from '#/api/purchase/order';

import { onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { getPurchaseOrderDetail } from '#/api/purchase/order';

interface Props {
  orderId?: string;
  orderData?: PurchaseOrderApi.PurchaseOrder;
}

const props = withDefaults(defineProps<Props>(), {
  orderId: '',
  orderData: undefined,
});

const emit = defineEmits<{
  close: [];
}>();

// 订单详情数据
const orderDetail = ref<PurchaseOrderApi.PurchaseOrder>({
  id: '',
  orderNo: '',
  orderStatus: '',
  supplierName: '',
  totalAmount: 0,
  totalQuantity: 0,
  orderDate: '',
  bankAccount: '',
  currency: '',
  paidAdvance: 0,
  creator: '',
  remark: '',
});

// 产品明细数据（模拟数据，基于图片内容）
const orderItems = ref([
  {
    vehicleModel: '天龙前兴#',
    productName: '东风天龙前兴彩',
    origin: '山西利虎',
    quantity: 100,
    arrivedQuantity: 0,
    unArrivedQuantity: 100,
    accumulatedQuantity: 216,
    stockQuantity: 24,
    cumulativeQuantity: 24,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 12_100,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '东风天锦前兴带#',
    productName: '东风天锦前兴带彩',
    origin: '山西利虎',
    quantity: 100,
    arrivedQuantity: 0,
    unArrivedQuantity: 100,
    accumulatedQuantity: 165,
    stockQuantity: 13,
    cumulativeQuantity: 13,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 11_500,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '红岩杰狮前兴#',
    productName: '红岩杰狮前兴',
    origin: '山西利虎',
    quantity: 50,
    arrivedQuantity: 0,
    unArrivedQuantity: 50,
    accumulatedQuantity: 104,
    stockQuantity: 0,
    cumulativeQuantity: 0,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 6400,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '陕汽德龙X3000前兴带#',
    productName: '陕汽德龙X3000白带链前兴',
    origin: '山西利虎',
    quantity: 50,
    arrivedQuantity: 0,
    unArrivedQuantity: 50,
    accumulatedQuantity: 95,
    stockQuantity: 28,
    cumulativeQuantity: 29,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 7750,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '成都王牌左前门',
    productName: '成都王牌左前门',
    origin: '山西利虎',
    quantity: 30,
    arrivedQuantity: 0,
    unArrivedQuantity: 30,
    accumulatedQuantity: 87,
    stockQuantity: 37,
    cumulativeQuantity: 37,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 791.999_998_550_082,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '东风天龙左前门/天锦/大力神左前门门/解放化2006款#',
    productName: '东风天龙左前门',
    origin: '山西利虎',
    quantity: 30,
    arrivedQuantity: 0,
    unArrivedQuantity: 30,
    accumulatedQuantity: 85,
    stockQuantity: 33,
    cumulativeQuantity: 33,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 681.000_002_288_618,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '成都王牌右前门',
    productName: '成都王牌右前门',
    origin: '山西利虎',
    quantity: 30,
    arrivedQuantity: 0,
    unArrivedQuantity: 30,
    accumulatedQuantity: 81,
    stockQuantity: 32,
    cumulativeQuantity: 32,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 791.999_998_550_082,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '东风天龙后1260*430#',
    productName: '东风天龙后1260*430',
    origin: '山西利虎',
    quantity: 20,
    arrivedQuantity: 0,
    unArrivedQuantity: 20,
    accumulatedQuantity: 77,
    stockQuantity: 36,
    cumulativeQuantity: 36,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 380,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
  {
    vehicleModel: '豪沃前兴#',
    productName: '豪沃前兴',
    origin: '山西利虎',
    quantity: 50,
    arrivedQuantity: 0,
    unArrivedQuantity: 50,
    accumulatedQuantity: 74,
    stockQuantity: 10,
    cumulativeQuantity: 10,
    positiveQuantity: 0,
    inTransitQuantity: 0,
    policy: '无',
    totalAmount: 6400,
    trademark: '无',
    bracket: '无',
    color: '无',
    ribbon: '无',
  },
]);

// 格式化货币
const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return '0.00';
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// 格式化日期
const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

// 加载订单详情
const loadOrderDetail = async () => {
  if (props.orderData) {
    orderDetail.value = { ...props.orderData };
    return;
  }

  if (props.orderId) {
    try {
      const response = await getPurchaseOrderDetail(props.orderId);
      orderDetail.value = response;
    } catch (error) {
      console.error('加载订单详情失败:', error);
      ElMessage.error('加载订单详情失败');
    }
  }
};

// 打印
const onPrint = () => {
  window.print();
};

// 导出
const onExport = () => {
  ElMessage.info('导出功能开发中...');
};

onMounted(() => {
  loadOrderDetail();
});
</script>

<script lang="ts">
export default {
  name: 'OrderDetail',
};
</script>

<template>
  <div class="purchase-order-detail">
    <!-- 基本信息区域 -->
    <div class="detail-header mb-4 rounded-lg bg-gray-50 p-4">
      <h3 class="mb-4 text-lg font-semibold text-gray-800">采购订单详情</h3>

      <!-- 第一行信息 -->
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="info-item">
          <label class="info-label">采购编号:</label>
          <span class="info-value">{{
            orderDetail.orderNo || 'CGD152508090000606'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">供应商:</label>
          <span class="info-value">{{
            orderDetail.supplierName || '利虎'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">银行账号:</label>
          <span class="info-value">{{ orderDetail.bankAccount || '' }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">参考月数:</label>
          <span class="info-value">{{
            orderDetail.referenceMonths || '3'
          }}</span>
        </div>
      </div>

      <!-- 第二行信息 -->
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="info-item">
          <label class="info-label">预付款:</label>
          <span class="info-value">{{
            formatCurrency(orderDetail.paidAdvance) || '0.0'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">已付定金:</label>
          <span class="info-value">{{
            formatCurrency(orderDetail.paidDeposit) || '0.0'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">订货日期:</label>
          <span class="info-value">{{
            formatDate(orderDetail.orderDate) || '2025-08-09'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">预计到货日期:</label>
          <span class="info-value">{{
            formatDate(orderDetail.expectedDate) || ''
          }}</span>
        </div>
      </div>

      <!-- 第三行信息 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="info-item">
          <label class="info-label">总金额:</label>
          <span class="info-value font-semibold text-red-600">{{
            formatCurrency(orderDetail.totalAmount) || '217920.5'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">总数量:</label>
          <span class="info-value font-semibold">{{
            orderDetail.totalQuantity || '3486'
          }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">币种:</label>
          <span class="info-value">{{ orderDetail.currency || '人民币' }}</span>
        </div>
        <div class="info-item">
          <label class="info-label">备注:</label>
          <span class="info-value">{{ orderDetail.remark || '' }}</span>
        </div>
      </div>
    </div>

    <!-- 产品明细列表 -->
    <div class="detail-items">
      <h4 class="text-md mb-3 font-semibold text-gray-800">产品明细</h4>

      <div class="overflow-x-auto">
        <table class="min-w-full rounded-lg border border-gray-200 bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                排序
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                通用车型
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                产品名称
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                产地
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                数量
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                到货数量
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                未到数量
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                累结数
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                库存数
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                累存数
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                正定数
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                在途数
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                政策
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                总金额
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                商标
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                支架
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                颜色
              </th>
              <th
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                彩带
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(item, index) in orderItems"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.vehicleModel }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.productName }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.origin }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.quantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.arrivedQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.unArrivedQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.accumulatedQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.stockQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.cumulativeQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.positiveQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.inTransitQuantity }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.policy }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">
                {{ formatCurrency(item.totalAmount) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.trademark }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ item.bracket }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.color }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.ribbon }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-6 flex justify-end space-x-3">
      <ElButton @click="onPrint">
        <IconifyIcon
          icon="material-symbols:print-outline-rounded"
          class="mr-2"
        />
        打印
      </ElButton>
      <ElButton @click="onExport">
        <IconifyIcon icon="material-symbols:download-rounded" class="mr-2" />
        导出
      </ElButton>
      <ElButton type="primary" @click="$emit('close')"> 关闭 </ElButton>
    </div>
  </div>
</template>

<style scoped>
.info-item {
  @apply flex flex-col space-y-1;
}

.info-label {
  @apply text-sm font-medium text-gray-600;
}

.info-value {
  @apply text-sm text-gray-900;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
