<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { getGeneralLedgerStaList } from '#/api';

const detailData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  // fullscreen: true,
  // fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: true,
  draggable: true,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      getGeneralLedgerStaList().then(({ data }) => {
        detailData.value = data;
      });
    }
  },
  title: '统计分类账',
});

onMounted(() => {
  nextTick(() => {
    // const tableData = gridApi.grid.getFullData();
    // console.log('tableData', tableData);
  });
  // gridApi.grid.insertNextAt({ ...data }, tableData?.length - 1);
});

const list = [
  {
    label: '资金合计',
    fieldName: 'accountMoney',
  },
  {
    label: '应收欠款',
    fieldName: 'addMoney',
  },
  {
    label: '应付欠款',
    fieldName: 'minusMoney',
  },
  {
    label: '库存耗材',
    fieldName: 'consumables',
  },
  {
    label: '固定资产',
    fieldName: 'fixedAsset',
  },
  {
    label: '库存数量',
    fieldName: 'totalNum',
  },
  {
    label: '库存金额',
    fieldName: 'totalMoney',
  },
  {
    label: '毛利',
    fieldName: 'moneyPer',
  },
  // {
  //   label: '实际资产',
  //   fieldName: 'accountMoney',
  // },
];
const printArea = { id: 'printArea' };
</script>
<template>
  <Modal class="w-[800px]">
    <div id="printArea" class="w-full">
      <ElDescriptions
        :column="1"
        border
        title="天筑 总分类账统计"
        label-width="200"
      >
        <ElDescriptionsItem
          label-align="right"
          v-for="{ label, fieldName } in list"
          :key="fieldName"
        >
          <template #label>
            <div class="cell-item">{{ label }}</div>
          </template>
          {{ detailData[fieldName] }}
        </ElDescriptionsItem>
      </ElDescriptions>
      <div class="w-full" style="text-align: center">
        打印时间: {{ dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd') }}
      </div>
    </div>
    <template #append-footer>
      <ElButton type="primary" v-print="printArea">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:print-outline-rounded"
        />打印
      </ElButton>
    </template>
  </Modal>
</template>
<style lang="css" scoped>
:deep(.el-descriptions__title) {
  width: 100%;
  text-align: center;
}
</style>
