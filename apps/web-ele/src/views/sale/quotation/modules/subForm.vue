<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BillApi } from '#/api';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBillList } from '#/api';

// const selectRow = ref<BillApi.Bill>({});

const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
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
      }
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid<BillApi.Bill>({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'custName',
        label: '简拼码',
        componentProps: {
          clearable: true,
          placeholder: '请输入简拼码',
        },
      },
      {
        component: 'Input',
        fieldName: 'custName',
        label: '产品名称',
        componentProps: {
          clearable: true,
          placeholder: '请输入名称',
        },
      },

      {
        component: 'Checkbox',
        fieldName: 'custName',
        label: '模糊',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Select',
        fieldName: 'custName',
        label: '仓库名称',
        componentProps: {
          clearable: true,
          options: [],
        },
      },
      {
        component: 'Input',
        fieldName: 'custName',
        label: '库位',
        componentProps: {
          clearable: true,
        },
      },
      {
        component: 'Checkbox',
        fieldName: 'custName',
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
        field: 'code',
        title: '产品名称',
      },
      {
        field: 'code',
        title: '仓库名称',
      },
      {
        field: 'code',
        title: '库位',
      },
      {
        field: 'code',
        title: '库存数量',
      },
      {
        field: 'code',
        title: '批发价1',
      },
      {
        field: 'code',
        title: '批发价2',
      },
      {
        field: 'code',
        title: '批发价3',
      },
      {
        field: 'code',
        title: '批发价4',
      },
      {
        field: 'code',
        title: '存货上限',
      },
      {
        field: 'code',
        title: '存货下限',
      },
      {
        field: 'code',
        title: '厂家名称',
      },
      {
        field: 'code',
        title: '支架',
      },
      {
        field: 'code',
        title: '颜色',
      },
      {
        field: 'code',
        title: '彩带',
      },
      {
        field: 'code',
        title: '特征码',
      },
      {
        field: 'code',
        title: '印边',
      },
      {
        field: 'code',
        title: '夜视',
      },
      {
        field: 'code',
        title: '插头',
      },
      {
        field: 'code',
        title: '产品产地',
      },
      {
        field: 'code',
        title: '雨感',
      },
      {
        field: 'code',
        title: '胶条',
      },
      {
        field: 'code',
        title: '临时库位',
      },
      {
        field: 'code',
        title: '商标',
      },
      {
        field: 'code',
        title: '理赔价',
      },
      {
        field: 'code',
        title: '安装价',
      },
      {
        field: 'code',
        title: '零售价',
      },
      {
        field: 'code',
        title: '调货价',
      },
      {
        field: 'code',
        title: '批量价1',
      },
      {
        field: 'code',
        title: '批量价2',
      },
      {
        field: 'code',
        title: '批量价4',
      },
      {
        field: 'code',
        title: '批量价4',
      },
      {
        field: 'code',
        title: '批量价5',
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
          return await getBillList({
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
  } as VxeTableGridOptions<BillApi.Bill>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BillApi.Bill }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BillApi.Bill>,
});

function handleUpdate() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: BillApi.Bill | undefined) => void,
  );
}
</script>
<template>
  <Modal title="新增明细" class="h-[500px] w-3/5">
    <Grid>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="ep:select"
              class="size-5"
              style="margin-right: 4px"
            />
            选择
          </ElButton>

          <ElButton type="primary" @click="handleUpdate">
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
