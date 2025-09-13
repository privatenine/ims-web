<template>
  <div class="app-container">
    <div class="query-form-container">
      <!-- 搜索表单 -->
      <el-form
        :model="queryParams"
        :inline="true"
        class="query-form"
        label-width="110px"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入参数名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="类别" prop="category">
          <el-select
            v-model="queryParams.category"
            placeholder="请选择类别"
            clearable
            @change="handleQuery"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            @change="handleQuery"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
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
        <ElButton type="primary" @click="handleAdd">
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
        <ElButton type="primary" @click="editSelectRow">
          <IconifyIcon
            icon="line-md:edit-twotone"
            class="size-5"
            style="margin-right: 4px"
          />
          修改
        </ElButton>
        <ElButton type="primary" @click="onDelete">
          <IconifyIcon
            icon="mdi:trash-can-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          删除
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
        v-auto-fit-height
      >
        <el-table-column width="30" align="center">
          <template #default="{ row }">
            <el-radio v-model="selectedRowId" :value="row.id" @click.stop>
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="name" label="参数名称" min-width="200" />
        <el-table-column prop="category" label="类别" min-width="200" />
      </el-table>
    </div>
    <!-- 分页控件 -->
    <div class="pagination-container">
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

    <!-- 新增/修改弹框 -->
    <el-dialog
      v-model="formDialogVis"
      :title="formData.id ? '修改参数' : '新增参数'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="类别" prop="category">
          <el-select v-model="formData.category" placeholder="请选择类别">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入参数名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formDialogVis = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElMessage, ElMessageBox } from 'element-plus';

// 初始化时获取数据
onMounted(() => {
  getList();
});

const formDialogVis = ref(false);
const formRef = ref();
const formData = ref({
  id: '',
  name: '',
  category: '',
});

const formRules = {
  name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
};

// 添加类别选项数据
const categoryOptions = [
  { label: '车型', value: '车型' },
  { label: '车系', value: '车系' },
  { label: '类别', value: '类别' },
  { label: '安装位置', value: '安装位置' },
  { label: '单位', value: '单位' },
];

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
  pageSize: 20,
  name: '',
  category: '',
  status: undefined,
});

// 表格数据
const tableData = ref([
  { id: '1', name: '参数1', category: '类别1' },
  { id: '2', name: '参数2', category: '类别2' },
]);
const total = ref(2);

// 搜索按钮点击事件
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置按钮点击事件
const handleReset = () => {
  // 重置表单
  Object.keys(queryParams).forEach((key) => {
    (queryParams as any)[key] = undefined;
  });
  queryParams.pageNum = 1;
  queryParams.pageSize = 20;
  getList();
};

// 获取表格数据
const getList = async () => {
  // 模拟获取数据
  console.log('查询参数:', queryParams);
  // 这里应该调用实际的API接口
};

const handleAdd = () => {
  formData.value = {
    id: '',
    name: '',
    category: '',
  };
  formDialogVis.value = true;
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
  formData.value = {
    ...selectedRow.value,
  };
  formDialogVis.value = true;
}

function onDelete() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  ElMessageBox.confirm('确认要删除该数据吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟删除成功
      ElMessage({
        message: `删除成功!`,
        type: 'success',
        plain: true,
      });
      handleQuery();
    })
    .catch(() => {});
}

// 分页事件处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 弹框确认
const handleConfirm = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 模拟添加/修改成功
      ElMessage({
        message: `${formData.value.id ? '修改' : '新增'}成功!`,
        type: 'success',
        plain: true,
      });
      formDialogVis.value = false;
      handleQuery();
    }
  });
};

// 弹框关闭
const handleDialogClose = () => {
  formRef.value.resetFields();
};
</script>
