<template>
  <el-dialog v-model="vis" :title="title" width="1200" @close="handleClose">
    <div class="query-form-container">
      <!-- 添加搜索表单 -->
      <el-form
        :model="queryParams"
        label-width="80px"
        class="search-form"
        :inline="true"
      >
        <el-form-item label="简拼码" prop="jianPinCode">
          <el-input
            v-model="queryParams.jianPinCode"
            clearable
            placeholder="请输入简拼码"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="queryParams.name"
            clearable
            placeholder="请输入产品名称"
          />
        </el-form-item>
        <el-form-item label="车系" prop="carSeriesId">
          <el-select
            v-model="queryParams.carSeriesId"
            clearable
            placeholder="请选择车系"
          >
            <el-option
              v-for="item in carSeriesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车型" prop="carModelId">
          <el-select
            v-model="queryParams.carModelId"
            clearable
            placeholder="请选择车型"
          >
            <el-option
              v-for="item in carModelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" prop="positionId">
          <el-select
            v-model="queryParams.positionId"
            clearable
            placeholder="请选择安装位置"
          >
            <el-option
              v-for="item in positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="carTypeId">
          <el-select
            v-model="queryParams.carTypeId"
            clearable
            placeholder="请选择类别"
          >
            <el-option
              v-for="item in carTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="selectSub">
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
      <el-table-column prop="name" label="产品名称" width="200" />
      <el-table-column prop="baseName" label="通用车型" width="120" />
      <el-table-column prop="jianPinCode" label="简拼码" width="200" />
      <el-table-column prop="carModelName" label="车型名称" />
      <el-table-column prop="carSeriesName" label="车系名称" />
      <el-table-column prop="carTypeName" label="类型名称" />
      <el-table-column prop="positionName" label="安装位置名称" />
      <el-table-column prop="price" label="参考价" width="70" />
    </el-table>
    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import { ElMessage } from 'element-plus';

import {
  getInStorageSubList,
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
} from '#/api';
import { useMenuRights } from '#/utils';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

const vis = ref(false);
const tableRef = ref();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  jianPinCode: '',
  name: '',
  carSeriesId: '',
  carModelId: '',
  positionId: '',
  carTypeId: '',
});
const total = ref(0);

// 车系选项
const carSeriesOptions = ref<Array<any>>([]);
// 车型选项
const carModelOptions = ref<Array<any>>([]);
// 安装位置选项
const positionOptions = ref<Array<any>>([]);
// 类别选项
const carTypeOptions = ref<Array<any>>([]);

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

// 获取车系选项
const getCarSeriesOptions = async () => {
  const res = await getVehicleSeriesList();
  carSeriesOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 获取车型选项
const getCarModelOptions = async () => {
  const res = await getVehicleModelList();
  carModelOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 获取安装位置选项
const getPositionOptions = async () => {
  const res = await getVehiclePositionList();
  positionOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 获取类别选项
const getCarTypeOptions = async () => {
  const res = await getVehicleTypeList();
  carTypeOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));
};

// 初始化数据
onMounted(() => {
  getCarSeriesOptions();
  getCarModelOptions();
  getPositionOptions();
  getCarTypeOptions();
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
  return `新增明细`;
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

const getList = async () => {
  selectedRowId.value = '';
  const p = Object.assign({}, queryParams, {
    warehousingId: form.value.id,
  });
  const res = await getInStorageSubList(p);
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
  queryParams.carSeriesId = '';
  queryParams.carModelId = '';
  queryParams.positionId = '';
  queryParams.carTypeId = '';
  queryParams.pageNum = 1;
  getList();
};

// 查询按钮点击事件
const onRefresh = () => {
  queryParams.pageNum = 1;
  getList();
};

// 选择按钮点击事件
const selectSub = () => {
  if (!selectedRow.value) {
    ElMessage({
      message: '请先选择一条数据',
      type: 'warning',
    });
    return;
  }
  emit('confirm', {
    ...selectedRow.value,
    productName: selectedRow.value.name,
  });
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
</script>
