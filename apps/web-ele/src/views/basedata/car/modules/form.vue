<script lang="ts" setup>
import type { CarApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createCar, updateCar } from '#/api';

import { useFormSchema } from '../data';
import PersonList from './personList.vue';

const emits = defineEmits(['success']);

const formData = ref<CarApi.Car>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<CarApi.Car>();
    drawerApi.lock();
    (formData.value?.id
      ? updateCar({ ...values, id: formData.value.id })
      : createCar(values)
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
      const data = drawerApi.getData<CarApi.Car>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        formApi.setValues(data);
      }
      formApi.updateSchema([
        {
          fieldName: 'driverName',
          componentProps: {
            onClick: () => personModelApi.open(),
          },
        },
      ]);
    }
  },
});
const getDrawerTitle = computed(() => {
  return formData.value?.id ? '修改车辆' : '新增车辆';
});

const [PersonModel, personModelApi] = useVbenModal({
  connectedComponent: PersonList,
  destroyOnClose: true,
});

function selectPerson(person: Record<string, any>) {
  formApi.setValues({ driverId: person.id, driverName: person.username });
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <PersonModel @success="selectPerson" />
    <Form />
  </Drawer>
</template>
<style lang="css" scoped></style>
