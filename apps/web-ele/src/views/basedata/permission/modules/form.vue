<script lang="ts" setup>
import type { BasicMenuApi, BasicRoleApi, EmployeeApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createBasicRole, getBasicRole, updateBasicRole } from '#/api';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>();
const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}角色`;
});
const [Form, formApi] = useVbenForm({
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

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  draggable: true,
  modal: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    const { valid } = await formApi.validate();
    if (!valid) return;
    formApi.getValues<BasicRoleApi.Role>().then((data) => {
      (formData.value?.id
        ? updateBasicRole({ ...data, id: formData.value?.id })
        : createBasicRole(data)
      )
        .then(() => {
          emits('success');
          modalApi.close();
        })
        .finally(() => {
          modalApi.unlock();
        });
    });
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (values && values.id) {
        getBasicRole(values.id).then(({ data }) => {
          formData.value = data;
          formApi.setValues({
            ...values,
            menuIds: (data.menuList || []).map((n: BasicMenuApi.Menu) => n.id),
            userIds: (data.loginList || []).map(
              (n: EmployeeApi.Employee) => n.id,
            ),
          });
        });
      }
    }
  },
});
</script>
<template>
  <Modal class="w-3/5" :title="getDrawerTitle">
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
