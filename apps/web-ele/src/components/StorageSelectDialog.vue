<template>
  <el-dialog
    v-model="vis"
    :title="title"
    width="1200"
    class="form-dialog"
    @close="handleClose"
  >
    <div class="dialog-content">
      <div class="query-form-container">
        <!-- 添加搜索表单 -->
        <el-form
          :model="queryParams"
          label-width="80px"
          class="search-form"
          :inline="true"
        >
          <!-- 简拼码 -->
          <el-form-item label="简拼码">
            <el-input
              v-model="queryParams.jianPinCode"
              placeholder="请输入简拼码"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- 名称 -->
          <el-form-item label="名称">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- 产地 -->
          <el-form-item label="产地">
            <el-select
              v-model="queryParams.productPlaceId"
              placeholder="请选择产地"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="item in placeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <!-- 仓库 -->
          <el-form-item label="仓库">
            <el-select
              v-model="queryParams.storeId"
              placeholder="请选择仓库"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <!-- 排零 -->
          <!-- <el-form-item label="排零">
            <el-checkbox v-model="queryParams.isExcludeZero" />
          </el-form-item> -->
          <!-- 模糊 -->
          <!-- <el-form-item label="模糊">
            <el-checkbox v-model="queryParams.isFuzzy" />
          </el-form-item> -->

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <ElButtonGroup class="ml-4">
        <ElButton type="primary" @click="confirm">
          <IconifyIcon
            icon="ep:select"
            class="size-5"
            style="margin-right: 4px"
          />
          选择
        </ElButton>
        <ElButton type="primary" disabled>
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
      </ElButtonGroup>

      <!-- 添加表格 -->
      <el-table
        :data="tableData"
        ref="tableRef"
        stripe
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column align="center" type="radio" width="30">
          <template #default="scope">
            <el-radio
              v-model="selectedRowId"
              :value="scope.row.productId"
              @click.stop
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="baseName" label="通用车型" width="160" />
        <el-table-column prop="name" label="产品名称" width="220" />
        <el-table-column prop="productPlaceName" label="产地" width="220" />
        <el-table-column prop="actiNum" label="数量" width="100" />
        <el-table-column prop="storeName" label="仓库" width="160" />
        <el-table-column prop="siteName" label="库位" width="160" />
        <el-table-column prop="tradePrice1" label="批发价1" width="100" />
        <el-table-column prop="tradePrice2" label="批发价2" width="100" />
        <el-table-column prop="tradePrice3" label="批发价3" width="100" />
        <el-table-column prop="tradePrice4" label="批发价4" width="100" />
      </el-table>
      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[20, 40, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import { ElMessage } from 'element-plus';

import { getStorageList, getVehiclePlaceList, findBalanceList } from '#/api';
import { useMenuRights } from '#/utils';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

const vis = ref(false);
const tableRef = ref();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 40,
  jianPinCode: '',
  name: '',
  productPlaceId: '',
  storeId: '',
});

const total = ref(0);
// 产地选项
const placeOptions = ref<Array<any>>([]);
// 仓库选项
const storeOptions = ref<Array<any>>([]);

// 表单数据
const form = ref({
  supplierId: '',
  supplierName: '',
  code: '',
  arrivalId: undefined,
  pickUpCarId: undefined,
  unloadingId: undefined,
  totalMoney: 0,
  totalNum: 0,
  remark: '',
  id: '',
  statusFlag: undefined,
});

// 初始化数据
onMounted(() => {
  // 获取产地和仓库选项
  getPlaceOptions();
  getStoreOptions();
});

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      handleQuery();
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const title = computed(() => {
  return `新增明细-选择库存`;
});

// 表格相关
const tableData = ref<Array<any>>([]);
const selectedRowId = ref('');
const selectedRow = computed(() => {
  return tableData.value.find(
    (row: any) => row.productId === selectedRowId.value,
  );
});

// 添加处理行点击的函数
const handleRowClick = (row: any) => {
  selectedRowId.value = row.productId;
};

// 添加处理行双击的函数
const handleRowDblClick = (row: any) => {
  selectedRowId.value = row.productId;
  confirm();
};

const getList = async () => {
  selectedRowId.value = '';
  const p = Object.assign({}, queryParams);
  const res = await findBalanceList(p);
  tableData.value = res.data;
  total.value = res.total;
};

// 查询按钮点击事件
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置按钮点击事件
const handleReset = () => {
  queryParams.jianPinCode = '';
  queryParams.name = '';
  queryParams.productPlaceId = '';
  queryParams.storeId = '';
  queryParams.pageNum = 1;
  getList();
};

// 查询按钮点击事件
const onRefresh = () => {
  queryParams.pageNum = 1;
  getList();
};

// 选择按钮点击事件
const confirm = () => {
  if (!selectedRow.value) {
    ElMessage({
      message: '请先选择一条数据',
      type: 'warning',
    });
    return;
  }
  emit('confirm', selectedRow.value);
  vis.value = false;
};

// 分页事件处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

const handleClose = () => {
  emit('cancel');
};

// 获取产地选项
const getPlaceOptions = async () => {
  try {
    const res = await getVehiclePlaceList();
    placeOptions.value = res.data;
  } catch (error) {
    console.error('获取产地选项失败:', error);
  }
};

// 获取仓库选项
const getStoreOptions = async () => {
  try {
    const res = await getStorageList({});
    storeOptions.value = res.data;
  } catch (error) {
    console.error('获取仓库选项失败:', error);
  }
};
</script>
<style scoped>
.form-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.dialog-content {
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  padding-right: 10px;
}

:deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
}
</style>
