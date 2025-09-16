<template>
  <div class="app-container">
    <div class="query-form-container">
      <!-- 搜索表单 -->
      <el-form
        :model="queryParams"
        :inline="true"
        class="query-form"
        label-width="80px"
      >
        <!-- 客户 -->
        <el-form-item label="客户" prop="custName">
          <el-input
            v-model="queryParams.custName"
            placeholder="请输入客户名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <!-- 隐藏的客户ID字段 -->
        <el-form-item prop="custId" style="display: none">
          <el-input v-model="queryParams.custId" type="hidden" />
        </el-form-item>

        <!-- 单号 -->
        <el-form-item label="单号" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <!-- 配送类型 -->
        <el-form-item label="配送类型" prop="distribution">
          <el-select
            v-model="queryParams.distribution"
            placeholder="请选择配送类型"
            clearable
            @change="handleQuery"
          >
            <el-option label="自提" :value="125" />
            <el-option label="送货" :value="126" />
            <el-option label="物流发货" :value="127" />
            <el-option label="安装" :value="128" />
          </el-select>
        </el-form-item>

        <!-- 销售状态 -->
        <el-form-item label="销售状态" prop="statusFlag">
          <el-select
            v-model="queryParams.statusFlag"
            placeholder="请选择销售状态"
            clearable
            @change="handleQuery"
          >
            <el-option label="草稿" :value="1" />
            <el-option label="待审批" :value="2" />
            <el-option label="待出库" :value="3" />
            <el-option label="出库完成" :value="4" />
            <el-option label="存档" :value="5" />
            <el-option label="退货" :value="6" />
            <el-option label="作废" :value="7" />
            <el-option label="驳回" :value="8" />
            <el-option label="已结算" :value="9" />
          </el-select>
        </el-form-item>

        <el-form-item label="开单日期" prop="dateRange">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="x"
            clearable
          />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="query-btn-container">
      <ElButtonGroup class="ml-4">
        <ElButton type="primary" disabled>
          <IconifyIcon
            icon="fluent:apps-list-detail-20-regular"
            class="size-5"
            style="margin-right: 4px"
          />
          详情
        </ElButton>
        <ElButton type="primary" @click="handleAdd()">
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
        <ElButton type="primary" @click="handleUpdate">
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="line-md:edit-twotone"
          />
          修改
        </ElButton>
        <ElButton type="danger" @click="handleDelete">
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="mdi:trash-can-outline"
          />
          删除
        </ElButton>
        <ElButton type="primary" @click="handleApproveBill">
          <IconifyIcon
            icon="mdi:check"
            class="size-5"
            style="margin-right: 4px"
          />
          通过
        </ElButton>
        <!-- 驳回按钮 -->
        <ElButton type="danger" @click="handleRejectBill">
          <IconifyIcon
            icon="mdi:close"
            class="size-5"
            style="margin-right: 4px"
          />
          驳回
        </ElButton>
        <!-- 出库按钮 -->
        <ElButton type="primary" @click="handleOutboundBill">
          <IconifyIcon
            icon="mdi:folder-move-outline"
            class="size-5"
            style="margin-right: 4px"
          />出库
        </ElButton>
        <ElButton type="primary" disabled>
          <IconifyIcon
            icon="mdi:download"
            class="size-5"
            style="margin-right: 4px"
          />下载
        </ElButton>
        <!-- 取消订单按钮 -->
        <ElButton type="danger" @click="handleCancelBill">
          <IconifyIcon
            icon="mdi:selection-remove"
            class="size-5"
            style="margin-right: 4px"
          />取消订单
        </ElButton>
        <ElButton type="primary" disabled>
          <IconifyIcon
            icon="mdi:currency-jpy"
            class="size-5"
            style="margin-right: 4px"
          />收款
        </ElButton>
      </ElButtonGroup>
    </div>
    <!-- 分页列表 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
        v-auto-fit-height
      >
        <el-table-column width="30" align="center" fixed="left">
          <template #default="{ row }">
            <el-radio v-model="selectedRowId" :value="row.id" @click.stop>
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60" label="序号" fixed="left" />
        <el-table-column prop="code" label="单号" width="160" fixed="left" />
        <el-table-column prop="custName" label="客户" width="100" />
        <el-table-column prop="statusFlag" label="订单状态" width="100">
          <template #default="{ row }">
            <ElTag :type="billStatusFlagMap[row.statusFlag]?.color || 'danger'">
              {{ billStatusFlagMap[row.statusFlag]?.name || '未知' }}
            </ElTag>
          </template>
        </el-table-column>
        <el-table-column prop="totalNum" label="数量" width="100" />
        <el-table-column prop="totalMoney" label="金额(元)" width="100" />
        <el-table-column prop="createTime" label="制单日期" width="100">
          <template #default="{ row }">
            {{
              row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="制单员工" width="100" />
        <el-table-column prop="distribution" label="配送类型" width="200">
          <template #default="{ row }">
            {{ billDistributionFlagMap[row.distribution] || '' }}
          </template>
        </el-table-column>
        <el-table-column prop="businessTypeZh" label="业务类型" width="100" />
        <el-table-column prop="approveName" label="审批员工" width="100" />
        <el-table-column prop="outboundName" label="出库员工" width="100" />
        <el-table-column prop="updateTime" label="最后修改时间" width="140">
          <template #default="{ row }">
            {{
              row.updateTime ? dayjs(row.updateTime).format('YYYY-MM-DD') : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="logisticsName" label="物流名称" width="100" />
        <el-table-column prop="totalPrice" label="成本金额" width="100" />
        <el-table-column prop="profit" label="利润" width="100" />
        <el-table-column prop="profitMargin" label="利润率" width="100" />
        <el-table-column prop="remark" label="订单备注" width="300" />
      </el-table>
    </div>
    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <formDialog
      v-model:visible="formDialogVis"
      :form-data="formData"
      @close="formDialogVis = false"
      @confirm="handleFormDialogConfirm"
    />

    <!-- 添加详情弹框组件 -->
    <DetailDialog
      v-model:visible="detailDialogVis"
      :form-data="detailFormData"
      @close="detailDialogVis = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  approveBill,
  cancelBill,
  deleteBillById,
  getBillCode,
  getBillList,
  outboundBill,
  rejectBill,
} from '#/api';

import DetailDialog from './detailDialog.vue';
import formDialog from './formDialog.vue';

// 获取用户信息
const userInfoStr = localStorage.getItem('userInfo');
const nUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
// 添加订单状态映射
const billStatusFlagMap = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待审批', color: 'primary' },
  3: { name: '待出库', color: 'warning' },
  4: { name: '出库完成', color: 'success' },
  5: { name: '存档', color: 'success' },
  6: { name: '退货', color: 'danger' },
  7: { name: '作废', color: 'danger' },
  8: { name: '驳回', color: 'danger' },
  9: { name: '已结算', color: 'success' },
};

// 添加配送类型映射
const billDistributionFlagMap = {
  125: '自提',
  126: '送货',
  127: '物流发货',
  128: '安装',
};

// 初始化时获取数据
onMounted(() => {
  getList();
});

const formDialogVis = ref(false);
const formData = ref({});

// 添加详情弹框相关的变量
const detailDialogVis = ref(false);
const detailFormData = ref({});

// 添加选中行的ID
const selectedRowId = ref('');
const selectedRow = computed(() => {
  return tableData.value.find((row: any) => row.id === selectedRowId.value);
});
// 添加处理行点击的函数
const handleRowClick = (row: any) => {
  selectedRowId.value = row.id;
};

// 搜索表单数据
const queryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  custName: '',
  custId: '',
  code: '',
  distribution: '',
  statusFlag: '',
  dateRange: [],
  startTime: '',
  endTime: '',
});

// 表格数据
const tableData = ref([]);
const total = ref(0);

// 搜索按钮点击事件
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置按钮点击事件
const handleReset = () => {
  // 重置表单
  Object.keys(queryParams).forEach((key) => {
    queryParams[key] = '';
  });
  queryParams.dateRange = [];
  queryParams.pageNum = 1;
  queryParams.pageSize = 20;
  getList();
};

// 获取表格数据
const getList = async () => {
  const p = JSON.parse(JSON.stringify(queryParams));
  if (p.dateRange?.length) {
    p.startTime = p.dateRange[0];
    p.endTime = p.dateRange[1];
  } else {
    p.startTime = '';
    p.endTime = '';
  }
  Reflect.deleteProperty(p, 'dateRange');

  const res = await getBillList(p);
  tableData.value = res.data;
  total.value = res.total;
};

const handleAdd = () => {
  getBillCode().then(({ data }: { data: string }) => {
    formData.value = {
      code: data,
      orderTime: new Date(),
      createName: nUserInfo.realName || '',
    };
    formDialogVis.value = true;
  });
};

function handleUpdate() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  if (![1, 8].includes(selectedRow.value.statusFlag)) {
    ElMessage({
      message: `只能修改草稿状态的入库单!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  formData.value = selectedRow.value;
  formDialogVis.value = true;
}

function openDetail() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  detailFormData.value = selectedRow.value;
  detailDialogVis.value = true;
}

function openStoreForm() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
  }
}

function handleSettlement() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  if (selectedRow.value.statusFlag !== 3) {
    ElMessage.warning('只有完成入库才可以结算');
  }
}

const handleDelete = () => {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  ElMessageBox.confirm('确认要删除该数据吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteBillById({ id: selectedRow.value.id })
        .then(() => {
          ElMessage({
            message: `删除成功!`,
            type: 'success',
            plain: true,
          });
          handleQuery();
        })
        .catch(() => {
          ElMessage({
            message: `删除失败!`,
            type: 'error',
            plain: true,
          });
        })
        .finally(() => {});
    })
    .catch(() => {});
};

function handleApproveBill() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  // 只有待审批状态的销售单可以审核
  if (selectedRow.value.statusFlag !== 2) {
    ElMessage({
      message: `只有待审批状态的销售单可以审核!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确认要审核该销售单吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      approveBill({
        mainId: selectedRow.value.id,
        version: selectedRow.value.version,
      })
        .then(() => {
          ElMessage({
            message: `审核成功!`,
            type: 'success',
            plain: true,
          });
          handleQuery();
        })
        .catch(() => {
          ElMessage({
            message: `审核失败!`,
            type: 'error',
            plain: true,
          });
        });
    })
    .catch(() => {});
}

function handleRejectBill() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  // 只有待审批状态的销售单可以驳回
  if (selectedRow.value.statusFlag !== 2) {
    ElMessage({
      message: `只有待审批状态的销售单可以驳回!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确认要驳回该销售单吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      rejectBill({
        mainId: selectedRow.value.id,
        version: selectedRow.value.version,
      })
        .then(() => {
          ElMessage({
            message: `驳回成功!`,
            type: 'success',
            plain: true,
          });
          handleQuery();
        })
        .catch(() => {
          ElMessage({
            message: `驳回失败!`,
            type: 'error',
            plain: true,
          });
        });
    })
    .catch(() => {});
}

function handleCancelBill() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  // 只有草稿和待审批状态的销售单可以取消
  if (![3].includes(selectedRow.value.statusFlag)) {
    ElMessage({
      message: `只有审核通过未出库的销售单可以取消!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确认要取消该销售单吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cancelBill({
        mainId: selectedRow.value.id,
        version: selectedRow.value.version,
      })
        .then(() => {
          ElMessage({
            message: `取消成功!`,
            type: 'success',
            plain: true,
          });
          handleQuery();
        })
        .catch(() => {
          ElMessage({
            message: `取消失败!`,
            type: 'error',
            plain: true,
          });
        });
    })
    .catch(() => {});
}

function handleOutboundBill() {
  if (!selectedRow.value?.id) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  // 只有待出库状态的销售单可以出库
  if (selectedRow.value.statusFlag !== 3) {
    ElMessage({
      message: `只有待出库状态的销售单可以出库!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确认要出库该销售单吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      outboundBill({
        mainId: selectedRow.value.id,
        version: selectedRow.value.version,
      })
        .then(() => {
          ElMessage({
            message: `出库成功!`,
            type: 'success',
            plain: true,
          });
          handleQuery();
        })
        .catch(() => {
          ElMessage({
            message: `出库失败!`,
            type: 'error',
            plain: true,
          });
        });
    })
    .catch(() => {});
}

const handleFormDialogConfirm = () => {
  formDialogVis.value = false;
  getList();
};
// 分页事件处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};
</script>
