<script lang="ts" setup>
import type { ChangeApi } from '#/api/store/change';

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
  approveTransferMain,
  findTsList,
  rejectTransferMain,
} from '#/api/store/change';

import { statusFlagMap, useDetailColumns } from '../data';

const emits = defineEmits(['success']);

const detailData = ref<ChangeApi.TransferMainItem>();
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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<ChangeApi.TransferMainItem>();
      if (values) {
        detailData.value = values;
        loadDetailData(values.id);
      }
    }
  },
  title: '移库审核',
});

// 加载详情数据
async function loadDetailData(id: number) {
  try {
    // 使用新的接口获取明细数据
    const response = await findTsList({
      mainId: id,
      pageNum: 1,
      pageSize: 1000, // 设置较大的页面大小以获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    });

    if (response.data && Array.isArray(response.data)) {
      // 转换明细数据为表格期望的格式
      const transformedDetails = response.data.map((item: any) => ({
        id: item.id,
        productId: item.productId || 0,
        productName: item.productName || '',
        attachment: item.productAttachmentNames || item.attachment || '',
        origin: item.productPlaceName || item.origin || '',
        oldWarehouseName: item.oldStoreName || item.oldWarehouseName || '',
        oldWarehouseLocation:
          item.oldStoreSiteName || item.oldWarehouseLocation || '',
        transferQuantity: item.num || item.transferQuantity || 0,
        newWarehouse: item.newStoreName || item.newWarehouse || '',
        newWarehouseLocation:
          item.newStoreSiteName || item.newWarehouseLocation || '',
        transferMainId: item.mainId || item.transferMainId || id,
        // 新增字段映射
        actiNum: item.actiNum || 0,
        balanceId: item.balanceId || 0,
        price: item.price || 0,
        totalPrice: item.totalPrice || 0,
        supplierName: item.supplierName || '',
        remark: item.remark || '',
      }));

      subData.value = transformedDetails;

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData(transformedDetails);
      }

      console.log('成功加载明细数据:', transformedDetails);
    } else {
      console.log('没有明细数据或数据格式错误');
      subData.value = [];
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData([]);
      }
    }
  } catch (error) {
    console.error('加载详情数据失败:', error);
    subData.value = [];
    if (detailGridApi && detailGridApi.grid) {
      detailGridApi.grid.reloadData([]);
    }
  }
}

const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 300,
    keepSource: true,
    showOverflow: false,
    data: subData.value,
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: false,
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
  },
});

// 审核通过
async function onApprove() {
  if (!detailData.value) return;

  try {
    await approveTransferMain({
      mainId: detailData.value.id,
      version: detailData.value.version || 1,
    });

    ElMessage.success('审核通过成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('审核通过失败:', error);
    ElMessage.error('审核通过失败');
  }
}

// 驳回
async function onReject() {
  if (!detailData.value) return;

  try {
    await rejectTransferMain({
      mainId: detailData.value.id,
      version: detailData.value.version || 1,
    });

    ElMessage.success('驳回成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('驳回失败:', error);
    ElMessage.error('驳回失败');
  }
}
</script>

<script lang="ts">
export default { name: 'TransferAudit' };
</script>

<template>
  <Modal class="max-h-5/6 h-5/6">
    <div class="audit-container">
      <!-- 主信息 -->
      <ElDescriptions title="审核信息" :column="3" border>
        <ElDescriptionsItem label="移库单号">
          {{ detailData?.code || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="移库状态">
          <ElTag
            :type="statusFlagMap[detailData?.statusFlag || 1]?.color || 'info'"
          >
            {{ statusFlagMap[detailData?.statusFlag || 1]?.name || '未知' }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="总数量">
          {{ detailData?.totalNum || 0 }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="操作员">
          {{ detailData?.createName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="操作日期">
          {{
            detailData?.createTime
              ? new Date(detailData.createTime).toLocaleString()
              : '-'
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="当前审批人">
          {{ detailData?.approveName || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="备注" :span="3">
          {{ detailData?.remark || '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <!-- 操作按钮 -->
      <div class="audit-actions mt-4">
        <ElButtonGroup>
          <ElButton type="primary" @click="onReject">
            <IconifyIcon icon="ant-design:close-outlined" class="mr-1" />
            驳回
          </ElButton>
          <ElButton type="primary" @click="onApprove">
            <IconifyIcon icon="ant-design:check-outlined" class="mr-1" />
            审核通过
          </ElButton>
        </ElButtonGroup>
      </div>

      <!-- 明细列表 -->
      <div class="detail-list mt-4">
        <DetailGrid table-title="移库明细" class="w-full" />
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.audit-container {
  padding: 16px;
}

.audit-actions {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.detail-list {
  margin-top: 20px;
}

:deep(.el-descriptions__title) {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}
</style>
