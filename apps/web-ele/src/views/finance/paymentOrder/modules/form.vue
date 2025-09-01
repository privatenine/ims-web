<script lang="ts" setup>
import type { PaymentOrderApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessageBox } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  createPaymentOrder,
  getCompanyList,
  getPayableSubList,
  updatePaymentOrder,
} from '#/api';

import { useFormSchema } from '../data';
import PayableList from './payableList.vue';
import PayableSubList from './payableSubList.vue';

const emits = defineEmits(['success']);
const formData = ref<null | Record<string, any>>(null);

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
  return `${formData.value?.id ? '修改' : '新增'}其它应付款单`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  confirmText: '保存',
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
      formApi.resetForm();
      getCompanyList({}).then(({ data }) => {
        // console.log('companyList', data);
        const options = data.map((n: Record<string, any>) => {
          return {
            label: n.accountName,
            value: n.balanceType,
          };
        });

        formApi.updateSchema([
          {
            componentProps: {
              options,
            },
            fieldName: 'typeName',
          },
        ]);
      });
      formApi.updateSchema([
        {
          fieldName: 'supplierName',
          componentProps: {
            onClick: () => payableListModelApi.open(),
            onClear: () =>
              formApi.setValues({
                supplierId: 0,
                supplierName: '',
                balanceMoney: 0,
                mainId: 0,
              }),
          },
        },
        {
          fieldName: 'formCode',
          componentProps: {
            onClick: () => {
              formApi.getValues().then((data) => {
                if (data.mainId || data.supplierId) {
                  payableSubListModelApi.setData(data).open();
                } else {
                  ElMessageBox.alert('请先选择供应商', {
                    confirmButtonText: 'OK',
                  });
                }
              });
            },
          },
        },
      ]);
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formData.value = values;
        formApi.setValues(values);

        values.supplierId &&
          getPayableSubList({
            pageNum: 1,
            pageSize: 100,
            // mainId: formData.value?.mainId,
            supplierId: values.supplierId,
          }).then(({ data }) => {
            const item = data.find((n) => n.code === values.formCode);
            if (item) {
              formApi.setValues({
                bb: item.formCode,
              });
            }
          });
      }
    }
  },
});

async function onSubmit() {
  const data = await formApi.getValues<PaymentOrderApi.PaymentOrder>();
  // console.log('merge', data);

  save({ ...data, statusFlag: 1 });
}
function onSave() {
  formApi.validate().then(({ valid }) => {
    if (!valid) return;
    formApi
      .getValues<PaymentOrderApi.PaymentOrder>()
      .then((data) => save({ ...data, statusFlag: 2 }));
  });
}
function save(data: PaymentOrderApi.PaymentOrder) {
  modalApi.lock();
  (formData.value?.id
    ? updatePaymentOrder({ ...data, id: formData.value?.id })
    : createPaymentOrder(data)
  )
    .then(() => {
      emits('success');
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}

const [PayableListModel, payableListModelApi] = useVbenModal({
  connectedComponent: PayableList,
  destroyOnClose: true,
});

function selectPayable(data: Record<string, any>) {
  formApi.setValues({
    supplierId: data.supplierId,
    supplierName: data.supplierName,
    // countMoney: 0,
    aa: data.totalMoney,
    mainId: data.id,
  });
}

const [PayableSubListModel, payableSubListModelApi] = useVbenModal({
  connectedComponent: PayableSubList,
  destroyOnClose: true,
});

function selectPayableSub(data: Record<string, any>) {
  formApi.setValues({
    // code: data.code,
    formCode: data.code,
    balanceMoney: data.balanceMoney,
    // balanceMoney: data.balanceMoney,
    bb: data.formCode,
    formId: data.id,
  });
}
</script>
<template>
  <Modal :title="getDrawerTitle" class="w-3/5">
    <PayableSubListModel @select="selectPayableSub" />
    <PayableListModel @select="selectPayable" />
    <Form />
    <template #append-footer>
      <ElButton type="primary" @click="onSave">提交</ElButton>
    </template>
  </Modal>
</template>
<style lang="css" scoped></style>
