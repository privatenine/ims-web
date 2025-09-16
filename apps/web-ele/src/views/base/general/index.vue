<template>
  <div class="app-container">
    <div class="query-form-container">
      <!-- 搜索表单 -->
      <el-form
        :model="queryParams"
        :inline="true"
        class="query-form"
        label-width="110px"
        @submit.prevent="handleQuery"
      >
        <el-form-item label="简拼码" prop="jianPinCode">
          <el-input
            v-model="queryParams.jianPinCode"
            placeholder="请输入简拼码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入产品名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="排除名称中包含" prop="exclude">
          <el-input
            v-model="queryParams.exclude"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="车系" prop="carSeriesId">
          <el-select
            v-model="queryParams.carSeriesId"
            placeholder="请选择车系"
            clearable
            @change="handleQuery"
          >
            <el-option
              v-for="item in carSeriesOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="车型" prop="carModelId">
          <el-select
            v-model="queryParams.carModelId"
            placeholder="请选择车型"
            clearable
            @change="handleQuery"
          >
            <el-option
              v-for="item in carModelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="安装位置" prop="positionId">
          <el-select
            v-model="queryParams.positionId"
            placeholder="请选择安装位置"
            clearable
            @change="handleQuery"
          >
            <el-option
              v-for="item in positionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型" prop="carTypeId">
          <el-select
            v-model="queryParams.carTypeId"
            placeholder="请选择类型"
            clearable
            @change="handleQuery"
          >
            <el-option
              v-for="item in carTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否在用" prop="settingsEnable">
          <el-select
            v-model="queryParams.settingsEnable"
            placeholder="请选择"
            clearable
            @change="handleQuery"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="只显示公用" prop="isPublic">
          <el-select
            v-model="queryParams.isPublic"
            placeholder="请选择"
            clearable
            @change="handleQuery"
          >
            <el-option label="公用" :value="1" />
            <el-option label="私用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否模糊查询" prop="isFuzzy">
          <el-select
            v-model="queryParams.isFuzzy"
            placeholder="请选择"
            clearable
            @change="handleQuery"
          >
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
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
        <ElButton
          type="primary"
          @click="handleAdd"
          v-if="rights.includes('新增')"
        >
          <IconifyIcon
            icon="ant-design:plus-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          新增
        </ElButton>
        <ElButton
          type="primary"
          @click="handleUpdate"
          v-if="rights.includes('修改')"
        >
          <IconifyIcon
            icon="line-md:edit-twotone"
            class="size-5"
            style="margin-right: 4px"
          />
          修改
        </ElButton>
        <ElButton
          type="primary"
          @click="openDetail"
          v-if="rights.includes('详情')"
        >
          <IconifyIcon
            icon="fluent:apps-list-detail-20-regular"
            class="size-5"
            style="margin-right: 4px"
          />
          详情
        </ElButton>
        <ElButton
          type="primary"
          @click="uptProjectJPM"
          v-if="rights.includes('重生拼音码')"
        >
          <IconifyIcon
            icon="material-symbols:language-pinyin-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          重新生成拼音
        </ElButton>
        <ElButton type="primary" disabled v-if="rights.includes('下载')">
          <IconifyIcon
            icon="material-symbols:download-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          下载数据
        </ElButton>
        <ElButton type="primary" disabled v-if="rights.includes('上传')">
          <IconifyIcon
            icon="material-symbols:upload-rounded"
            class="size-5"
            style="margin-right: 4px"
          />
          上传数据
        </ElButton>
        <ElButton
          type="primary"
          @click="onDelete"
          v-if="rights.includes('删除')"
        >
          <IconifyIcon
            icon="mdi:trash-can-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          删除
        </ElButton>
        <ElButton
          type="primary"
          @click="upEnable"
          v-if="rights.includes('启用/停用')"
        >
          <IconifyIcon
            icon="mdi:list-status"
            class="size-5"
            style="margin-right: 4px"
          />
          公用资料启/停用
        </ElButton>
        <ElButton
          type="primary"
          @click="uptStatus"
          v-if="rights.includes('启用/停用')"
        >
          <IconifyIcon
            icon="mdi:list-status"
            class="size-5"
            style="margin-right: 4px"
          />
          启用/停用
        </ElButton>
        <ElButton
          type="primary"
          @click="upPublic"
          v-if="rights.includes('提交公用')"
        >
          <IconifyIcon
            icon="mdi:list-status"
            class="size-5"
            style="margin-right: 4px"
          />
          提交公用
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
        <el-table-column width="30" align="center">
          <template #default="{ row }">
            <el-radio v-model="selectedRowId" :value="row.dataId" @click.stop>
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column prop="name" label="产品名称" width="200" />
        <el-table-column prop="jianPinCode" label="简拼码" width="100" />
        <el-table-column prop="baseName" label="通用车型" width="100" />
        <el-table-column prop="carModelName" label="车型名称" width="100" />
        <el-table-column prop="carSeriesName" label="车系名称" width="100" />
        <el-table-column prop="carTypeName" label="类型名称" width="100" />
        <el-table-column prop="dataEnable" label="状态" width="80">
          <template #default="{ row }">
            <ElTag
              :type="productDataEnableMap[row.dataEnable]?.color || 'danger'"
            >
              {{ productDataEnableMap[row.dataEnable]?.name || '未知' }}
            </ElTag>
          </template>
        </el-table-column>
        <el-table-column prop="dataRemark" label="备注" width="200" />
        <el-table-column prop="dataUpdateTime" label="修改时间" width="100">
          <template #default="{ row }">
            {{ dayjs(row.dataUpdateTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="diagonal" label="对角" width="80" />
        <el-table-column prop="downLength" label="下长" width="80" />
        <el-table-column prop="jianPinCode" label="简拼码" width="200" />
        <el-table-column prop="listYear" label="上市年份" width="80" />
        <el-table-column prop="lowerLimit" label="下限" width="80" />
        <el-table-column prop="middleLength" label="中高" width="80" />
        <el-table-column prop="norms" label="规格" width="80" />
        <el-table-column prop="positionName" label="安装位置名称" width="100" />
        <el-table-column
          prop="settingsCreateTime"
          label="辅助表创建时间"
          width="110"
        >
          <template #default="{ row }">
            {{ dayjs(row.settingsCreateTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="settingsEnable" label="是否在用" width="80">
          <template #default="{ row }">
            <ElTag
              :type="
                productDataEnableMap[row.settingsEnable]?.color || 'danger'
              "
            >
              {{ productDataEnableMap[row.settingsEnable]?.name || '未知' }}
            </ElTag>
          </template>
        </el-table-column>
        <el-table-column prop="settingsRemark" label="辅助表备注" width="200" />
        <el-table-column
          prop="settingsUpdateTime"
          label="辅助表修改时间"
          width="110"
        >
          <template #default="{ row }">
            {{ dayjs(row.settingsUpdateTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="stopYear" label="停产年份" width="80" />
        <el-table-column prop="upperLimit" label="上限" width="80" />
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
      @confirm="handleQuery"
      class="custom-modal-width"
    />

    <DetailModel class="custom-modal-width" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  // deleteProductByIds,
  // getProductList,
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
  // updateProduct,
  // updateProjectDisable,
  // updateProjectEnable,
  // updateProjectJPM,
} from '#/api';
import { productDataEnableMap, useMenuRights } from '#/utils';

import formDialog from './formDialog.vue';
import Detail from './modules/detail.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);

// 初始化时获取数据
onMounted(() => {
  getList();
  initOptions();
});

// 各种选项数据
const carModelOptions = ref<Array<any>>([]);
const carSeriesOptions = ref<Array<any>>([]);
const positionOptions = ref<Array<any>>([]);
const carTypeOptions = ref<Array<any>>([]);
const initOptions = () => {
  Promise.all([
    getVehicleModelList(),
    getVehicleSeriesList(),
    getVehicleTypeList(),
    getVehiclePositionList(),
  ]).then(([modelRes, seriesRes, typeRes, positionRes]) => {
    carModelOptions.value = modelRes.data;
    carSeriesOptions.value = seriesRes.data;
    carTypeOptions.value = typeRes.data;
    positionOptions.value = positionRes.data;
  });
};

const formDialogVis = ref(false);
const formData = ref({});

// 添加选中行的ID
const selectedRowId = ref('');
const selectedRow = computed(() => {
  return tableData.value.find((row: any) => row.dataId === selectedRowId.value);
});

// 添加处理行点击的函数
const handleRowClick = (row: any) => {
  selectedRowId.value = row.dataId;
};

// 搜索表单数据
const queryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  name: '',
  jianPinCode: '',
  exclude: '',
  carSeriesId: undefined,
  carModelId: undefined,
  positionId: undefined,
  carTypeId: undefined,
  settingsEnable: undefined,
  isPublic: undefined,
  isFuzzy: undefined,
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
    queryParams[key] = undefined;
  });
  queryParams.pageNum = 1;
  queryParams.pageSize = 20;
  getList();
};

// 获取表格数据
const getList = async () => {
  const p = JSON.parse(JSON.stringify(queryParams));

  // const res = await getProductList(p);
  // tableData.value = res.data;
  // total.value = res.total;
};

const handleAdd = () => {
  formData.value = {};
  formDialogVis.value = true;
};

function handleUpdate() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  formData.value = {
    ...selectedRow.value,
    id: selectedRow.value.dataId,
    remark: selectedRow.value.dataRemark,
    settingRemark: selectedRow.value.settingsRemark,
    enable: selectedRow.value.dataEnable,
  };
  formDialogVis.value = true;
}

const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  centered: true,
});

function openDetail() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  detailModelApi
    .setData({
      ...selectedRow.value,
      remark: selectedRow.value.dataRemark,
      settingRemark: selectedRow.value.settingsRemark,
    })
    .open();
}
function upEnable() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  ElMessageBox.confirm('确定要更改当前数据的启用状态吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const p = {
        ...selectedRow.value,
        id: selectedRow.value.dataId,
        remark: selectedRow.value.dataRemark,
        settingRemark: selectedRow.value.settingsRemark,
        enable: selectedRow.value.dataEnable == 1 ? 0 : 1,
      };
      // updateProduct(p).then(() => {
      //   ElMessage({
      //     message: `操作成功!`,
      //     type: 'success',
      //     plain: true,
      //   });
      //   handleQuery();
      // });
    })
    .catch(() => {});
}
function upPublic() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }
  ElMessageBox.confirm('确定要提交公用吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const p = {
        ...selectedRow.value,
        id: selectedRow.value.dataId,
        remark: selectedRow.value.dataRemark,
        settingRemark: selectedRow.value.settingsRemark,
        enable: selectedRow.value.dataEnable,
        isPublic: 1,
      };
      // updateProduct(p).then(() => {
      //   ElMessage({
      //     message: `操作成功!`,
      //     type: 'success',
      //     plain: true,
      //   });
      //   handleQuery();
      // });
    })
    .catch(() => {});
}

function uptStatus() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确定要更改当前数据的启用状态吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // (selectedRow.value.settingsEnable
      //   ? updateProjectDisable({ id: selectedRow.value.dataId })
      //   : updateProjectEnable({ id: selectedRow.value.dataId })
      // ).then(() => {
      //   ElMessage({
      //     message: `操作成功!`,
      //     type: 'success',
      //     plain: true,
      //   });
      //   handleQuery();
      // });
    })
    .catch(() => {});
}

function uptProjectJPM() {
  if (!selectedRow.value?.dataId) {
    ElMessage({
      message: `请选择一条数据!`,
      type: 'warning',
      plain: true,
    });
    return;
  }

  ElMessageBox.confirm('确定要重新生成简拼码吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // updateProjectJPM({
      //   id: selectedRow.value.dataId,
      // }).then(() => {
      //   ElMessage({
      //     message: `操作成功!`,
      //     type: 'success',
      //     plain: true,
      //   });
      //   handleQuery();
      // });
    })
    .catch(() => {});
}

function onDelete() {
  if (!selectedRow.value?.dataId) {
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
      // deleteProductByIds({ ids: [selectedRow.value.dataId] })
      //   .then(() => {
      //     ElMessage({
      //       message: `删除成功!`,
      //       type: 'success',
      //       plain: true,
      //     });
      //     handleQuery();
      //   })
      //   .catch(() => {
      //     ElMessage({
      //       message: `删除失败!`,
      //       type: 'error',
      //       plain: true,
      //     });
      //   });
    })
    .catch(() => {});
}

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
