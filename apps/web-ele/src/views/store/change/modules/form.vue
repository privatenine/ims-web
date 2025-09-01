<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ChangeApi } from '#/api/store/change';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addTransferMain,
  addTransferSub,
  deleteTransferSub,
  findTsList,
  getTransferCode,
} from '#/api/store/change';
import BalanceSelectDialog from '#/components/BalanceSelectDialog.vue';

import { useDetailColumns, useFormSchema } from '../data';
import DetailForm from './detailForm.vue';

const emits = defineEmits(['success']);

const formData = ref<Record<string, any>>({});

// 子对话框的打开状态
const balanceSelectOpen = ref(false);
const detailFormOpen = ref(false);

// 存储选择的库存数据
const selectedBalanceData = ref<any>(null);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
  },
});

const getModalTitle = computed(() => {
  return `${formData.value?.id ? '修改' : '新增'}移库`;
});

// 检查是否有明细数据
const hasDetailData = computed(() => {
  return detailData.value && detailData.value.length > 0;
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: true,
  showConfirmButton: false,
  draggable: true,
  centered: true,
  closeOnEsc: true,
  closeOnClickModal: false,
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (values) {
        // 转换接口数据为表单期望的格式
        const formValues = transformApiDataToFormData(values);
        formData.value = formValues;
        formApi.setValues(formValues);
        console.log('设置表单数据:', formValues);

        // 如果是修改、详情或审核模式，加载明细列表
        if (formValues.id && formValues.id > 0) {
          loadTransferSubList(formValues.id);
        }
      } else {
        // 新增时的默认值
        initNewForm();
      }
    }
  },
});

// 明细数据
const detailData = ref<any[]>([]);

// 转换接口数据为表单期望的格式
function transformApiDataToFormData(apiData: Record<string, any>) {
  // 将时间戳转换为YYYY-MM-DD格式
  const orderDate = apiData.operTime
    ? new Date(apiData.operTime).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  // 将移库方式代码转换为中文
  const transferMethod =
    apiData.fashion === 'CORRECT' ? '修正货位' : '移动货位';

  return {
    id: apiData.id,
    code: apiData.code,
    orderDate, // 制单日期
    orderCreator: apiData.operName || apiData.createName, // 制单人员
    transferMethod, // 移库方式（中文）
    fashion: apiData.fashion, // 移库方式（英文代码）
    remark: apiData.remark || '',
    statusFlag: apiData.statusFlag,
    totalNum: apiData.totalNum || 0,
    totalPrice: apiData.totalPrice || 0,
    createTime: apiData.createTime,
    createId: apiData.createId,
    createName: apiData.createName,
    operId: apiData.operId,
    operName: apiData.operName,
    operTime: apiData.operTime,
    version: apiData.version,
  };
}

// 加载移库单明细列表
async function loadTransferSubList(mainId: number) {
  try {
    if (!mainId || mainId === 0) {
      console.log('移库单ID无效，跳过加载明细');
      detailData.value = [];
      return;
    }

    console.log('开始加载移库单明细，mainId:', mainId);

    // 使用新的接口获取明细数据
    const response = await findTsList({
      mainId,
      pageNum: 1,
      pageSize: 1000, // 设置较大的页面大小以获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    });

    if (response.data && Array.isArray(response.data)) {
      // 转换明细数据为表格期望的格式
      const transformedDetails = response.data.map((item: any) => ({
        id: item.id,
        productId: item.productId || 0,
        productName: item.productName || '',
        attachment: item.productAttachmentNames || item.attachment || '',
        origin: item.productPlaceName || item.origin || '',
        oldWarehouseName: item.oldStoreName || item.oldWarehouseName || '',
        oldWarehouseLocation:
          item.oldStoreSiteName || item.oldWarehouseLocation || '',
        transferQuantity: item.num || item.transferQuantity || 0,
        newWarehouse: item.newStoreName || item.newWarehouse || '',
        newWarehouseLocation:
          item.newStoreSiteName || item.newWarehouseLocation || '',
        transferMainId: item.mainId || item.transferMainId || mainId,
        // 新增字段映射
        actiNum: item.actiNum || 0,
        balanceId: item.balanceId || 0,
        price: item.price || 0,
        totalPrice: item.totalPrice || 0,
        supplierName: item.supplierName || '',
        remark: item.remark || '',
      }));

      detailData.value = transformedDetails;

      // 重新加载表格数据
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData(transformedDetails);
      }

      console.log('成功加载明细数据:', transformedDetails);
    } else {
      console.log('没有明细数据或数据格式错误');
      detailData.value = [];
      if (detailGridApi && detailGridApi.grid) {
        detailGridApi.grid.reloadData([]);
      }
    }
  } catch (error) {
    console.error('加载明细数据失败:', error);
    ElMessage.error('加载明细数据失败');
    detailData.value = [];
    if (detailGridApi && detailGridApi.grid) {
      detailGridApi.grid.reloadData([]);
    }
  }
}

// 明细表格
const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 400,
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
      export: false,
      refresh: false,
      search: false,
      zoom: false,
    },
  } as VxeTableGridOptions,
  gridEvents: {
    editClosed({ row, column }) {
      // 编辑完成后的处理
      if (column.field === 'transferQuantity') {
        updateTotalCount();
      }
    },
  },
});

// 初始化新表单
async function initNewForm() {
  try {
    // 获取当前日期
    const currentDate = new Date().toISOString().split('T')[0];

    // 获取当前登录用户信息
    const currentUser = getCurrentUser();
    console.log('当前用户:', currentUser);

    // 调用接口获取移库单号
    const codeResponse = await getTransferCode();
    console.log('获取移库单号响应:', codeResponse);

    const newFormData = {
      code: codeResponse.data || '',
      transferMethod: '修正货位',
      orderDate: currentDate, // 制单日期默认为当前日期
      orderCreator: currentUser.name, // 制单人员为当前登录用户
      remark: '',
      details: [],
    };

    console.log('设置表单数据:', newFormData);
    formData.value = newFormData;
    formApi.setValues(newFormData);

    // 清空明细数据
    detailData.value = [];
    if (detailGridApi && detailGridApi.grid) {
      detailGridApi.grid.reloadData([]);
    }
  } catch (error) {
    console.error('初始化表单失败:', error);
    ElMessage.error('获取移库单号失败，使用本地生成');
    // 如果接口调用失败，使用本地生成的单号
    generateCodeLocally();
  }
}

// 获取当前登录用户信息
function getCurrentUser(): { id: number; name: string } {
  try {
    // 从 localStorage 获取用户信息
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      return {
        id: userInfo.userId || 0,
        name: userInfo.realName || userInfo.username || '当前用户',
      };
    }
  } catch (error) {
    console.warn('获取用户信息失败:', error);
  }

  return {
    id: 0,
    name: '当前用户',
  };
}

// 本地生成移库单号（备用方案）
function generateCodeLocally() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const code = `YKD${year}${month}${day}${random}`;

  const currentDate = new Date().toISOString().split('T')[0];
  const currentUser = getCurrentUser();

  const newFormData = {
    code,
    transferMethod: '修正货位',
    orderDate: currentDate,
    orderCreator: currentUser.name,
    transferPersonnel: currentUser.name,
    quantity: 0,
    remark: '',
    details: [],
  };

  console.log('使用本地生成的表单数据:', newFormData);
  formData.value = newFormData;
  formApi.setValues(newFormData);

  // 清空明细数据
  detailData.value = [];
  if (detailGridApi && detailGridApi.grid) {
    detailGridApi.grid.reloadData([]);
  }
}

// 新增明细
function onAddDetail() {
  // 直接打开库存选择对话框
  balanceSelectOpen.value = true;
}

// 处理库存选择
function onBalanceSelect(selectedBalance: any) {
  console.log('选择的库存:', selectedBalance);

  // 存储选择的库存数据
  selectedBalanceData.value = selectedBalance;

  // 打开添加明细对话框
  detailFormOpen.value = true;
}

// 处理明细添加
async function onDetailAdd(detailInfo: any) {
  console.log('添加的明细:', detailInfo);

  // 获取之前选择的库存数据
  const balanceData = selectedBalanceData.value;
  if (!balanceData) {
    ElMessage.error('未找到库存数据');
    return;
  }

  try {
    // 获取当前表单数据
    const formValues = await formApi.getValues();

    // 构建调用接口的参数
    const addTransferSubParam: ChangeApi.AddTransferSubParam = {
      actiNum: balanceData.actiNum, // 原有数量
      balanceId: balanceData.id, // 库存ID
      code: formValues.code, // 移库单号
      isDefault: detailInfo.setDefaultBinLocation || false, // 是否设置为默认货位
      mainId: formValues.id === 0 ? null : formValues.id, // 移库单ID，如果是0则提交null
      newStoreId: getStoreIdByName(detailInfo.targetWarehouse), // 新仓库ID
      newStoreSiteName: detailInfo.targetBinLocation, // 新库货位名称
      num: detailInfo.quantity, // 移库数量
      oldStoreId: balanceData.storeId, // 旧仓库ID
      oldStoreSiteName: balanceData.productPlaceName, // 旧库货位名称
      price: balanceData.buyPrice || 0, // 成本单价
      productAttachmentIds: balanceData.productAttachmentIds, // 产品附件id组合
      productAttachmentNames: balanceData.productAttachmentNames, // 产品附件名称组合
      productId: balanceData.productId, // 产品ID
      productName: balanceData.productName, // 产品名称
      productPlaceId: balanceData.productPlaceId, // 产品产地id
      remark: detailInfo.remark || '', // 备注
      supplierId: balanceData.supplierId, // 供应商id
      supplierName: balanceData.supplierName, // 供应商名字
      addTransferMainParam: {
        code: formValues.code,
        fashion: 'CORRECT', // 修正货位
        operId: getCurrentUser().id, // 移库员ID，从用户信息获取
        operName: getCurrentUser().name,
        operTime: new Date(formValues.orderDate).getTime(),
        remark: formValues.remark || '',
        statusFlag: 1, // 草稿状态
      },
    };

    // 调用接口添加明细
    const response = await addTransferSub(addTransferSubParam);

    // 将返回的数据添加到表格中
    const newDetail = {
      id: response.data.id || Date.now(),
      productId: response.data.productId || 0,
      productName: response.data.productName || '',
      attachment: response.data.productAttachmentNames || '',
      origin: balanceData.baseName || '',
      oldWarehouseName: response.data.oldStoreName || '',
      oldWarehouseLocation: response.data.oldStoreSiteName || '',
      transferQuantity: response.data.num || 0,
      newWarehouse: response.data.newStoreName || '',
      newWarehouseLocation: response.data.newStoreSiteName || '',
      transferMainId: response.data.mainId || 0,
    };

    // 添加到明细数据数组
    detailData.value.push(newDetail);

    // 重新加载表格数据
    if (detailGridApi && detailGridApi.grid) {
      detailGridApi.grid.reloadData(detailData.value);
    }
    updateTotalCount();
    ElMessage.success('已添加明细');
  } catch (error) {
    console.error('添加明细失败:', error);
    ElMessage.error('添加明细失败');
  }

  // 清理临时数据
  selectedBalanceData.value = null;
}

// 根据仓库名称获取仓库ID（临时实现，实际应该从仓库列表获取）
function getStoreIdByName(storeName: string): number {
  const storeMap: Record<string, number> = {
    临时库: 1,
    A库: 2,
    B库: 3,
    C库: 4,
    F库: 5,
  };
  return storeMap[storeName] || 1;
}

// 删除明细
async function onDeleteDetail() {
  const selectRows = detailGridApi.grid.getCheckboxRecords();
  if (selectRows.length === 0) {
    ElMessage.warning('请选择要删除的明细');
    return;
  }

  try {
    // 遍历删除选中的明细
    for (const row of selectRows) {
      // 如果明细有ID（已保存到数据库），调用接口删除
      if (row.id && row.id !== Date.now()) {
        try {
          await deleteTransferSub(row.id);
        } catch (error) {
          console.error(`删除明细失败:`, error);
          continue;
        }
      }

      // 从本地明细数据数组中删除
      const index = detailData.value.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        detailData.value.splice(index, 1);
      }
    }

    // 重新加载表格数据
    if (detailGridApi && detailGridApi.grid) {
      detailGridApi.grid.reloadData(detailData.value);
    }
    updateTotalCount();
    ElMessage.success(`成功删除 ${selectRows.length} 条明细`);
  } catch (error) {
    console.error('删除明细失败:', error);
    ElMessage.error('删除明细失败');
  }
}

// 更新总数
function updateTotalCount() {
  const total = detailData.value.reduce(
    (sum: number, item: any) => sum + (item.transferQuantity || 0),
    0,
  );
  formApi.setValues({ quantity: total });
}

// 保存
async function onSave() {
  try {
    const values = await formApi.getValues();
    console.log('表单数据:', values);

    // 获取用户信息
    const currentUser = getCurrentUser();

    // 准备提交参数
    const submitParams: ChangeApi.AddTransferMainParam = {
      code: values.code || '',
      fashion: values.transferMethod === '修正货位' ? 'CORRECT' : 'MOVE',
      operId: currentUser.id,
      operName: currentUser.name,
      operTime: values.orderDate
        ? new Date(values.orderDate).getTime()
        : Date.now(),
      remark: values.remark || '',
      statusFlag: 1, // 草稿状态
    };

    console.log('提交参数:', submitParams);

    await addTransferMain(submitParams);

    ElMessage.success('保存成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败');
  }
}

// 提交
async function onSubmit() {
  try {
    // 验证是否有明细数据
    if (!hasDetailData.value) {
      ElMessage.warning('请先添加移库明细后再提交');
      return;
    }

    const values = await formApi.getValues();
    console.log('提交表单数据:', values);

    // 获取用户信息
    const currentUser = getCurrentUser();

    // 准备提交参数
    const submitParams: ChangeApi.AddTransferMainParam = {
      code: values.code || '',
      fashion: values.transferMethod === '修正货位' ? 'CORRECT' : 'MOVE',
      operId: currentUser.id,
      operName: currentUser.name,
      operTime: values.orderDate
        ? new Date(values.orderDate).getTime()
        : Date.now(),
      remark: values.remark || '',
      statusFlag: 2, // 待审核状态
    };

    console.log('提交参数:', submitParams);

    await addTransferMain(submitParams);

    ElMessage.success('提交成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败');
  }
}
</script>

<script lang="ts">
export default { name: 'TransferForm' };
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <Form />
    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="onSave">
        <IconifyIcon
          icon="material-symbols:save-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        保存
      </ElButton>
      <ElButton type="primary" @click="onSubmit" :disabled="!hasDetailData">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:save-outline"
        />
        提交
      </ElButton>
      <ElButton type="primary" @click="onAddDetail">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="ant-design:plus-outlined"
        />
        新增明细
      </ElButton>
      <ElButton type="primary" @click="onDeleteDetail">
        <IconifyIcon
          icon="mdi:trash-can-outline"
          class="size-5"
          style="margin-right: 4px"
        />
        删除明细
      </ElButton>
    </ElButtonGroup>
    <DetailGrid table-title="明细列表" class="p-raw h-full w-full" />
  </Modal>

  <!-- 库存选择对话框 - 移到Modal外面，作为独立对话框 -->
  <BalanceSelectDialog
    v-model:open="balanceSelectOpen"
    @success="onBalanceSelect"
  />

  <!-- 添加明细对话框 - 移到Modal外面，作为独立对话框 -->
  <DetailForm
    v-model:open="detailFormOpen"
    :product-data="selectedBalanceData"
    @success="onDetailAdd"
  />
</template>

<style lang="css" scoped></style>
