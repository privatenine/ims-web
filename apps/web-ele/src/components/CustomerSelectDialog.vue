<template>
  <el-dialog
    class="form-dialog"
    v-model="vis"
    title="选择客户"
    width="1000"
    append-to-body
    draggable
    @close="handleClose"
  >
    <div class="dialog-content">
      <!-- 查询条件 -->
      <el-form :model="queryParams" inline label-width="100px" class="mb-4">
        <el-form-item label="简拼码">
          <el-input
            v-model="queryParams.shortName"
            placeholder="请输入简拼码"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input
            v-model="queryParams.fullName"
            placeholder="请输入客户名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 客户列表 -->
      <el-table
        :data="tableList"
        ref="tableRef"
        @row-click="handleRowClick"
        @row-dblclick="handleRowDblClick"
        highlight-current-row
      >
        <!-- 单选列 -->
        <el-table-column width="50">
          <template #default="scope">
            <el-radio v-model="selectedId" :value="scope.row.id" @click.stop>
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="fullName" label="客户名称" width="160" />
        <el-table-column prop="shortName" label="简拼码" width="220" />
        <el-table-column prop="address" label="客户地址" width="220" />
        <el-table-column prop="priceLevel" label="价格级别" width="100" />
        <el-table-column prop="fax" label="传真" width="160" />
        <el-table-column prop="mobilePhone" label="电话" width="160" />
        <el-table-column prop="telephone" label="手机" width="100" />
      </el-table>
      <div class="pagination-container mt-4">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="!selectedSupplier"
        >
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { getCustomerList } from '#/api';

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible', 'confirm', 'close']);

const vis = ref(false);
const tableRef = ref();
const tableList = ref<Array<any>>([]);
const total = ref(0);
const selectedId = ref('');

const queryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  shortName: '',
  fullName: '',
});

// 计算选中的客户
const selectedSupplier = computed(() => {
  return tableList.value.find((item) => item.id === selectedId.value);
});

// 监听visible属性变化
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      selectedId.value = '';
      getSupplierData();
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  if (!newVal) {
    emit('close');
  }
  emit('update:visible', newVal);
});

// 获取客户列表数据
const getSupplierData = async () => {
  const res = await getCustomerList(queryParams);
  tableList.value = res.data;
  total.value = res.total;
};

// 查询
const handleSearch = () => {
  queryParams.pageNum = 1;
  getSupplierData();
};

// 重置查询条件
const resetQuery = () => {
  queryParams.shortName = '';
  queryParams.fullName = '';
  queryParams.pageNum = 1;
  getSupplierData();
};

// 分页事件处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getSupplierData();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getSupplierData();
};

// 处理行点击
const handleRowClick = (row: any) => {
  selectedId.value = row.id;
};

// 处理行双击
const handleRowDblClick = (row: any) => {
  selectedId.value = row.id;
  handleConfirm();
};

// 确认选择
const handleConfirm = () => {
  if (selectedSupplier.value) {
    emit('confirm', selectedSupplier.value);
    vis.value = false;
  }
};

// 关闭弹窗
const handleClose = () => {
  vis.value = false;
};

// 组件挂载时初始化
onMounted(() => {
  if (vis.value) {
    getSupplierData();
  }
});
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.dialog-footer {
  text-align: right;
}
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
