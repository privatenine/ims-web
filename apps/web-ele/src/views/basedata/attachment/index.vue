<template>
  <div class="app-container">
    <div class="query-btn-container">
      <ElButtonGroup class="ml-4">
        <ElButton type="primary" @click="handleQuery()">
          <IconifyIcon
            icon="ant-design:search-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          查询
        </ElButton>
        <ElButton
          type="primary"
          @click="handleAdd()"
          v-if="rights.includes('新增')"
        >
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
        <!-- <ElButton
          type="primary"
          @click="onDelete"
          v-if="rights.includes('删除')"
        >
          <IconifyIcon
            icon="mdi:trash-can-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          删除
        </ElButton> -->
      </ElButtonGroup>
    </div>
    <el-table
      :data="tableData"
      row-key="id"
      default-expand-all
      v-loading="loading"
      :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称" min-width="300" />
      <el-table-column prop="createTime" label="创建时间" min-width="200">
        <template #default="scope">
          {{ scope.row.createTime ? formatDate(scope.row.createTime) : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="200">
        <template #default="scope">
          {{ scope.row.updateTime ? formatDate(scope.row.updateTime) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="right" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            v-if="rights.includes('新增') && scope.row.parentId === 0"
            link
            @click="handleAdd(scope.row)"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            v-if="rights.includes('修改')"
            link
            @click="handleEdit(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="rights.includes('启用停用')"
            type="danger"
            link
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import { ElMessage, ElMessageBox } from 'element-plus';

import { addAtt, deleteAttByIds, getAttList, updateAttById } from '#/api';
import { useMenuRights } from '#/utils';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

const tableData = ref<any[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const currentRow = ref<any | null>(null);

const formRef = ref();
const formData = ref({
  name: '',
  parentId: 0,
});

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
};

// 格式化时间
const formatDate = (timestamp: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const res = await getAttList();
    tableData.value = res.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 查询
const handleQuery = () => {
  getList();
};

// 新增
const handleAdd = (row?: any) => {
  dialogTitle.value = `新增附件-${row?.name ? `${row.name}下的二级附件` : '一级'}`;
  isEdit.value = false;
  formData.value = {
    name: '',
    parentId: row?.id || 0,
  };
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = `编辑附件-${row.name}`;
  isEdit.value = true;
  currentRow.value = { ...row };
  formData.value = {
    name: row.name,
    parentId: row.parentId,
  };
  dialogVisible.value = true;
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该附件吗？', '提示', {
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteAttByIds({ ids: [row.id] });
        ElMessage.success('删除成功');
        getList();
      } catch {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    try {
      isEdit.value && currentRow.value
        ? await updateAttById({
            id: currentRow.value.id,
            name: formData.value.name,
            parentId: formData.value.parentId,
          })
        : await addAtt({
            name: formData.value.name,
            parentId: formData.value.parentId,
          });

      ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`);
      dialogVisible.value = false;
      getList();
    } catch {
      ElMessage.error(`${isEdit.value ? '编辑' : '新增'}失败`);
    }
  });
};

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields();
  currentRow.value = null;
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  margin-bottom: 16px;
}
</style>
