<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { getCompanyList, getPayableSubList } from '#/api';

import { useDetailSchema } from '../data';

const detailData = ref<Record<string, any>>({});
const companyList = ref<Record<string, any>[]>([]);
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: false,
  draggable: true,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        detailData.value = values;
        getPayableSubList({
          pageNum: 1,
          pageSize: 100,
          // mainId: formData.value?.mainId,
          supplierId: values.supplierId,
        }).then(({ data }) => {
          const item = data.find((n) => n.code === values.formCode);
          if (item) {
            detailData.value = { ...values, bb: item.formCode };
          }
        });
        getCompanyList({}).then(({ data }) => {
          companyList.value = data;
          // console.log('companyList', data);
          // const options = data.map((n: Record<string, any>) => {
          //   return {
          //     label: n.accountName,
          //     value: n.balanceType,
          //   };
        });
      }
    }
  },
  title: '其它应付款单详情',
});

const detailSchema = useDetailSchema();
</script>
<template>
  <Modal class="w-3/5">
    <ElDescriptions :column="3" border label-width="110">
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in detailSchema.filter(
          (n) => n.fieldName !== 'aa',
        )"
        :key="fieldName"
      >
        <template #label>
          <div class="cell-item">{{ label }}</div>
        </template>
        <template v-if="fieldName === 'typeName'">
          {{
            companyList.find((n) => n.balanceType === detailData[fieldName])
              ?.accountName
          }}
        </template>
        <template v-else>
          {{ detailData[fieldName] }}
        </template>
      </ElDescriptionsItem>
    </ElDescriptions>
  </Modal>
</template>
<style lang="css" scoped></style>
