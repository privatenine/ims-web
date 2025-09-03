<template>
  <div class="app-container">
    <div class="query-form-container">
      <!-- 搜索表单 -->
      <el-form
        :model="queryParams"
        :inline="true"
        class="query-form"
        label-width="80px"
      >
        <!-- 单号 -->
        <el-form-item label="单号" prop="code">
          <el-input v-model="queryParams.code" />
        </el-form-item>

        <!-- 供应商 -->
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            v-model="queryParams.supplierName"
            placeholder="请选择"
            readonly
          />
        </el-form-item>

        <!-- 到货方式 -->
        <el-form-item label="到货方式" prop="arrivalId">
          <el-select
            v-model="queryParams.arrivalId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in arrivalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 提货车牌 -->
        <el-form-item label="提货车牌" prop="pickUpCarId">
          <el-select
            v-model="queryParams.pickUpCarId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in carOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="开单日期" prop="dateRange">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="x"
          />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="query-btn-container">
      <ElButtonGroup class="ml-4">
        <ElButton
          type="primary"
          @click="handleAdd"
          v-if="rights.includes('新增')"
        >
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
        <ElButton
          type="primary"
          @click="editSelectRow"
          v-if="rights.includes('修改')"
        >
          <IconifyIcon
            icon="ant-design:edit"
            class="size-5"
            style="margin-right: 4px"
          />
          修改
        </ElButton>
        <ElButton type="primary" disabled>
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="material-symbols:download-rounded"
          />
          下载数据
        </ElButton>
        <ElButton
          type="primary"
          @click="openDetail"
          v-if="rights.includes('详情')"
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="fluent:apps-list-detail-20-regular"
          />
          详情
        </ElButton>
        <ElButton
          type="primary"
          @click="openAudit"
          v-if="rights.includes('审核')"
        >
          <IconifyIcon
            icon="icon-park-outline:audit"
            class="size-5"
            style="margin-right: 4px"
          />
          审核
        </ElButton>
        <ElButton type="primary" disabled v-if="rights.includes('订单查询')">
          <IconifyIcon
            icon="material-symbols:search-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          订单查询
        </ElButton>
        <ElButton
          type="primary"
          @click="openStoreForm"
          v-if="rights.includes('改货位')"
        >
          <IconifyIcon
            icon="line-md:edit-twotone"
            class="size-5"
            style="margin-right: 4px"
          />
          改货位
        </ElButton>
        <ElButton
          type="primary"
          @click="deleteSelectRow"
          v-if="rights.includes('删除')"
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="mdi:trash-can-outline"
          />
          删除
        </ElButton>
        <ElButton
          type="primary"
          @click="
            () =>
              useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
                if (3 !== data.statusFlag) {
                  ElMessage.warning('只有完成入库才可以结算');
                  return;
                }
                settlementFormModelApi.setData(data).open();
              })
          "
          v-if="rights.includes('付款')"
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="fluent:select-all-on-20-regular"
          />
          结算
        </ElButton>
      </ElButtonGroup>
    </div>
    <!-- 分页列表 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column width="30" align="center">
          <template #default="{ row }">
            <el-radio v-model="selectedRowId" :value="row.id" @click.stop>
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="code" label="单号" width="200" />
        <el-table-column prop="statusFlag" label="订单状态" width="120">
          <template #default="{ row }">
            <ElTag :type="statusFlagMap[row.statusFlag]?.color || 'danger'">
              {{ statusFlagMap[row.statusFlag]?.name || '未知' }}
            </ElTag>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" width="200" />
        <el-table-column prop="totalNum" label="数量" width="80" />
        <el-table-column prop="totalMoney" label="金额" width="80">
          <template #default="{ row }">
            ¥{{ row.totalMoney.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="printFlag" label="打印次数" width="100" />
        <el-table-column prop="storeName" label="临时仓库" width="100" />
        <el-table-column prop="storeSiteName" label="临时货位" width="100" />
        <el-table-column prop="createName" label="制单员" width="100" />
        <el-table-column prop="createTime" label="入库日期" width="100">
          <template #default="{ row }">
            {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="approveName" label="审批人" width="100" />
        <el-table-column prop="pickUpCarNum" label="提货车牌号" width="120" />
        <el-table-column prop="unloadingId" label="卸货方式" width="100">
          <template #default="{ row }">
            {{ unloadingMap[row.unloadingId] || '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" />
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
    </div>

    <formDialog
      v-model:visible="formDialogVis"
      :form-data="formData"
      @close="formDialogVis = false"
      @confirm="handleFormDialogConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarApi } from '#/api';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';

import { getCarList, getInStorageCode, getInStorageList } from '#/api';
import { statusFlagMap, unloadingMap, useMenuRights } from '#/utils';

import formDialog from './formDialog.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

// 初始化时获取数据
onMounted(() => {
  getList();
  getCarOptions();
});

const formDialogVis = ref(false);
const formData = ref({});

// 添加选中行的ID
const selectedRowId = ref('');
const selectedRow = computed(() => {
  return tableData.value.find((row: any) => row.id === selectedRowId.value);
});

// 添加处理行点击的函数
const handleRowClick = (row: any) => {
  selectedRowId.value = row.id;
};

// 搜索表单数据
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  supplierName: '',
  code: '',
  arrivalId: '',
  pickUpCarId: '',
  unloadingId: '',
  remark: '',
  supplierId: '',
  id: '',
  startTime: '',
  endTime: '',
  dateRange: [],
});

// 下拉选项数据
const arrivalOptions = [
  { label: '自提', value: 1 },
  { label: '送货', value: 2 },
  { label: '物流送货', value: 3 },
];

// 提货车牌远程数据
const carOptions = ref<Array<{ label: string; value: number }>>([]);

// 表格数据
const tableData = ref([]);
const total = ref(0);

// 搜索按钮点击事件
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置按钮点击事件
const handleReset = () => {
  // 重置表单
  Object.keys(queryParams).forEach((key) => {
    queryParams[key] = '';
  });
  queryParams.dateRange = [];
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  getList();
};

const getCarOptions = async () => {
  const res = await getCarList();
  carOptions.value = res.data.map((item: CarApi.Car) => ({
    label: item.carNum || '',
    value: item.id,
  }));
};

// 获取表格数据
const getList = async () => {
  const p = JSON.parse(JSON.stringify(queryParams));
  if (p.dateRange) {
    p.startTime = p.dateRange[0];
    p.endTime = p.dateRange[1];
  } else {
    p.startTime = '';
    p.endTime = '';
  }
  Reflect.deleteProperty(p, 'dateRange');

  const res = await getInStorageList(p);
  tableData.value = res.data;
  total.value = res.total;
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

const handleAdd = () => {
  getInStorageCode().then(({ data }: { data: string }) => {
    formData.value = { code: data };
    formDialogVis.value = true;
  });
};

function editSelectRow() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  if (![1, 5].includes(selectedRow.value.statusFlag)) {
    ElMessage({
      message: `只能修改草稿状态的入库单!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  formData.value = selectedRow.value;
  formDialogVis.value = true;
}

const handleFormDialogConfirm = () => {
  formDialogVis.value = false;
  getList();
};
</script>
