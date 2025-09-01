<script lang="ts" setup>
import type { ReceivePaymentApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createReceivePayment, updateReceivePayment } from '#/api';

import { useFormSchema } from '../data';
import ReceivablesList from './receivablesList.vue';
import ReceivablesSubList from './receivablesSubList.vue';

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
  return `${formData.value?.id ? '修改' : '新增'}免收制单`;
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
      formApi.updateSchema([
        {
          fieldName: 'custName',
          componentProps: {
            onClick() {
              receivablesListModelApi.open();
            },
          },
        },
        {
          fieldName: 'formCode',
          componentProps: {
            onClick() {
              receivablesSubListModelApi.setData(formData.value).open();
            },
          },
        },
      ]);
      // getCompanyList({}).then(({ data }) => {
      //   const options = data.map((n: Record<string, any>) => {
      //     return {
      //       label: n.accountName,
      //       value: n.balanceType,
      //     };
      //   });

      //   formApi.updateSchema([
      //     {
      //       componentProps: {
      //         options,
      //         onChange(value: number) {
      //           formApi.setValues({
      //             bankAccount: options.find(
      //               (n: Record<string, any>) => n.value === value,
      //             )?.label,
      //           });
      //         },
      //       },
      //       fieldName: 'bankId',
      //     },
      //   ]);
      // });

      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }
    }
  },
});

async function onSubmit() {
  const data = await formApi.getValues<ReceivePaymentApi.ReceivePayment>();
  // console.log('merge', data);

  save({ ...data, statusFlag: 1 });
}
function onSave() {
  formApi.validate().then(({ valid }) => {
    if (!valid) return;
    formApi
      .getValues<ReceivePaymentApi.ReceivePayment>()
      .then((data) => save({ ...data, statusFlag: 2 }));
  });
}
function save(data: ReceivePaymentApi.ReceivePayment) {
  modalApi.lock();
  (formData.value?.id
    ? updateReceivePayment({
        ...formData.value,
        ...data,
        id: formData.value?.id,
      })
    : createReceivePayment({ ...formData.value, ...data })
  )
    .then(() => {
      emits('success');
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}

const [ReceivablesListModel, receivablesListModelApi] = useVbenModal({
  connectedComponent: ReceivablesList,
  destroyOnClose: true,
});

const [ReceivablesSubListModel, receivablesSubListModelApi] = useVbenModal({
  connectedComponent: ReceivablesSubList,
  destroyOnClose: true,
});
</script>
<template>
  <Modal :title="getDrawerTitle" class="w-3/5">
    <Form />
    <ReceivablesListModel
      @select="
        ({ customerName, id, customerId }: Record<string, any>) => {
          formApi.getValues().then(({ custId }) => {
            if (custId !== customerId) {
              formApi.setValues({
                custName: customerName,
                formCode: '',
              });
              formData.value = {
                ...formData.value,
                custId: customerId,
                custName: customerName,
                formId: id,
              };
            }
          });
        }
      "
    />
    <ReceivablesSubListModel
      @select="
        ({ code }: Record<string, any>) => {
          formApi.setValues({
            formCode: code,
          });
        }
      "
    />
    <template #append-footer>
      <ElButton type="primary" @click="onSave">提交</ElButton>
    </template>
  </Modal>
</template>
<style lang="css" scoped></style>
