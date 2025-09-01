<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElButton, ElDescriptions, ElDescriptionsItem } from 'element-plus';

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
      const values = modalApi.getData<Record<string, any>>();
      detailData.value = {
        ...values,
        createTimeStr: values.createTime
          ? dayjs(values.createTime).format('YYYY-MM-DD')
          : '',
        approveTimeStr: values.approveTime
          ? dayjs(values.approveTime).format('YYYY-MM-DD')
          : '',
      };
    }
  },
  title: '打印预览',
});

const list = [
  {
    label: '类别',
    fieldName: 'typeName',
  },
  {
    label: '收款方式',
    fieldName: 'bankAccount',
  },
  {
    label: '收款流水号',
    fieldName: 'code',
  },
  {
    label: '收款单据',
    fieldName: 'formCode',
  },
  {
    label: '审核日期',
    fieldName: 'approveTimeStr',
  },
  {
    label: '审核员',
    fieldName: 'approveName',
  },
  {
    label: '实收金额',
    fieldName: 'balanceMoney',
  },
  {
    label: '单据总数',
    fieldName: 'totalNum',
  },
  {
    label: '制单日期',
    fieldName: 'createTimeStr',
  },
  {
    label: '制单员',
    fieldName: 'createName',
  },
  {
    label: '年月',
    fieldName: 'monthField',
  },
  {
    label: '备注',
    fieldName: 'remark',
  },
];
const printArea = { id: 'printArea' };
</script>
<template>
  <Modal class="w-[800px]">
    <div id="printArea" class="w-full">
      <ElDescriptions
        :column="2"
        border
        title="其它收入单报表"
        label-width="100"
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
