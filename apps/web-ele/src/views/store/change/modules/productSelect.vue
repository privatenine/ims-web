<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface ProductItem {
  id: number;
  generalCarModel: string;
  productName: string;
  attachment: string;
  productOrigin: string;
  inventory: number;
  warehouse: string;
  binLocation: string;
  selected?: boolean;
}

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  success: [product: ProductItem];
  'update:open': [value: boolean];
}>();

// 控制对话框显示的变量
const dialogVisible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

// 筛选条件
const filterData = ref({
  jianpinCode: '',
  productName: '',
  fuzzy: false,
  warehouse: '全部',
  binLocation: '全部',
});

// 仓库选项
const warehouseOptions = [
  { label: '全部', value: '全部' },
  { label: 'A库', value: 'A库' },
  { label: 'B库', value: 'B库' },
  { label: 'C库', value: 'C库' },
  { label: 'F库', value: 'F库' },
];

// 货位选项
const binLocationOptions = [
  { label: '全部', value: '全部' },
  { label: 'FA139', value: 'FA139' },
  { label: 'FB113', value: 'FB113' },
  { label: 'FA107', value: 'FA107' },
];

// 模拟产品数据
const mockProductData: ProductItem[] = [
  {
    id: 1,
    generalCarModel: '比亚迪海鸥前夹2023-Q款纯电动小型车#',
    productName: '比亚迪海鸥前夹2023-Q款纯电动小型车#',
    attachment: '配套商标',
    productOrigin: '信义',
    inventory: 1,
    warehouse: 'F库',
    binLocation: 'FB113',
  },
  {
    id: 2,
    generalCarModel: '大众凌渡2015-2021款轿车前挡#',
    productName: '上汽大众凌渡前挡夹层2015款',
    attachment: '带镜座',
    productOrigin: '信义',
    inventory: 1,
    warehouse: 'F库',
    binLocation: 'FB113',
  },
  {
    id: 3,
    generalCarModel: '日产轩逸(第十四代)带摄像22款前夹#',
    productName: '日产轩逸(第十四代)2020-Q款轿车前挡/行车记录仪',
    attachment: '镜座/胶条',
    productOrigin: '信义',
    inventory: 1,
    warehouse: 'F库',
    binLocation: 'FA139',
  },
  {
    id: 4,
    generalCarModel: '日产轩逸(第十四代)带摄像22款前夹#',
    productName: '日产轩逸(第十四代)2020-Q款轿车前挡/行车记录仪',
    attachment: '',
    productOrigin: '信义',
    inventory: 1,
    warehouse: 'F库',
    binLocation: 'FA139',
  },
  {
    id: 5,
    generalCarModel: '丰田兰德酷路泽2008-Q款前夹/丰田霸道FJ200前2009-2017款/',
    productName: '丰田兰德酷路泽2008-Q款前挡/镜座/丰田霸道FJ200前2009-2017款/',
    attachment: '',
    productOrigin: '信义',
    inventory: 1,
    warehouse: 'F库',
    binLocation: 'FA107',
  },
];

// 过滤后的数据
const filteredData = computed(() => {
  return mockProductData.filter((item) => {
    const jianpinMatch =
      !filterData.value.jianpinCode ||
      item.productName
        .toLowerCase()
        .includes(filterData.value.jianpinCode.toLowerCase());
    const nameMatch =
      !filterData.value.productName ||
      (filterData.value.fuzzy
        ? item.productName
            .toLowerCase()
            .includes(filterData.value.productName.toLowerCase())
        : item.productName === filterData.value.productName);
    const warehouseMatch =
      filterData.value.warehouse === '全部' ||
      item.warehouse === filterData.value.warehouse;
    const locationMatch =
      filterData.value.binLocation === '全部' ||
      item.binLocation === filterData.value.binLocation;
    return jianpinMatch && nameMatch && warehouseMatch && locationMatch;
  });
});

// 产品表格
const [ProductGrid, productGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '排序', type: 'seq', width: 60 },
      {
        field: 'generalCarModel',
        title: '通用车型',
        width: 300,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'productName',
        title: '产品名称',
        width: 300,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'attachment',
        title: '附件',
        width: 120,
        showOverflow: 'tooltip',
      },
      {
        field: 'productOrigin',
        title: '产品产地',
        width: 100,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'inventory',
        title: '库存',
        width: 80,
        align: 'right',
        sortable: true,
        formatter: ({ cellValue }: { cellValue: number }) => {
          return cellValue || 0;
        },
      },
      {
        field: 'warehouse',
        title: '仓库',
        width: 100,
        sortable: true,
        showOverflow: 'tooltip',
      },
      {
        field: 'binLocation',
        title: '库位',
        width: 100,
        sortable: true,
        showOverflow: 'tooltip',
      },
    ],
    height: 400,
    keepSource: true,
    showOverflow: false,
    data: filteredData.value,
    rowConfig: {
      keyField: 'id',
    },
    radioConfig: {
      trigger: 'row',
    },
    toolbarConfig: {
      custom: false,
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
  },
});

// 查询
const onQuery = () => {
  // 更新表格数据
  productGridApi.query();
  ElMessage.success('查询完成');
};

// 选择
const onSelect = () => {
  const selectedRow = productGridApi.getRadioRecord();
  if (!selectedRow) {
    ElMessage.warning('请选择产品');
    return;
  }

  emit('success', selectedRow);
  emit('update:open', false);
};

// 全选
const onSelectAll = () => {
  // 这里可以根据业务需求实现全选逻辑
  ElMessage.info('全选功能待实现');
};

// 取消
const onCancel = () => {
  emit('cancel');
  emit('update:open', false);
};

// 监听筛选条件变化
const handleFilterChange = () => {
  productGridApi.query();
};

// 监听props.open变化
watch(
  () => props.open,
  (open) => {
    if (open) {
      // 重置筛选条件
      filterData.value = {
        jianpinCode: '',
        productName: '',
        fuzzy: false,
        warehouse: '全部',
        binLocation: '全部',
      };
      // 加载数据
      productGridApi.query();
    }
  },
);
</script>

<script lang="ts">
export default { name: 'ProductSelect' };
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="选择产品"
    width="1200px"
    :center="true"
    @close="onCancel"
  >
    <div class="product-select-dialog">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label>简拼码:</label>
            <ElInput
              v-model="filterData.jianpinCode"
              placeholder="请输入简拼码"
              @input="handleFilterChange"
            />
          </div>
          <div class="filter-item">
            <label>产品名称:</label>
            <ElInput
              v-model="filterData.productName"
              placeholder="请输入产品名称"
              @input="handleFilterChange"
            />
          </div>
          <div class="filter-item">
            <ElCheckbox v-model="filterData.fuzzy" @change="handleFilterChange">
              模糊
            </ElCheckbox>
          </div>
          <div class="filter-item">
            <label>仓库:</label>
            <ElSelect
              v-model="filterData.warehouse"
              placeholder="请选择仓库"
              @change="handleFilterChange"
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
            <label>货位:</label>
            <ElSelect
              v-model="filterData.binLocation"
              placeholder="请选择货位"
              @change="handleFilterChange"
            >
              <ElOption
                v-for="option in binLocationOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>
          <div class="filter-actions">
            <ElButton type="primary" @click="onQuery">
              <IconifyIcon icon="ant-design:search-outlined" class="mr-1" />
              查询
            </ElButton>
            <ElButton type="primary" @click="onSelect">
              <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
              选择
            </ElButton>
            <ElButton type="primary" @click="onSelectAll">
              <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
              全选
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 产品列表 -->
      <div class="product-list">
        <ProductGrid table-title="产品列表" />
      </div>
    </div>
  </ElDialog>
</template>

<style lang="scss" scoped>
.product-select-dialog {
  padding: 16px 0;
}

.filter-section {
  padding: 16px;
  margin-bottom: 20px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;

  label {
    min-width: 60px;
    font-weight: 500;
  }

  .el-input,
  .el-select {
    width: 150px;
  }
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.product-list {
  margin-top: 16px;
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
</style>
