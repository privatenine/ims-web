<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const searchForm = ref({
  simplePinyin: '', // 简拼码
  productName: '', // 产品名称
  model: '', // 模糊
  warehouseName: 'all', // 仓库名称
  warehouseLocation: 'all', // 库位
  sortField: 'desc', // 排序
  priceType: 'cost', // 价格类型，默认成本价
});

// 商品列表表格配置
const productColumns: VxeTableGridOptions['columns'] = [
  { align: 'center', title: '', type: 'radio', width: 40 },
  { title: '排序', type: 'seq', width: 60 },
  {
    field: 'productName',
    title: '产品名称',
    width: 150,
  },
  {
    field: 'warehouseName',
    title: '仓库名称',
    width: 100,
  },
  {
    field: 'warehouseLocation',
    title: '库位',
    width: 100,
  },
  {
    field: 'stockQuantity',
    title: '库存数量',
    width: 100,
    formatter: ({ cellValue }) => cellValue || 0,
  },
  {
    field: 'batchPrice1',
    title: '批发价1',
    width: 100,
    formatter: ({ cellValue }) => cellValue || 0,
  },
  {
    field: 'batchPrice2',
    title: '批发价2',
    width: 100,
    formatter: ({ cellValue }) => cellValue || 0,
  },
  {
    field: 'batchPrice3',
    title: '批发价3',
    width: 100,
    formatter: ({ cellValue }) => cellValue || 0,
  },
];

const [ProductGrid, productGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [],
  },
  gridOptions: {
    columns: productColumns,
    height: 400,
    keepSource: true,
    showOverflow: false,
    data: [
      // 模拟数据
      {
        id: 1,
        productName: '黑豹J69前门左',
        warehouseName: 'A库',
        warehouseLocation: 'AF121',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
      {
        id: 2,
        productName: '黑豹J69前钢新款',
        warehouseName: 'A库',
        warehouseLocation: 'AO212',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
      {
        id: 3,
        productName: '黄河王子后',
        warehouseName: 'A库',
        warehouseLocation: 'AG325',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
      {
        id: 4,
        productName: '黄河王子后',
        warehouseName: 'A库',
        warehouseLocation: 'AG325',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
      {
        id: 5,
        productName: '黄河王子后',
        warehouseName: 'A库',
        warehouseLocation: 'AG325',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
      {
        id: 6,
        productName: '黄河王子右三角带孔',
        warehouseName: 'A库',
        warehouseLocation: 'AG339',
        stockQuantity: 1,
        batchPrice1: 0,
        batchPrice2: 0,
        batchPrice3: 0,
      },
    ],
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: false,
    },
  },
});

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
  },
  { immediate: true },
);

watch(dialogVisible, (val) => {
  if (!val) {
    emit('update:visible', false);
  }
});

function handleSearch() {
  console.log('搜索商品:', searchForm.value);
  // TODO: 调用商品搜索API
}

function handleSelect() {
  const selectedRows = productGridApi.getRadioRecord();
  if (!selectedRows) {
    // TODO: 显示提示消息
    console.log('请选择商品');
    return;
  }
  console.log('选择的商品:', selectedRows);
  emit('confirm', selectedRows);
  dialogVisible.value = false;
}

function handleCancel() {
  dialogVisible.value = false;
}

function setPriceType(type: string) {
  searchForm.value.priceType = type;
  // TODO: 重新加载数据显示对应价格
  console.log('切换价格类型:', type);
}
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="选择商品"
    width="90%"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <!-- 搜索表单 -->
    <ElForm :model="searchForm" inline class="search-form mb-4">
      <ElRow :gutter="20">
        <ElCol :span="6">
          <ElFormItem label="简拼码:">
            <ElInput
              v-model="searchForm.simplePinyin"
              placeholder="请输入简拼码"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="产品名称:">
            <ElInput
              v-model="searchForm.productName"
              placeholder="请输入产品名称"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="模糊:">
            <div class="flex items-center">
              <input type="checkbox" class="mr-2" />
              <ElInput v-model="searchForm.model" placeholder="" />
            </div>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="仓库名称:">
            <ElSelect v-model="searchForm.warehouseName" placeholder="请选择">
              <ElOption label="全部" value="all" />
              <ElOption label="A库" value="A" />
              <ElOption label="B库" value="B" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="6">
          <ElFormItem label="库位:">
            <ElSelect
              v-model="searchForm.warehouseLocation"
              placeholder="请选择"
            >
              <ElOption label="全部" value="all" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="排序:">
            <ElSelect v-model="searchForm.sortField" placeholder="请选择">
              <ElOption label="是" value="desc" />
              <ElOption label="否" value="asc" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem>
            <ElButton type="primary" @click="handleSearch"> 🔍 查询 </ElButton>
            <ElButton type="success" @click="handleSelect" class="ml-2">
              ✓ 选择
            </ElButton>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <!-- 价格类型切换按钮 -->
    <div class="price-type-buttons mb-4">
      <ElButton
        :type="searchForm.priceType === 'cost' ? 'warning' : 'default'"
        @click="setPriceType('cost')"
      >
        ✓ 成本价
      </ElButton>
    </div>

    <!-- 商品列表表格 -->
    <div class="product-table">
      <ProductGrid />
    </div>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSelect">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<style scoped>
.search-form {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.price-type-buttons {
  text-align: left;
}

.product-table {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
