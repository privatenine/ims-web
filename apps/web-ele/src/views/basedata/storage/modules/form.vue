<script lang="ts" setup>
import type { StorageApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createStorage, updateStorage } from '#/api';

import { useFormSchema } from '../data';
import PersonList from './personList.vue';

const emits = defineEmits(['success']);

const formData = ref<Record<string, any>>();
const getDrawerTitle = computed(() => {
  return formData.value?.id ? '修改仓库' : '新增仓库';
});
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
      const values = modalApi.getData<StorageApi.Storage>();
      formApi.resetForm();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }
      formApi.updateSchema([
        {
          fieldName: 'storeOperName',
          componentProps: {
            onClick: () => personModelApi.open(),
          },
        },
      ]);
    }
  },
  // title: formData.value?.id ? '修改仓库' : '新增仓库',
});

function onSubmit() {
  // const aa = modalApi.getData<Record<string, any>>();
  formApi.getValues<StorageApi.Storage>().then((data) => {
    modalApi.lock();
    (formData.value?.id
      ? updateStorage({ ...data, id: formData.value?.id })
      : createStorage(data)
    )
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .finally(() => {
        modalApi.unlock();
      });
  });
}

const [PersonModel, personModelApi] = useVbenModal({
  connectedComponent: PersonList,
  destroyOnClose: true,
});

function selectPerson(person: Record<string, any>) {
  formApi.setValues({ storeOperId: person.id, storeOperName: person.username });
}
</script>
<template>
  <Modal class="w-2/5" :title="getDrawerTitle">
    <PersonModel @success="selectPerson" />
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
