<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PurchaseReturnApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addPurchaseReturn,
  approvePurchaseReturn,
  createPurchaseReturnSub,
  deletePurchaseReturnSubById,
  getPurchaseReturnPrmById,
  getPurchaseReturnSubList,
  rejectPurchaseReturn,
} from '#/api/purchase/return';
import EmployeeSelectDialog from '#/components/EmployeeSelectDialog.vue';

import { useFormSchema, useSubFormColumns } from '../data';
import InventorySelect from './inventorySelect.vue';
import ReturnSubForm from './returnSubForm.vue';
import SubList from './subList.vue';
import SupplierList from './supplierList.vue';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
// const id = ref<number | null>(null);
// const selectRow = ref();
const [Form, formApi] = useVbenForm({
  // handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
});

const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}退货`;
});

const [Modal, modalApi] = useVbenModal({
  // fullscreen: true,
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<PurchaseReturnApi.PurchaseReturn>();
      formApi.resetForm();

      if (values && values.id) {
        // 如果有ID，调用API获取详细信息
        try {
          const response = await getPurchaseReturnPrmById(values.id);
          formData.value = { ...values, ...response.data };

          // 处理员工信息
          const pickerNames =
            response.data.pickingPersons
              ?.map((p) => p.realName || p.username)
              .join(', ') || '';
          const loaderNames =
            response.data.loadingPersons
              ?.map((p) => p.realName || p.username)
              .join(', ') || '';
          const pickerIds =
            response.data.pickingPersons?.map((p) => p.userId) || [];
          const loaderIds =
            response.data.loadingPersons?.map((p) => p.userId) || [];

          // 更新选中的员工状态
          selectedPickers.value = response.data.pickingPersons || [];
          selectedLoaders.value = response.data.loadingPersons || [];

          // 设置表单值
          formApi.setValues({
            ...response.data,
            pickerName: pickerNames,
            loaderName: loaderNames,
            pickerIds,
            loaderIds,
          });

          // 加载明细数据
          setTimeout(() => {
            gridApi.query();
          }, 100);
        } catch (error) {
          console.error('获取退货单详情失败:', error);
          formData.value = values;
          formApi.setValues(values);
        }
      } else if (values) {
        formData.value = values;
        formApi.setValues(values);
      }

      console.warn('formData:', formData.value);
      console.warn('rights:', formData.value?.rights);
      console.warn('isApproveMode:', formData.value?.isApproveMode);

      // 如果是审批模式，禁用所有可编辑字段
      if (formData.value?.isApproveMode) {
        formApi.updateSchema([
          {
            fieldName: 'supplierName',
            componentProps: {
              disabled: true,
            },
          },
          {
            fieldName: 'pickerName',
            componentProps: {
              disabled: true,
            },
          },
          {
            fieldName: 'loaderName',
            componentProps: {
              disabled: true,
            },
          },
        ]);
      } else {
        formApi.updateSchema([
          {
            fieldName: 'supplierName',
            componentProps: {
              onClick: () => {
                supplierModelApi.open();
              },
            },
          },
          {
            fieldName: 'pickerName',
            componentProps: {
              onClick: () => {
                openPickerDialog();
              },
            },
          },
          {
            fieldName: 'loaderName',
            componentProps: {
              onClick: () => {
                openLoaderDialog();
              },
            },
          },
        ]);
      }
    }
  },
});

// async function onSubmit() {
//   const data = await formApi.getValues<InStorageApi.InStorage>();
//   // console.log('merge', data);
//   // const data = { addWarehousingMainParam: values };

//   modalApi.lock();
//   (formData.value?.id
//     ? updateInStorage({ ...data, id: formData.value.id })
//     : createInStorage({ ...data })
//   )
//     .then(() => {
//       emits('success');
//       modalApi.close();
//     })
//     .finally(() => {
//       modalApi.unlock();
//     });
// }

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useSubFormColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      pageSize: 50,
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }) => {
          if (formData.value?.id) {
            return getPurchaseReturnSubList({
              mainId: getValidMainId(formData.value.id),
              code: formData.value.code,
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              sortParam: {
                field: sort.field,
                type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
              },
            });
          }
          return { data: [], total: 0 };
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
  } as VxeGridListeners<PurchaseReturnApi.PurchaseReturn>,
});

async function save(statusFlag: number) {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  try {
    const currentFormValues = await formApi.getValues();

    // 检查必填字段
    if (!currentFormValues.supplierId) {
      ElMessage({
        message: '请选择供应商',
        type: 'warning',
        plain: true,
      });
      return;
    }

    // 从组件状态获取员工ID，因为formApi可能无法获取到这些动态设置的值
    const pickerIds =
      formData.value.pickerIds ||
      selectedPickers.value.map((emp) => emp.userId) ||
      [];
    const loaderIds =
      formData.value.loaderIds ||
      selectedLoaders.value.map((emp) => emp.userId) ||
      [];

    // 构建API请求参数
    const apiParams = {
      code: currentFormValues.code,
      loadingPersonIds: loaderIds,
      pickingPersonIds: pickerIds,
      printFlag: 0, // 默认打印标志
      printLabel: 0, // 默认打印标签
      remark: currentFormValues.remark || '',
      statusFlag, // 1:保存(草稿) 2:提交(待审批)
      supplierId: currentFormValues.supplierId,
      supplierName: currentFormValues.supplierName,
    };

    console.log('API调用参数:', apiParams);
    console.log('当前表单数据:', currentFormValues);
    console.log('拣货人员IDs:', pickerIds);
    console.log('装货人员IDs:', loaderIds);

    // 调用新增采购退货单接口
    await addPurchaseReturn(apiParams);

    ElMessage({
      message: statusFlag === 1 ? '保存成功' : '提交成功',
      type: 'success',
      plain: true,
    });

    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage({
      message: '操作失败，请重试',
      type: 'error',
      plain: true,
    });
  }
}

const [SupplierModel, supplierModelApi] = useVbenModal({
  connectedComponent: SupplierList,
  destroyOnClose: true,
});

const [PurchaseReturnSubModel, purchaseReturnSubModelApi] = useVbenModal({
  connectedComponent: SubList,
  destroyOnClose: true,
});
function openSub() {
  formApi.getValues().then((data) => {
    if (!data.supplierId) {
      ElMessage({
        message: `请选择供应商`,
        type: 'warning',
        plain: true,
      });
      return;
    }

    // 打开库存选择对话框
    inventorySelectModelApi
      .setData({
        addPurchaseReturnMainParam: data,
      })
      .open();
  });
}

// 处理库存选择结果
function handleInventorySelect(inventoryItem: any) {
  // 将库存信息传递给子表单
  subFormModelApi
    .setData({
      addPurchaseReturnMainParam: formData.value,
      inventoryItem, // 传递选中的库存项目
      id: inventoryItem.id, // 库存记录ID，用作balanceId
      productId: inventoryItem.productId,
      productName: inventoryItem.productName,
      price: inventoryItem.priceReference || 0,
      priceReference: inventoryItem.priceReference || 0,
      storeId: inventoryItem.storeId,
      storeName: inventoryItem.storeName,
      siteName: inventoryItem.siteName,
      productPlaceId: inventoryItem.productPlaceId,
      productPlaceName: inventoryItem.productPlaceName,
      productAttachmentIds: inventoryItem.productAttachmentIds,
      productAttachmentNames: inventoryItem.productAttachmentNames,
      balanceId: inventoryItem.id, // 明确设置balanceId为库存记录ID
      mainId: getValidMainId(formData.value?.id), // 设置mainId为当前退货单ID
      actiNum: 1, // 默认数量为1
      printLabel: 1, // 默认标签数为1
      onSuccess: selectSub,
    })
    .open();
}

async function selectSub(data?: any) {
  if (data) {
    try {
      // 如果有主表ID，则直接创建明细
      if (formData.value?.id) {
        // 获取当前表单数据
        const currentFormData = await formApi.getValues();

        // 构建符合API要求的参数格式
        const createData = {
          actiNum: data.actiNum || 0,
          addPurchaseReturnMainParam: {
            code: currentFormData.code || '',
            loadingPersonIds: currentFormData.loaderIds || [],
            pickingPersonIds: currentFormData.pickerIds || [],
            printFlag: currentFormData.printFlag || 0,
            printLabel: currentFormData.printLabel || 0,
            remark: currentFormData.remark || '',
            statusFlag: currentFormData.statusFlag || 1,
            supplierId: currentFormData.supplierId || 0,
            supplierName: currentFormData.supplierName || '',
          },
          balanceId: data.id || 0, // 使用选择的库存记录ID
          code: currentFormData.code || '',
          formCode: data.formCode || '',
          formId: 0, // 设置为0
          mainId: getValidMainId(formData.value.id),
          num: data.num || 0,
          price: data.price || 0,
          priceReference: data.priceReference || 0,
          productAttachmentIds: data.productAttachmentIds || '',
          productAttachmentNames: data.productAttachmentNames || '',
          productId: data.productId || 0,
          productName: data.productName || '',
          productPlaceId: data.productPlaceId || 0,
          remark: data.remark || '',
          siteName: data.siteName || '',
          statusFlag: currentFormData.statusFlag || 1,
          storeId: data.storeId || 0,
        };

        await createPurchaseReturnSub(createData);
        ElMessage({
          message: '明细添加成功!',
          type: 'success',
          plain: true,
        });
        // 重新加载明细列表
        gridApi.query();
      } else {
        // 如果没有主表ID，先插入到表格中，保存主表时一起保存
        gridApi.grid.insertNextAt(data, gridApi.grid.getRadioRecord());
        ElMessage({
          message: '明细添加成功!',
          type: 'success',
          plain: true,
        });
      }
    } catch (error) {
      console.error('明细添加失败:', error);
      ElMessage({
        message: '明细添加失败!',
        type: 'error',
        plain: true,
      });
    }
  }
}

function handleDelete() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage({
      message: '请选择要删除的明细行!',
      type: 'warning',
      plain: true,
    });
    return;
  }

  useSelectedRow(selectedRow)((data) => {
    deletePurchaseReturnSubById({ id: data.id })
      .then(() => {
        gridApi.grid.remove(data);
        ElMessage({
          message: '删除成功!',
          type: 'success',
          plain: true,
        });
      })
      .catch(() => {
        ElMessage({
          message: '删除失败!',
          type: 'error',
          plain: true,
        });
      });
  });
}

const [SubFormModel, subFormModelApi] = useVbenModal({
  connectedComponent: ReturnSubForm,
  destroyOnClose: true,
});

const [InventorySelectModel, inventorySelectModelApi] = useVbenModal({
  connectedComponent: InventorySelect,
  destroyOnClose: true,
});

// 员工选择对话框状态
const pickerDialogVisible = ref(false);
const loaderDialogVisible = ref(false);
const currentSelectType = ref<'loader' | 'picker'>('picker');

// 存储选中的员工数据
const selectedPickers = ref<any[]>([]);
const selectedLoaders = ref<any[]>([]);

// 辅助函数：处理mainId，确保0或无效值时返回undefined
function getValidMainId(id: any): number | undefined {
  if (id === 0 || id === null || id === undefined || id === '') {
    return undefined;
  }
  return Number(id);
}

// 打开拣货人员选择对话框
function openPickerDialog() {
  currentSelectType.value = 'picker';
  pickerDialogVisible.value = true;
}

// 打开装货人员选择对话框
function openLoaderDialog() {
  currentSelectType.value = 'loader';
  loaderDialogVisible.value = true;
}

// 处理员工选择（支持多选）
function handleEmployeeSelect(employees: any[]) {
  console.log(
    '员工选择回调，类型:',
    currentSelectType.value,
    '员工:',
    employees,
  );

  if (currentSelectType.value === 'picker') {
    selectedPickers.value = employees;
    const names = employees
      .map((emp) => emp.realName || emp.username)
      .join(', ');
    const ids = employees.map((emp) => emp.userId);

    // 更新表单显示
    formApi.setValues({
      pickerName: names,
    });

    // 更新组件状态，确保save函数能获取到正确的ID
    formData.value.pickerIds = ids;

    console.log('拣货人员设置完成 - 姓名:', names, 'IDs:', ids);
    console.log('formData.value.pickerIds:', formData.value.pickerIds);
    pickerDialogVisible.value = false;
  } else if (currentSelectType.value === 'loader') {
    selectedLoaders.value = employees;
    const names = employees
      .map((emp) => emp.realName || emp.username)
      .join(', ');
    const ids = employees.map((emp) => emp.userId);

    // 更新表单显示
    formApi.setValues({
      loaderName: names,
    });

    // 更新组件状态，确保save函数能获取到正确的ID
    formData.value.loaderIds = ids;

    console.log('装货人员设置完成 - 姓名:', names, 'IDs:', ids);
    console.log('formData.value.loaderIds:', formData.value.loaderIds);
    loaderDialogVisible.value = false;
  }
}
function selectSubForm() {
  const selectedRow = gridApi.grid.getRadioRecord();
  if (!selectedRow) {
    ElMessage({
      message: '请选择要修改的明细行!',
      type: 'warning',
      plain: true,
    });
    return;
  }

  useSelectedRow(selectedRow)((data) =>
    subFormModelApi
      .setData({
        ...data,
        addPurchaseReturnMainParam: formData.value,
      })
      .open(),
  );
}

// 审批通过
async function handleApprove() {
  try {
    // 从formData中获取当前退货单的详细信息，包括version
    const currentData = formData.value;

    // 调用审核通过接口
    await approvePurchaseReturn({
      id: currentData.id,
      version: currentData.version || 1,
    });

    ElMessage({
      message: '审批通过成功!',
      type: 'success',
      plain: true,
    });

    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('审批通过失败:', error);
    ElMessage({
      message: '审批通过失败，请重试',
      type: 'error',
      plain: true,
    });
  }
}

// 审批驳回
async function handleReject() {
  try {
    // 从formData中获取当前退货单的详细信息，包括version
    const currentData = formData.value;

    // 调用驳回接口
    await rejectPurchaseReturn({
      id: currentData.id,
      version: currentData.version || 1,
    });

    ElMessage({
      message: '驳回成功!',
      type: 'success',
      plain: true,
    });

    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('驳回失败:', error);
    ElMessage({
      message: '驳回失败，请重试',
      type: 'error',
      plain: true,
    });
  }
}
</script>
<template>
  <Modal :title="getDrawerTitle" class="max-h-5/6 h-5/6 w-4/5">
    <Form />
    <SubFormModel @success="selectSub" />
    <InventorySelectModel @select="handleInventorySelect" />
    <SupplierModel
      @select="
        (data) =>
          formApi.setValues({
            supplierId: data?.id || '',
            supplierName: data?.fullName || '',
          })
      "
    />
    <PurchaseReturnSubModel @select="selectSub" />

    <!-- 员工选择对话框 -->
    <EmployeeSelectDialog
      v-model="pickerDialogVisible"
      title="选择拣货人员"
      @select="handleEmployeeSelect"
    />
    <EmployeeSelectDialog
      v-model="loaderDialogVisible"
      title="选择装货人员"
      @select="handleEmployeeSelect"
    />
    <!-- <ElDescriptions :column="4" border label-width="110">
      <ElDescriptionsItem label-align="right">
        <template #label>
          <div class="cell-item">金额</div>
        </template>
        200
      </ElDescriptionsItem>
      <ElDescriptionsItem label-align="right">
        <template #label>
          <div class="cell-item">数量</div>
        </template>
        100
      </ElDescriptionsItem>
    </ElDescriptions> -->
    <ElButtonGroup class="ml-4">
      <!-- 审批模式下的按钮 -->
      <template v-if="formData.isApproveMode">
        <ElButton type="primary" @click="handleReject">
          <IconifyIcon
            icon="material-symbols:cancel-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          驳回
        </ElButton>
        <ElButton type="primary" @click="handleApprove">
          <IconifyIcon
            icon="material-symbols:check-circle-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          通过
        </ElButton>
      </template>

      <!-- 正常模式下的按钮 -->
      <template v-else>
        <ElButton type="primary" @click="save(1)">
          <IconifyIcon
            icon="material-symbols:save-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          保存草稿
        </ElButton>
        <ElButton type="success" @click="save(2)">
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="material-symbols:send-outline"
          />
          提交审批
        </ElButton>
        <ElButton
          type="primary"
          disabled
          v-if="formData.rights?.includes('采购明细')"
        >
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="ant-design:plus-outlined"
          />
          采购退货
        </ElButton>
        <ElButton type="primary" @click="openSub">
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="ant-design:plus-outlined"
          />
          新增明细
        </ElButton>
        <ElButton type="primary" @click="selectSubForm">
          <IconifyIcon
            icon="line-md:edit-twotone"
            class="size-5"
            style="margin-right: 4px"
          />
          修改明细
        </ElButton>
        <ElButton type="danger" @click="handleDelete">
          <IconifyIcon
            icon="mdi:trash-can-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          删除明细
        </ElButton>
      </template>
    </ElButtonGroup>
    <Grid table-title="明细列表" class="p-raw h-full w-full">
      <template #siteName="{ row }">
        {{ row.siteName ? `#${row.siteName}` : '' }}
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
