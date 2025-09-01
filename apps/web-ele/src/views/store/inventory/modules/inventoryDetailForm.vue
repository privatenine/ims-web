<script lang="ts" setup>
import { ref, watch } from 'vue';

import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

interface Props {
  visible: boolean;
  balanceData?: any; // 从库存选择对话框传入的库存信息
  detailData?: any; // 编辑时的明细信息
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  balanceData: () => ({}),
  detailData: () => ({}),
});

const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const detailForm = ref({
  quantity: 0, // 数量
  unitPrice: 15, // 单价
  attachment: '', // 附件
  warehouse: 'A库', // 仓库
  warehouseLocation: 'AG325', // 库位
  origin: '福耀', // 产地
  remark: '', // 备注
  productName: '', // 产品名称
  universalModel: '', // 通用车型
});

// 附件选项
const attachmentOptions = [
  { label: '无附件', value: '' },
  { label: '雨刷器', value: '雨刷器' },
  { label: '密封条', value: '密封条' },
  { label: '螺丝包', value: '螺丝包' },
];

// 仓库选项
const warehouseOptions = [
  { label: 'A库', value: 'A库' },
  { label: 'B库', value: 'B库' },
  { label: 'C库', value: 'C库' },
  { label: '临时库', value: '临时库' },
];

// 产地选项
const originOptions = [
  { label: '福耀', value: '福耀' },
  { label: '明星', value: '明星' },
  { label: '山西利虎', value: '山西利虎' },
  { label: '其他', value: '其他' },
];

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
    if (val) {
      initForm();
    }
  },
  { immediate: true },
);

watch(dialogVisible, (val) => {
  if (!val) {
    emit('update:visible', false);
  }
});

function initForm() {
  if (props.detailData && Object.keys(props.detailData).length > 0) {
    // 编辑模式
    Object.assign(detailForm.value, props.detailData);
  } else if (props.balanceData && Object.keys(props.balanceData).length > 0) {
    // 新增模式，基于选择的库存填充基本信息
    detailForm.value = {
      quantity: 0,
      unitPrice: props.balanceData.buyPrice || 15, // 使用库存的采购价格
      attachment: props.balanceData.productAttachmentNames || '',
      warehouse: props.balanceData.storeName || 'A库',
      warehouseLocation: props.balanceData.productPlaceName || 'AG325',
      origin: props.balanceData.siteName || '福耀',
      remark: '',
      productName: props.balanceData.productName || '',
      universalModel: props.balanceData.baseName || '',
    };
  }
}

function handleConfirm() {
  // 基本表单验证
  if (!detailForm.value.quantity || detailForm.value.quantity === 0) {
    ElMessage.warning('请输入有效的数量');
    return;
  }

  if (!detailForm.value.unitPrice || detailForm.value.unitPrice <= 0) {
    ElMessage.warning('请输入有效的单价');
    return;
  }

  // 计算金额 = 数量 * 单价
  const amount =
    (detailForm.value.quantity || 0) * (detailForm.value.unitPrice || 0);

  const formData = {
    ...detailForm.value,
    amount, // 计算后的金额
    profitLossQuantity: detailForm.value.quantity, // 盈亏数量
    costUnitPrice: detailForm.value.unitPrice, // 成本单价
    productId: props.balanceData?.productId || '',
    warehouseName: detailForm.value.warehouse,
  };

  console.log('盈亏明细表单数据:', formData);
  ElMessage.success('明细添加成功');
  emit('confirm', formData);
  dialogVisible.value = false;
}

function handleCancel() {
  dialogVisible.value = false;
}
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="盈亏明细信息"
    width="60%"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <ElForm :model="detailForm" label-width="80px" class="detail-form">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="*数量:" required>
            <ElInput
              v-model.number="detailForm.quantity"
              type="number"
              step="1"
              placeholder="请输入数量"
              style="background-color: #f5f5f5"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="*单价:" required>
            <ElInput
              v-model.number="detailForm.unitPrice"
              type="number"
              step="0.01"
              placeholder="请输入单价"
              style="background-color: #f5f5f5"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="附件:">
            <ElSelect
              v-model="detailForm.attachment"
              style="width: 100%; background-color: #f5f5f5"
              placeholder="请选择附件"
            >
              <ElOption
                v-for="option in attachmentOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="仓库:">
            <ElSelect
              v-model="detailForm.warehouse"
              style="width: 100%; background-color: #f5f5f5"
              placeholder="请选择仓库"
            >
              <ElOption
                v-for="option in warehouseOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="库位:">
            <ElInput
              v-model="detailForm.warehouseLocation"
              placeholder="请输入库位"
              style="background-color: #f5f5f5"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="产地:">
            <ElSelect
              v-model="detailForm.origin"
              style="width: 100%; background-color: #f5f5f5"
              placeholder="请选择产地"
            >
              <ElOption
                v-for="option in originOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="备注:">
            <ElInput
              v-model="detailForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              style="background-color: #f5f5f5"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleConfirm">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<style scoped>
.detail-form {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* 设置表单项标签的样式 */
:deep(.el-form-item__label) {
  font-weight: normal;
  color: #333;
}

/* 必填项标记样式 */
:deep(.el-form-item.is-required .el-form-item__label::before) {
  margin-right: 4px;
  color: #f56c6c;
  content: '*';
}
</style>
