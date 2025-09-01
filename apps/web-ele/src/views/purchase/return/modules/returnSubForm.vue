<script lang="ts" setup>
import type { StorageApi, VehiclePlaceApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { getAttList, getStorageList, getVehiclePlaceList } from '#/api';
import {
  createPurchaseReturnSub,
  updatePurchaseReturnSub,
} from '#/api/purchase/return';
import { findNodesByIds } from '#/utils';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>();

// 辅助函数：处理mainId，确保0或无效值时返回null
function getValidMainId(id: any): null | number {
  if (id === 0 || id === null || id === undefined || id === '') {
    return null;
  }
  return Number(id);
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'num',
      label: '退货数量',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入退货数量',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '单价',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入单价',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'priceReference',
      label: '参考价格',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入参考价格',
        min: 0,
      },
    },
    {
      component: 'Select',
      fieldName: 'productPlaceId',
      label: '产地',
      componentProps: {
        placeholder: '请选择产地',
        clearable: true,
        options: [],
      },
    },
    {
      component: 'Cascader',
      fieldName: 'productAttListTemp',
      label: '附件',
      componentProps: {
        placeholder: '请选择附件',
        clearable: true,
        props: {
          expandTrigger: 'hover' as const,
          value: 'id',
          label: 'name',
          children: 'childList',
          multiple: true,
          emitPath: false,
        },
      },
    },
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库',
      componentProps: {
        placeholder: '请选择仓库',
        clearable: true,
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'siteName',
      label: '库位',
      componentProps: {
        placeholder: '请输入库位',
      },
      renderComponentContent: () => ({
        prefix: () => '#',
      }),
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 4,
      },
    },
  ],
  showDefaultActions: false,
  // 大屏一行显示1个，中屏一行显示1个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
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
  return `${formData.value?.id ? '修改' : '新增'}明细-${formData.value?.productName || '无'}`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  draggable: true,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (values) {
        formData.value = { ...values };
        formApi.setValues(values);
      }

      // 加载产地选项
      getVehiclePlaceList().then(
        ({ data }: { data: VehiclePlaceApi.VehiclePlace[] }) => {
          const options = data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          formApi.updateSchema([
            {
              componentProps: {
                options,
                onChange: (value: number) => {
                  changeOptions(value, options, 'productPlaceName');
                },
              },
              fieldName: 'productPlaceId',
            },
          ]);
        },
      );

      // 加载仓库选项
      getStorageList({}).then(({ data }: { data: StorageApi.Storage[] }) => {
        const options = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        formApi.updateSchema([
          {
            componentProps: {
              options,
              onChange: (value: number) =>
                changeOptions(value, options, 'storeName'),
            },
            fieldName: 'storeId',
          },
        ]);
      });

      // 加载附件选项
      getAttList().then(({ data }) => {
        formApi.updateSchema([
          {
            componentProps: {
              options: data,
              onChange: (value: number[]) => {
                const productAttList = findNodesByIds(
                  data,
                  Object.values(value),
                ).map(({ id, name }) => ({ id, name }));
                formData.value = {
                  ...(formData.value as Record<string, any>),
                  productAttList,
                };
              },
            },
            fieldName: 'productAttListTemp',
          },
        ]);

        // 设置已选择的附件
        formApi.setValues({
          productAttListTemp: values?.productAttachmentIds
            ?.split('_')
            .map(Number),
        });

        // 处理附件数据
        if (values?.productAttachmentIds) {
          const ids = values.productAttachmentIds.split('_') || [];
          const names = values.productAttachmentNames?.split('_') || [];
          const productAttList = ids.map((id, index) => ({
            id: Number.parseInt(id),
            name: names[index],
          }));
          formData.value = {
            ...(formData.value as Record<string, any>),
            productAttList,
          };
        }
      });
    }
  },
});

function changeOptions(
  value: number,
  options: Array<Record<string, any>>,
  fieldName: string,
) {
  formData.value = {
    ...formData.value,
    [fieldName]: options.find((item) => item.value === value)?.label,
  };
}

async function onSubmit(values: Record<string, any>) {
  const { addPurchaseReturnMainParam } = formData.value || {};

  // 构建符合API要求的参数格式
  const subData = {
    actiNum: values.num || 0, // 使用num作为数量字段
    addPurchaseReturnMainParam: {
      code: addPurchaseReturnMainParam?.code || '',
      loadingPersonIds: addPurchaseReturnMainParam?.loadingPersonIds || [],
      pickingPersonIds: addPurchaseReturnMainParam?.pickingPersonIds || [],
      printFlag: addPurchaseReturnMainParam?.printFlag || 0,
      printLabel: addPurchaseReturnMainParam?.printLabel || 0,
      remark: addPurchaseReturnMainParam?.remark || '',
      statusFlag: addPurchaseReturnMainParam?.statusFlag || 1,
      supplierId: addPurchaseReturnMainParam?.supplierId || 0,
      supplierName: addPurchaseReturnMainParam?.supplierName || '',
    },
    balanceId: formData.value?.balanceId || formData.value?.id || 0, // 使用balanceId或库存记录ID
    code: addPurchaseReturnMainParam?.code || '',
    formCode: formData.value?.formCode || '',
    formId: '', // 设置为空字符串
    mainId: getValidMainId(formData.value?.mainId),
    num: values.num || 0,
    price: values.price || 0,
    priceReference: values.priceReference || 0,
    productAttachmentIds:
      formData.value?.productAttList?.map((item) => item.id).join('_') || '',
    productAttachmentNames:
      formData.value?.productAttList?.map((item) => item.name).join('_') || '',
    productId: formData.value?.productId || 0,
    productName: formData.value?.productName || '',
    productPlaceId: values.productPlaceId || 0,
    remark: values.remark || '',
    siteName: values.siteName || '',
    statusFlag: addPurchaseReturnMainParam?.statusFlag || 1,
    storeId: values.storeId || 0,
  };

  modalApi.lock();

  try {
    const response = formData.value?.id
      ? await updatePurchaseReturnSub({ ...subData, id: formData.value.id })
      : await createPurchaseReturnSub(subData);

    console.warn('退货明细操作结果', response);
    emits('success', response.data);
    modalApi.close();
  } catch (error) {
    console.error('退货明细操作失败:', error);
    throw error;
  } finally {
    modalApi.unlock();
  }
}
</script>

<template>
  <Modal :title="getDrawerTitle" class="w-[500px]">
    <Form />
  </Modal>
</template>

<style lang="css" scoped></style>
