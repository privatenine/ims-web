import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PurchaseReturnApi, SupplierApi } from '#/api';

import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approvePurchaseReturn,
  deletePurchaseReturnPrmById,
  getPurchaseReturnCode,
  getPurchaseReturnList,
  rejectPurchaseReturn,
} from '#/api/purchase/return';
import { statusFlagMap, useMenuRights } from '#/utils';

import SupplierList from '../../inStorage/modules/supplierList.vue';
import { useColumns, useGridFormSchema } from '../data';

export function useReturnLogic() {
  const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

  // 防止重复初始化和重复请求的标志
  let isInitialized = false;
  const isQuerying = ref(false);

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

  // 网格配置
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      schema: useGridFormSchema(),
      submitOnChange: false,
      fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'X']],
      wrapperClass: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-4',
    },
    gridOptions: {
      columns: useColumns(),
      height: 'auto',
      keepSource: true,
      showOverflow: false,
      pagerConfig: {
        pageSize: 40,
        pageSizes: [10, 15, 20, 40, 50, 100],
      },
      proxyConfig: {
        response: {
          result: 'data',
          total: 'total',
          list: 'data',
        },
        ajax: {
          query: async ({ page, sort }, formValues: any) => {
            // 防止重复请求
            if (isQuerying.value) {
              console.warn(
                'Query already in progress, skipping duplicate request',
              );
              return { data: [], total: 0 };
            }

            try {
              isQuerying.value = true;
              console.warn('Executing query:', { page, sort, formValues });

              // 处理日期范围参数
              const { dateRange, ...otherParams } = formValues;
              let endTime: number | undefined, startTime: number | undefined;

              if (
                dateRange &&
                Array.isArray(dateRange) &&
                dateRange.length === 2
              ) {
                startTime = dateRange[0];
                endTime = dateRange[1];
              }

              const result = await getPurchaseReturnList({
                ...otherParams,
                startTime,
                endTime,
                pageNum: page.currentPage,
                pageSize: page.pageSize,
                sortParam: sort.field
                  ? {
                      field: sort.field,
                      type: sort.order === 'asc' ? 1 : -1,
                    }
                  : undefined,
              });

              return result;
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
    } as VxeTableGridOptions<PurchaseReturnApi.PurchaseReturn>,
    gridEvents: {
      sortChange({ column }) {
        const field = column?.field;
        const order = column?.order;

        if (field && order) {
          gridApi.query();
        }
      },
    } as VxeGridListeners<PurchaseReturnApi.PurchaseReturn>,
  });

  // 供应商选择模态框
  const [SupplierModel, supplierModelApi] = useVbenModal({
    connectedComponent: SupplierList,
    destroyOnClose: true,
    centered: true,
  });

  // 组件挂载时的初始化
  onMounted(() => {
    if (!isInitialized) {
      isInitialized = true;

      nextTick(() => {
        gridApi.formApi.updateSchema([
          {
            fieldName: 'supplierName',
            componentProps: {
              onClick: () => {
                supplierModelApi.open();
              },
            },
          },
        ]);

        nextTick(() => {
          initializeData();
        });
      });
    }
  });

  // 刷新数据
  function onRefresh() {
    gridApi.grid.clearRadioRow();
    if (!isQuerying.value) {
      gridApi.query();
    }
  }

  // 手动搜索
  function onSearch() {
    if (!isQuerying.value) {
      gridApi.query();
    }
  }

  // 初始化页面数据
  function initializeData() {
    if (!isQuerying.value) {
      setTimeout(() => {
        gridApi.query();
      }, 100);
    }
  }

  // 供应商选择处理
  function handleSupplierSelect(data: SupplierApi.Supplier) {
    gridApi.formApi.setValues({
      supplierName: data?.fullName || '',
    });
  }

  // 删除选中行
  function deleteSelectRow() {
    useSelectedRow(gridApi.grid.getRadioRecord())(
      onDelete as (data: PurchaseReturnApi.PurchaseReturn | undefined) => void,
      true,
    );
  }

  // 删除操作
  function onDelete(row: PurchaseReturnApi.PurchaseReturn) {
    const hideLoading = ElMessage({
      message: '正在删除!',
      type: 'info',
      plain: true,
      duration: 0,
    });

    deletePurchaseReturnPrmById(row.id)
      .then(() => {
        ElMessage({
          message: '删除成功!',
          type: 'success',
          plain: true,
        });
        onRefresh();
      })
      .catch(() => {
        ElMessage({
          message: '删除失败!',
          type: 'error',
          plain: true,
        });
      })
      .finally(() => {
        hideLoading.close();
      });
  }

  // 编辑选中行
  function handleUpdate(formModelApi: any) {
    const selectData = gridApi.grid.getRadioRecord();
    useSelectedRow(selectData)((row) => {
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

  // 创建新记录
  function onCreate(formModelApi: any) {
    getPurchaseReturnCode().then(({ data }: { data: string }) => {
      const currentUser = getCurrentUser();
      formModelApi
        .setData({
          code: data,
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

  // 打开详情
  function openDetail(detailModelApi: any) {
    useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
      detailModelApi.setData(data).open(),
    );
  }

  // 审核操作
  function openAudit(auditModelApi: any) {
    const selectData = gridApi.grid.getRadioRecord();
    useSelectedRow(selectData)((data) => {
      if (data.statusFlag === 1) {
        ElMessage.warning('请先提交');
        return;
      }
      auditModelApi.setData(data).open();
    });
  }

  // 审核通过
  function approvePurchaseReturnOrder() {
    const selectData = gridApi.grid.getRadioRecord();
    useSelectedRow(selectData)((data) => {
      if (data.statusFlag !== 2) {
        ElMessage.warning('只能审核待审批状态的退货单');
        return;
      }

      const hideLoading = ElMessage({
        message: '正在审核...',
        type: 'info',
        plain: true,
        duration: 0,
      });

      approvePurchaseReturn({
        id: data.id,
        version: data.version || 1,
      })
        .then(() => {
          ElMessage({
            message: '审核成功!',
            type: 'success',
            plain: true,
          });
          onRefresh();
        })
        .catch(() => {
          ElMessage({
            message: '审核失败!',
            type: 'error',
            plain: true,
          });
        })
        .finally(() => {
          hideLoading.close();
        });
    });
  }

  // 驳回操作
  function rejectPurchaseReturnOrder() {
    const selectData = gridApi.grid.getRadioRecord();
    useSelectedRow(selectData)((data) => {
      if (data.statusFlag !== 2) {
        ElMessage.warning('只能驳回待审批状态的退货单');
        return;
      }

      const hideLoading = ElMessage({
        message: '正在驳回...',
        type: 'info',
        plain: true,
        duration: 0,
      });

      rejectPurchaseReturn({
        id: data.id,
        version: data.version || 1,
      })
        .then(() => {
          ElMessage({
            message: '驳回成功!',
            type: 'success',
            plain: true,
          });
          onRefresh();
        })
        .catch(() => {
          ElMessage({
            message: '驳回失败!',
            type: 'error',
            plain: true,
          });
        })
        .finally(() => {
          hideLoading.close();
        });
    });
  }

  return {
    // 数据
    Grid,
    gridApi,
    SupplierModel,
    supplierModelApi,
    rights,
    isQuerying,
    statusFlagMap,

    // 方法
    onRefresh,
    onSearch,
    handleSupplierSelect,
    deleteSelectRow,
    handleUpdate,
    onCreate,
    openDetail,
    openAudit,
    approvePurchaseReturnOrder,
    rejectPurchaseReturnOrder,
  };
}
