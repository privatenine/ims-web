<script lang="ts" setup>
import type { CheckApi } from '#/api';

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
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addInventorySub2,
  createInventoryMain2,
  deleteInventorySub2ById,
  findIs2List,
} from '#/api/store/check';
import { getStorageOptions, hasCachedStorageList } from '#/utils/storage';

import { useDetailColumns } from './detailData';
import InventoryDetailForm from './inventoryDetailForm.vue';

interface Props {
  visible?: boolean;
  formData?: Partial<CheckApi.InventoryMain2RespVO>;
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
  id: undefined as number | undefined,
  code: '',
  createTime: '',
  createName: '',
  quantity: 0,
  totalAmount: 0,
  remark: '',
  storeId: undefined as number | undefined,
  storeName: '',
});

const getModalTitle = computed(() => {
  return `${form.value?.id ? '修改' : '新增'}盘盈盘亏`;
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
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 每次打开对话框时都重新加载仓库选项
      initStorageOptions();
      
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        Object.assign(form.value, values);
        // 如果是修改模式，加载现有明细数据
        if (values.id) {
          await loadExistingDetails(values.id, values.code);
        }
      } else {
        initForm();
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
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    toolbarConfig: {
      custom: false,
    },
  },
  gridEvents: {
    cellEditClosed: ({ row, column }) => {
      // 当盈亏数量被编辑后，重新计算金额
      if (column.field === 'profitLossQuantity') {
        const profitLossQuantity = Number(row.profitLossQuantity) || 0;
        const unitPrice = Number(row.costUnitPrice) || 0;
        row.amount = profitLossQuantity * unitPrice;

        // 更新总计
        updateTotals();
      }
    },
  },
});

// 对话框状态管理
const detailFormVisible = ref(false);
const selectedBalance = ref(null);
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
      // 映射父组件数据到表单字段
      const formattedData = {
        id: newData.id,
        code: newData.code || '',
        createName: newData.createName || '',
        quantity: newData.totalNum || 0,
        totalAmount: newData.totalPrice || 0,
        remark: newData.remark || '',
        storeId: newData.storeId || undefined,
        storeName: newData.storeName || '',
      };

      // 格式化时间戳为日期字符串
      if (newData.createTime && typeof newData.createTime === 'number') {
        const date = new Date(newData.createTime);
        formattedData.createTime = date.toISOString().split('T')[0];
      }

      Object.assign(form.value, formattedData);
      console.log('表单数据已更新:', form.value);
    }
  },
  { immediate: true, deep: true },
);

// 获取仓库选项
const storageOptions = ref([]);

// 初始化仓库选项
function initStorageOptions(showSuccessMsg = false) {
  try {
    if (!hasCachedStorageList()) {
      console.warn('本地缓存中没有仓库数据，请先登录或刷新数据');
      ElMessage.warning('未找到仓库数据，请先刷新页面或重新登录');
      storageOptions.value = [];
      return;
    }
    
    const options = getStorageOptions();
    storageOptions.value = options || [];
    console.log('从本地缓存加载仓库选项:', options.length, '个');
    
    if (options.length === 0) {
      ElMessage.warning('仓库数据为空，请联系管理员');
    } else if (showSuccessMsg) {
      ElMessage.success(`成功加载 ${options.length} 个仓库`);
    }
  } catch (error) {
    console.error('获取仓库选项失败:', error);
    storageOptions.value = [];
    ElMessage.error('加载仓库数据失败');
  }
}

// 仓库选择变化处理
function handleStoreChange(storeId: number) {
  const selectedStore = storageOptions.value.find(
    (store) => store.value === storeId,
  );
  if (selectedStore) {
    form.value.storeName = selectedStore.label;
  }
}

function initForm() {
  if (props.formData && Object.keys(props.formData).length > 0) {
    // 映射父组件数据到表单字段
    const formattedData = {
      id: props.formData.id,
      code: props.formData.code || '',
      createName: props.formData.createName || '',
      quantity: props.formData.totalNum || 0,
      totalAmount: props.formData.totalPrice || 0,
      remark: props.formData.remark || '',
      storeId: props.formData.storeId || undefined,
      storeName: props.formData.storeName || '',
    };

    // 格式化时间戳为日期字符串
    if (
      props.formData.createTime &&
      typeof props.formData.createTime === 'number'
    ) {
      const date = new Date(props.formData.createTime);
      formattedData.createTime = date.toISOString().split('T')[0];
    }

    Object.assign(form.value, formattedData);
  } else {
    // 新增时的默认值
    const now = new Date();
    form.value = {
      id: undefined,
      code: `PYPK${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${Date.now().toString().slice(-8)}`,
      createTime: now.toISOString().split('T')[0],
      createName: '页面开发',
      quantity: 0,
      totalAmount: 0,
      remark: '',
      storeId: undefined,
      storeName: '',
    };
  }

  // 初始化仓库选项
  initStorageOptions();
}

async function handleSave() {
  try {
    // 验证必填字段
    if (!form.value.storeId) {
      ElMessage.warning('请选择仓库');
      return;
    }

    if (!form.value.code) {
      ElMessage.warning('单号不能为空');
      return;
    }

    // 准备提交数据
    const submitData: CheckApi.CreateInventoryMain2Param = {
      code: form.value.code,
      remark: form.value.remark || '',
      statusFlag: 1, // 草稿状态
      storeId: form.value.storeId,
    };

    console.log('提交数据:', submitData);

    // 调用API创建盘盈盘亏单
    const response = await createInventoryMain2(submitData);

    if (response.code === 200) {
      ElMessage.success('保存成功');
      // 触发父组件刷新列表
      emit('confirm', form.value);
      modalApi.close();
      emit('update:visible', false);
    } else {
      ElMessage.error(response.msg || '保存失败');
    }
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  }
}

function handleSubmit() {
  // TODO: 调用提交接口
  emit('confirm', form.value);
  modalApi.close();
  emit('update:visible', false);
}

function handleAddDetail() {
  // 触发父组件打开库存选择对话框
  emit('add-detail');
}

function handleEditDetail() {
  const selectedRows = detailGridApi.getCheckboxRecords();
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择要修改的明细');
    return;
  }
  // 直接打开明细表单对话框进行编辑
  currentDetailData.value = selectedRows[0];
  selectedBalance.value = null; // 编辑时不需要库存信息
  detailFormVisible.value = true;
}

async function handleDeleteDetail() {
  const selectedRows = detailGridApi.getCheckboxRecords();
  if (selectedRows.length === 0) {
    ElMessage.warning('请选择要删除的明细');
    return;
  }

  try {
    // 确认删除
    const confirmResult = await ElMessage.confirm(
      `确定要删除选中的 ${selectedRows.length} 条明细吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    if (confirmResult) {
      // 逐个删除选中的明细
      const deletePromises = selectedRows.map(async (row) => {
        if (row.id && typeof row.id === 'number') {
          try {
            const response = await deleteInventorySub2ById(row.id);
            return response.code === 200
              ? { success: true, id: row.id }
              : { success: false, id: row.id, error: response.msg };
          } catch (error) {
            console.error(`删除明细 ${row.id} 失败:`, error);
            return { success: false, id: row.id, error: '网络错误' };
          }
        } else {
          // 如果是临时数据（没有真实ID），直接从本地删除
          return { success: true, id: row.id, isLocal: true };
        }
      });

      const results = await Promise.all(deletePromises);
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      // 从明细数据中删除选中的行
      selectedRows.forEach((row) => {
        const index = detailData.value.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          detailData.value.splice(index, 1);
        }
      });

      // 更新总计信息
      updateTotals();

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData(detailData.value);
      }

      // 显示删除结果
      if (failCount === 0) {
        ElMessage.success(`成功删除 ${successCount} 条明细`);
      } else {
        ElMessage.warning(
          `删除完成：成功 ${successCount} 条，失败 ${failCount} 条`,
        );
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除明细失败:', error);
      ElMessage.error('删除明细失败，请重试');
    }
  }
}

// 加载现有明细数据（修改模式时使用）
async function loadExistingDetails(mainId: number | string, code?: string) {
  try {
    const result = await findIs2List({
      mainId,
      code: code || form.value.code || '',
      pageNum: 1,
      pageSize: 1000, // 设置较大的页面大小以获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    });
    
    const existingDetails = result.data || [];
    detailData.value = existingDetails;
    detailGridApi.grid.loadData(existingDetails);
    
    console.log('加载现有明细数据成功:', existingDetails.length, '条');
  } catch (error) {
    console.error('加载现有明细数据失败:', error);
    detailData.value = [];
    detailGridApi.grid.loadData([]);
  }
}

// 添加库存明细（供父组件调用）
async function addBalanceDetail(balance: any) {
  if (!balance) {
    return;
  }

  try {
    // 验证主表信息
    if (!form.value.storeId) {
      ElMessage.warning('请先选择仓库');
      return;
    }

    if (!form.value.code) {
      ElMessage.warning('单号不能为空');
      return;
    }

    // 准备提交数据
    const submitData: CheckApi.AddInventorySub2Param = {
      addInventoryMain2Param: {
        code: form.value.code,
        remark: form.value.remark || '',
        statusFlag: 1, // 草稿状态
        storeId: form.value.storeId,
      },
      balanceId: balance.id || 0,
      buyPrice: balance.buyPrice || 0,
      code: form.value.code,
      mainId: form.value.id || 0, // 如果是新增，这里会是0
      num: 0, // 盈亏数量，初始为0
      productAttachmentIds: balance.productAttachmentIds || '',
      productAttachmentNames: balance.productAttachmentNames || '',
      productId: balance.productId || 0,
      productName: balance.productName || '',
      productPlaceId: balance.productPlaceId || 0,
      remark: '',
      statusFlag: 1, // 草稿状态
      storeId: form.value.storeId,
      storeSiteName: balance.productPlaceName || '',
      supplierId: balance.supplierId || 0,
      supplierName: balance.supplierName || '',
    };

    console.log('提交明细数据:', submitData);

    // 调用API添加明细
    const response = await addInventorySub2(submitData);

    if (response.code === 200) {
      ElMessage.success('成功添加明细');

      // 将选中的库存添加到明细表格
      const newDetail = {
        id: response.data?.id || Date.now() + Math.random(),
        productId: balance.productId,
        productName: balance.productName,
        productPlaceName: balance.productPlaceName,
        storeName: balance.storeName,
        stockQuantity: balance.actiNum, // 当前库存数量
        profitLossQuantity: 0, // 盈亏数量，待用户输入
        costUnitPrice: balance.buyPrice || 0, // 使用库存的采购价格作为成本单价
        amount: 0, // 金额，待计算
        remark: '', // 备注
        // 其他相关字段
        attachment: balance.productAttachmentNames || '',
        origin: balance.siteName || '',
        // 新增字段
        balanceId: balance.id,
        mainId: response.data?.mainId || 0,
        supplierId: balance.supplierId,
        supplierName: balance.supplierName,
      };

      detailData.value.push(newDetail);

      // 更新总计信息
      updateTotals();

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData(detailData.value);
      }
    } else {
      ElMessage.error(response.msg || '添加明细失败');
    }
  } catch (error) {
    console.error('添加明细失败:', error);
    ElMessage.error('添加明细失败，请重试');
  }

  // 关闭对话框
  emit('add-detail');
}

// 暴露方法给父组件
defineExpose({
  addBalanceDetail,
});

// 明细表单确认回调
function onDetailFormConfirm(detailInfo: any) {
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
    };
    detailData.value.push(newDetail);
  }

  // 更新总数和总金额
  updateTotals();

  // 重新加载表格数据
  if (detailGridApi && detailGridApi.grid) {
    detailGridApi.grid.reloadData(detailData.value);
  }
}

// 更新总计信息
function updateTotals() {
  form.value.quantity = detailData.value.reduce(
    (sum, item) => sum + (Number(item.profitLossQuantity) || 0),
    0,
  );
  form.value.totalAmount = detailData.value.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );
}
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <ElForm :model="form" label-width="100px" class="inventory-form">
      <ElRow :gutter="20">
        <ElCol :span="8">
          <ElFormItem label="制单日期:">
            <ElInput v-model="form.createTime" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="制单员工:">
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
          <ElFormItem label="数量:">
            <ElInput v-model="form.quantity" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="金额:">
            <ElInput v-model="form.totalAmount" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="仓库:">
            <div class="flex items-center gap-2">
              <ElSelect
                v-model="form.storeId"
                placeholder="请选择仓库"
                class="flex-1"
                @change="handleStoreChange"
              >
                <ElOption
                  v-for="item in storageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
              <ElButton
                size="small"
                type="primary"
                @click="() => initStorageOptions(true)"
                title="刷新仓库数据"
              >
                <IconifyIcon icon="material-symbols:refresh" />
              </ElButton>
            </div>
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

    <!-- 明细信息对话框 -->
    <InventoryDetailForm
      v-model:visible="detailFormVisible"
      :balance-data="selectedBalance"
      :detail-data="currentDetailData"
      @confirm="onDetailFormConfirm"
    />
  </Modal>
</template>

<style lang="css" scoped></style>
