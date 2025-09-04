<template>
  <el-dialog v-model="vis" :title="title" append-to-body width="800">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      :inline="false"
      class="sub-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数量" prop="actiNum">
            <el-input-number
              v-model="form.actiNum"
              placeholder="请输入数量"
              :min="0"
              @change="handleActiNumChange"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价" prop="price">
            <el-input-number
              v-model="form.price"
              placeholder="请选择输入单价"
              :min="0"
              @change="handlePriceChange"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考价格" prop="priceReference">
            <el-input-number
              v-model="form.priceReference"
              placeholder="请输入参考价格"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产地" prop="productPlaceId">
            <el-select
              v-model="form.productPlaceId"
              placeholder="请选择产地"
              clearable
              style="width: 100%"
              @change="handleProductPlaceChange"
            >
              <el-option
                v-for="item in productPlaceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="附件" prop="productAttListTemp">
            <el-cascader
              v-model="form.productAttListTemp"
              placeholder="请选择附件"
              clearable
              :props="{
                expandTrigger: 'hover',
                value: 'id',
                label: 'name',
                children: 'childList',
                multiple: true,
                emitPath: false,
              }"
              :options="attOptions"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标签数" prop="printLabel">
            <el-input-number
              v-model="form.printLabel"
              placeholder="请输入标签数"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库" prop="storeId">
            <el-select
              v-model="form.storeId"
              placeholder="请选择仓库"
              clearable
              style="width: 100%"
              @change="handleStoreChange"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库位" prop="siteName">
            <el-input v-model="form.siteName" placeholder="请输入库位">
              <template #prefix>#</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认库位" prop="isDefault">
            <el-checkbox v-model="form.isDefault" placeholder="请选择">
              默认库位
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请输入备注"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { computed, onMounted, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import {
  createInStorageSub,
  getAttList,
  // getInStorageStoreBy,
  getVehiclePlaceList,
  updateInStorageSub,
} from '#/api';
import { getStorageOptions } from '#/utils/storage';

const props = defineProps(['visible', 'formData']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const vis = ref(false);
const formRef = ref<FormInstance>();

// 表单数据
const form = ref({
  id: '',
  actiNum: 0,
  price: 0,
  priceReference: 0,
  productPlaceId: '',
  productPlaceName: '', // 新增产地名称字段
  productAttListTemp: [],
  printLabel: 0,
  storeId: '',
  storeName: '', // 新增仓库名称字段
  siteName: '',
  isDefault: false,
});

// 表单验证规则
const rules = ref<FormRules>({
  actiNum: [{ required: true, message: '请输入数量', trigger: 'change' }],
  price: [{ required: true, message: '请输入单价', trigger: 'change' }],
  // 可以根据需要添加其他字段的验证规则
});

// 产地选项
const productPlaceOptions = ref([]);
// 仓库选项
const storeOptions = ref([]);
const attOptions = ref([]);

// 初始化数据
onMounted(async () => {
  storeOptions.value = getStorageOptions();

  const res = await getVehiclePlaceList();
  productPlaceOptions.value = res.data;

  const res2 = await getAttList();
  attOptions.value = res2.data;
});

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
    if (newVal) {
      // 当对话框打开时，初始化表单数据
      if (props.formData) {
        form.value = { ...props.formData };
        if (form.value.productAttachmentIds?.length > 0) {
          form.value.productAttListTemp = form.value.productAttachmentIds.split('_').map((item) => {
            return Number(item);
          });
        }
      } else {
        // 重置表单
        formRef.value?.resetFields();
        form.value = {
          id: '',
          actiNum: 0,
          price: 0,
          priceReference: 0,
          productPlaceId: '',
          productAttListTemp: [],
          printLabel: 0,
          storeId: '',
          siteName: '',
          isDefault: false,
        };
      }
      if (props.formData.value?.id) {
        // getSubList();
      }
    }
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const title = computed(() => {
  return `${form.value?.id ? '修改' : '新增'}明细-${form.value?.productName || '无'}`;
});

// 数量变化处理函数
const handleActiNumChange = (value: number) => {
  form.value.printLabel = value;
};

// 单价变化处理函数
const handlePriceChange = (value: number) => {
  // findInStorageStoreBy({ buyPrice: value });
  // 这里可以添加具体实现
};

const handleCancel = () => {
  vis.value = false;
};

// 监听产地选择变化
const handleProductPlaceChange = (value: string) => {
  const selected = productPlaceOptions.value.find(
    (item: any) => item.id === value,
  );
  form.value.productPlaceName = selected ? selected.name : undefined;
};

// 监听仓库选择变化
const handleStoreChange = (value: string) => {
  const selected = storeOptions.value.find((item: any) => item.value === value);
  form.value.storeName = selected ? selected.label : undefined;
};

function findCategoryById(id: number, categories: any[]): any {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.childList && category.childList.length > 0) {
      const found = findCategoryById(id, category.childList);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
function handleFormData() {
  // 根据接口文档处理数据
  form.value.code = form.value.addWarehousingMainParam.code;
  form.value.supplierId = form.value.addWarehousingMainParam.supplierId;
  form.value.supplierName = form.value.addWarehousingMainParam.supplierName;
  // 当入库和明细都是新增时，新增明细传id:0,接口返回时会同时创建明细和入库id
  // form.value.id = form.value.id || 0;
  // 在提交前确保获取最新的label值
  handleProductPlaceChange(form.value.productPlaceId);
  handleStoreChange(form.value.storeId);
  // 处理状态
  form.value.addWarehousingMainParam.statusFlag =
    form.value.addWarehousingMainParam.statusFlag || 1;
  // 处理附件数据
  form.value.productAttList = [];
  if (form.value.productAttListTemp?.length > 0) {
    form.value.productAttListTemp.forEach((id: number) => {
      const category = findCategoryById(id, attOptions.value);
      if (category) {
        form.value.productAttList.push({
          id: category.id,
          name: category.name,
        });
      }
    });
  }
}

// 修改handleConfirm函数
const handleConfirm = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) {
    return;
  }

  handleFormData();

  (form.value.id
    ? updateInStorageSub(form.value)
    : createInStorageSub(form.value)
  ).then((res) => {
    ElMessage({
      message: `添加明细成功`,
      type: 'success',
      plain: true,
    });
    emit('confirm', res.data);
    vis.value = false;
  });
};
</script>

<style scoped>
.sub-form {
  padding: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>
