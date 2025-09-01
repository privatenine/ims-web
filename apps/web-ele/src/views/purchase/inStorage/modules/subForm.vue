<script lang="ts" setup>
import type { InStorageApi, VehiclePlaceApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  createInStorageSub,
  getAttList,
  getInStorageStoreBy,
  getVehiclePlaceList,
  updateInStorageSub,
} from '#/api';
import { findNodesByIds } from '#/utils';
import { getStorageOptions } from '#/utils/storage';

const emits = defineEmits(['success']);
const formData = ref<InStorageApi.InStorageSub>();

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'actiNum',
      label: '数量',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入数量',
        min: 0,
        onChange: (value: number) =>
          formApi.setValues({
            printLabel: value,
          }),
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '单价',
      defaultValue: 0,
      componentProps: {
        placeholder: '请选择输入单价',
        min: 0,
        onChange: (value: number) => findInStorageStoreBy({ buyPrice: value }),
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
        // showAllLevels: false,
        // popperClass: 'last-check',

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
      component: 'InputNumber',
      fieldName: 'printLabel',
      label: '标签数',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入标签数',
        min: 0,
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
      component: 'Checkbox',
      fieldName: 'isDefault',
      label: '默认库位',
      componentProps: {
        placeholder: '请选择',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      // formItemClass: 'col-span-3',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 4,
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'productPlaceName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'storeName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
  ],
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
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
  showCancelButton: false,
  showConfirmButton: false,
  width: '400px',
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<InStorageApi.InStorageSub>();
      formApi.resetForm();
      if (values) {
        formData.value = { ...values };
        formApi.setValues(values);
      }
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
                  findInStorageStoreBy({ productPlaceId: value });
                },
              },
              fieldName: 'productPlaceId',
            },
          ]);
        },
      );
      // 使用缓存的仓库数据
      const storageOptions = getStorageOptions();
      formApi.updateSchema([
        {
          componentProps: {
            options: storageOptions,
            onChange: (value: number) => {
              const selectedOption = storageOptions.find(
                (option) => option.value === value,
              );
              changeOptions(value, storageOptions, 'storeName');
            },
          },
          fieldName: 'storeId',
        },
      ]);
      getAttList().then(({ data }) => {
        formApi.updateSchema([
          {
            componentProps: {
              options: data,
              onChange: (value: number[]) => {
                const productAttList: InStorageApi.ProductAttParam[] =
                  findNodesByIds(data, Object.values(value)).map(
                    ({ id, name }) => ({ id, name }),
                  );
                formData.value = {
                  ...(formData.value as InStorageApi.InStorageSub),
                  productAttList,
                };
                findInStorageStoreBy({
                  productAttachmentIds: Object.values(value).join('_'),
                });
              },
            },
            fieldName: 'productAttListTemp',
            // defaultValue: [11, 12],
          },
        ]);
        formApi.setValues({
          productAttListTemp: values.productAttachmentIds
            ?.split('_')
            .map(Number),
        });
        {
          const ids = values.productAttachmentIds?.split('_') || [];
          const names = values.productAttachmentNames?.split('_') || [];

          // 映射生成目标数组
          const productAttList: Array<InStorageApi.ProductAttParam> = ids.map(
            (id, index) => ({
              id: Number.parseInt(id),
              name: names[index],
            }),
          );
          formData.value = {
            ...(formData.value as InStorageApi.InStorageSub),
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

function findInStorageStoreBy(data: InStorageApi.InStorageStoreQuery) {
  const { productId } = formData.value;
  const { supplierId } = formData.value?.addWarehousingMainParam || {};
  formApi.getValues().then((oData) => {
    const param = {
      ...oData,
      productId,
      supplierId,
      ...data,
      buyPrice: data.buyPrice || oData.price,
    };
    const {
      productId: nProductId,
      productAttachmentIds,
      buyPrice,
      productPlaceId,
      supplierId: nSupplierId,
    } = param;
    if (
      nProductId &&
      productAttachmentIds &&
      buyPrice &&
      productPlaceId &&
      nSupplierId
    ) {
      getInStorageStoreBy(param)
        .then(({ data: nData }) => {
          formApi.setValues({
            storeId: nData.storeId,
            storeName: nData.storeName,
            siteName: nData.siteName,
            isDefault: nData.isDefault,
          });
        })
        .catch(() => {});
    }
  });
}

async function onSubmit(values: Record<string, any>) {
  const { supplierId, supplierName, code } =
    formData.value?.addWarehousingMainParam || {};

  const subData = {
    ...formData.value,
    ...values,
    addWarehousingMainParam: {
      ...formData.value?.addWarehousingMainParam,
      statusFlag: 1,
    },
    code: code ?? '',
    supplierId: supplierId ?? 0,
    supplierName: supplierName ?? '',
    actiNum: values.actiNum ?? null, // 修改默认值为null以匹配InStorageSub类型
  }; // 显式类型断言

  if (subData.addWarehousingMainParam?.id) {
    subData.warehousingId = subData.addWarehousingMainParam.id;
    // if (subData.addWarehousingMainParam) {
    //   delete subData.addWarehousingMainParam;
    // }
  }
  modalApi.lock();
  (subData.id
    ? updateInStorageSub(subData as InStorageApi.InStorageSub)
    : createInStorageSub(
        subData as Omit<InStorageApi.InStorageSub, 'id'> & { id?: number },
      )
  )
    .then(({ data }: { data: InStorageApi.InStorageSub }) => {
      console.warn('入库明细新增 修改 结果', data);
      emits('success', data);
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}
</script>
<template>
  <Modal :title="getDrawerTitle">
    <Form />
    <div class="mt-4 flex justify-end space-x-2">
      <ElButton @click="modalApi.close()">取消</ElButton>
      <ElButton type="primary" @click="formApi.validateAndSubmitForm()">
        确定
      </ElButton>
    </div>
  </Modal>
</template>
<style lang="css" scoped></style>
