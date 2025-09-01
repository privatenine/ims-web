<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BillSubApi, StorageApi, VehiclePlaceApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { findBalanceList, getStorageList, getVehiclePlaceList } from '#/api';

import SubForm from './subForm.vue';

const emits = defineEmits(['success']);
const formData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
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
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formData.value = { ...formData.value, ...values };
      }
      console.warn(222, formData.value);
      getVehiclePlaceList().then(
        ({ data }: { data: VehiclePlaceApi.VehiclePlace[] }) => {
          const options = data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          gridApi.formApi.updateSchema([
            {
              componentProps: {
                options,
              },
              fieldName: 'productPlaceId',
            },
          ]);
        },
      );
      getStorageList({}).then(({ data }: { data: StorageApi.Storage[] }) => {
        const options = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        gridApi.formApi.updateSchema([
          {
            componentProps: {
              options,
            },
            fieldName: 'storeId',
          },
        ]);
      });
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid<BillSubApi.BalanceEntity>({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'productJpm',
        label: '简拼码',
        componentProps: {
          clearable: true,
          placeholder: '请输入简拼码',
        },
      },
      {
        component: 'Input',
        fieldName: 'productName',
        label: '名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入名称',
        },
      },

      {
        component: 'Checkbox',
        fieldName: 'isFuzzy',
        label: '模糊',
        componentProps: {
          clearable: true,
        },
      },

      {
        component: 'Select',
        fieldName: 'productPlaceId',
        label: '产地',
        componentProps: {
          clearable: true,
          options: [],
        },
      },
      {
        component: 'Select',
        fieldName: 'storeId',
        label: '仓库',
        componentProps: {
          clearable: true,
          options: [],
        },
      },
      {
        component: 'Checkbox',
        fieldName: 'isExcludeZero',
        label: '排零',
        componentProps: {
          clearable: true,
        },
      },
    ],
    submitOnChange: true,
  },
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'baseName',
        title: '通用车型',
        sortable: true,
        width: 160,
      },
      {
        field: 'productName',
        title: '产品名称',
        width: 220,
        sortable: true,
      },
      // {
      //   field: 'code',
      //   title: '属性',
      // },
      {
        field: 'productPlaceName',
        title: '产地',
        sortable: true,
        width: 220,
      },
      {
        field: 'actiNum',
        title: '数量',
        sortable: true,
        width: 100,
      },
      {
        field: 'storeName',
        title: '仓库',
        sortable: true,
        width: 160,
      },
      {
        field: 'siteName',
        title: '库位',
        sortable: true,
        width: 160,
      },
      {
        field: 'tradePrice1',
        title: '批发价1',
        sortable: true,
        width: 100,
      },
      {
        field: 'tradePrice2',
        title: '批发价2',
        sortable: true,
        width: 100,
      },
      {
        field: 'tradePrice3',
        title: '批发价3',
        sortable: true,
        width: 100,
      },
      {
        field: 'tradePrice4',
        title: '批发价4',
        sortable: true,
        width: 100,
      },
    ],
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          return await findBalanceList({
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
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<BillSubApi.BalanceEntity>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillApi.Bill }) {
    //   selectRow.value = row;
    // },
    cellDblclick({ row }) {
      const { id: balanceId, ...rest } = row;
      subFormModalApi.setData({ ...formData.value, ...rest, balanceId }).open();
    },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BillSubApi.BalanceEntity>,
});

const [SubFormModal, subFormModalApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
  centered: true,
});
</script>
<template>
  <Modal title="新增明细" class="max-h-5/6 mb-0 mr-0 w-4/5">
    <SubFormModal
      @success="
        (data: Record<string, any>) => {
          emits('success', data);
          modalApi.close();
        }
      "
    />
    <Grid class="p-raw h-[700px]">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="
              () => {
                useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
                  const { id: balanceId, ...rest } = data;
                  subFormModalApi
                    .setData({ ...formData, ...rest, balanceId })
                    .open();
                });
              }
            "
          >
            <IconifyIcon
              icon="ep:select"
              class="size-5"
              style="margin-right: 4px"
            />
            选择
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="lets-icons:img-box"
              class="size-5"
              style="margin-right: 4px"
            />
            浏览图片
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="ic:baseline-price-check"
            />
            成本价
          </ElButton>
          <ElButton type="primary" @click="() => modalApi.close()">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="lets-icons:back"
            />
            返回
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
