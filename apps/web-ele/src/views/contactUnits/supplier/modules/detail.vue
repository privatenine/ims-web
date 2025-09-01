<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { useDetailSchema } from '../data';

const detailData = ref<Record<string, any>>({});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
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
      }
    }
  },
  title: '供应商详情',
});

const detailSchema = useDetailSchema();
</script>
<template>
  <Modal class="w-4/5">
    <ElDescriptions :column="3" border title="供应商基本信息" label-width="130">
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in detailSchema.filter(
          (item) => item.sign === 1,
        )"
        :key="fieldName"
      >
        <template #label>
          <div class="cell-item">{{ label }}</div>
        </template>
        {{ detailData[fieldName] }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElDescriptions
      :column="3"
      border
      title="联系人信息"
      style="margin-top: 20px"
      label-width="110"
    >
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in detailSchema.filter(
          (item) => item.sign === 2,
        )"
        :key="fieldName"
      >
        <template #label>
          <div class="cell-item">{{ label }}</div>
        </template>
        {{ detailData[fieldName] }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </Modal>
</template>
<style lang="css" scoped></style>
