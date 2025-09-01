<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  InStorageApi,
  VehicleModelApi,
  VehiclePositionApi,
  VehicleSeriesApi,
  VehicleTypeApi,
} from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getInStorageSubList,
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
} from '#/api';
// import Form from '#/views/contactUnits/supplier/modules/form.vue';

import SubForm from './subForm.vue';

const emits = defineEmits(['select']);
const formData = ref();

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  showConfirmButton: false,
  centered: true,
  draggable: true,
  title: '选择产品',
  class: 'max-h-5/6 h-5/6 w-4/5',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    // await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      // formApi.resetForm();
      // console.log('subList values', values);
      if (values) {
        formData.value = values;
        //   formApi.setValues(values);
      }
      // 自动查询数据 - 添加延迟确保组件完全渲染
      if (gridApi && gridApi.query) {
        // 使用 setTimeout 确保组件完全渲染后再查询
        setTimeout(() => {
          try {
            if (gridApi && gridApi.query) {
              gridApi.query();
            }
          } catch (error) {
            console.warn('Grid query failed:', error);
          }
        }, 100);
      }
      // getVehicleSeriesList().then((res) => {
      //   const options = res.data.map((n) => ({ label: n.name, value: n.id }));
      //   gridApi.formApi.updateSchema([
      //     {
      //       fieldName: 'carSeriesId',
      //       componentProps: {
      //         options,
      //       },
      //     },
      //   ]);
      // });
      // getVehicleModelList().then((res) => {
      //   const options = res.data.map((n) => ({ label: n.name, value: n.id }));
      //   gridApi.formApi.updateSchema([
      //     {
      //       fieldName: 'carModelId',
      //       componentProps: {
      //         options,
      //       },
      //     },
      //   ]);
      // });
      // getVehicleTypeList().then((res) => {
      //   const options = res.data.map((n) => ({ label: n.name, value: n.id }));
      //   gridApi.formApi.updateSchema([
      //     {
      //       fieldName: 'carTypeId',
      //       componentProps: {
      //         options,
      //       },
      //     },
      //   ]);
      // });
      // getVehiclePositionList().then((res) => {
      //   const options = res.data.map((n) => ({ label: n.name, value: n.id }));
      //   gridApi.formApi.updateSchema([
      //     {
      //       fieldName: 'positionId',
      //       componentProps: {
      //         options,
      //       },
      //     },
      //   ]);
      // });
    }
  },
  title: '新增明细',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'jianPinCode',
        label: '简拼码',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'name',
        label: '产品名称',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'ApiSelect',
        fieldName: 'carSeriesId',
        label: '车系',
        componentProps: {
          clearable: true,
          placeholder: '请选择车系',
          api: getVehicleSeriesList,
          afterFetch: ({
            data,
          }: {
            data: Array<VehicleSeriesApi.VehicleSeries>;
          }) => {
            return data.map((item: VehicleSeriesApi.VehicleSeries) => ({
              label: item.name,
              value: item.id,
            }));
          },
        },
      },
      {
        component: 'ApiSelect',
        fieldName: 'carModelId',
        label: '车型',
        componentProps: {
          clearable: true,
          placeholder: '请选择车型',
          api: getVehicleModelList,
          afterFetch: ({
            data,
          }: {
            data: Array<VehicleModelApi.VehicleModel>;
          }) => {
            return data.map((item: VehicleModelApi.VehicleModel) => ({
              label: item.name,
              value: item.id,
            }));
          },
        },
      },
      {
        component: 'ApiSelect',
        fieldName: 'positionId',
        label: '安装位置',
        componentProps: {
          clearable: true,
          placeholder: '请选择安装位置',
          api: getVehiclePositionList,
          afterFetch: ({
            data,
          }: {
            data: Array<VehiclePositionApi.VehiclePosition>;
          }) => {
            return data.map((item: VehiclePositionApi.VehiclePosition) => ({
              label: item.name,
              value: item.id,
            }));
          },
        },
      },
      {
        component: 'ApiSelect',
        fieldName: 'carTypeId',
        label: '类别',
        componentProps: {
          clearable: true,
          placeholder: '请选择类别',
          api: getVehicleTypeList,
          afterFetch: ({
            data,
          }: {
            data: Array<VehicleTypeApi.VehicleType>;
          }) => {
            return data.map((item: VehicleTypeApi.VehicleType) => ({
              label: item.name,
              value: item.id,
            }));
          },
        },
      },
    ],
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-4',
  },
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'name',
        title: '产品名称',
        sortable: true,
      },
      {
        field: 'baseName',
        title: '通用车型',
        width: 120,
        sortable: true,
      },
      {
        field: 'jianPinCode',
        title: '简拼码',
        sortable: true,
      },
      {
        field: 'carModelName',
        title: '车型名称',
        width: 100,
        sortable: true,
      },
      {
        field: 'carSeriesName',
        title: '车系名称',
        sortable: true,
      },
      {
        field: 'carTypeName',
        title: '类型名称',
        sortable: true,
      },
      {
        field: 'positionName',
        title: '安装位置名称',
        sortable: true,
      },
      {
        field: 'price',
        title: '参考价',
        sortable: true,
      },
    ],
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
        query: async ({ page, sort }, formValues) => {
          // console.log('formValues', formValues);
          return await getInStorageSubList({
            ...formValues,
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
  } as VxeTableGridOptions<InStorageApi.InStorageSub1>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InStorageApi.InStorageSub1 }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
    cellDblclick({ row, column }) {
      console.warn(` 双击列：${column.title}`, row);
      subFormModelApi
        .setData({
          ...row,
          addWarehousingMainParam: { ...formData.value },
          id: 0,
          productName: row.name,
        })
        .open();
    },
  } as VxeGridListeners<InStorageApi.InStorageSub1>,
});

function onRefresh() {
  gridApi.query();
}

function onCloseModel(data: InStorageApi.InStorageSub1) {
  modalApi.close();
  emits('select', data);
}

const [SubFormModel, subFormModelApi] = useVbenModal({
  connectedComponent: SubForm,
  centered: true,
});

function selectSub() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    subFormModelApi
      .setData({
        ...data,
        addWarehousingMainParam: { ...formData.value },
        id: 0,
        productName: data?.name,
      })
      .open(),
  );
}

// 暴露modalApi给父组件
defineExpose({
  modalApi,
});
</script>
<template>
  <Modal>
    <!-- <FormModel /> -->
    <SubFormModel @success="onCloseModel" />
    <Grid table-title="产品列表" class="vp-raw h-full w-full">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onRefresh">
            <IconifyIcon
              icon="material-symbols-light:search-rounded"
              class="size-5"
              style="margin-right: 4px"
            />
            查询
          </ElButton>
          <ElButton type="primary" @click="selectSub">
            <IconifyIcon
              icon="ep:select"
              class="size-5"
              style="margin-right: 4px"
            />
            选择
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
