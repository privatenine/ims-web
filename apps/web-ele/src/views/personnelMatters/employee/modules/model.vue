<script lang="ts" setup>
import type { EmployeeApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElTabPane, ElTabs } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { createEmployee, updateEmployee } from '#/api';

import { useForm1Schema, useForm2Schema, useFormSchema } from '../data';

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
const [Form1, formApi1] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useForm1Schema(),
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
const [Form2, formApi2] = useVbenForm({
  handleSubmit: onSubmit,
  schema: useForm2Schema(),
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
      formApi.resetForm();
      if (values) {
        formData.value = values;
        id.value = values.employeeId;
        formApi.setValues(values);
        formApi1.setValues(values);
        formApi2.setValues(values);
      } else {
        id.value = undefined;
      }
    }
  },
});

async function onSubmit() {
  const data = await formApi
    .merge(formApi1)
    .merge(formApi2)
    .submitAllForm(true);

  modalApi.lock();
  (id.value
    ? updateEmployee({ ...data, id: id.value, userId: formData.value?.userId })
    : createEmployee(data)
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
    <ElTabs>
      <ElTabPane label="基本信息">
        <Form />
      </ElTabPane>
      <ElTabPane label="相关信息">
        <Form1 />
      </ElTabPane>
      <ElTabPane label="图像信息">
        <Form2 />
      </ElTabPane>
    </ElTabs>
  </Modal>
</template>
<style lang="css" scoped></style>
