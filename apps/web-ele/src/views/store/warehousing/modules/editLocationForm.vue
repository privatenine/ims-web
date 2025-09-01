<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getStorageOptions } from '#/utils/storage';

const emits = defineEmits(['success']);

// 表单数据
const formData = ref<Record<string, any>>({});

const getTitle = computed(() => {
  return `修改货位 - ${formData.value?.productName || ''}`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  draggable: true,
  centered: true,
  destroyOnClose: true,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData<Record<string, any>>();
      if (data) {
        formData.value = { ...data };
        formApi.setValues({
          storeId: data.storeId,
          siteName: data.siteName,
          ignoreLocation: false,
        });
      }
    }
  },
});

// 表单配置
const useFormSchema = (): VbenFormSchema[] => {
  return [
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库名称',
      rules: 'required',
      componentProps: {
        placeholder: '请选择仓库',
        clearable: true,
        options: getStorageOptions(),
      },
    },
    {
      component: 'Input',
      fieldName: 'siteName',
      label: '库位',
      rules: 'required',
      componentProps: {
        placeholder: '请输入库位',
      },
    },
    {
      component: 'Checkbox',
      fieldName: 'ignoreLocation',
      label: '默认货位',
      componentProps: {
        label: '',
      },
    },
  ];
};

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
  },
});

// 保存修改
async function onSave() {
  try {
    const values = await formApi.getValues();

    if (!values.storeId) {
      ElMessage.error('请选择仓库');
      return;
    }

    if (!values.siteName) {
      ElMessage.error('请输入库位');
      return;
    }

    // TODO: 这里应该调用实际的修改货位API
    // await updateWarehousingLocation({
    //   id: formData.value.id,
    //   storeId: values.storeId,
    //   siteName: values.siteName,
    // });

    ElMessage.success('修改货位成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('修改货位失败:', error);
    ElMessage.error('修改货位失败');
  }
}

// 取消
function onCancel() {
  modalApi.close();
}
</script>

<template>
  <Modal :title="getTitle" width="300px">
    <div class="edit-location-form">
      <Form />

      <div class="form-hint">
        <p class="mt-4 text-sm text-gray-500">
          开关#号临时货位不参与货位的打印
        </p>
      </div>

      <div class="form-actions">
        <ElButton @click="onCancel"> 取消 </ElButton>
        <ElButton type="primary" @click="onSave">
          <IconifyIcon icon="material-symbols:check-rounded" class="mr-1" />
          确认
        </ElButton>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.edit-location-form {
  padding: 16px 0;
}

.form-hint {
  padding: 12px;
  margin-top: 16px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  margin-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
