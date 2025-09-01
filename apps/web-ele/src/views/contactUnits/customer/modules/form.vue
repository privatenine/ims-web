<script lang="ts" setup>
import type { CustomerApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElCard } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createCustomer, updateCustomer } from '#/api';

import { useFormSchema, useFormSchema1 } from '../data';

const emits = defineEmits(['success']);
const formData = ref<CustomerApi.Customer>();

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
});

const [Form1, formApi1] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useFormSchema1(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
});

const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}客户信息`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<CustomerApi.Customer>();
      formApi.resetForm();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
        formApi1.setValues(values);
      }
      formApi.updateSchema([
        {
          fieldName: 'fullName',
          componentProps: {
            onChange: (value: string) =>
              formApi.setValues({ shortName: value }),
          },
        },
      ]);
    }
  },
});

async function onSubmit() {
  const data = await formApi.merge(formApi1).submitAllForm(true);

  modalApi.lock();
  (formData.value?.id
    ? updateCustomer({ ...data, id: formData.value?.id })
    : createCustomer(data)
  )
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
  <Modal :title="getDrawerTitle" class="w-4/5">
    <ElCard>
      <template #header>客户基本信息</template>
      <Form />
    </ElCard>
    <ElCard>
      <template #header>联系人信息</template>
      <Form1 />
    </ElCard>
  </Modal>
</template>
<style lang="css" scoped></style>
