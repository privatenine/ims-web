<script lang="ts" setup>
import type { DamageApi } from '#/api';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addReportLossMain,
  addReportLossSub,
  deleteReportLossSub,
  findRlsList,
  getReportLossCode,
} from '#/api/store/damage';

import { useDetailColumns } from './detailData';
import DetailForm from './detailForm.vue';
import ProductSelect from './productSelect.vue';

interface Props {
  visible: boolean;
  formData?: Partial<DamageApi.ReportLossMainItem>;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: any): void;
  (e: 'add-detail'): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  formData: () => ({}),
});

const emit = defineEmits<Emits>();

const form = ref({
  id: undefined,
  code: '',
  createTime: '',
  createName: '',
  moveWorker: '',
  moveUserId: 0,
  totalMoney: 0,
  totalNum: 0,
  remark: '',
  storeId: 0,
  storeSiteName: '',
  statusFlag: 1,
});

const getModalTitle = computed(() => {
  return `${form.value?.id ? '修改' : '新增'}报损单`;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  centered: true,
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        Object.assign(form.value, values);

        // 如果是编辑、详情或审核模式，加载明细数据
        if (values.id && values.code) {
          loadDetailList(values.id, values.code);
        }
      } else {
        initForm();
      }

      // 初始化明细表格数据
      detailData.value = [];
      if (detailGridApi && detailGridApi.grid && detailGridApi.grid.loadData) {
        detailGridApi.grid.loadData([]);
      }
    }
  },
});

// 明细表格配置
const detailData = ref([]);
const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 300,
    keepSource: true,
    showOverflow: false,
    data: [], // 初始化为空数组
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: false,
    },
  },
});

// 对话框状态管理
const productSelectVisible = ref(false);
const detailFormVisible = ref(false);
const selectedProduct = ref(null);
const currentDetailData = ref(null);

watch(
  () => props.visible,
  (val) => {
    if (val) {
      // 在打开Modal时，将formData传递给Modal
      modalApi.open(props.formData);
    } else {
      modalApi.close();
    }
  },
  { immediate: true },
);

// 同时监听formData的变化
watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      console.log('接收到formData:', newData);
      // 格式化时间戳为日期字符串
      const formattedData = { ...newData };
      if (
        formattedData.createTime &&
        typeof formattedData.createTime === 'number'
      ) {
        const date = new Date(formattedData.createTime);
        formattedData.createTime = date.toISOString().split('T')[0];
      }
      Object.assign(form.value, formattedData);
    }
  },
  { immediate: true, deep: true },
);

// 加载明细列表
async function loadDetailList(mainId: number, code: string) {
  try {
    const params = {
      code,
      mainId,
      pageNum: 1,
      pageSize: 1000,
      sortParam: { field: 'id', type: 1 },
    };
    const response = await findRlsList(params);
    if (response.code === 0 && response.data) {
      const detailData = response.data.map((item) => ({
        id: item.id,
        productName: item.productName || '待选择商品',
        attachment1: item.productAttachmentNames || '',
        origin1: item.productPlaceName || '',
        inventoryQuantity: item.num || 0,
        attachment2: '',
        origin2: '',
        actualQuantity: item.actiNum || 0,
        warehouseName: item.storeName || '',
        binLocation: item.storeSiteName || '',
        remark: item.remark || '',
        _rawData: item,
      }));
      if (detailGridApi && detailGridApi.grid && detailGridApi.grid.loadData) {
        detailGridApi.grid.loadData(detailData);
      }
      updateTotals();
    }
  } catch (error) {
    console.error('加载明细列表失败:', error);
    ElMessage.error('加载明细列表失败');
  }
}

async function initForm() {
  if (props.formData && Object.keys(props.formData).length > 0) {
    Object.assign(form.value, props.formData);
  } else {
    // 新增时的默认值
    const now = new Date();

    // 获取报损单号
    let code = '';
    try {
      const response = await getReportLossCode();
      if (response.code === 1 && response.data) {
        code = response.data;
      } else {
        // 如果接口失败，使用默认生成的单号
        code = `BS${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;
      }
    } catch (error) {
      console.error('获取报损单号失败:', error);
      // 如果接口失败，使用默认生成的单号
      code = `BS${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;
    }

    form.value = {
      id: undefined,
      code,
      createTime: now.toISOString().split('T')[0], // 当前日期 YYYY-MM-DD 格式
      createName: '页面开发',
      moveWorker: '页面开发',
      moveUserId: 1, // 默认用户ID
      totalMoney: 0,
      totalNum: 0,
      remark: '',
      storeId: 0,
      storeSiteName: '',
      statusFlag: 1,
    };
  }
}

async function handleSave() {
  try {
    // 验证必填字段
    if (!form.value.code) {
      ElMessage.error('报损单号不能为空');
      return;
    }

    if (!form.value.storeId) {
      ElMessage.error('请选择仓库');
      return;
    }

    if (detailData.value.length === 0) {
      ElMessage.error('请至少添加一条明细');
      return;
    }

    // 准备提交数据
    const submitData = {
      code: form.value.code,
      moveUserId: form.value.moveUserId,
      remark: form.value.remark || '',
      statusFlag: 1, // 保存状态为草稿
      storeId: form.value.storeId,
      storeSiteName: form.value.storeSiteName || '',
    };

    console.log('保存报损单数据:', submitData);

    // 调用新增API
    const response = await addReportLossMain(submitData);

    if (response.code === 0) {
      ElMessage.success('保存成功');
      // 触发父组件刷新列表
      emit('confirm', { ...form.value, ...submitData });
      modalApi.close();
      emit('update:visible', false);
    } else {
      ElMessage.error(response.msg || '保存失败');
    }
  } catch (error) {
    console.error('保存报损单失败:', error);
    ElMessage.error('保存失败');
  }
}

async function handleSubmit() {
  try {
    // 验证必填字段
    if (!form.value.code) {
      ElMessage.error('报损单号不能为空');
      return;
    }

    if (!form.value.storeId) {
      ElMessage.error('请选择仓库');
      return;
    }

    if (detailData.value.length === 0) {
      ElMessage.error('请至少添加一条明细');
      return;
    }

    // 准备提交数据
    const submitData = {
      code: form.value.code,
      moveUserId: form.value.moveUserId,
      remark: form.value.remark || '',
      statusFlag: 2, // 提交状态为待审核
      storeId: form.value.storeId,
      storeSiteName: form.value.storeSiteName || '',
    };

    console.log('提交报损单数据:', submitData);

    // 调用新增API
    const response = await addReportLossMain(submitData);

    if (response.code === 0) {
      ElMessage.success('提交成功');
      // 触发父组件刷新列表
      emit('confirm', { ...form.value, ...submitData });
      modalApi.close();
      emit('update:visible', false);
    } else {
      ElMessage.error(response.msg || '提交失败');
    }
  } catch (error) {
    console.error('提交报损单失败:', error);
    ElMessage.error('提交失败');
  }
}

function handleCancel() {
  modalApi.close();
  emit('update:visible', false);
}

function handleAddDetail() {
  console.log('新增明细');
  // 触发父组件打开库存选择对话框
  emit('add-detail');
}

function handleEditDetail() {
  console.log('修改明细');
  const selectedRows =
    detailGridApi && detailGridApi.grid
      ? detailGridApi.grid.getCheckboxRecords()
      : [];
  if (selectedRows.length === 0) {
    console.log('请选择要修改的明细');
    return;
  }
  // 直接打开明细表单对话框进行编辑
  currentDetailData.value = selectedRows[0];
  selectedProduct.value = null; // 编辑时不需要商品信息
  detailFormVisible.value = true;
}

async function handleDeleteDetail() {
  const selectedRows =
    detailGridApi && detailGridApi.grid
      ? detailGridApi.grid.getCheckboxRecords()
      : [];
  if (selectedRows.length === 0) {
    console.log('请选择要删除的明细');
    return;
  }

  try {
    // 显示确认对话框
    const confirmed = await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.length} 条明细吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    if (confirmed) {
      // 逐个删除选中的明细
      for (const row of selectedRows) {
        if (row.id && typeof row.id === 'number') {
          try {
            // 调用删除API
            await deleteReportLossSub(row.id);
            console.log('删除明细成功:', row.id);
          } catch (error) {
            console.error('删除明细失败:', error);
            // 继续删除其他明细，不中断流程
          }
        }
      }

      // 从明细数据中删除选中的行
      selectedRows.forEach((row) => {
        const index = detailData.value.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          detailData.value.splice(index, 1);
        }
      });

      updateTotals();

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.reloadData) {
        detailGridApi.reloadData(detailData.value);
      }

      ElMessage.success(`成功删除 ${selectedRows.length} 条明细`);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除明细失败:', error);
      ElMessage.error('删除明细失败');
    }
  }
}

// 添加库存明细（供父组件调用）
async function addBalanceDetail(balance: any) {
  if (!balance) {
    return;
  }

  console.log('添加库存明细:', balance);

  try {
    // 验证表单数据
    if (!form.value.code) {
      ElMessage.error('请先填写报损单号');
      return;
    }

    if (!form.value.storeId) {
      ElMessage.error('请先选择仓库');
      return;
    }

    // 准备调用API的参数
    const submitData = {
      actiNum: balance.actiNum || 0,
      addReportLossMainParam: {
        code: form.value.code,
        moveUserId: form.value.moveUserId,
        remark: form.value.remark || '',
        statusFlag: form.value.statusFlag,
        storeId: form.value.storeId,
        storeSiteName: form.value.storeSiteName || '',
      },
      balanceId: balance.balanceId || 0,
      buyPrice: balance.buyPrice || 0,
      code: form.value.code,
      img_path0: balance.img_path0 || '',
      img_path1: balance.img_path1 || '',
      img_path2: balance.img_path2 || '',
      img_path3: balance.img_path3 || '',
      img_path4: balance.img_path4 || '',
      lossCategoryId: balance.lossCategoryId || 0,
      lossProcessId: balance.lossProcessId || 0,
      mainId: 0, // 新增时主表ID为0
      num: 0, // 报损数量，待用户输入
      operId: form.value.moveUserId,
      operName: form.value.createName,
      price: balance.buyPrice || 0,
      productAttachmentIds: balance.productAttachmentIds || '',
      productAttachmentNames: balance.productAttachmentNames || '',
      productId: balance.productId,
      productName: balance.productName,
      productPlaceId: balance.productPlaceId || 0,
      remark: '',
      storeId: form.value.storeId,
      storeSiteName: form.value.storeSiteName || '',
      supplierId: balance.supplierId || 0,
      supplierName: balance.supplierName || '',
    };

    console.log('提交明细数据:', submitData);

    // 调用新增明细API
    const response = await addReportLossSub(submitData);

    if (response.code === 0) {
      // 添加成功，更新本地数据
      const newDetail = {
        id: response.data?.id || Date.now() + Math.random(), // 使用API返回的ID或临时ID
        productId: balance.productId,
        productName: balance.productName,
        productPlaceName: balance.productPlaceName || '',
        storeName: balance.storeName,
        storeSiteName: balance.siteName || '',
        currentStock: balance.actiNum || 0, // 当前库存数量
        damageQuantity: 0, // 报损数量，待用户输入
        unitPrice: balance.buyPrice || 0, // 使用库存的采购价格作为单价
        totalPrice: 0, // 总价，待计算
        remark: '', // 备注
        // 其他相关字段
        attachment: balance.productAttachmentNames || '',
        supplierName: balance.supplierName || '',
        _rawData: response.data, // 保存API返回的原始数据
      };

      detailData.value.push(newDetail);

      // 更新总计信息
      updateTotals();

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.grid && detailGridApi.grid.loadData) {
        detailGridApi.grid.loadData(detailData.value);
      }

      ElMessage.success('添加明细成功');
    } else {
      ElMessage.error(response.msg || '添加明细失败');
    }
  } catch (error) {
    console.error('添加明细失败:', error);
    ElMessage.error('添加明细失败');
  }
}

// 暴露方法给父组件
defineExpose({
  addBalanceDetail,
});

// 商品选择确认回调（保留原有逻辑，以防其他地方还在使用）
function onProductSelectConfirm(product: any) {
  console.log('选择的商品:', product);
  selectedProduct.value = product;
  currentDetailData.value = null; // 新增时清空编辑数据
  // 打开明细表单对话框
  detailFormVisible.value = true;
}

// 明细表单确认回调
function onDetailFormConfirm(detailInfo: any) {
  console.log('明细信息:', detailInfo);

  if (currentDetailData.value) {
    // 编辑模式：更新现有明细
    const index = detailData.value.findIndex(
      (item) => item.id === currentDetailData.value.id,
    );
    if (index !== -1) {
      detailData.value[index] = {
        ...detailData.value[index],
        ...detailInfo,
      };
    }
  } else {
    // 新增模式：添加新明细
    const newDetail = {
      id: Date.now(), // 临时ID
      ...detailInfo,
      flowNo: `FL${Date.now()}`, // 生成流水号
    };
    detailData.value.push(newDetail);
  }

  // 更新总数和总金额
  updateTotals();

  // 重新加载表格数据
  if (detailGridApi && detailGridApi.reloadData) {
    detailGridApi.reloadData(detailData.value);
  }
}

// 更新总计信息
function updateTotals() {
  form.value.totalNum = detailData.value.reduce(
    (sum, item) => sum + (Number(item.damageQuantity) || 0),
    0,
  );
  form.value.totalMoney = detailData.value.reduce(
    (sum, item) => sum + (Number(item.totalPrice) || 0),
    0,
  );
}
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <ElForm :model="form" label-width="100px" class="damage-form">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="制单日期:">
            <ElInput v-model="form.createTime" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="制单员:">
            <ElInput v-model="form.createName" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="单号:">
            <ElInput v-model="form.code" disabled />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="仓库:">
            <ElSelect
              v-model="form.storeId"
              placeholder="请选择仓库"
              style="width: 100%"
            >
              <ElOption label="仓库1" :value="1" />
              <ElOption label="仓库2" :value="2" />
              <ElOption label="仓库3" :value="3" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="库位:">
            <ElInput v-model="form.storeSiteName" placeholder="请输入库位" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="移动员工:">
            <ElInput v-model="form.moveWorker" disabled />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="总金额:">
            <ElInput v-model="form.totalMoney" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="总数:">
            <ElInput v-model="form.totalNum" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="状态:">
            <ElInput
              :value="
                form.statusFlag === 1
                  ? '草稿'
                  : form.statusFlag === 2
                    ? '待审核'
                    : '未知'
              "
              disabled
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="备注:">
            <ElInput
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="handleSave">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        保存
      </ElButton>
      <ElButton type="primary" @click="handleSubmit">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:save-outline"
        />
        提交
      </ElButton>
      <ElButton type="primary" @click="handleAddDetail">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="ant-design:plus-outlined"
        />
        新增明细
      </ElButton>
      <ElButton type="primary" @click="handleEditDetail">
        <IconifyIcon
          icon="line-md:edit-twotone"
          class="size-5"
          style="margin-right: 4px"
        />
        修改明细
      </ElButton>
      <ElButton type="primary" @click="handleDeleteDetail">
        <IconifyIcon
          icon="mdi:trash-can-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        删除明细
      </ElButton>
    </ElButtonGroup>
    <DetailGrid table-title="明细列表" class="p-raw h-full w-full" />

    <!-- 商品选择对话框 -->
    <ProductSelect
      v-model:visible="productSelectVisible"
      @confirm="onProductSelectConfirm"
    />

    <!-- 明细信息对话框 -->
    <DetailForm
      v-model:visible="detailFormVisible"
      :product-data="selectedProduct"
      :detail-data="currentDetailData"
      @confirm="onDetailFormConfirm"
    />
  </Modal>
</template>

<style lang="css" scoped></style>
