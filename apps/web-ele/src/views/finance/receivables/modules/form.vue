<script lang="ts" setup>
import type { PayableApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { uptReceivablesHand } from '#/api';

const emits = defineEmits(['success']);
const formData = ref<PayableApi.PayableHand>();

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'totalMoney',
      label: '账户余额',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'balanceMoney',
      label: '调整金额',
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '调整原因',
      componentProps: {
        type: 'textarea',
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
  },
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
      const values = modalApi.getData<PayableApi.PayableHand>();
      formApi.resetForm();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }
    }
  },
  title: '手工单',
});

async function onSubmit(values: Record<string, any>) {
  // const data = await formApi.getValues();
  // console.log('merge', data);
  const { id: mainId } = formData.value;

  modalApi.lock();
  uptReceivablesHand({ ...values, mainId })
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
  <Modal class="w-1/5">
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
