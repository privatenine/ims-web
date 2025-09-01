<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessageBox } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createSupplier, updateSupplier } from '#/api';

import { useFormSchema } from '../data';
import PayableList from './payableList.vue';
import SupplierList from './supplierList.vue';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
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
  return `${formData.value?.id ? '修改' : '新增'}其它应收款单`;
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
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }

      formApi.updateSchema([
        {
          fieldName: 'customerName',
          componentProps: {
            onClick: () => supplierModelApi.open(),
          },
        },
        {
          fieldName: 'formCode',
          componentProps: {
            onClick: () =>
              formApi.getValues().then((data) => {
                if (data.customerId) {
                  payableModelApi.open();
                } else {
                  ElMessageBox.alert('请先选择客户', {
                    confirmButtonText: 'OK',
                  });
                }
              }),
          },
        },
      ]);
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  // const data = await formApi.getValues();
  // console.log('merge', data);

  modalApi.lock();
  (formData.value?.id
    ? updateSupplier({ ...values, id: formData.value?.id })
    : createSupplier(values)
  )
    .then(() => {
      emits('success');
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}

const [SupplierModel, supplierModelApi] = useVbenModal({
  connectedComponent: SupplierList,
  destroyOnClose: true,
});

function selectSupplier(data: Record<string, any>) {
  formApi.setValues({
    customerId: data.id,
    customerName: data.fullName,
    // countMoney: 0,
    balanceMoney: data.creditLimit,
  });
}

const [PayableModel, payableModelApi] = useVbenModal({
  connectedComponent: PayableList,
  destroyOnClose: true,
});

function selectPayable(data: Record<string, any>) {
  formApi.setValues({ supplierId: data.id, supplierName: data.username });
}
</script>
<template>
  <Modal :title="getDrawerTitle" class="w-3/5">
    <SupplierModel @select="selectSupplier" />
    <PayableModel @select="selectPayable" />
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
