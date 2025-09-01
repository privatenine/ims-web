<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElCheckbox,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus';

interface DetailFormData {
  quantity: number;
  sourceWarehouse: string;
  sourceBinLocation: string;
  origin: string;
  targetWarehouse: string;
  targetBinLocation: string;
  setDefaultBinLocation: boolean;
  searchBinLocation: string;
  manufacturerName: string;
  remark: string;
}

interface Props {
  open: boolean;
  productData?: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [];
  success: [detail: DetailFormData];
  'update:open': [value: boolean];
}>();

// 控制对话框显示的变量
const dialogVisible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

// 表单数据
const formData = ref<DetailFormData>({
  quantity: 1,
  sourceWarehouse: '',
  sourceBinLocation: '',
  origin: '',
  targetWarehouse: 'A库',
  targetBinLocation: 'AH118',
  setDefaultBinLocation: false,
  searchBinLocation: '无',
  manufacturerName: '',
  remark: '',
});

// 目标仓库选项
const targetWarehouseOptions = [
  { label: 'A库', value: 'A库' },
  { label: 'B库', value: 'B库' },
  { label: 'C库', value: 'C库' },
  { label: 'F库', value: 'F库' },
];

// 查找货位选项
const searchBinLocationOptions = [
  { label: '无', value: '无' },
  { label: 'AH118', value: 'AH118' },
  { label: 'AH119', value: 'AH119' },
  { label: 'BH201', value: 'BH201' },
  { label: 'BH202', value: 'BH202' },
];

const getModalTitle = computed(() => {
  return '添加明细';
});

// 监听props变化来初始化表单数据
watch(
  () => [props.open, props.productData],
  ([open, productData]) => {
    if (open && productData) {
      console.log('初始化明细表单，产品数据:', productData);
      // 根据选择的产品数据填充表单
      formData.value = {
        quantity: 1,
        sourceWarehouse: productData.warehouse || '',
        sourceBinLocation: productData.binLocation || '',
        origin: productData.productOrigin || '',
        targetWarehouse: 'A库',
        targetBinLocation: 'AH118',
        setDefaultBinLocation: false,
        searchBinLocation: '无',
        manufacturerName: '',
        remark: '',
      };
    }
  },
  { immediate: true },
);

// 表单验证规则
const rules = {
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 0.1, message: '数量必须大于0', trigger: 'blur' },
  ],
  targetBinLocation: [
    { required: true, message: '请输入目标货位', trigger: 'blur' },
  ],
  searchBinLocation: [
    { required: true, message: '请选择查找货位', trigger: 'change' },
  ],
};

// 表单引用
const formRef = ref();

// 保存
async function onSave() {
  try {
    await formRef.value.validate();

    const submitData = {
      ...formData.value,
    };

    emit('success', submitData);
    emit('update:open', false);
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.error('请检查表单填写是否正确');
  }
}

// 取消
function onCancel() {
  emit('update:open', false);
}

// 设置默认货位变化
function onSetDefaultBinLocationChange(value: boolean) {
  formData.value.setDefaultBinLocation = value;
  if (value) {
    ElMessage.info('已设置为默认货位');
  }
}

// 查找货位变化
function onSearchBinLocationChange(value: string) {
  formData.value.searchBinLocation = value;
  // 根据选择的货位自动填充目标货位
  if (value !== '无') {
    formData.value.targetBinLocation = value;
  }
}
</script>

<script lang="ts">
export default { name: 'DetailForm' };
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="getModalTitle"
    width="500px"
    class="detail-form-modal"
  >
    <div class="detail-form">
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="detail-form-content"
      >
        <!-- 数量 -->
        <ElFormItem label="数量" prop="quantity" required>
          <ElInputNumber
            v-model="formData.quantity"
            :min="0.1"
            :precision="1"
            :step="0.1"
            placeholder="请输入数量"
            style="width: 100%"
          />
        </ElFormItem>

        <!-- 源仓库 -->
        <ElFormItem label="源仓库">
          <ElInput
            v-model="formData.sourceWarehouse"
            readonly
            placeholder="源仓库"
            style="background-color: #f5f5f5"
          />
        </ElFormItem>

        <!-- 源货位 -->
        <ElFormItem label="源货位">
          <ElInput
            v-model="formData.sourceBinLocation"
            readonly
            placeholder="源货位"
            style="background-color: #f5f5f5"
          />
        </ElFormItem>

        <!-- 产地 -->
        <ElFormItem label="产地">
          <ElInput v-model="formData.origin" placeholder="请输入产地" />
        </ElFormItem>

        <!-- 目标仓库 -->
        <ElFormItem label="目标仓库">
          <ElSelect
            v-model="formData.targetWarehouse"
            placeholder="请选择目标仓库"
            style="width: 100%"
          >
            <ElOption
              v-for="option in targetWarehouseOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>

        <!-- 目标货位 -->
        <ElFormItem label="目标货位" prop="targetBinLocation" required>
          <ElInput
            v-model="formData.targetBinLocation"
            placeholder="请输入目标货位"
          />
        </ElFormItem>

        <!-- 设置默认货位 -->
        <ElFormItem label="设置默认货位">
          <ElCheckbox
            v-model="formData.setDefaultBinLocation"
            @change="onSetDefaultBinLocationChange"
          >
            设置默认货位
          </ElCheckbox>
        </ElFormItem>

        <!-- 查找货位 -->
        <ElFormItem label="查找货位" prop="searchBinLocation" required>
          <ElSelect
            v-model="formData.searchBinLocation"
            placeholder="请选择查找货位"
            @change="onSearchBinLocationChange"
            style="width: 100%"
          >
            <ElOption
              v-for="option in searchBinLocationOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>

        <!-- 厂家名称 -->
        <ElFormItem label="厂家名称">
          <ElInput
            v-model="formData.manufacturerName"
            placeholder="厂家名称"
            readonly
            style="background-color: #f5f5f5"
          />
        </ElFormItem>

        <!-- 备注 -->
        <ElFormItem label="备注">
          <ElInput
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </ElFormItem>
      </ElForm>

      <!-- 底部按钮 -->
      <div class="form-actions">
        <ElButton @click="onCancel">取消</ElButton>
        <ElButton type="primary" @click="onSave">
          <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
          确定
        </ElButton>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="scss" scoped>
.detail-form {
  padding: 16px 0;
}

.detail-form-content {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-form-item.is-required .el-form-item__label::before) {
  margin-right: 4px;
  color: var(--el-color-danger);
  content: '*';
}
</style>
