<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi, SupplierApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createInStorage,
  deleteInStorageSubById,
  getInStorageSubByMainId,
  updateInStorage,
} from '#/api';

import { useFormSchema, useSubFormColumns } from '../data';
import SubForm from './subForm.vue';
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
  return `${formData.value?.id ? '修改' : '新增'}入库`;
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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<InStorageApi.InStorage>();
      formApi.resetForm();
      if (values) {
        formData.value = values;
        formApi.setValues(values);
      }
      console.warn(444, formData.value);
      formApi.updateSchema([
        {
          fieldName: 'supplierName',
          componentProps: {
            onClick: () => {
              supplierModelApi.open();
            },
          },
        },
        // {
        //   fieldName: 'supplierName',
        //   componentProps: {
        //     onClick: () => {
        //       supplierModelApi.open();
        //     },
        //   },
        // },
      ]);
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
            return getInStorageSubByMainId({
              warehousingId: formData.value.id,
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              sortParam: {
                field: sort.field,
                type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
              },
            });
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
  } as VxeTableGridOptions<InStorageApi.InStorage>,
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

async function save(statusFlag: number) {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  formApi.getValues<InStorageApi.InStorage>().then((data) => {
    const tableData = gridApi.grid.getFullData();
    (tableData.length === 0
      ? createInStorage({ ...data, statusFlag })
      : updateInStorage({ ...data, statusFlag, id: formData.value.id })
    ).then(() => {
      ElMessage({
        message: `提交成功`,
        type: 'success',
        plain: true,
      });
      emits('success');
      modalApi.close();
    });
  });
}

const [SupplierModel, supplierModelApi] = useVbenModal({
  connectedComponent: SupplierList,
  destroyOnClose: true,
  centered: true,
});

// SubList组件引用
const subListRef = ref();

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
    // 通过SubList组件的modalApi打开对话框
    if (subListRef.value) {
      subListRef.value.modalApi.setData(data).open();
    }
  });
}

// 处理SubList的选择结果
function handleSubListSelect(data: any) {
  console.log('选择的产品:', data);
  // 处理选择的产品数据，调用原有的selectSub方法
  selectSub(data);
}

function selectSub(data?: InStorageApi.InStorageSub1) {
  if (data) {
    gridApi.grid.insertNextAt(data, gridApi.grid.getRadioRecord());
    if (!formData.value?.id) {
      formData.value.id = data.warehousingId;
    }
  }
  gridApi.query();
}

function handleDelete() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    deleteInStorageSubById({ id: data.id }).then(() =>
      gridApi.grid.remove(data),
    );
  });
}

const [SubFormModel, subFormModelApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
  centered: true,
});
function selectSubForm() {
  // gridApi.grid.setEditRow(selectRow.value);
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    subFormModelApi
      .setData({
        ...data,
        // warehousingId: formData.value?.id,
        addWarehousingMainParam: formData.value,
      })
      .open(),
  );
}
</script>
<template>
  <Modal :title="getDrawerTitle" class="max-h-5/6 h-5/6 w-4/5">
    <Form />
    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="save(1)">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        保存
      </ElButton>
      <ElButton type="primary" @click="save(2)">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:save-outline"
        />
        提交
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
        采购入库
      </ElButton>
      <ElButton
        type="primary"
        @click="openSub"
        v-if="formData.rights.includes('新增明细')"
      >
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="ant-design:plus-outlined"
        />
        新增明细
      </ElButton>
      <ElButton
        type="primary"
        @click="selectSubForm"
        v-if="formData.rights.includes('修改明细')"
      >
        <IconifyIcon
          icon="line-md:edit-twotone"
          class="size-5"
          style="margin-right: 4px"
        />
        修改明细
      </ElButton>
      <ElButton
        type="primary"
        @click="handleDelete"
        v-if="formData.rights.includes('删除明细')"
      >
        <IconifyIcon
          icon="mdi:trash-can-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        删除明细
      </ElButton>
    </ElButtonGroup>
    <Grid table-title="明细列表" class="p-raw h-full w-full">
      <template #siteName="{ row }">
        {{ row.siteName ? `#${row.siteName}` : '' }}
      </template>
    </Grid>

    <!-- 子组件对话框 -->
    <SubFormModel @success="selectSub" />
    <SupplierModel
      @select="
        (data: SupplierApi.Supplier) =>
          formApi.setValues({
            supplierId: data?.id || '',
            supplierName: data?.fullName || '',
          })
      "
    />
    <!-- 产品选择对话框 -->
    <SubList ref="subListRef" @select="handleSubListSelect" />
  </Modal>
</template>
<style lang="css" scoped></style>
