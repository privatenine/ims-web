<script lang="ts" setup>
import type { FreePaymentApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createFreePayment, updateFreePayment } from '#/api';

import { useFormSchema } from '../data';
import PayableList from './payableList.vue';
import PayableSubList from './payableSubList.vue';

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
          fieldName: 'supplierName',
          componentProps: {
            onClick() {
              payableListModelApi.open();
            },
          },
        },
        {
          fieldName: 'formCode',
          componentProps: {
            onClick() {
              payableSubListModelApi.setData(formData.value).open();
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
  const data = await formApi.getValues<FreePaymentApi.FreePayment>();
  // console.log('merge', data);

  save({ ...data, statusFlag: 1 });
}
function onSave() {
  formApi.validate().then(({ valid }) => {
    if (!valid) return;
    formApi
      .getValues<FreePaymentApi.FreePayment>()
      .then((data) => save({ ...data, statusFlag: 2 }));
  });
}
function save(data: FreePaymentApi.FreePayment) {
  modalApi.lock();
  (formData.value?.id
    ? updateFreePayment({
        ...formData.value,
        ...data,
        id: formData.value?.id,
      })
    : createFreePayment({ ...formData.value, ...data })
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

const [PayableSubListModel, payableSubListModelApi] = useVbenModal({
  connectedComponent: PayableSubList,
  destroyOnClose: true,
});
</script>
<template>
  <Modal :title="getDrawerTitle" class="w-3/5">
    <Form />
    <PayableListModel
      @select="
        ({ supplierName, id, supplierId }: Record<string, any>) => {
          formApi.getValues().then((data) => {
            if (data.supplierId !== supplierId) {
              formApi.setValues({
                supplierName,
                formCode: '',
              });
              formData.value = {
                ...formData.value,
                supplierId,
                supplierName,
                formId: id,
              };
            }
          });
        }
      "
    />
    <PayableSubListModel
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
