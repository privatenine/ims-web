<template>
  <el-dialog
    v-model="vis"
    :title="title"
    width="1200"
    append-to-body
    draggable
    style="background-color: aquamarine;"
    class="form-dialog"
  >
    <div class="dialog-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="产品名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入产品名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="公用资料启/停用" prop="enable">
              <el-radio-group v-model="form.enable">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="车型" prop="carModelId">
              <el-select
                v-model="form.carModelId"
                placeholder="请选择"
                clearable
                readonly
                @change="handleCarModelChange"
              >
                <el-option
                  v-for="item in carModelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="车系" prop="carSeriesId">
              <el-select
                v-model="form.carSeriesId"
                placeholder="请选择"
                clearable
                readonly
                @change="handleCarSeriesChange"
              >
                <el-option
                  v-for="item in carSeriesOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="安装位置" prop="positionId">
              <el-select
                v-model="form.positionId"
                placeholder="请选择"
                clearable
                readonly
                @change="handlePositionChange"
              >
                <el-option
                  v-for="item in positionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="中高" prop="middleLength">
              <el-input-number
                v-model="form.middleLength"
                :min="0"
                clearable
                style="width: 100%"
                @input="handleNormsInputChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="下长" prop="downLength">
              <el-input-number
                v-model="form.downLength"
                :min="0"
                clearable
                style="width: 100%"
                @input="handleNormsInputChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="对角" prop="diagonal">
              <el-input-number
                v-model="form.diagonal"
                :min="0"
                clearable
                style="width: 100%"
                @input="handleNormsInputChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="类型" prop="carTypeId">
              <el-select
                v-model="form.carTypeId"
                placeholder="请选择"
                clearable
                readonly
                @change="handleCarTypeChange"
              >
                <el-option
                  v-for="item in carTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="上市年份" prop="listYear">
              <el-input-number
                v-model="form.listYear"
                :min="0"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="停产年份" prop="stopYear">
              <el-input-number
                v-model="form.stopYear"
                :min="0"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="规格" prop="norms">
              <el-input
                v-model="form.norms"
                placeholder="请输入"
                disabled
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="通用车型" prop="baseId" class="col-span-3">
              <el-select
                v-model="form.baseId"
                placeholder="请选择"
                clearable
                readonly
                @change="handleBaseChange"
              >
                <el-option
                  v-for="item in baseOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="产品资料备注" prop="remark" class="col-span-2">
              <el-input v-model="form.remark" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="上限" prop="upperLimit">
              <el-input-number
                v-model="form.upperLimit"
                :min="0"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="下限" prop="lowerLimit">
              <el-input-number
                v-model="form.lowerLimit"
                :min="0"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="辅助资料备注" prop="settingRemark">
              <el-input
                v-model="form.settingRemark"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="后45度照片" prop="img_path_45_h">
              <el-upload
                v-model:file-list="form.img_path_45_h"
                accept=".png,.jpg,.jpeg"
                :disabled="false"
                :max-count="1"
                :multiple="false"
                :show-file-list="true"
                list-type="picture-card"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="前45度照片" prop="img_path_45_q">
              <el-upload
                v-model:file-list="form.img_path_45_q"
                accept=".png,.jpg,.jpeg"
                :disabled="false"
                :max-count="1"
                :multiple="false"
                :show-file-list="true"
                list-type="picture-card"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="安装位置照片" prop="img_path_location">
              <el-upload
                v-model:file-list="form.img_path_location"
                accept=".png,.jpg,.jpeg"
                :disabled="false"
                :max-count="1"
                :multiple="false"
                :show-file-list="true"
                list-type="picture-card"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="前挡后视镜区域特写" prop="img_path_other">
              <el-upload
                v-model:file-list="form.img_path_other"
                accept=".png,.jpg,.jpeg"
                :disabled="false"
                :max-count="1"
                :multiple="false"
                :show-file-list="true"
                list-type="picture-card"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="产品照片" prop="img_path_product">
              <el-upload
                v-model:file-list="form.img_path_product"
                accept=".png,.jpg,.jpeg"
                :disabled="false"
                :max-count="1"
                :multiple="false"
                :show-file-list="true"
                list-type="picture-card"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="confirmLoading"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { computed, onMounted, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import {
  createProduct,
  getBasicProjectList,
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
  updateProduct,
} from '#/api';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const vis = ref(false);
const formRef = ref<FormInstance>();
const confirmLoading = ref(false);

// 表单数据
const form = ref({
  name: '',
  enable: 1,
  carModelId: '',
  carSeriesId: '',
  positionId: '',
  middleLength: 0,
  downLength: 0,
  diagonal: 0,
  carTypeId: '',
  listYear: 2010,
  stopYear: 2010,
  norms: '',
  remark: '',
  upperLimit: 0,
  lowerLimit: 0,
  settingRemark: '',
  baseId: '',
  // img_path_45_h: [],
  // img_path_45_q: [],
  // img_path_location: [],
  // img_path_other: [],
  // img_path_product: [],
  id: '',
});

// 表单验证规则
const rules = ref<FormRules>({
  name: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  // baseId: [{ required: true, message: '通用车型不能为空', trigger: 'change' }],
  enable: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
});

// 各种选项数据
const carModelOptions = ref<Array<any>>([]);
const carSeriesOptions = ref<Array<any>>([]);
const positionOptions = ref<Array<any>>([]);
const carTypeOptions = ref<Array<any>>([]);
const baseOptions = ref<Array<any>>([]);

// 初始化数据
onMounted(() => {
  // 初始化各种选项数据
  initOptions();
});

// 初始化选项数据
const initOptions = () => {
  Promise.all([
    getBasicProjectList({}),
    getVehicleModelList(),
    getVehicleSeriesList(),
    getVehicleTypeList(),
    getVehiclePositionList(),
  ]).then(([basicRes, modelRes, seriesRes, typeRes, positionRes]) => {
    baseOptions.value = basicRes.data;
    carModelOptions.value = modelRes.data;
    carSeriesOptions.value = seriesRes.data;
    carTypeOptions.value = typeRes.data;
    positionOptions.value = positionRes.data;
  });
};

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      // 当对话框打开时，初始化表单数据
      if (props.formData) {
        form.value = Object.assign(
          {
            name: '',
            enable: 1,
            carModelId: '',
            carSeriesId: '',
            positionId: '',
            middleLength: 0,
            downLength: 0,
            diagonal: 0,
            carTypeId: '',
            listYear: 2010,
            stopYear: 2010,
            norms: '',
            remark: '',
            upperLimit: 0,
            lowerLimit: 0,
            settingRemark: '',
            baseId: '',
            // img_path_45_h: [],
            // img_path_45_q: [],
            // img_path_location: [],
            // img_path_other: [],
            // img_path_product: [],
            id: '',
          },
          props.formData,
        );
      } else {
        // 重置表单
        formRef.value?.resetFields();
        form.value = {
          name: '',
          enable: 1,
          carModelId: '',
          carSeriesId: '',
          positionId: '',
          middleLength: 0,
          downLength: 0,
          diagonal: 0,
          carTypeId: '',
          listYear: 2010,
          stopYear: 2010,
          norms: '',
          remark: '',
          upperLimit: 0,
          lowerLimit: 0,
          settingRemark: '',
          baseId: '',
          // img_path_45_h: [],
          // img_path_45_q: [],
          // img_path_location: [],
          // img_path_other: [],
          // img_path_product: [],
          id: '',
        };
      }
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const title = computed(() => {
  return `${props.formData?.id ? '修改' : '新增'}产品资料`;
});

async function handleConfirm() {
  // 校验formRef
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  confirmLoading.value = true;
  const p = {
    ...form.value,
    norms: form.value.norms === '**' ? '' : form.value.norms,
  };
  (form.value?.id
    ? updateProduct({
        ...p,
        id: form.value?.id,
      })
    : createProduct(p)
  )
    .then(() => {
      ElMessage({
        message: `保存成功`,
        type: 'success',
        plain: true,
      });
      emit('confirm', form.value);
      vis.value = false;
    })
    .catch(() => {})
    .finally(() => {
      confirmLoading.value = false;
    });
}
const handleCancel = () => {
  vis.value = false;
};

// 添加处理车型选择变化的函数
const handleCarModelChange = (val: string) => {
  if (val) {
    const selected = carModelOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.carModelName = selected.name;
    }
  } else {
    form.value.carModelName = '';
  }
};

// 添加处理车系选择变化的函数
const handleCarSeriesChange = (val: string) => {
  if (val) {
    const selected = carSeriesOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.carSeriesName = selected.name;
    }
  } else {
    form.value.carSeriesName = '';
  }
};

// 添加处理安装位置选择变化的函数
const handlePositionChange = (val: string) => {
  if (val) {
    const selected = positionOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.positionName = selected.name;
    }
  } else {
    form.value.positionName = '';
  }
};

// 添加处理类型选择变化的函数
const handleCarTypeChange = (val: string) => {
  if (val) {
    const selected = carTypeOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.carTypeName = selected.name;
    }
  } else {
    form.value.carTypeName = '';
  }
};

// 添加处理通用车型选择变化的函数
const handleBaseChange = (val: string) => {
  if (val) {
    const selected = baseOptions.value.find((item) => item.id === val);
    if (selected) {
      form.value.baseName = selected.name;
    }
  } else {
    form.value.baseName = '';
  }
};

// 添加处理规格输入变化的函数
const handleNormsInputChange = () => {
  const { middleLength, downLength, diagonal } = form.value;
  form.value.norms = `${middleLength === null ? '' : middleLength}*${downLength === null ? '' : downLength}*${diagonal === null ? '' : diagonal}`;
};
</script>

<style scoped>
.form-dialog {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.dialog-content {
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  padding-right: 10px;
}

:deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
}

</style>
