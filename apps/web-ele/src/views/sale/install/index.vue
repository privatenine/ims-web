<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InstallApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteInstallOrderById, getInstallOrderList } from '#/api';
import { useMenuRights } from '#/utils';

import { installStatusMap, useColumns, useGridFormSchema } from './data';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

// 定义一个标志来防止重复初始化
let isInitialized = false;

onMounted(() => {
  if (!isInitialized) {
    isInitialized = true;
    // 初始化页面数据
    nextTick(() => {
      initializeData();
    });
  }
});

// 防止重复请求的标志
const isQuerying = ref(false);

// 选中行数据
const selectedRow = ref<InstallApi.InstallOrderRespVO | null>(null);

// 演示数据已移除，现在使用真实API

const [Grid, gridApi] = useVbenVxeGrid<InstallApi.InstallOrderRespVO>({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
    fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'X']],
    wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-6',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 20,
      pageSizes: [10, 20, 30, 50, 100],
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          // 防止重复请求
          if (isQuerying.value) {
            console.warn(
              'Query already in progress, skipping duplicate request',
            );
            return {
              data: [],
              total: 0,
            };
          }

          try {
            isQuerying.value = true;
            console.log('执行查询:', { page, sort, formValues });

            // 处理日期范围
            let endTime, startTime;
            if (formValues.startTime) {
              startTime = new Date(formValues.startTime).getTime();
            }
            if (formValues.endTime) {
              endTime = new Date(formValues.endTime).getTime();
            }

            const params: InstallApi.InstallOrderSearchParam = {
              pageNum: page.currentPage || 1,
              pageSize: page.pageSize || 20,
              code: formValues.code || undefined,
              custId: formValues.custId || undefined,
              productName: formValues.productName || undefined,
              statusFlag: formValues.statusFlag || undefined,
              saleCode: formValues.saleCode || undefined,
              installCarNum: formValues.installCarNum || undefined,
              startTime: startTime || undefined,
              endTime: endTime || undefined,
              sortParam:
                sort && sort.field
                  ? {
                      field: sort.field,
                      type: sort.order === 'asc' ? 0 : 1, // 根据接口文档调整排序类型
                    }
                  : undefined,
            };

            const response = await getInstallOrderList(params);

            return {
              data: response.data || [],
              total: response.total || 0,
            };
          } catch (error) {
            console.error('获取安装订单列表失败:', error);
            ElMessage.error('获取数据失败');
            return {
              data: [],
              total: 0,
            };
          } finally {
            isQuerying.value = false;
          }
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
  } as VxeTableGridOptions<InstallApi.InstallOrderRespVO>,
  gridEvents: {
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
    radioChange({ row }) {
      selectedRow.value = row;
    },
  } as VxeGridListeners<InstallApi.InstallOrderRespVO>,
});

function onRefresh() {
  gridApi.grid.clearRadioRow();
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 手动搜索函数
function onSearch() {
  if (!isQuerying.value) {
    gridApi.query();
  }
}

// 初始化页面数据
function initializeData() {
  if (!isQuerying.value) {
    // 延迟执行，确保表单初始化完成
    setTimeout(() => {
      gridApi.query();
    }, 100);
  }
}

// 安装上报模态框
const [ReportModal, reportModalApi] = useVbenModal({
  destroyOnClose: true,
  centered: true,
});

// 新增
function onCreate() {
  ElMessage.info('新增功能待开发');
}

// 修改
function onEdit() {
  if (!selectedRow.value) {
    ElMessage.warning('请先选择一行数据');
    return;
  }
  ElMessage.info('修改功能待开发');
}

// 删除
async function onDelete() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)(async (data) => {
    try {
      await ElMessageBox.confirm('确定要删除选中的安装单吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });

      const response = await deleteInstallOrderById({ id: data.id! });
      if (response && (response as any).code === 1) {
        ElMessage.success('删除成功');
        onRefresh();
      } else {
        ElMessage.error((response as any).msg || '删除失败');
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error);
        ElMessage.error('删除失败');
      }
    }
  });
}

// 查看详情
function onDetail() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.info(`查看安装单详情: ${data.code}`);
    // 这里可以实现详情弹窗逻辑
  });
}

// 安装上报
function onReport() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    if (data.statusFlag !== 1) {
      ElMessage.warning('只有草稿状态的订单才能进行安装上报');
      return;
    }
    ElMessage.success('安装上报成功（演示）');
    // TODO: 实现安装上报功能
  });
}

// 下载照片
function onDownloadPhotos() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.success('照片下载成功（演示）');
    // TODO: 实现下载照片功能
  });
}

// 打印
function onPrint() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    ElMessage.info(`打印安装单: ${data.code}`);
    // 这里可以实现打印逻辑
  });
}

// 获取标签类型的函数
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
  return validTypes.includes(color as any) ? (color as any) : 'info';
}
</script>

<template>
  <Page auto-content-height>
    <ReportModal />
    <Grid table-title="安装订单列表" class="w-full">
      <!-- 状态列模板 -->
      <template #statusFlag="{ row }">
        <ElTag :type="getTagType(installStatusMap[row.statusFlag]?.color)">
          {{ installStatusMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>

      <template #toolbar-tools>
        <ElButton
          type="primary"
          @click="onSearch"
          class="mr-2"
          :loading="isQuerying"
        >
          <IconifyIcon
            icon="material-symbols:search-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          查询
        </ElButton>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onCreate">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary" @click="onEdit">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" @click="onDelete">
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
          <ElButton type="primary" @click="onReport">
            <IconifyIcon
              icon="material-symbols:upload-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            安装上报
          </ElButton>
          <ElButton type="primary" @click="onDownloadPhotos">
            <IconifyIcon
              icon="material-symbols:download-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            下载照片
          </ElButton>
          <ElButton type="primary" @click="onPrint">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="css">
.el-button-group .el-button--primary:last-child {
  border-radius: 0;
}

:deep(.el-button-group .el-button--primary:first-child) {
  border-left: var(--el-button-divide-border-color) 1px solid;
  border-radius: 0;
}
</style>
