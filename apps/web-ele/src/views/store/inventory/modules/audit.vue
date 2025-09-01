<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElDescriptions,
  ElDescriptionsItem,
  ElMessage,
  ElTag,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveInventory2,
  findIs2List,
  getInventoryMain2,
  rejectInventory2,
} from '#/api/store/check';

import { statusFlagMap } from '../data';
import { useDetailColumns } from './detailData';

const emits = defineEmits(['success']);
const detailData = ref<Record<string, any>>({});
const subData = ref<any[]>([]);

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  draggable: true,
  centered: true,
  width: 1200,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values?.id) {
        await loadDetailData(values.id);
        await loadSubData(values.id, values.code);
      }
    }
  },
  title: '盘盈盘亏审核',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    data: subData,
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
  } as VxeTableGridOptions<any>,
});

// 加载主表详情数据
async function loadDetailData(id: number | string) {
  try {
    const result = await getInventoryMain2(id);
    detailData.value = result.data || {};
  } catch (error) {
    console.error('加载主表数据失败:', error);
    detailData.value = {};
  }
}

// 加载子表数据
async function loadSubData(mainId: number | string, code?: string) {
  try {
    const result = await findIs2List({
      mainId,
      code: code || detailData.value.code || '',
      pageNum: 1,
      pageSize: 1000, // 设置较大的页面大小以获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    });
    subData.value = result.data || [];
    gridApi.grid.loadData(subData.value);
    console.log('加载明细数据成功:', subData.value.length, '条');
  } catch (error) {
    console.error('加载详情数据失败:', error);
    subData.value = [];
    gridApi.grid.loadData([]);
  }
}

// 审核通过
async function handleApprove() {
  if (!detailData.value?.id) {
    ElMessage.error('数据异常，无法审核');
    return;
  }

  try {
    await approveInventory2({ id: detailData.value.id });
    ElMessage.success('审核通过成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('审核通过失败:', error);
    ElMessage.error('审核通过失败');
  }
}

// 审核驳回
async function handleReject() {
  if (!detailData.value?.id) {
    ElMessage.error('数据异常，无法审核');
    return;
  }

  try {
    await rejectInventory2({ id: detailData.value.id });
    ElMessage.success('审核驳回成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('审核驳回失败:', error);
    ElMessage.error('审核驳回失败');
  }
}

defineExpose({
  modalApi,
});

</script>

<template>
  <Modal>
    <div class="p-4">
      <ElDescriptions :column="3" border>
        <ElDescriptionsItem label="单号">
          {{ detailData.code }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="制单人">
          {{ detailData.createName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="制单时间">
          {{
            detailData.createTime
              ? new Date(detailData.createTime).toLocaleDateString()
              : ''
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="仓库">
          {{ detailData.storeName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="库位">
          {{ detailData.storeSiteName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="statusFlagMap[detailData.statusFlag]?.color || 'info'">
            {{ statusFlagMap[detailData.statusFlag]?.name || '未知' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总数量">
          {{ detailData.totalNum || 0 }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总金额">
          {{
            detailData.totalPrice
              ? `￥${Number(detailData.totalPrice).toFixed(2)}`
              : '￥0.00'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注" :span="3">
          {{ detailData.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <div class="mt-4">
        <h3 class="mb-2 text-lg font-semibold">明细信息</h3>
        <Grid />
      </div>

      <!-- 审核按钮 -->
      <div class="mt-4 text-center">
        <ElButtonGroup>
          <ElButton type="success" @click="handleApprove">
            <IconifyIcon
              icon="icon-park-outline:check-one"
              class="size-4"
              style="margin-right: 4px"
            />
            审核通过
          </ElButton>
          <ElButton type="danger" @click="handleReject">
            <IconifyIcon
              icon="icon-park-outline:close-one"
              class="size-4"
              style="margin-right: 4px"
            />
            审核驳回
          </ElButton>
        </ElButtonGroup>
      </div>
    </div>
  </Modal>
</template>
