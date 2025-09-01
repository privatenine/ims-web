<script lang="ts" setup>
import type { DeliveryApi } from '#/api';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRow,
} from 'element-plus';

interface Props {
  visible?: boolean;
  formData?: Partial<DeliveryApi.DeliveryOrderMainRespVO>;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  formData: () => ({}),
});

const emit = defineEmits<Emits>();

const form = ref({
  id: undefined as number | undefined,
  code: '',
  createTime: '',
  createName: '',
  carNum: '',
  logisticsName: '',
  logisticsNumber: '',
  totalMoney: 0,
  totalNum: 0,
  remark: '',
});

const getModalTitle = computed(() => {
  return `${form.value?.id ? '修改' : '新增'}配送单`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        Object.assign(form.value, values);
      } else {
        initForm();
      }
    }
  },
});

watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 在打开Modal时，将formData传递给Modal
      modalApi.open(props.formData);
    } else {
      modalApi.close();
    }
  },
  { immediate: true },
);

// 同时监听formData的变化
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      console.log('接收到formData:', newData);
      // 映射父组件数据到表单字段
      const formattedData = {
        id: newData.id,
        code: newData.code || '',
        createName: newData.createName || '',
        carNum: newData.carNum || '',
        logisticsName: newData.logisticsName || '',
        logisticsNumber: newData.logisticsNumber || '',
        totalMoney: newData.totalMoney || 0,
        totalNum: newData.totalNum || 0,
        remark: newData.remark || '',
      };

      // 格式化时间戳为日期字符串
      if (newData.createTime && typeof newData.createTime === 'number') {
        const date = new Date(newData.createTime);
        formattedData.createTime = date.toISOString().split('T')[0];
      }

      Object.assign(form.value, formattedData);
      console.log('表单数据已更新:', form.value);
    }
  },
  { immediate: true, deep: true },
);

function initForm() {
  if (props.formData && Object.keys(props.formData).length > 0) {
    // 映射父组件数据到表单字段
    const formattedData = {
      id: props.formData.id,
      code: props.formData.code || '',
      createName: props.formData.createName || '',
      carNum: props.formData.carNum || '',
      logisticsName: props.formData.logisticsName || '',
      logisticsNumber: props.formData.logisticsNumber || '',
      totalMoney: props.formData.totalMoney || 0,
      totalNum: props.formData.totalNum || 0,
      remark: props.formData.remark || '',
    };

    // 格式化时间戳为日期字符串
    if (
      props.formData.createTime &&
      typeof props.formData.createTime === 'number'
    ) {
      const date = new Date(props.formData.createTime);
      formattedData.createTime = date.toISOString().split('T')[0];
    }

    Object.assign(form.value, formattedData);
  } else {
    // 新增时的默认值
    const now = new Date();
    form.value = {
      id: undefined,
      code: '',
      createTime: now.toISOString().split('T')[0],
      createName: '页面开发',
      carNum: '',
      logisticsName: '',
      logisticsNumber: '',
      totalMoney: 0,
      totalNum: 0,
      remark: '',
    };
  }
}

function handleSave() {
  console.log('保存数据:', form.value);
  // TODO: 调用保存接口
  ElMessage.info('保存功能待实现');
}

function handleSubmit() {
  console.log('提交数据:', form.value);
  // TODO: 调用提交接口
  emit('confirm', form.value);
  modalApi.close();
  emit('update:visible', false);
}

function handleCancel() {
  modalApi.close();
  emit('update:visible', false);
}
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <ElForm :model="form" label-width="120px" class="delivery-form">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="配送流水号:">
            <ElInput v-model="form.code" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="制单员:">
            <ElInput v-model="form.createName" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="制单日期:">
            <ElInput v-model="form.createTime" disabled />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="汽车车牌:">
            <ElInput v-model="form.carNum" placeholder="请输入汽车车牌" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="装货员工:">
            <ElInput placeholder="请选择装货员工" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="配送员工:">
            <ElInput placeholder="请选择配送员工" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="总金额:">
            <ElInput v-model="form.totalMoney" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="总数量:">
            <ElInput v-model="form.totalNum" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <!-- 空列，保持布局 -->
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="备注:">
            <ElInput
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="handleSave">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        保存
      </ElButton>
      <ElButton type="primary" @click="handleSubmit">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:save-outline"
        />
        提交
      </ElButton>
      <ElButton type="primary">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="ant-design:plus-outlined"
        />
        新增明细
      </ElButton>
      <ElButton type="primary">
        <IconifyIcon
          icon="line-md:edit-twotone"
          class="size-5"
          style="margin-right: 4px"
        />
        修改明细
      </ElButton>
      <ElButton type="primary">
        <IconifyIcon
          icon="mdi:trash-can-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        删除明细
      </ElButton>
    </ElButtonGroup>

    <!-- 明细列表区域 -->
    <div class="mt-4 rounded border border-gray-200 p-4">
      <div class="py-8 text-center text-gray-500">没有找到匹配的记录</div>
    </div>
  </Modal>
</template>

<style lang="css" scoped>
.delivery-form {
  margin-bottom: 20px;
}
</style>
