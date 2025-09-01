<script lang="ts" setup>
import type { StorageLocationApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createStorageLocation, updateStorageLocation } from '#/api';

import { useFormSchema } from '../data';
import StorageList from './storageList.vue';

const emits = defineEmits(['success']);

const formData = ref<StorageLocationApi.StorageLocation>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values =
      await formApi.getValues<StorageLocationApi.StorageLocation>();
    drawerApi.lock();
    (formData.value?.id
      ? updateStorageLocation({
          ...values,
          id: formData.value?.id,
        })
      : createStorageLocation(values)
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<StorageLocationApi.StorageLocation>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        formApi.setValues(data);
      }
      formApi.updateSchema([
        {
          fieldName: 'storageName',
          componentProps: {
            onClick: () => storageModelApi.open(),
          },
        },
      ]);
    }
  },
});
const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}库位`;
});

const [StorageModel, storageModelApi] = useVbenModal({
  connectedComponent: StorageList,
  destroyOnClose: true,
});

function selectData(data: Record<string, any>) {
  formApi.setValues({ storageId: data.id, storageName: data.name });
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <StorageModel @success="selectData" />
    <Form />
  </Drawer>
</template>
<style lang="css" scoped></style>
