<script lang="ts" setup>
import type { ProductApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  createProduct,
  getBasicProjectList,
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
  updateProduct,
} from '#/api';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<Record<string, any>>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3',
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-[120px]',
  },
});

// const [Form1, formApi1] = useVbenForm({
//   schema: useFormSchema1(),
//   showDefaultActions: false,
//   // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
//   wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2',
//   // 所有表单项共用，可单独在表单内覆盖
//   commonConfig: {
//     // 在label后显示一个冒号
//     colon: true,
//     // 所有表单项
//     componentProps: {
//       class: 'w-full',
//     },
//   },
// });
// const [Form2, formApi2] = useVbenForm({
//   schema: useFormSchema2(),
//   showDefaultActions: false,
//   // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
//   wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
//   // 所有表单项共用，可单独在表单内覆盖
//   commonConfig: {
//     // 在label后显示一个冒号
//     colon: true,
//     // 所有表单项
//     componentProps: {
//       class: 'w-full',
//     },
//   },
// });
const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
  draggable: true,
  fullscreenButton: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<ProductApi.Product>();
    const subData = {
      ...formData.value,
      ...values,
      norms: values.norms === '**' ? '' : values.norms,
    };
    modalApi.lock();
    (formData.value?.id
      ? updateProduct({
          ...subData,
          id: formData.value?.id,
        })
      : createProduct(subData)
    )
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<ProductApi.Product>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
      }
      const uptNorms = () => {
        formApi.getValues().then(({ middleLength, downLength, diagonal }) =>
          formApi.setValues({
            norms: `${middleLength === null ? '' : middleLength}*${downLength === null ? '' : downLength}*${diagonal === null ? '' : diagonal}`,
          }),
        );
      };
      formApi.updateSchema([
        {
          fieldName: 'middleLength',
          componentProps: {
            onChange: uptNorms,
          },
        },
        {
          fieldName: 'downLength',
          componentProps: {
            onChange: uptNorms,
          },
        },
        {
          fieldName: 'diagonal',
          componentProps: {
            onChange: uptNorms,
          },
        },
      ]);
      const updateSchemaWith = (
        fieldName: string,
        options: { label: string; value: number }[],
        formApi: any,
        setValueField: string,
      ) => {
        formApi.updateSchema([
          {
            fieldName,
            componentProps: {
              options,
              onChange: (value: number) =>
                // formApi.setValues({
                //   [setValueField]: options.find((n) => n.value === value)
                //     ?.label,
                // }),
                (formData.value = {
                  ...formData.value,
                  [setValueField]: options.find((n) => n.value === value)
                    ?.label,
                }),
              onClear: () => {
                formApi.setValues({
                  [setValueField]: '',
                  [fieldName]: '',
                });
              },
            },
          },
        ]);
      };

      Promise.all([
        getBasicProjectList({}),
        getVehicleModelList(),
        getVehicleSeriesList(),
        getVehicleTypeList(),
        getVehiclePositionList(),
      ]).then(([basicRes, modelRes, seriesRes, typeRes, positionRes]) => {
        const basicOptions = basicRes.data.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        updateSchemaWith('baseId', basicOptions, formApi, 'baseName');

        const modelOptions = modelRes.data.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        updateSchemaWith('carModelId', modelOptions, formApi, 'carModelName');

        const seriesOptions = seriesRes.data.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        updateSchemaWith(
          'carSeriesId',
          seriesOptions,
          formApi,
          'carSeriesName',
        );

        const typeOptions = typeRes.data.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        updateSchemaWith('carTypeId', typeOptions, formApi, 'carTypeName');

        const positionOptions = positionRes.data.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
        updateSchemaWith(
          'positionId',
          positionOptions,
          formApi,
          'positionName',
        );
        data && formApi.setValues(data);
      });
    }
  },
});

const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}产品资料`;
});
</script>
<template>
  <Modal class="max-h-5/6 mr-0 w-4/5" :title="getDrawerTitle">
    <!-- <ElTabs> -->
    <!-- <ElTabPane label="基本信息"> -->
    <Form />
    <!-- </ElTabPane> -->
    <!-- <ElTabPane label="相关信息">
        <Form1 />
      </ElTabPane>
      <ElTabPane label="价格设置">
        <Form2 />
      </ElTabPane> -->
    <!-- </ElTabs> -->
  </Modal>
</template>
<style lang="css" scoped></style>
