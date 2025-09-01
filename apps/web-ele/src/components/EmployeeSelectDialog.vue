<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElDialog,
  ElEmpty,
  ElInput,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { useAuthStore } from '#/store/auth';

interface Employee {
  userId: number;
  username: string;
  realName: string;
}

interface Props {
  modelValue: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '选择员工',
});

const emit = defineEmits<{
  select: [employees: Employee[]];
  'update:modelValue': [value: boolean];
}>();

// 使用认证store
const authStore = useAuthStore();

// 响应式数据
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const searchKeyword = ref('');
const loading = ref(false);
const selectedEmployees = ref<Employee[]>([]);
const tableRef = ref();

// 从缓存获取员工列表
const employeeList = ref<Employee[]>([]);

// 过滤后的员工列表
const filteredEmployeeList = computed(() => {
  if (!searchKeyword.value) {
    return employeeList.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return employeeList.value.filter(
    (employee) =>
      employee.realName?.toLowerCase().includes(keyword) ||
      employee.username?.toLowerCase().includes(keyword),
  );
});

// 处理表格选择变化
function handleSelectionChange(selection: Employee[]) {
  selectedEmployees.value = selection;
}

// 处理行点击
function handleRowClick(row: Employee) {
  if (tableRef.value) {
    tableRef.value.toggleRowSelection(row);
  }
}

// 确认选择
function handleConfirm() {
  if (selectedEmployees.value.length > 0) {
    // 返回所有选中的员工
    emit('select', selectedEmployees.value);
    handleClose();
  }
}

// 关闭对话框
function handleClose() {
  dialogVisible.value = false;
  searchKeyword.value = '';
  selectedEmployees.value = [];
  if (tableRef.value) {
    tableRef.value.clearSelection();
  }
}

// 加载员工数据
async function loadEmployeeData() {
  try {
    loading.value = true;

    // 优先使用store中的方法获取员工数据
    const cachedData = authStore.getCachedEmployeeList();
    console.log('从store获取员工数据:', cachedData);

    if (Array.isArray(cachedData) && cachedData.length > 0) {
      employeeList.value = cachedData;
      console.log('员工数据加载成功，共', employeeList.value.length, '条');
    } else {
      console.warn('员工数据缓存为空，请先登录');
      employeeList.value = [];

      // 如果没有缓存数据，尝试重新获取
      if (authStore.hasCachedEmployeeList()) {
        console.log('尝试重新获取员工数据...');
        await authStore.fetchAndCacheEmployeeList();
        const newData = authStore.getCachedEmployeeList();
        if (Array.isArray(newData)) {
          employeeList.value = newData;
          console.log(
            '重新获取员工数据成功，共',
            employeeList.value.length,
            '条',
          );
        }
      }
    }
  } catch (error) {
    console.error('加载员工数据失败:', error);
    employeeList.value = [];
  } finally {
    loading.value = false;
  }
}

// 监听对话框打开状态
watch(dialogVisible, (isOpen) => {
  if (isOpen) {
    loadEmployeeData();
  }
});

// 监听搜索关键词变化
watch(searchKeyword, () => {
  selectedEmployees.value = [];
  if (tableRef.value) {
    tableRef.value.clearSelection();
  }
});
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title"
    width="560px"
    :z-index="3000"
    append-to-body
    @close="handleClose"
  >
    <div class="employee-select-container">
      <!-- 搜索框 -->
      <div class="search-section mb-4">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索员工姓名、工号..."
          clearable
          class="search-input"
        >
          <template #prefix>
            <IconifyIcon icon="material-symbols:search-rounded" />
          </template>
        </ElInput>
      </div>

      <!-- 员工列表 -->
      <div v-loading="loading" class="employee-list-container">
        <!-- 空数据状态 -->
        <ElEmpty
          v-if="!loading && filteredEmployeeList.length === 0"
          description="暂无员工数据"
          :image-size="120"
        />

        <!-- 员工表格 -->
        <ElTable
          v-else
          ref="tableRef"
          :data="filteredEmployeeList"
          class="employee-table"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <ElTableColumn type="selection" width="55" />
          <ElTableColumn prop="index" label="排序" width="80" type="index" />
          <ElTableColumn
            prop="realName"
            label="账户名称"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.realName || row.username || '未知员工' }}
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="username"
            label="登录名称"
            min-width="150"
            show-overflow-tooltip
          />
        </ElTable>
      </div>

      <!-- 底部操作按钮 -->
      <div class="footer-actions mt-4">
        <ElButton @click="handleClose">取消</ElButton>
        <ElButton
          type="primary"
          :disabled="selectedEmployees.length === 0"
          @click="handleConfirm"
        >
          确认选择({{ selectedEmployees.length }})
        </ElButton>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="scss" scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .employee-grid {
    grid-template-columns: 1fr;
  }

  .search-section .search-input {
    max-width: 100%;
  }
}

.employee-select-container {
  display: flex;
  flex-direction: column;
  height: 50vh;
}

.search-section {
  .search-input {
    max-width: 400px;
  }
}

.employee-list-container {
  flex: 1;
  overflow-y: auto;
}

.employee-table {
  width: 100%;

  :deep(.el-table__row) {
    cursor: pointer;

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }

    &.current-row {
      background-color: var(--el-color-primary-light-8);
    }
  }

  :deep(.el-table th) {
    font-weight: 600;
    background-color: var(--el-fill-color-light);
  }
}

.footer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
