<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { ElButton, ElDialog, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

import { useFormSchema } from '../data';

interface Props {
  visible?: boolean;
  formData?: any;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  formData: () => ({}),
  title: '促销信息管理',
});

const emit = defineEmits<{
  cancel: [];
  success: [];
  'update:visible': [value: boolean];
}>();

const isEdit = computed(() => !!props.formData?.id);
const isSubmitting = ref(false);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 提交表单
async function onSubmit() {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    const values = await formApi.submitForm();
    console.log('表单数据:', values);

    // 这里应该调用API保存数据
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success(isEdit.value ? '更新成功' : '保存成功');
    emit('success');
  } catch (error) {
    console.error('表单提交失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
}

// 关闭对话框
function handleClose() {
  emit('update:visible', false);
  emit('cancel');
}

// 初始化表单数据
function initFormData() {
  if (props.formData && Object.keys(props.formData).length > 0) {
    formApi.setValues(props.formData);
  }
}

// 暴露给父组件的方法
defineExpose({
  formApi,
  initFormData,
});

// 监听 formData 变化
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formApi.setValues(newData);
    }
  },
  { deep: true, immediate: true },
);

// 组件挂载后初始化表单数据
onMounted(() => {
  initFormData();
});
</script>

<script lang="ts">
export default {
  name: 'PromoForm',
};
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="title"
    width="800px"
    @close="handleClose"
  >
    <div class="p-6">
      <Form />
    </div>

    <template #footer>
      <div class="flex justify-end gap-4">
        <ElButton @click="handleClose"> 取消 </ElButton>
        <ElButton type="primary" @click="onSubmit" :loading="isSubmitting">
          {{ isEdit ? '更新' : '保存' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
