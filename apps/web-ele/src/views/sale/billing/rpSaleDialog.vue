<template>
  <el-dialog
    v-model="vis"
    title="销售单结算"
    draggable
    append-to-body
    width="800"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="sub-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="custName">
            <el-input
              v-model="form.custName"
              placeholder="请输入客户名称"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款方式" prop="bankId" required>
            <!-- 修改: 使用从接口获取的收款方式列表 -->
            <el-select
              v-model="form.bankId"
              placeholder="请选择收款方式"
              style="width: 100%"
              @change="handleBankChange"
            >
              <el-option
                v-for="item in bankOptions"
                :key="item.id"
                :label="item.accountName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款流水号" prop="skCode">
            <el-input
              v-model="form.skCode"
              disabled
              placeholder="请输入收款流水号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款单据" prop="formCode">
            <el-input
              v-model="form.formCode"
              disabled
              placeholder="请输入收款单据"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实收金额" prop="totalMoney">
            <el-input-number
              v-model="form.totalMoney"
              placeholder="请输入实收金额"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="优惠金额" prop="discountMoney">
            <el-input-number
              v-model="form.discountMoney"
              placeholder="请输入优惠金额"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请输入备注"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="confirmLoading"
        >
          结算
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { onMounted, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import { getCompanyList, rpParam, rpSale } from '#/api';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const vis = ref(false);
const formRef = ref<FormInstance>();
const confirmLoading = ref(false);

// 添加: 银行选项数据
const bankOptions = ref([]);

// 表单数据
const form = ref({
  mainId: '',
  custId: '',
  custName: '',
  bankId: '',
  bankName: '',
  skCode: '',
  formCode: '',
  formId: '',
  totalMoney: 0,
  discountMoney: 0,
  remark: '',
  version: 0,
});

// 表单验证规则
const rules = ref<FormRules>({
  bankId: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
  totalMoney: [
    { required: true, message: '请输入实收金额', trigger: 'change' },
  ],
});

// 添加: 获取收款方式列表
const fetchBankOptions = async () => {
  try {
    const res = await getCompanyList({});
    bankOptions.value = res.data || [];
  } catch (error) {
    console.error('获取收款方式列表失败:', error);
    bankOptions.value = [];
  }
};
onMounted(() => {
  fetchBankOptions();
});

// 添加: 处理收款方式变化
const handleBankChange = (value) => {
  const selectedBank = bankOptions.value.find((item) => item.id === value);
  if (selectedBank) {
    form.value.bankName = selectedBank.accountName;
  }
};

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      // 当对话框打开时，初始化表单数据
      if (props.formData) {
        form.value.mainId = props.formData.id;
        form.value.custName = props.formData.custName;
        form.value.custId = props.formData.custId;
        form.value.discountMoney = props.formData.discountMoney;
        form.value.totalMoney = props.formData.totalMoney;
        form.value.version = props.formData.version;
        // 使用rpParam方法为form赋值
        rpParam(props.formData.id).then((res) => {
          form.value.skCode = res.data.skCode;
          form.value.formCode = res.data.formCode;
          form.value.formId = res.data.formId;
          form.value.remark = res.data.remark;
        });
      } else {
        // 重置表单
        formRef.value?.resetFields();
        form.value = {
          mainId: '',
          custId: '',
          custName: '',
          bankId: '',
          bankName: '',
          skCode: '',
          formCode: '',
          formId: '',
          totalMoney: 0,
          discountMoney: 0,
          remark: '',
          version: 0,
        };
      }
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const handleCancel = () => {
  vis.value = false;
};

// 提交结算
const handleConfirm = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  confirmLoading.value = true;

  // 使用rpSale方法提交结算
  rpSale(form.value)
    .then(() => {
      ElMessage({
        message: `结算成功`,
        type: 'success',
        plain: true,
      });
      emit('confirm', form.value);
      vis.value = false;
    })
    .catch(() => {
      ElMessage({
        message: `结算失败`,
        type: 'error',
        plain: true,
      });
    })
    .finally(() => {
      confirmLoading.value = false;
    });
};
</script>

<style scoped>
.sub-form {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
