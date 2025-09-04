<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useQRCode } from '@vueuse/integrations/useQRCode';
import dayjs from 'dayjs';
import {
  ElButton,
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElRow,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInStorageSubByMainId } from '#/api';

const detailData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  // fullscreen: true,
  // fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  confirmText: '关闭',
  draggable: true,
  centered: true,
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
  title: '打印明细',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { title: '序号', type: 'seq', width: 40 },
      {
        field: 'productName',
        title: '产品名称',
        width: 160,
      },
      {
        field: 'productAttachmentNames',
        title: '附件',
        width: 160,
      },
      {
        field: 'productPlaceName',
        title: '产地',
        width: 100,
      },
      {
        field: 'storeName',
        title: '仓库',
        width: 60,
      },
      {
        field: 'siteName',
        title: '货位',
        width: 60,
      },
      {
        field: 'actiNum',
        title: '入库数量',
        width: 80,
      },
      {
        field: 'price',
        title: '单价',
        width: 60,
      },
      {
        field: 'totalPrice',
        title: '金额',
        width: 60,
      },
    ],
    height: 'auto',
    keepSource: true,
    showOverflow: false,

    footerConfig: {
      showFooter: true,
      // 自定义合计行样式
      className: 'grid-footer',
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: ({ page, sort }) => {
          return getInStorageSubByMainId({
            warehousingId: detailData.value.id,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            sortParam: {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            },
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
      // labelField: 'name',
      trigger: 'row',
    },
    pagerConfig: {
      enabled: false,
    },
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    toolbarConfig: {
      custom: false,
      export: false,
      // refresh: { code: 'query' },
      search: false,
      zoom: false,
    },
    showFooter: true,
    // footerData: [
    //   {
    //     productName: '合计',
    //     actiNum: 0,
    //     price: 0,
    //     totalPrice: 0,
    //   },
    // ],
    footerMethod(params) {
      const { data } = params;

      const sum = { actiNum: 0, price: 0, totalPrice: 0 };
      for (const item of data) {
        sum.actiNum += Number(item.actiNum || 0);
        sum.price += Number(item.price || 0);
        sum.totalPrice += Number(item.totalPrice || 0);
      }
      return [{ ...sum, productName: '合计' }];
    },
  } as VxeTableGridOptions<InStorageApi.InStorageSub>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InStorageApi.InStorage }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<InStorageApi.InStorage>,
});

const qrcode = useQRCode('11111', {
  errorCorrectionLevel: 'H',
  margin: 4,
});

onMounted(() => {
  nextTick(() => {
    // const tableData = gridApi.grid.getFullData();
    // console.log('tableData', tableData);
  });
  // gridApi.grid.insertNextAt({ ...data }, tableData?.length - 1);
});

const printArea = { id: 'printArea' };
</script>
<template>
  <Modal class="w-[800px]">
    <div id="printArea">
      <ElRow class="w-full">
        <ElCol :span="2">
          <img :src="qrcode" alt="qrcode" class="h-[130px] w-[130px]" />
        </ElCol>
        <ElCol :span="22">
          <ElDescriptions
            :column="3"
            border
            title="安华易车店 入库单"
            label-width="110"
          >
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">供应商</div>
              </template>
              {{ detailData.supplierName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">经手人</div>
              </template>
              {{ detailData.approveName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">单据日期</div>
              </template>
              {{ dayjs(detailData.createTime).format('YYYY-MM-DD') }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">制单人</div>
              </template>
              {{ detailData.createName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">提货车牌号</div>
              </template>
              {{ detailData.pickUpCarNum }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label-align="right">
              <template #label>
                <div class="cell-item">单据编号</div>
              </template>
              {{ detailData.code }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </ElCol>
      </ElRow>

      <Grid lass="vp-raw h-[500px] w-full" />
    </div>
    <div class="w-full" style="text-align: center">
      <ElButton type="primary" class="mt-4" v-print="printArea">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:print-outline-rounded"
        />打印
      </ElButton>
      <ElButton type="primary" class="mt-4" @click="() => modalApi.close()">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:close"
        />
        关闭
      </ElButton>
    </div>
  </Modal>
</template>
<style lang="css" scoped>
:deep(.el-descriptions__title) {
  width: 100%;
  text-align: center;
}
</style>
