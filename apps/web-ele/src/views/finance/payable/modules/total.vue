<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { payableAccumulatePm } from '#/api';

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
      payableAccumulatePm().then(({ data }) => {
        detailData.value.totalMoney = data;
      });
    }
  },
  title: '合计',
});
</script>
<template>
  <Modal class="w-1/5">
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label-align="right" label-width="80">
        <template #label>
          <div class="cell-item">资金累计</div>
        </template>
        {{ detailData.value?.totalMoney || 0 }} 元
      </ElDescriptionsItem>
    </ElDescriptions>
  </Modal>
</template>
<style lang="css" scoped></style>
