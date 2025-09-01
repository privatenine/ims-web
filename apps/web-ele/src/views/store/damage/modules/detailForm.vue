<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElOption,
  ElRow,
  ElSelect,
  ElUpload,
} from 'element-plus';

import { getStorageOptions } from '#/utils/storage';

interface Props {
  visible: boolean;
  productData?: any; // 从商品选择对话框传入的商品信息
  detailData?: any; // 编辑时的明细信息
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  productData: () => ({}),
  detailData: () => ({}),
});

const emit = defineEmits<Emits>();

const detailForm = ref({
  damageProcess: '包装', // 报损工序
  damageType: '自裂', // 报损类别
  damageQuantity: 0, // 报损数量
  responsiblePerson: '无', // 责任人
  remark: '', // 备注
  images: [], // 图片上传
  costPrice: 15, // 成本价
  colorBand: '', // 彩带
  printEdge: '', // 印边
  nightVision: '', // 夜视
  lens: '', // 镜头
  bracket: '', // 支架
  color: '', // 颜色
  warehouse: 'A库', // 仓库
  warehouseLocation: 'AG325', // 库位
  tempWarehouseLocation: '', // 临时库位
  trademark: '', // 商标
  adhesiveStrip: '', // 胶条
  rainSensor: '', // 雨感
});

const getModalTitle = computed(() => {
  return `明细信息 - ${props.productData?.productName || '无'}`;
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
      initForm();
    }
  },
});

// 报损工序选项
const damageProcessOptions = [
  { label: '包装', value: '包装' },
  { label: '生产', value: '生产' },
  { label: '运输', value: '运输' },
  { label: '仓储', value: '仓储' },
];

// 报损类别选项
const damageTypeOptions = [
  { label: '自裂', value: '自裂' },
  { label: '破损', value: '破损' },
  { label: '缺陷', value: '缺陷' },
  { label: '过期', value: '过期' },
];

// 责任人选项
const responsiblePersonOptions = [
  { label: '无', value: '无' },
  { label: '操作员A', value: 'operatorA' },
  { label: '操作员B', value: 'operatorB' },
];

watch(
  () => props.visible,
  (val) => {
    if (val) {
      modalApi.open();
    } else {
      modalApi.close();
    }
  },
  { immediate: true },
);

function initForm() {
  if (props.detailData && Object.keys(props.detailData).length > 0) {
    // 编辑模式
    Object.assign(detailForm.value, props.detailData);
  } else if (props.productData && Object.keys(props.productData).length > 0) {
    // 新增模式，基于选择的商品填充基本信息
    detailForm.value.warehouse = props.productData.warehouseName || 'A库';
    detailForm.value.warehouseLocation =
      props.productData.warehouseLocation || 'AG325';
    detailForm.value.costPrice = props.productData.costPrice || 15;
  }
}

function handleConfirm() {
  // 计算金额 = 报损数量 * 成本价
  const amount =
    (detailForm.value.damageQuantity || 0) * (detailForm.value.costPrice || 0);

  const formData = {
    ...detailForm.value,
    productName: props.productData?.productName || '',
    productId: props.productData?.id || '',
    amount, // 计算后的金额
    factoryPrice: detailForm.value.costPrice, // 出厂价使用成本价
  };
  console.log('明细表单数据:', formData);
  emit('confirm', formData);
  modalApi.close();
  emit('update:visible', false);
}

function handleCancel() {
  modalApi.close();
  emit('update:visible', false);
}

// 文件上传处理
function handleFileUpload(info: any) {
  console.log('上传文件:', info);
  // TODO: 处理文件上传逻辑
}

function handleRemoveFile(file: any) {
  console.log('删除文件:', file);
  // TODO: 处理文件删除逻辑
}
</script>

<template>
  <Modal :title="getModalTitle" class="max-h-5/6 h-5/6 w-4/5">
    <ElForm :model="detailForm" label-width="120px" class="detail-form">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="报损工序:">
            <ElSelect v-model="detailForm.damageProcess" style="width: 100%">
              <ElOption
                v-for="option in damageProcessOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="报损类别:">
            <ElSelect v-model="detailForm.damageType" style="width: 100%">
              <ElOption
                v-for="option in damageTypeOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="报损数量:">
            <ElInput
              v-model.number="detailForm.damageQuantity"
              type="number"
              min="0"
              placeholder="请输入报损数量"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="责任人:">
            <ElSelect
              v-model="detailForm.responsiblePerson"
              style="width: 100%"
            >
              <ElOption
                v-for="option in responsiblePersonOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="备注:">
            <ElInput
              v-model="detailForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <!-- 图片上传区域 -->
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="图片1:">
            <ElUpload
              class="upload-demo"
              action="/"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
            >
              <ElButton>选择文件</ElButton>
              <span class="ml-2">未选择任何文件</span>
            </ElUpload>
            <div
              class="upload-preview mt-2"
              style="
                width: 100%;
                height: 150px;
                background: #f0f0f0;
                border: 1px dashed #ddd;
              "
            >
              <!-- 图片预览区域 -->
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="图片2:">
            <ElUpload
              class="upload-demo"
              action="/"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
            >
              <ElButton>选择文件</ElButton>
              <span class="ml-2">未选择任何文件</span>
            </ElUpload>
            <div
              class="upload-preview mt-2"
              style="
                width: 100%;
                height: 150px;
                background: #f0f0f0;
                border: 1px dashed #ddd;
              "
            >
              <!-- 图片预览区域 -->
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="图片3:">
            <ElUpload
              class="upload-demo"
              action="/"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
            >
              <ElButton>选择文件</ElButton>
              <span class="ml-2">未选择任何文件</span>
            </ElUpload>
            <div
              class="upload-preview mt-2"
              style="
                width: 100%;
                height: 150px;
                background: #f0f0f0;
                border: 1px dashed #ddd;
              "
            >
              <!-- 图片预览区域 -->
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="图片4:">
            <ElUpload
              class="upload-demo"
              action="/"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
            >
              <ElButton>选择文件</ElButton>
              <span class="ml-2">未选择任何文件</span>
            </ElUpload>
            <div
              class="upload-preview mt-2"
              style="
                width: 100%;
                height: 150px;
                background: #f0f0f0;
                border: 1px dashed #ddd;
              "
            >
              <!-- 图片预览区域 -->
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="图片5:">
            <ElUpload
              class="upload-demo"
              action="/"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileUpload"
            >
              <ElButton>选择文件</ElButton>
              <span class="ml-2">未选择任何文件</span>
            </ElUpload>
            <div
              class="upload-preview mt-2"
              style="
                width: 100%;
                height: 150px;
                background: #f0f0f0;
                border: 1px dashed #ddd;
              "
            >
              <!-- 图片预览区域 -->
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <!-- 产品详细信息 -->
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="成本价:">
            <ElInput
              v-model.number="detailForm.costPrice"
              type="number"
              step="0.01"
              placeholder="请输入成本价"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="彩带:">
            <ElInput
              v-model="detailForm.colorBand"
              placeholder="请输入彩带信息"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="印边:">
            <ElInput
              v-model="detailForm.printEdge"
              placeholder="请输入印边信息"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="夜视:">
            <ElInput
              v-model="detailForm.nightVision"
              placeholder="请输入夜视信息"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="镜头:">
            <ElInput v-model="detailForm.lens" placeholder="请输入镜头信息" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="支架:">
            <ElInput
              v-model="detailForm.bracket"
              placeholder="请输入支架信息"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="颜色:">
            <ElInput v-model="detailForm.color" placeholder="请输入颜色信息" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="仓库:">
            <ElSelect
              v-model="detailForm.warehouse"
              style="width: 100%"
              placeholder="请选择仓库"
            >
              <ElOption
                v-for="option in getStorageOptions()"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="库位:">
            <ElInput v-model="detailForm.warehouseLocation" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="临时库位:">
            <ElInput
              v-model="detailForm.tempWarehouseLocation"
              placeholder="请输入临时库位"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="商标:">
            <ElInput
              v-model="detailForm.trademark"
              placeholder="请输入商标信息"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="胶条:">
            <ElInput
              v-model="detailForm.adhesiveStrip"
              placeholder="请输入胶条信息"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="雨感:">
            <ElInput
              v-model="detailForm.rainSensor"
              placeholder="请输入雨感信息"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <div class="mt-4 flex justify-end space-x-2">
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" @click="handleConfirm">确定</ElButton>
    </div>
  </Modal>
</template>

<style lang="css" scoped></style>
