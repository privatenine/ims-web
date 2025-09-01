<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  approveReceivePaymentById,
  getCompanyList,
  rejectReceivePaymentById,
} from '#/api';

import { useAuditSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<null | Record<string, any>>(null);

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useAuditSchema(),
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
  return `审批免收制单`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  draggable: true,
  confirmText: '通过',
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
            onClick() {},
          },
        },
        {
          fieldName: 'formCode',
          componentProps: {
            onClick() {},
          },
        },
      ]);
      getCompanyList({}).then(({ data }) => {
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
              onChange(value: number) {
                formApi.setValues({
                  bankAccount: options.find(
                    (n: Record<string, any>) => n.value === value,
                  )?.label,
                });
              },
            },
            fieldName: 'bankId',
          },
        ]);
      });

      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }
    }
  },
});

async function onSubmit() {
  save(approveReceivePaymentById);
}
function save(callBack: Function) {
  modalApi.lock();
  const { version, id } = formData.value;
  callBack({ version, id })
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
  <Modal :title="getDrawerTitle" class="w-3/5">
    <Form />
    <template #center-footer>
      <ElButton type="primary" @click="() => save(rejectReceivePaymentById)">
        驳回
      </ElButton>
    </template>
  </Modal>
</template>
<style lang="css" scoped></style>
