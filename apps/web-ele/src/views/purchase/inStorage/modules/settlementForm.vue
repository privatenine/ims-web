<script lang="ts" setup>
import type { InStorageApi } from '#/api';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElTooltip } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  getCompanyList,
  getInStorageSettlement,
  settlementInStorage,
} from '#/api';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
const isCalculating = ref(false); // 防止循环计算

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      rules: 'required',
      componentProps: {
        // placeholder: '请选择仓库',
        disabled: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'bankId',
      label: '结算账户',
      rules: 'required',
      componentProps: {
        placeholder: '结算账户',
        options: [],
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'fkCode',
      label: '付款流水号',
      componentProps: {
        placeholder: '付款流水号',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '核销单据',
      componentProps: {
        placeholder: '核销单据',
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'inStorageMoney',
      label: '入库金额',
      componentProps: {
        placeholder: '入库金额',
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalMoney',
      label: () =>
        h(
          ElTooltip,
          {
            content: '负数为减少正数为增加',
            placement: 'top-start',
            effect: 'light',
          },
          [
            h('div', { class: 'tooltip-content' }, [
              h(IconifyIcon, {
                icon: 'majesticons:tooltip-line',
                style: { float: 'left', marginTop: '4px' },
              }),
              h('span', {}, '实付金额'),
            ]),
          ],
        ), // '实付金额',
      componentProps: {
        placeholder: '实付金额',
        onChange: (value: number) => {
          handleTotalMoneyChange(value);
        },
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'discountMoney',
      label: '优惠金额',
      componentProps: {
        placeholder: '优惠金额',
        onChange: (value: number) => {
          handleDiscountMoneyChange(value);
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '备注',
        type: 'textarea',
      },
    },
  ],
  showDefaultActions: false,
  // 调整为单列布局，适应500px宽度
  wrapperClass: 'grid-cols-1',
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
  centered: true,
  // width: 500,
  // showCancelButton: false,
  // showConfirmButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      getCompanyList({}).then(({ data }) => {
        const options = data.map((n: Record<string, any>) => {
          return {
            label: n.accountName,
            value: n.id,
          };
        });

        formApi.updateSchema([
          {
            componentProps: {
              options,
              onChange(value: number) {
                formData.value = {
                  ...formData.value,
                  bankName: options.find(
                    (n: Record<string, any>) => n.value === value,
                  )?.label,
                };
              },
            },
            fieldName: 'bankId',
          },
        ]);
      });
      const values = modalApi.getData<InStorageApi.InStorage>();
      formApi.resetForm();
      console.warn(444, values);
      if (values) {
        formData.value = { ...formData.value, ...values };
        formApi.setValues(values);
        const { code, id: warehousingId } = values;
        getInStorageSettlement({ warehousingId, code }).then(({ data }) => {
          formData.value = { ...formData.value, ...data };
          // 设置初始值：实付金额等于入库金额
          if (data.inStorageMoney && !data.totalMoney) {
            data.totalMoney = data.inStorageMoney;
            data.discountMoney = 0;
          }
          formApi.setValues(data);
        });
      }
    }
  },
});

// 处理实付金额变化
async function handleTotalMoneyChange(value: number) {
  if (isCalculating.value) return;
  isCalculating.value = true;

  const currentValues = await formApi.getValues();
  const inStorageMoney = currentValues.inStorageMoney || 0;

  // 优惠金额 = 入库金额 - 实付金额
  const discountMoney = inStorageMoney - (value || 0);

  formApi.setFieldValue('discountMoney', discountMoney);

  setTimeout(() => {
    isCalculating.value = false;
  }, 100);
}

// 处理优惠金额变化
async function handleDiscountMoneyChange(value: number) {
  if (isCalculating.value) return;
  isCalculating.value = true;

  const currentValues = await formApi.getValues();
  const inStorageMoney = currentValues.inStorageMoney || 0;

  // 实付金额 = 入库金额 - 优惠金额
  const totalMoney = inStorageMoney - (value || 0);

  formApi.setFieldValue('totalMoney', totalMoney);

  setTimeout(() => {
    isCalculating.value = false;
  }, 100);
}

async function onSubmit() {
  const data = await formApi.getValues<InStorageApi.InStorageSettlement>();
  modalApi.lock();
  const {
    bankName,
    id: warehousingId,
    supplierId,
    supplierName,
    formId,
    version,
  } = formData.value;
  settlementInStorage({
    ...data,
    bankName,
    warehousingId,
    supplierId,
    supplierName,
    formId,
    version,
  })
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
  <Modal title="入库结算" class="max-h-5/6" style="max-width: 500px">
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
