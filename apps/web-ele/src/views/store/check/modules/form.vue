<script lang="ts"></script>

<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  addInventorySubBatch,
  createInventoryMain,
  deleteInventorySub,
  deleteInventorySubBatch,
  findIsList,
  getInventoryMain,
  updateInventoryMain,
  updateInventorySubNum,
} from '#/api/store/check';

import { useDetailColumns, useFormSchema } from '../data';
import LocationSelect from './locationSelect.vue';

const emits = defineEmits(['success']);

// 表单数据
const formData = ref<Record<string, any>>({});
const formMode = ref<'add' | 'audit' | 'detail' | 'edit'>('add');

const formSchema = useFormSchema();
console.log('表单 Schema:', formSchema);

const [Form, formApi] = useVbenForm({
  schema: formSchema,
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
  const modeMap = {
    add: '新增盘点',
    edit: '修改盘点',
    detail: '盘点详情',
    audit: '盘点审核',
  };
  return modeMap[formMode.value];
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: false,
  draggable: true,
  centered: true,
  width: 1100, // 加宽100像素
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      formApi.resetForm();

      if (values && values.mode) {
        // 修改、详情、审核模式
        formMode.value = values.mode;

        if (values.mode === 'add') {
          // 新增模式
          if (values.code) {
            formData.value = {
              code: values.code,
              storeId: undefined,
              remark: '',
              details: [],
            };
          } else {
            generateCode();
            formData.value = {
              code: '',
              storeId: undefined,
              remark: '',
              details: [],
            };
          }
          formApi.setValues(formData.value);
        } else {
          // 修改、详情、审核模式，需要调用API获取数据
          loadInventoryMainData(values.id);
        }
      } else {
        // 兼容原有逻辑，默认为新增模式
        formMode.value = 'add';
        if (values && values.code) {
          formData.value = {
            code: values.code,
            storeId: undefined,
            remark: '',
            details: [],
          };
        } else {
          generateCode();
          formData.value = {
            code: '',
            storeId: undefined,
            remark: '',
            details: [],
          };
        }
        formApi.setValues(formData.value);
      }
    }
  },
});

// 库位选择对话框状态
const locationSelectOpen = ref(false);

// 明细表格
const [DetailGrid, detailGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 400,
    keepSource: true,
    showOverflow: false,
    data: formData.value.details || [],
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
      if (column.field === 'inventoryQuantity') {
        updateTotalCount();

        // 如果是修改模式且数据来自API，调用更新接口
        if (formMode.value === 'edit' && row._rawData && row._rawData.id) {
          updateInventorySubNumValue(row._rawData.id, row.inventoryQuantity);
        }
      }
    },
  },
});

// 生成盘点单号
function generateCode() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const code = `PDD${year}${month}${day}${random}`;
  formApi.setValues({ code });
}

// 添加明细
function onAddDetail() {
  // 直接打开库位选择对话框，不验证仓库选择
  locationSelectOpen.value = true;
}

// 处理添加明细事件 - 兼容其他调用方式
function handleAddDetail() {
  onAddDetail();
}

// 处理库位选择
async function onLocationSelect(selectedLocations: any[]) {
  console.log('选择的库位:', selectedLocations);

  const values = await formApi.getValues();

  if (!values.storeId) {
    ElMessage.error('请先选择仓库');
    return;
  }

  let mainId = formData.value.id;

  // 如果是新增模式且还没有mainId，先创建盘点主单
  if (formMode.value === 'add' && !mainId) {
    const createMainData = {
      code: values.code,
      remark: values.remark || '',
      statusFlag: 1, // 草稿状态
      storeId: values.storeId,
    };

    console.log('先创建盘点主单:', createMainData);
    const mainResponse = await createInventoryMain(createMainData);
    console.log('创建盘点主单响应:', mainResponse);
    
    // 接口封装返回的是整个axios response，需要访问data属性获取真实数据
    const responseData = mainResponse?.data || mainResponse;
    console.log('实际响应数据:', responseData);
    
    // 检查响应结构，适应不同的返回格式
    if (responseData && responseData.code === 1) {
      // 创建成功，但可能没有返回id，我们可以通过code找到对应的记录
      // 由于接口可能不返回id，我们将code作为标识
      ElMessage.success('创建盘点主单成功');
      // 不设置mainId，让批量添加接口自己处理
    } else if (responseData) {
      ElMessage.error(responseData.msg || '创建盘点主单失败');
      return;
    } else {
      ElMessage.error('创建盘点主单接口返回空值');
      return;
    }
  }

  // 批量添加选中的库位明细
  const paramList = selectedLocations.map((location) => ({
    siteName: location.siteName,
    storeId: values.storeId,
  }));

  const submitData = {
    addInventoryMainParam: {
      code: values.code,
      remark: values.remark || '',
      statusFlag: 1, // 草稿状态
      storeId: values.storeId,
    },
    code: values.code,
    mainId: mainId || 0,
    paramList,
    remark: '',
  };

  console.log('批量添加明细参数:', submitData);
  const response = await addInventorySubBatch(submitData);
  console.log('批量添加明细成功:', response);

  // 刷新明细列表
  await refreshDetailList();

  ElMessage.success(`已成功添加 ${selectedLocations.length} 个库位的明细`);
}

// 刷新明细列表
async function refreshDetailList() {
  const values = await formApi.getValues();
  if (values.code) {
    // 使用 findIsList 查询明细列表
    const params = {
      code: values.code,
      mainId: formData.value.id || 0,
      pageNum: 1,
      pageSize: 1000, // 获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    };

    console.log('查询明细列表参数:', params);
    const response = await findIsList(params);
    console.log('查询明细列表响应:', response);
    
    if (response.data) {
      // 将API返回的明细数据转换为表格需要的格式
      const detailData = response.data.map((item) => ({
        id: item.id,
        productName: item.productName || '待选择商品',
        attachment1: item.productAttachmentNames || '',
        origin1: '',
        inventoryQuantity: item.num || 0,
        attachment2: '',
        origin2: '',
        actualQuantity: item.actiNum || 0,
        warehouseName: item.storeName || '',
        binLocation: item.storeSiteName || '',
        remark: item.remark || '',
        // 保存原始API数据，用于后续操作
        _rawData: item,
      }));

      // 更新表格数据
      detailGridApi.grid.loadData(detailData);

      // 更新总数
      updateTotalCount();

      console.log('明细列表刷新成功，共', detailData.length, '条');
    }
  }
}

// 删除明细
async function onDeleteDetail() {
  const selectRows = detailGridApi.grid.getCheckboxRecords();
  if (selectRows.length === 0) {
    ElMessage.warning('请选择要删除的明细');
    return;
  }

  try {
    // 显示确认对话框
    const confirmed = await ElMessageBox.confirm(
      `确定要删除选中的 ${selectRows.length} 条明细吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    if (confirmed) {
      if (selectRows.length === 1) {
        // 单个删除
        const row = selectRows[0];
        if (row._rawData && row._rawData.id) {
          // 如果是从API加载的数据，调用删除API
          await deleteInventorySub(row._rawData.id);
          ElMessage.success('删除明细成功');
        } else {
          // 如果是本地新增的数据，直接从表格中移除
          detailGridApi.grid.removeCheckboxRow();
          ElMessage.success('删除明细成功');
        }
      } else {
        // 批量删除
        const ids = selectRows
          .filter((row) => row._rawData && row._rawData.id)
          .map((row) => row._rawData.id);

        if (ids.length > 0) {
          // 调用批量删除API
          await deleteInventorySubBatch(ids);
          ElMessage.success(`批量删除 ${ids.length} 条明细成功`);
        }

        // 从表格中移除所有选中的行
        detailGridApi.grid.removeCheckboxRow();
      }

      // 更新总数
      updateTotalCount();
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除明细失败:', error);
      ElMessage.error('删除明细失败');
    }
  }
}

// 更新总数
function updateTotalCount() {
  const data = detailGridApi.grid.getTableData().fullData;
  const total = data.reduce(
    (sum: number, item: any) => sum + (item.inventoryQuantity || 0),
    0,
  );
  formApi.setValues({ totalCount: total });
}

// 保存
async function onSave() {
  try {
    const values = await formApi.getValues();

    if (!values.storeId) {
      ElMessage.error('请选择仓库');
      return;
    }

    const detailData = detailGridApi.grid.getTableData().fullData;
    if (detailData.length === 0) {
      ElMessage.error('请添加盘点明细');
      return;
    }

    if (formMode.value === 'edit') {
      // 修改模式：调用更新API
      const updateData = {
        id: values.id,
        remark: values.remark || '',
        statusFlag: 1, // 草稿状态
        storeId: values.storeId,
        version: values.version || 1,
      };

      await updateInventoryMain(updateData);
      ElMessage.success('修改成功');
    } else {
      // 新增模式：检查是否已创建主单
      if (!formData.value.id) {
        // 如果还没有创建主单，先创建
        const submitData = {
          code: values.code,
          remark: values.remark || '',
          statusFlag: 1, // 草稿状态
          storeId: values.storeId,
        };

        const response = await createInventoryMain(submitData);
        if (response.data && response.data.id) {
          formData.value.id = response.data.id;
          formApi.setValues({ id: response.data.id });
        }
        ElMessage.success('保存成功');
      } else {
        // 已创建主单，调用更新API
        const updateData = {
          id: formData.value.id,
          remark: values.remark || '',
          statusFlag: 1, // 草稿状态
          storeId: values.storeId,
          version: formData.value.version || 1,
        };

        await updateInventoryMain(updateData);
        ElMessage.success('保存成功');
      }
    }

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
    const values = await formApi.getValues();

    if (!values.storeId) {
      ElMessage.error('请选择仓库');
      return;
    }

    const detailData = detailGridApi.grid.getTableData().fullData;
    if (detailData.length === 0) {
      ElMessage.error('请添加盘点明细');
      return;
    }

    if (formMode.value === 'edit') {
      // 修改模式：调用更新API
      const updateData = {
        id: values.id,
        remark: values.remark || '',
        statusFlag: 2, // 待审核状态
        storeId: values.storeId,
        version: values.version || 1,
      };

      await updateInventoryMain(updateData);
      ElMessage.success('提交成功');
    } else {
      // 新增模式：检查是否已创建主单
      if (!formData.value.id) {
        // 如果还没有创建主单，先创建
        const submitData = {
          code: values.code,
          remark: values.remark || '',
          statusFlag: 2, // 待审核状态
          storeId: values.storeId,
        };

        const response = await createInventoryMain(submitData);
        if (response.data && response.data.id) {
          formData.value.id = response.data.id;
          formApi.setValues({ id: response.data.id });
        }
        ElMessage.success('提交成功');
      } else {
        // 已创建主单，调用更新API
        const updateData = {
          id: formData.value.id,
          remark: values.remark || '',
          statusFlag: 2, // 待审核状态
          storeId: values.storeId,
          version: formData.value.version || 1,
        };

        await updateInventoryMain(updateData);
        ElMessage.success('提交成功');
      }
    }

    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败');
  }
}

// 取消
function onCancel() {
  modalApi.close();
}

// 加载盘点单数据
async function loadInventoryMainData(id: number) {
  try {
    const response = await getInventoryMain(id);
    if (response.data) {
      const data = response.data;
      formData.value = {
        id: data.id,
        code: data.code,
        storeId: data.storeId,
        remark: data.remark || '',
        details: [],
        statusFlag: data.statusFlag,
        createTime: data.createTime,
        createName: data.createName,
        approveId: data.approveId,
        approveName: data.approveName,
        approveTime: data.approveTime,
        version: data.version,
      };

      formApi.setValues(formData.value);

      // 加载明细列表数据
      await loadDetailList(data.id, data.code);
    }
  } catch (error) {
    console.error('加载盘点单数据失败:', error);
    ElMessage.error('加载盘点单数据失败');
  }
}

// 加载明细列表
async function loadDetailList(mainId: number, code: string) {
  try {
    const params = {
      code,
      mainId,
      pageNum: 1,
      pageSize: 1000, // 获取所有明细
      sortParam: {
        field: 'id',
        type: 1, // 正序
      },
    };

    const response = await findIsList(params);
    if (response.data) {
      // 将API返回的明细数据转换为表格需要的格式
      const detailData = response.data.map((item) => ({
        id: item.id,
        productName: item.productName || '待选择商品',
        attachment1: item.productAttachmentNames || '',
        origin1: '',
        inventoryQuantity: item.num || 0,
        attachment2: '',
        origin2: '',
        actualQuantity: item.actiNum || 0,
        warehouseName: item.storeName || '',
        binLocation: item.storeSiteName || '',
        remark: item.remark || '',
        // 保存原始API数据，用于后续操作
        _rawData: item,
      }));

      // 更新表格数据
      detailGridApi.grid.loadData(detailData);

      // 更新总数
      updateTotalCount();

      console.log('明细列表加载成功，共', detailData.length, '条');
    }
  } catch (error) {
    console.error('加载明细列表失败:', error);
    ElMessage.error('加载明细列表失败');
  }
}

// 审核通过
async function onApprove() {
  try {
    // TODO: 调用审核通过API
    ElMessage.success('审核通过成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('审核通过失败:', error);
    ElMessage.error('审核通过失败');
  }
}

// 驳回
async function onReject() {
  try {
    // TODO: 调用驳回API
    ElMessage.success('驳回成功');
    emits('success');
    modalApi.close();
  } catch (error) {
    console.error('驳回失败:', error);
    ElMessage.error('驳回失败');
  }
}

// 更新盘点单明细盘点数量
async function updateInventorySubNumValue(id: number, num: number) {
  try {
    const updateData = {
      id,
      num,
    };

    await updateInventorySubNum(updateData);
    console.log('盘点数量更新成功:', updateData);

    // 可以选择是否显示成功提示，避免频繁弹窗
    // ElMessage.success('盘点数量更新成功');
  } catch (error) {
    console.error('盘点数量更新失败:', error);
    ElMessage.error('盘点数量更新失败');
  }
}
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <Form />
    <ElButtonGroup class="ml-4">
      <!-- 新增模式：显示保存、提交、新增明细、删除明细按钮 -->
      <template v-if="formMode === 'add'">
        <ElButton type="primary" @click="onSave">
          <IconifyIcon
            icon="material-symbols:save-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          保存
        </ElButton>
        <ElButton type="primary" @click="onSubmit">
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
      </template>

      <!-- 修改模式：显示保存、提交、新增明细、删除明细按钮 -->
      <template v-if="formMode === 'edit'">
        <ElButton type="primary" @click="onSave">
          <IconifyIcon
            icon="material-symbols:save-outline"
            class="size-5"
            style="margin-right: 4px"
          />
          保存
        </ElButton>
        <ElButton type="primary" @click="onSubmit">
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
      </template>

      <!-- 详情模式：只显示关闭按钮 -->
      <template v-if="formMode === 'detail'">
        <ElButton @click="onCancel">
          <IconifyIcon
            icon="material-symbols:close"
            class="size-5"
            style="margin-right: 4px"
          />
          关闭
        </ElButton>
      </template>

      <!-- 审核模式：显示审核通过、驳回按钮 -->
      <template v-if="formMode === 'audit'">
        <ElButton type="success" @click="onApprove">
          <IconifyIcon
            icon="ant-design:check-circle-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          审核通过
        </ElButton>
        <ElButton type="danger" @click="onReject">
          <IconifyIcon
            icon="ant-design:close-circle-outlined"
            class="size-5"
            style="margin-right: 4px"
          />
          驳回
        </ElButton>
      </template>
    </ElButtonGroup>
    <DetailGrid table-title="明细列表" class="p-raw h-full w-full" />
  </Modal>

  <!-- 库位选择对话框 - 只在新增和修改模式下显示 -->
  <LocationSelect
    v-if="formMode === 'add' || formMode === 'edit'"
    v-model:open="locationSelectOpen"
    @success="onLocationSelect"
  />
</template>

<style lang="css" scoped></style>
