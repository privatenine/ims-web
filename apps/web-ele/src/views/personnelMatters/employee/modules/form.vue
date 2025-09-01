<script lang="ts" setup>
import type { EmployeeApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createEmployee, updateEmployee } from '#/api';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const id = ref();
const formData = ref<EmployeeApi.Employee>();

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
    labelClass: 'w-2/6',
  },
});

// const id = ref();
// const [Drawer, drawerApi] = useVbenDrawer({
//   async onConfirm() {
//     const { valid } = await formApi.validate();
//     if (!valid) return;
//     const values = await formApi.getValues();
//     drawerApi.lock();
//     (id.value
//       ? updateEmployee({ ...values, id: id.value } as EmployeeApi.Employee)
//       : createEmployee(values as Omit<EmployeeApi.Employee, 'id'>)
//     )
//       .then(() => {
//         emits('success');
//         drawerApi.close();
//       })
//       .catch(() => {
//         drawerApi.unlock();
//       });
//   },
//   onOpenChange(isOpen) {
//     if (isOpen) {
//       const data = drawerApi.getData<EmployeeApi.Employee>();
//       formApi.resetForm();
//       if (data) {
//         formData.value = data;
//         id.value = data.id;
//         formApi.setValues(data);
//       } else {
//         id.value = undefined;
//       }
//     }
//   },
// });
const getDrawerTitle = computed(() => {
  return formData.value?.employeeId ? '修改员工档案' : '新增员工档案';
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
      const { values } = modalApi.getData<Record<string, any>>();
      console.log('values222', values);
      formApi.resetForm();
      if (values) {
        formData.value = values;
        id.value = values.employeeId;
        formApi.setValues(values);
      } else {
        id.value = undefined;
      }
    }
  },
  title: '内嵌表单示例',
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();
  (id.value
    ? updateEmployee({ ...values, id: id.value, userId: formData.value.userId })
    : createEmployee(values)
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
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
