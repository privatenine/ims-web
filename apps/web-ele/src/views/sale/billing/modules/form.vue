<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BillApi, BillSubApi, CustomerApi, EmployeeApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createBill,
  deleteBillSubById,
  getBillCode,
  getBillSubList,
  updateBill,
} from '#/api';

import { useFormSchema, useSubColumns } from '../data';
import CustomerList from './customerList.vue';
import EmployeeList from './employeeList.vue';
import SubForm from './subForm.vue';
import SubList from './subList.vue';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
// const id = ref<number | null>(null);

// 获取用户信息
const userInfoStr = localStorage.getItem('userInfo');
const nUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

const getDrawerTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}销售开单`;
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
      formApi.updateSchema([
        {
          fieldName: 'createName',
          componentProps: {
            onClick() {
              employeeListModalApi.open();
            },
          },
        },
        {
          fieldName: 'custName',
          componentProps: {
            onClick() {
              customerListModalApi.open();
            },
          },
        },
      ]);
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (values.id) {
        formData.value = values;
        formApi.setValues({ ...values });
        return;
      }
      getBillCode().then(({ data }) => {
        formApi.setValues({
          code: data,
          orderTime: new Date(),
          createName: nUserInfo.realName || '',
        });
      });
      // getBillAndSubListByMainId().then(({ data }) => {
      //   formData.value = data;
      //   formApi.setValues(data);
      // });
    }
  },
});

const [Form, formApi] = useVbenForm({
  // handleSubmit: onSubmit,
  schema: useFormSchema(),
  showDefaultActions: false,
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
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
const [Grid, gridApi] = useVbenVxeGrid<BillSubApi.BillSub>({
  gridOptions: {
    columns: useSubColumns(),
    height: 'auto',
    keepSource: true,
    size: 'small',
    showOverflow: false,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          return await getBillSubList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            saleId: formData.value.id,
            code: formData.value.code,
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
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    toolbarConfig: {
      custom: false,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<BillSubApi.BillSub>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillSubApi.BillSub }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BillSubApi.BillSub>,
});

function onSave() {
  formApi.getValues().then((data) => {
    const subData: BillApi.BillAdd = {
      ...formData.value,
      ...data,
      statusFlag: 1,
    };
    (subData.id
      ? updateBill({ ...subData, statusFlag: 2 })
      : createBill(subData)
    )
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .finally(() => {
        modalApi.unlock();
      });
  });
}
function onDelete() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    deleteBillSubById({ id: data.id })
      .then(() => {
        ElMessage({
          message: `删除成功!`,
          type: 'success',
          plain: true,
        });
        gridApi.query();
      })
      .finally(() => {});
  }, true);
}
const [SubListModal, subListModalApi] = useVbenModal({
  connectedComponent: SubList,
  destroyOnClose: true,
  centered: true,
});

const [EmployeeListModal, employeeListModalApi] = useVbenModal({
  connectedComponent: EmployeeList,
  destroyOnClose: true,
  centered: true,
});

const [CustomerListModal, customerListModalApi] = useVbenModal({
  connectedComponent: CustomerList,
  destroyOnClose: true,
  centered: true,
});

const [SubFormModal, subFormModalApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
  centered: true,
});
</script>
<template>
  <Modal :title="getDrawerTitle" class="max-h-5/6 mb-0 mr-0 w-4/5">
    <Form />
    <SubListModal
      @success="
        (data) => {
          formData = { ...fromData, ...data.saleMainRespVO };
          gridApi.query();
        }
      "
    />
    <EmployeeListModal
      @success="
        (data: EmployeeApi.Employee) => {
          formApi.setValues({ createName: data?.realName || '' });
          formData.value = { ...formData.value, createId: data?.id || '' };
        }
      "
    />
    <CustomerListModal
      @success="
        (data: CustomerApi.Customer) => {
          console.warn(777, data);
          formApi.setValues({ custName: data?.fullName || '' });
          formData = { ...formData, custId: data?.id || '' };
        }
      "
    />
    <SubFormModal @success="() => gridApi.query()" />
    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="onSave">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        提交
      </ElButton>
      <ElButton
        type="primary"
        @click="
          () => {
            formApi.getValues().then((data) => {
              subListModalApi
                .setData({ addSaleMainParam: { ...formData, ...data } })
                .open();
            });
          }
        "
      >
        <IconifyIcon
          icon="ant-design:plus-outlined"
          class="size-5"
          style="margin-right: 4px"
        />
        新增明细
      </ElButton>
      <ElButton
        type="primary"
        @click="
          () => {
            subFormModalApi.setData(gridApi.grid.getRadioRecord()).open();
          }
        "
      >
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="line-md:edit-twotone"
        />
        修改明细
      </ElButton>
      <ElButton type="primary" @click="onDelete">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="mdi:trash-can-outline"
        />
        删除明细
      </ElButton>
      <ElButton type="primary" @click="() => modalApi.close()">
        <IconifyIcon
          icon="lets-icons:back"
          class="size-5"
          style="margin-right: 4px"
        />
        返回
      </ElButton>
    </ElButtonGroup>
    <Grid table-title="明细列表" class="p-raw h-[500px]" />
  </Modal>
</template>
<style lang="css" scoped></style>
