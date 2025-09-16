<template>
  <el-dialog
    class="main-dialog"
    v-model="vis"
    :title="title"
    width="1200"
    append-to-body
    @close="handleClose"
  >
    <el-form :model="formData" label-width="80px" class="detail-form">
      <!-- ... existing code ... -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-descriptions :column="4" border>
            <el-descriptions-item label="供应商">
              {{ formData.supplierName }}
            </el-descriptions-item>
            <el-descriptions-item label="单号">
              {{ formData.code }}
            </el-descriptions-item>
            <el-descriptions-item label="到货方式">
              {{ arrivalMap[formData.arrivalId] }}
            </el-descriptions-item>
            <el-descriptions-item label="提货车牌">
              {{ carMap[formData.pickUpCarId] }}
            </el-descriptions-item>
            <el-descriptions-item label="卸货方式">
              {{ unloadingMap[formData.unloadingId] }}
            </el-descriptions-item>
            <el-descriptions-item label="金额">
              ¥{{ formData.totalMoney?.toFixed(2) }}
            </el-descriptions-item>
            <el-descriptions-item label="数量">
              {{ formData.totalNum }}
            </el-descriptions-item>
            <el-descriptions-item label="备注">
              {{ formData.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <ElButtonGroup class="mt-2">
        <ElButton type="primary" @click="uptStatus(0)">
          <IconifyIcon
            icon="mdi:selection-remove"
            class="size-5"
            style="margin-right: 4px"
          />
          驳回
        </ElButton>
        <ElButton type="primary" @click="uptStatus(1)">
          <IconifyIcon
            icon="material-symbols:select-check-box-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          入库
        </ElButton>
      </ElButtonGroup>

      <el-row>
        <el-col :span="24">
          <div class="table-container">
            <el-table
              :data="tableData"
              stripe
              height="calc(100vh - 340px)"
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column
                prop="productName"
                label="产品名称"
                width="200"
              />
              <el-table-column
                prop="productAttachmentNames"
                label="附件"
                width="200"
              />
              <el-table-column
                prop="productPlaceName"
                label="产地"
                width="100"
              />
              <el-table-column prop="actiNum" label="数量" width="80" />
              <el-table-column prop="price" label="单价" width="80">
                <template #default="{ row }">
                  ¥{{ row.price?.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="总金额" width="80">
                <template #default="{ row }">
                  ¥{{ row.totalPrice?.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="storeName" label="仓库" width="100" />
              <el-table-column prop="siteName" label="库位" width="100" />
              <el-table-column prop="remark" label="备注" width="300" />
              <el-table-column
                prop="priceReference"
                label="参考价格"
                width="100"
              >
                <template #default="{ row }">
                  ¥{{ row.priceReference?.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="purchaseCode"
                label="采购编号"
                width="80"
              />
            </el-table>
          </div>
          <!-- 分页控件 -->
          <div class="pagination-container space-between flex-row">
            <el-pagination
              v-model:current-page="queryParams.pageNum"
              v-model:page-size="queryParams.pageSize"
              :page-sizes="[20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
            <el-button type="primary" @click="handleClose">关闭</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  approveInstorage,
  getCarList,
  getInStorageSubByMainId,
  rejectInstorage,
} from '#/api';
import { unloadingMap } from '#/utils';

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'info',
  },
});
const emit = defineEmits(['close', 'success']);
const vis = ref(false);
const tableData = ref([]);
const carOptions = ref([]);
const carMap = ref<Record<number | string, string>>({});

// 到货方式映射
const arrivalMap = {
  1: '自提',
  2: '送货',
  3: '物流送货',
};

const title = computed(() => {
  return `入库审核`;
});

// 添加分页相关的响应式数据
const queryParams = reactive({
  pageNum: 1,
  pageSize: 20,
});

const total = ref(0);

const fetchTableData = async () => {
  if (props.formData.id) {
    try {
      // 添加分页参数
      const res = await getInStorageSubByMainId({
        warehousingId: props.formData.id,
        pageNum: queryParams.pageNum,
        pageSize: queryParams.pageSize,
      });
      tableData.value = res.data || [];
      total.value = res.total || 0;
    } catch (error) {
      console.error('获取明细数据失败:', error);
      tableData.value = [];
      total.value = 0;
    }
  }
};

const fetchCarList = async () => {
  try {
    const res = await getCarList();
    carOptions.value = res.data.map((item: any) => ({
      label: item.carNum || '',
      value: item.id,
    }));

    // 构建车牌映射
    carMap.value = {};
    res.data.forEach((item: any) => {
      carMap.value[item.id] = item.carNum || '';
    });
  } catch (error) {
    console.error('获取车牌列表失败:', error);
  }
};

function uptStatus(flag: number) {
  const params = {
    mainId: props.formData?.id,
    version: props.formData?.version,
  };
  (flag ? approveInstorage(params) : rejectInstorage(params))
    .then(() => {
      emit('success');
      emit('close');
    })
    .finally(() => {});
}

const handleClose = () => {
  emit('close');
};

// 添加分页事件处理函数
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  fetchTableData();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  fetchTableData();
};

// 监听分页参数变化
watch(
  () => [queryParams.pageNum, queryParams.pageSize],
  () => {
    fetchTableData();
  },
);

// 监听formData变化，重新获取数据
watch(
  () => props.formData,
  () => {
    fetchTableData();
  },
  { immediate: true, deep: true },
);
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal && props.formData?.id) {
      fetchTableData();
    }
  },
);

onMounted(() => {
  fetchCarList();
  fetchTableData();
});
</script>

<style scoped></style>
