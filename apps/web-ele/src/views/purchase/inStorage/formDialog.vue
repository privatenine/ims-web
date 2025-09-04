<template>
  <el-dialog
    v-model="vis"
    :title="title"
    width="1200"
    append-to-body
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      :disabled="formData?.statusFlag && ![1, 5].includes(formData.statusFlag)"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="form.supplierId"
              placeholder="请选择"
              clearable
              @change="handleSupplierChange"
            >
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="单号" prop="code">
            <el-input v-model="form.code" disabled readonly />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="到货方式" prop="arrivalId">
            <el-select
              v-model="form.arrivalId"
              placeholder="请选择"
              clearable
              @change="handleArrivalChange"
            >
              <el-option
                v-for="item in arrivalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="提货车牌" prop="pickUpCarId">
            <el-select
              v-model="form.pickUpCarId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in carOptions"
                :key="item.id"
                :label="item.carNum"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="卸货方式" prop="unloadingId">
            <el-select
              v-model="form.unloadingId"
              placeholder="请选择"
              clearable
              @change="handleUnloadingChange"
            >
              <el-option
                v-for="item in unloadingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="金额" prop="totalMoney">
            <el-input-number
              v-model="form.totalMoney"
              :readonly="true"
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="数量" prop="totalNum">
            <el-input-number
              v-model="form.totalNum"
              :readonly="true"
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark" class="col-span-4">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              :clearable="true"
            />
          </el-form-item>
        </el-col>

        <el-col :span="0">
          <el-form-item prop="supplierId">
            <el-input v-model="form.supplierId" type="hidden" />
          </el-form-item>
        </el-col>

        <el-col :span="0">
          <el-form-item prop="id">
            <el-input v-model="form.id" type="hidden" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
      <ElButton type="primary" disabled v-if="rights?.includes('采购明细')">
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
        v-if="rights.includes('新增明细')"
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
        @click="handleEdit"
        v-if="rights.includes('修改明细')"
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
        v-if="rights.includes('删除明细')"
      >
        <IconifyIcon
          icon="mdi:trash-can-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        删除明细
      </ElButton>
    </ElButtonGroup>

    <!-- 添加表格 -->
    <el-table
      :data="tableData"
      ref="tableRef"
      @row-click="handleRowClick"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column align="center" width="30">
        <template #default="scope">
          <el-radio v-model="selectedRowId" :value="scope.row.id" @click.stop>
            &nbsp;
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="productName" label="产品名称" width="140" />
      <el-table-column prop="productAttachmentNames" label="附件" />
      <el-table-column prop="productPlaceName" label="产地" width="100" />
      <el-table-column prop="actiNum" label="数量" width="80" />
      <el-table-column prop="price" label="单价" width="80" />
      <el-table-column prop="totalPrice" label="总金额" width="80" />
      <el-table-column prop="storeName" label="仓库" width="100" />
      <el-table-column prop="siteName" label="库位" width="100">
        <template #default="scope">
          <span>{{ scope.row.siteName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceReference" label="参考价格" width="100" />
      <el-table-column prop="printLabel" label="商标" width="80" />
      <el-table-column prop="remark" label="备注" width="80" />
    </el-table>
    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <productSelectDialog
      v-model:visible="productSelectDialogVis"
      :form-data="formData"
      @close="productSelectDialogVis = false"
      @confirm="productConfirm"
    />
    <subFormDialog
      v-model:visible="subformDialogVis"
      :form-data="subformData"
      @close="subformDialogVis = false"
      @confirm="subConfirm"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import { ElMessage, ElMessageBox } from 'element-plus';

import {
  createInStorage,
  deleteInStorageSubById,
  getCarList,
  getInStorageSubByMainId,
  getSupplierList,
  updateInStorage,
} from '#/api';
import { useMenuRights } from '#/utils';

import productSelectDialog from './productSelectDialog.vue';
import subFormDialog from './subFormDialog.vue';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

const vis = ref(false);
const formRef = ref<FormInstance>();
const tableRef = ref();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const total = ref(0);

// 表单数据
const form = ref({
  supplierId: '',
  supplierName: '',
  code: '',
  arrivalId: undefined,
  pickUpCarId: undefined,
  unloadingId: undefined,
  totalMoney: 0,
  totalNum: 0,
  remark: '',
  id: '',
  statusFlag: undefined,
});

// 表单验证规则
const rules = ref<FormRules>({
  supplierId: [
    { required: true, message: '供应商不能为空', trigger: 'change' },
  ],
});

// 到货方式选项
const arrivalOptions = [
  { label: '自提', value: 1 },
  { label: '送货', value: 2 },
  { label: '物流送货', value: 3 },
];

// 卸货方式选项
const unloadingOptions = [
  { label: '机械', value: 1 },
  { label: '人工', value: 2 },
];

// 提货车牌选项
const carOptions = ref<Array<any>>([]);
const supplierOptions = ref<Array<any>>([]);

// 获取提货车牌选项
const getCarOptions = async () => {
  const res = await getCarList();
  carOptions.value = res.data;
};

const getSupplierOptions = async () => {
  const res = await getSupplierList({ pageSize: 999 });
  supplierOptions.value = res.data;
};

// 初始化数据
onMounted(() => {
  getCarOptions();
  getSupplierOptions();
});

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      // 当对话框打开时，初始化表单数据
      selectedRowId.value = '';
      if (props.formData) {
        form.value = { ...props.formData };
        form.value.totalMoney = form.value.totalMoney || 0;
        form.value.totalNum = form.value.totalNum || 0;
      } else {
        // 重置表单
        formRef.value?.resetFields();
        form.value = {
          supplierId: '',
          supplierName: '',
          code: '',
          arrivalId: undefined,
          pickUpCarId: undefined,
          unloadingId: undefined,
          totalMoney: 0,
          totalNum: 0,
          remark: '',
          id: '',
          statusFlag: undefined,
        };
      }
      if (props.formData?.id) {
        getSubList();
      }
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const title = computed(() => {
  return `${props.formData.value?.id ? '修改' : '新增'}入库`;
});

async function save(statusFlag: number) {
  // 校验formRef
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }
  (tableData.value.length === 0
    ? createInStorage(Object.assign({}, form.value, { statusFlag }))
    : updateInStorage(
        Object.assign({}, form.value, { statusFlag, id: form.value.id }),
      )
  ).then(() => {
    ElMessage({
      message: `提交成功`,
      type: 'success',
      plain: true,
    });
    emit('confirm', form.value);
    vis.value = false;
  });
}

// 表格相关
const tableData = ref<Array<any>>([]);
const selectedRowId = ref('');
const selectedRow = computed(() => {
  return tableData.value.find((row: any) => row.id === selectedRowId.value);
});

// 添加处理行点击的函数
const handleRowClick = (row: any) => {
  selectedRowId.value = row.id;
};
const getSubList = async () => {
  const p = Object.assign({}, queryParams, { warehousingId: form.value.id });
  const res = await getInStorageSubByMainId(p);
  tableData.value = res.data;
  total.value = res.total;
};
// 分页事件处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getSubList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getSubList();
};

const handleClose = () => {
  emit('cancel');
};

const productSelectDialogVis = ref(false);
// 打开子表单
const openSub = () => {
  // 打开新增明细的逻辑
  if (!form.value.supplierId) {
    ElMessage({
      message: `请选择供应商`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  // 打开对话框
  productSelectDialogVis.value = true;
};

const subformDialogVis = ref(false);
const subformData = ref({});
const productConfirm = (data) => {
  // 新增明细选择产品
  subformData.value = Object.assign(data, {
    addWarehousingMainParam: form.value,
  });
  subformDialogVis.value = true;
};
const subConfirm = (data) => {
  // 当入库和明细都是新增时，新增明细传id:0,接口返回时会同时创建明细和入库id
  form.value.id = form.value.id || data.warehousingId;
  getSubList();
};

// 修改明细
const handleEdit = () => {
  if (!selectedRowId.value) {
    ElMessage({
      message: `请选择一条明细`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  subformData.value = Object.assign(selectedRow.value, {
    addWarehousingMainParam: form.value,
  });
  subformDialogVis.value = true;
};

// 删除操作
const handleDelete = () => {
  if (!selectedRowId.value) {
    ElMessage({
      message: `请选择一条明细`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  ElMessageBox.confirm('确认要删除该明细吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteInStorageSubById({ id: selectedRowId.value }).then((res) => {
        ElMessage({
          message: `删除成功`,
          type: 'success',
        });
        getSubList();
      });
    })
    .catch(() => {});
};

// 添加处理供应商选择变化的函数
const handleSupplierChange = (val: string) => {
  if (val) {
    const selected = supplierOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.supplierName = selected.fullName;
    }
  } else {
    form.value.supplierName = '';
  }
};

// 添加处理到货方式选择变化的函数
const handleArrivalChange = (val: number) => {
  if (val) {
    const selected = arrivalOptions.find((item) => item.value === val);
    if (selected) {
      form.value.arrivalName = selected.label;
    }
  } else {
    form.value.arrivalName = '';
  }
};

// 添加处理卸货方式选择变化的函数
const handleUnloadingChange = (val: number) => {
  if (val) {
    const selected = unloadingOptions.find((item) => item.value === val);
    if (selected) {
      form.value.unloadingName = selected.label;
    }
  } else {
    form.value.unloadingName = '';
  }
};
</script>
