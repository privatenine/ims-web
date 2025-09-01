<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ChangeApi } from '#/api/store/change';

import { computed } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteTmById,
  downloadTransferMainList,
  findTmById,
  getTransferCode,
  getTransferMainList,
} from '#/api/store/change';

import { statusFlagMap, useColumns, useGridFormSchema } from './data';
import TransferAudit from './modules/audit.vue';
import TransferDetail from './modules/detail.vue';
import TransferForm from './modules/form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: async ({ page, sort }, formValues: any) => {
          const params: ChangeApi.TransferMainSearchParam = {
            pageNum: page.currentPage || 1,
            pageSize: page.pageSize || 20,
            ...formValues,
          };

          // 处理日期范围转换
          if (
            params.dateRange &&
            Array.isArray(params.dateRange) &&
            params.dateRange.length === 2
          ) {
            const [startDate, endDate] = params.dateRange;
            if (startDate) {
              params.startTime = new Date(startDate).getTime();
            }
            if (endDate) {
              // 将结束日期设置为当天的23:59:59
              const endDateTime = new Date(endDate);
              endDateTime.setHours(23, 59, 59, 999);
              params.endTime = endDateTime.getTime();
            }
            // 删除dateRange字段，避免传递给后端
            delete params.dateRange;
          }

          // 处理排序 - 使用 sort 参数，与参考页面保持一致
          if (sort && sort.field) {
            params.sortParam = {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            };
          }

          const result = await getTransferMainList(params);
          return {
            data: result.data || [],
            total: result.total || 0,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
      trigger: 'row',
    },
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<ChangeApi.TransferMainItem>,

  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<ChangeApi.TransferMainItem>,
});

// 新增对话框
const [TransferFormModal, transferFormModalApi] = useVbenModal({
  connectedComponent: TransferForm,
  destroyOnClose: true,
  centered: true,
});

// 获取当前用户信息
function getCurrentUser() {
  try {
    // 从localStorage获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      return {
        id: parsedUserInfo.userId || parsedUserInfo.id || 0,
        name:
          parsedUserInfo.realName ||
          parsedUserInfo.username ||
          parsedUserInfo.name ||
          '当前用户',
      };
    }

    // 尝试从其他可能的存储位置获取用户信息
    const authInfo =
      localStorage.getItem('auth') || localStorage.getItem('user');
    if (authInfo) {
      const parsedAuth = JSON.parse(authInfo);
      const user = parsedAuth.user || parsedAuth;
      return {
        id: user.userId || user.id || 0,
        name: user.realName || user.username || user.name || '当前用户',
      };
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }

  // 返回默认值
  return {
    id: 0,
    name: '当前用户',
  };
}

// 新增
const onCreate = async () => {
  try {
    // 获取移库单号
    const codeResponse = await getTransferCode();
    const transferCode = codeResponse.data;

    // 获取当前用户信息
    const currentUser = getCurrentUser();

    // 获取当前日期（YYYY-MM-DD格式）
    const currentDate = new Date().toISOString().split('T')[0];

    // 设置初始数据
    const initialData = {
      code: transferCode, // 移库单号
      orderDate: currentDate, // 制单日期（YYYY-MM-DD格式）
      orderCreator: currentUser.name, // 制单人员
      createTime: Date.now(), // 创建时间（时间戳）
      createId: currentUser.id, // 制单人ID
      createName: currentUser.name, // 制单人姓名
      statusFlag: 1, // 草稿状态
      fashion: 'CORRECT', // 默认移库方式改为修正货位
      transferMethod: '修正货位', // 移库方式中文显示
      totalNum: 0, // 总数量
      totalPrice: 0, // 总金额
      remark: '', // 备注
    };

    console.log('初始化移库单数据:', initialData);
    transferFormModalApi.setData(initialData).open();
  } catch (error) {
    console.error('获取移库单号失败:', error);
    ElMessage.error('获取移库单号失败');

    // 即使获取失败，也打开新增对话框，使用默认数据
    const currentUser = getCurrentUser();
    const currentDate = new Date().toISOString().split('T')[0];

    const defaultData = {
      code: '',
      orderDate: currentDate, // 制单日期（YYYY-MM-DD格式）
      orderCreator: currentUser.name, // 制单人员
      createTime: Date.now(),
      createId: currentUser.id,
      createName: currentUser.name,
      statusFlag: 1,
      fashion: 'CORRECT',
      transferMethod: '修正货位',
      totalNum: 0,
      totalPrice: 0,
      remark: '',
    };

    console.log('使用默认数据初始化:', defaultData);
    transferFormModalApi.setData(defaultData).open();
  }
};

// 新增成功
const onFormSuccess = () => {
  gridApi.query();
  ElMessage.success('创建成功');
};

// 获取当前选中行的状态
const getSelectedRowStatus = () => {
  try {
    const selectedRow = gridApi.grid?.getRadioRecord?.();
    return selectedRow ? selectedRow.statusFlag : null;
  } catch (error) {
    console.warn('获取选中行状态失败:', error);
    return null;
  }
};

// 检查是否为完成状态
const isCompleted = computed(() => {
  return getSelectedRowStatus() === 3;
});

// 修改选中行
const onEdit = async () => {
  const selectData = gridApi.grid?.getRadioRecord?.();
  useSelectedRow(selectData)(async (row) => {
    if (![1, 4].includes(row.statusFlag)) {
      ElMessage({
        message: `只能修改草稿或驳回状态的移库单!`,
        type: 'warning',
        plain: true,
      });
      return;
    }

    // 检查是否为完成状态
    if (row.statusFlag === 3) {
      ElMessage({
        message: '移库完成的订单不允许修改!',
        type: 'warning',
        plain: true,
      });
      return;
    }

    try {
      // 获取最新的移库单数据
      const response = await findTmById(row.id);
      transferFormModalApi.setData(response.data).open();
    } catch (error) {
      ElMessage.error('获取移库单数据失败');
      console.error('获取移库单数据失败:', error);
    }
  });
};

// 删除选中行
const onDelete = () => {
  const selectData = gridApi.grid?.getRadioRecord?.();
  useSelectedRow(selectData)(async (row) => {
    // 检查是否为完成状态
    if (row.statusFlag === 3) {
      ElMessage({
        message: '移库完成的订单不允许删除!',
        type: 'warning',
        plain: true,
      });
      return;
    }

    // 调用删除函数
    onDeleteRow(row);
  });
};

// 删除单行数据
const onDeleteRow = (row: ChangeApi.TransferMainItem) => {
  const hideLoading = ElMessage({
    message: `正在删除!`,
    type: 'info',
    plain: true,
    duration: 0,
  });

  deleteTmById(row.id)
    .then(() => {
      ElMessage({
        message: `删除成功!`,
        type: 'success',
        plain: true,
      });
      onRefresh(); // 刷新页面数据并清除选中状态
    })
    .catch(() => {
      ElMessage({
        message: `删除失败!`,
        type: 'error',
        plain: true,
      });
    })
    .finally(() => {
      hideLoading.close();
    });
};

// 详情模态框
const [TransferDetailModal, transferDetailModalApi] = useVbenModal({
  connectedComponent: TransferDetail,
  destroyOnClose: true,
  centered: true,
});

// 详情
const onDetail = async () => {
  useSelectedRow(gridApi.grid?.getRadioRecord?.())(async (data) => {
    try {
      // 获取最新的移库单数据
      const response = await findTmById(data.id);
      transferDetailModalApi.setData(response.data).open();
    } catch (error) {
      ElMessage.error('获取移库单数据失败');
      console.error('获取移库单数据失败:', error);
    }
  });
};

// 审核模态框
const [TransferAuditModal, transferAuditModalApi] = useVbenModal({
  connectedComponent: TransferAudit,
  destroyOnClose: true,
  centered: true,
});

// 审核
const onAudit = async () => {
  const selectData = gridApi.grid?.getRadioRecord?.();
  useSelectedRow(selectData)(async (data) => {
    if ([1, 4].includes(data.statusFlag)) {
      ElMessage.warning('请先提交');
      return;
    }

    // 检查是否为完成状态
    if (data.statusFlag === 3) {
      ElMessage({
        message: '移库完成的订单不允许审核!',
        type: 'warning',
        plain: true,
      });
      return;
    }

    try {
      // 获取最新的移库单数据
      const response = await findTmById(data.id);
      transferAuditModalApi.setData(response.data).open();
    } catch (error) {
      ElMessage.error('获取移库单数据失败');
      console.error('获取移库单数据失败:', error);
    }
  });
};

// 打印
const onPrint = () => {
  ElMessage.info('打印功能待实现');
};

// 下载
const onDownload = async () => {
  try {
    // 构建下载参数 - 暂时使用默认参数，后续可以优化为获取当前查询条件
    const downloadParams: ChangeApi.TransferMainDownloadParam = {
      pageNum: 1,
      pageSize: 10_000, // 设置较大的页面大小以获取所有数据
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    };

    // 显示加载提示
    const loadingMessage = ElMessage({
      message: '正在生成下载文件...',
      type: 'info',
      duration: 0,
    });

    // 调用下载接口
    const response = await downloadTransferMainList(downloadParams);

    // 关闭加载提示
    loadingMessage.close();

    // 创建下载链接
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `移库单据_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.append(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    ElMessage.success('下载成功');
  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('下载失败，请重试');
  }
};

// 刷新函数
const onRefresh = () => {
  gridApi.grid.clearRadioRow();
  gridApi.query();
};
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="移库列表">
      <template #statusFlag="{ row }">
        <ElTag :type="statusFlagMap[row.statusFlag]?.color || 'danger'">
          {{ statusFlagMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <!-- <ElButton
          type="primary"
          @click="onSearch"
          class="mr-2"
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          查询
        </ElButton> -->
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onCreate">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton
            type="primary"
            @click="onEdit"
            :disabled="isCompleted"
            :title="isCompleted ? '移库完成的订单不允许修改' : ''"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton
            type="primary"
            @click="onDelete"
            :disabled="isCompleted"
            :title="isCompleted ? '移库完成的订单不允许删除' : ''"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton type="primary" @click="onDetail">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton
            type="primary"
            @click="onAudit"
            :disabled="isCompleted"
            :title="isCompleted ? '移库完成的订单不允许审核' : ''"
          >
            <IconifyIcon
              icon="icon-park-outline:audit"
              class="size-5"
              style="margin-right: 4px"
            />
            审核
          </ElButton>
          <ElButton type="primary" @click="onPrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
          <ElButton type="primary" @click="onDownload">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>

    <!-- 新增对话框 -->
    <TransferFormModal @success="onFormSuccess" />

    <!-- 详情对话框 -->
    <TransferDetailModal />

    <!-- 审核对话框 -->
    <TransferAuditModal @success="onRefresh" />
  </Page>
</template>
