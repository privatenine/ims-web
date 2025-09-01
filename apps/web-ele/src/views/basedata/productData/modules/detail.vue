<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { useDetailSchema } from '../data';

const detailData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  // fullscreen: true,
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
      }
    }
  },
  title: '产品资料详情',
});
</script>
<template>
  <Modal class="max-h-5/6 mr-0 w-4/5">
    <ElDescriptions :column="4" border title="产品资料详情" label-width="120">
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in useDetailSchema()"
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
