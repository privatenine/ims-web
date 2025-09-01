<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElTag,
} from 'element-plus';

import { useSelectedRow } from '#/adapter/vxe-table';
import { getPurchaseReturnCode } from '#/api/purchase/return';

import { useReturnLogic } from './composables/useReturnLogic';

// 动态导入模态框组件
const Form = defineAsyncComponent(() => import('./modules/form.vue'));
const Detail = defineAsyncComponent(() => import('./modules/detail.vue'));
const Audit = defineAsyncComponent(() => import('./modules/audit.vue'));
const DetailPrint = defineAsyncComponent(
  () => import('./modules/detailPrint.vue'),
);

// 使用业务逻辑 hook
const {
  Grid,
  gridApi,
  SupplierModel,
  rights,
  isQuerying,
  statusFlagMap,
  onRefresh,
  onSearch,
  handleSupplierSelect,
  deleteSelectRow,
  approvePurchaseReturnOrder,
  rejectPurchaseReturnOrder,
} = useReturnLogic();

// 表单模态框
const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  centered: true,
  draggable: true,
  fullscreen: false,
  fullscreenButton: true,
});

// 详情模态框
const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
  draggable: true,
  fullscreen: false,
  fullscreenButton: true,
});

// 审核模态框
const [AuditModel, auditModelApi] = useVbenModal({
  connectedComponent: Audit,
  destroyOnClose: true,
  centered: true,
  draggable: true,
});

// 打印模态框
const [DetailPrintModel, detailPrintModelApi] = useVbenModal({
  connectedComponent: DetailPrint,
  destroyOnClose: true,
  centered: true,
  draggable: true,
  fullscreen: false,
  fullscreenButton: true,
});

// 获取当前用户信息
function getCurrentUser() {
  // 这里应该从用户store或localStorage获取当前用户信息
  // 暂时返回模拟数据，实际项目中需要替换为真实的用户信息获取逻辑
  return {
    id: 1,
    name: '当前用户', // 这里应该获取真实的用户名
    // 其他用户信息...
  };
}

// 封装操作方法
function handleCreate() {
  getPurchaseReturnCode().then((response: any) => {
    const currentUser = getCurrentUser();
    formModelApi
      .setData({
        code: response.data,
        createTime: new Date().toISOString().split('T')[0], // 当前日期 YYYY-MM-DD
        createName: currentUser.name, // 制单员为当前用户
        rights: [...rights.value],
        // 设置默认的员工ID
        pickerIds: [4, 6], // 默认拣货人员ID
        loaderIds: [3, 5], // 默认装货人员ID
      })
      .open();
  });
}

function handleEdit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((row: any) => {
    if (row.statusFlag !== 1 && row.statusFlag !== 4) {
      ElMessage({
        message: '只能修改草稿状态或驳回状态的退货单!',
        type: 'warning',
        plain: true,
      });
      return;
    }
    formModelApi.setData({ ...row, rights: [...rights.value] }).open();
  });
}

function handleDetail() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data: any) =>
    detailModelApi.setData(data).open(),
  );
}

function handleAudit() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data: any) => {
    if (data.statusFlag !== 2) {
      ElMessage({
        message: '只能审核待审批状态的退货单!',
        type: 'warning',
        plain: true,
      });
      return;
    }
    // 打开审批对话框，传递数据并设置审批模式
    formModelApi
      .setData({
        ...data,
        rights: [...rights.value],
        isApproveMode: true, // 标记为审批模式
      })
      .open();
  });
}

function handleDetailPrint() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data: any) =>
    detailPrintModelApi.setData(data).open(),
  );
}

// 获取ElTag的正确类型
function getTagType(
  color?: string,
): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  const validTypes = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ] as const;
  return validTypes.includes(color as any) ? (color as any) : 'danger';
}
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <SupplierModel @select="handleSupplierSelect" />
    <DetailModel />
    <AuditModel @success="onRefresh" />
    <DetailPrintModel />
    <Grid table-title="采购退货单列表" class="w-full">
      <template #statusFlag="{ row }">
        <ElTag :type="getTagType(statusFlagMap[row.statusFlag]?.color)">
          {{ statusFlagMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #createTime="{ row }">
        {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
      </template>

      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="handleCreate"
            v-if="rights.includes('新增')"
          >
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton
            type="primary"
            @click="handleEdit"
            v-if="rights.includes('修改')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" @click="handleAudit">
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载数据
          </ElButton>
          <ElButton
            type="primary"
            @click="handleDetail"
            v-if="rights.includes('详情')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton
            type="success"
            @click="approvePurchaseReturnOrder"
            v-if="rights.includes('审核')"
          >
            <IconifyIcon
              icon="material-symbols:check-circle-outline"
              class="size-5"
              style="margin-right: 4px"
            />
            审核通过
          </ElButton>
          <ElButton
            type="warning"
            @click="rejectPurchaseReturnOrder"
            v-if="rights.includes('审核')"
          >
            <IconifyIcon
              icon="material-symbols:cancel-outline"
              class="size-5"
              style="margin-right: 4px"
            />
            驳回
          </ElButton>
          <ElButton
            type="danger"
            @click="deleteSelectRow"
            v-if="rights.includes('删除')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
        </ElButtonGroup>
        <ElDropdown
          split-button
          type="primary"
          v-if="
            rights.includes('带价单据') ||
            rights.includes('数量单据') ||
            rights.includes('单一标签') ||
            rights.includes('整单标签')
          "
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="material-symbols:print-outline-rounded"
          />
          打印
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                @click="handleDetailPrint"
                v-if="rights.includes('带价单据')"
              >
                价格退货
              </ElDropdownItem>
              <ElDropdownItem
                @click="handleDetailPrint"
                v-if="rights.includes('数量单据')"
              >
                一般退货
              </ElDropdownItem>
              <ElDropdownItem
                @click="handleDetailPrint"
                v-if="rights.includes('单一标签')"
              >
                单一标签
              </ElDropdownItem>
              <ElDropdownItem
                @click="handleDetailPrint"
                v-if="rights.includes('整单标签')"
              >
                整个标签
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </Grid>
  </Page>
</template>
<style scoped lang="css">
.el-button-group .el-button--primary:last-child {
  border-radius: 0;
}

:deep(.el-dropdown .el-button-group .el-button--primary:first-child) {
  border-left: var(--el-button-divide-border-color) 1px solid;
  border-radius: 0;
}
</style>
