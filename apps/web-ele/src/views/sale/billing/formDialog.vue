<template>
  <el-dialog
    class="main-dialog"
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
          <el-form-item label="单号" prop="code">
            <el-input v-model="form.code" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="custId">
            <el-input
              v-model="form.custName"
              placeholder="点击选择客户"
              readonly
              clearable
              @click="openCustomerDialog"
            >
              <template #append>
                <el-button @click="openCustomerDialog">选择客户</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单日期" prop="orderTime">
            <el-date-picker
              v-model="form.orderTime"
              type="date"
              placeholder="选择下单日期"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="业务类型" prop="businessType">
            <el-select
              v-model="form.businessType"
              placeholder="请选择业务类型"
              clearable
              style="width: 100%"
            >
              <el-option label="零售" :value="122" />
              <el-option label="批发" :value="123" />
              <el-option label="其它" :value="124" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="配送类型" prop="distribution">
            <el-select
              v-model="form.distribution"
              placeholder="请选择配送类型"
              clearable
              style="width: 100%"
            >
              <el-option label="自提" :value="125" />
              <el-option label="送货" :value="126" />
              <el-option label="物流发货" :value="127" />
              <el-option label="安装" :value="128" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务员" prop="createName">
            <el-input
              v-model="form.createName"
              placeholder="点击选择业务员"
              readonly
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="总数量" prop="totalNum">
            <el-input-number
              v-model="form.totalNum"
              disabled
              :precision="0"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总金额" prop="totalMoney">
            <el-input-number
              v-model="form.totalMoney"
              disabled
              :precision="2"
              :min="0"
              :formatter="
                (value: number) =>
                  `¥ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value: string) => value.replaceAll(/¥\s?|(,*)/g, '')"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠金额" prop="discountMoney">
            <el-input-number
              v-model="form.discountMoney"
              :precision="2"
              :min="0"
              placeholder="输入优惠金额"
              :formatter="
                (value: number) =>
                  `¥ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value: string) => value.replaceAll(/¥\s?|(,*)/g, '')"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收货地址" prop="receiveAddress">
            <el-input
              v-model="form.receiveAddress"
              placeholder="请输入收货地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收货人" prop="receiveName">
            <el-input
              v-model="form.receiveName"
              placeholder="请输入收货人姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="receivePhone">
            <el-input
              v-model="form.receivePhone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注信息"
              :rows="3"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 隐藏字段 -->
      <el-form-item prop="custId" style="display: none">
        <el-input v-model="form.custId" type="hidden" />
      </el-form-item>
      <el-form-item prop="createId" style="display: none">
        <el-input v-model="form.createId" type="hidden" />
      </el-form-item>
    </el-form>

    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="save(1)" :loading="saveLoading">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        保存
      </ElButton>
      <ElButton type="primary" @click="save(2)" :loading="saveLoading">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:save-outline"
        />
        提交
      </ElButton>
      <ElButton type="primary" @click="openSub">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="ant-design:plus-outlined"
        />
        新增明细
      </ElButton>
      <ElButton type="primary" @click="handleEdit">
        <IconifyIcon
          icon="line-md:edit-twotone"
          class="size-5"
          style="margin-right: 4px"
        />
        修改明细
      </ElButton>
      <ElButton type="primary" @click="handleDelete">
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
      @row-dblclick="handleRowDblClick"
      height="calc(100vh - 470px)"
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

    <StorageSelectDialog
      v-model:visible="storageSelectDialogVis"
      :form-data="formData"
      @close="storageSelectDialogVis = false"
      @confirm="storageConfirm"
    />
    <subFormDialog
      v-model:visible="subformDialogVis"
      :form-data="subformData"
      @close="subformDialogVis = false"
      @confirm="subConfirm"
    />

    <!-- 添加: 客户选择弹框 -->
    <CustomerSelectDialog
      v-model:visible="supplierSelectDialogVis"
      @confirm="handleCustomerSelect"
      @close="supplierSelectDialogVis = false"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { computed, onMounted, reactive, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElMessage, ElMessageBox } from 'element-plus';

import {
  createBill,
  deleteBillSubById,
  getBillSubList,
  updateBill,
} from '#/api';
// 添加: 导入客户选择弹框组件
import CustomerSelectDialog from '#/components/CustomerSelectDialog.vue';
import StorageSelectDialog from '#/components/StorageSelectDialog.vue';

import subFormDialog from './subFormDialog.vue';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const vis = ref(false);
const formRef = ref<FormInstance>();
const tableRef = ref();

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
const total = ref(0);

// 获取用户信息
const userInfoStr = localStorage.getItem('userInfo');
const nUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

// 表单数据
const form = ref({
  custId: '',
  custName: '',
  code: '',
  orderTime: new Date(),
  businessType: undefined,
  distribution: undefined,
  createName: nUserInfo.realName || '',
  createId: nUserInfo.id || '',
  totalMoney: 0,
  totalNum: 0,
  discountMoney: 0,
  receiveAddress: '',
  receiveName: '',
  receivePhone: '',
  remark: '',
  id: '',
  statusFlag: undefined,
});

// 表单验证规则
const rules = ref<FormRules>({
  custId: [{ required: true, message: '客户不能为空', trigger: 'change' }],
  businessType: [
    { required: true, message: '业务类型不能为空', trigger: 'change' },
  ],
  distribution: [
    { required: true, message: '配送类型不能为空', trigger: 'change' },
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

// 初始化数据
onMounted(() => {});

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      // 当对话框打开时，初始化表单数据
      selectedRowId.value = '';
      tableData.value = [];
      if (props.formData) {
        form.value = { ...props.formData };
        form.value.totalMoney = form.value.totalMoney || 0;
        form.value.totalNum = form.value.totalNum || 0;
        form.value.discountMoney = form.value.discountMoney || 0;
      } else {
        // 重置表单
        formRef.value?.resetFields();
        form.value = {
          custId: '',
          custName: '',
          code: '',
          orderTime: new Date(),
          businessType: undefined,
          distribution: undefined,
          createName: nUserInfo.realName || '',
          createId: nUserInfo.id || '',
          totalMoney: 0,
          totalNum: 0,
          discountMoney: 0,
          receiveAddress: '',
          receiveName: '',
          receivePhone: '',
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
  return `${props.formData?.id ? '修改' : '新增'}销售开单`;
});

const saveLoading = ref(false);

async function save(statusFlag: number) {
  // 校验formRef
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  saveLoading.value = true;
  (tableData.value?.length === 0
    ? createBill(Object.assign({}, form.value, { statusFlag }))
    : updateBill(
        Object.assign({}, form.value, { statusFlag, id: form.value.id }),
      )
  )
    .then(() => {
      ElMessage({
        message: `提交成功`,
        type: 'success',
        plain: true,
      });
      emit('confirm', form.value);
      vis.value = false;
    })
    .finally(() => {
      saveLoading.value = false;
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

// 添加处理行双击的函数
const handleRowDblClick = (row: any) => {
  selectedRowId.value = row.id;
  handleEdit();
};

const getSubList = async () => {
  const p = Object.assign({}, queryParams, { saleId: form.value.id });
  const res = await getBillSubList(p);
  tableData.value = res.data;
  total.value = res.total;
  selectedRowId.value = '';
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

const storageSelectDialogVis = ref(false);
// 打开子表单
const openSub = () => {
  // 打开新增明细的逻辑
  if (!form.value.custId) {
    ElMessage({
      message: `请选择客户`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  // 打开对话框
  storageSelectDialogVis.value = true;
};

// 添加: 客户选择弹框相关
const supplierSelectDialogVis = ref(false);
const openCustomerDialog = () => {
  supplierSelectDialogVis.value = true;
};

// 添加: 处理客户选择确认
const handleCustomerSelect = (row: any) => {
  if (row) {
    form.value.custId = row.id;
    form.value.custName = row.fullName;
  }
  supplierSelectDialogVis.value = false;
};

const subformDialogVis = ref(false);
const subformData = ref({});
const storageConfirm = (data) => {
  // 新增明细选择产品
  subformData.value = Object.assign(data, {
    id: undefined,
    balanceId: data.id,
    addSaleMainParam: form.value,
  });
  subformDialogVis.value = true;
};
const subConfirm = (data) => {
  // 当入库和明细都是新增时，新增明细传id:0,接口返回时会同时创建明细和入库id
  form.value.id = form.value.id || data.saleId;
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
    addSaleMainParam: form.value,
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
      deleteBillSubById({ id: selectedRowId.value }).then((res) => {
        ElMessage({
          message: `删除成功`,
          type: 'success',
        });
        getSubList();
      });
    })
    .catch(() => {});
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
