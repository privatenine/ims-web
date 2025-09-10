<script lang="ts" setup>
import type { InStorageApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { updateInStorage } from '#/api';
import { getStorageOptions } from '#/utils/storage';

const emits = defineEmits(['success']);
const formData = ref<InStorageApi.InStorage>();

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库',
      componentProps: {
        placeholder: '请选择仓库',
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'storeSiteName',
      label: '货位',
      defaultValue: '1',
      componentProps: {
        placeholder: '请输入货位',
      },
      // renderComponentContent: () => ({
      //   prefix: () => '#',
      // }),
    },
    {
      component: 'Input',
      fieldName: 'storeName',
      componentProps: {
        placeholder: '请输入备注',
        type: 'hidden',
      },
    },
  ],
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 40,
  },
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  draggable: true,
  centered: true,
  showCancelButton: true,
  showConfirmButton: true,
  onConfirm() {
    onSubmit();
  },
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<InStorageApi.InStorage>();
      formApi.resetForm();
      if (values) {
        formData.value = { ...values };
        formApi.setValues(values);
      }
      // 使用缓存的仓库数据
      const storageOptions = getStorageOptions();
      formApi.updateSchema([
        {
          componentProps: {
            options: storageOptions,
            onChange: (value: number) =>
              changeOptions(value, storageOptions, 'storeName'),
          },
          fieldName: 'storeId',
        },
      ]);
    }
  },
});

function changeOptions(
  value: number,
  options: Array<Record<string, any>>,
  fieldName: string,
) {
  formApi.setValues({
    [fieldName]: options.find((item) => item.value === value)?.label,
  });
}

async function onSubmit() {
  const data = await formApi.getValues<InStorageApi.InStorage>();
  modalApi.lock();
  updateInStorage({
    ...formData.value,
    ...data,
    // storeSiteName: `#${data.storeSiteName}`,
  })
    .then(() => {
      emits('success');
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}
</script>
<template>
  <Modal title="修改货位" class="w-[300px]">
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
