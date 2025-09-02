<template>
  <el-dialog
    v-model="vis"
    :title="title"
    width="1000"
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
          <el-form-item label="供应商" prop="supplierId">
            <el-select
              v-model="form.supplierId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="单号" prop="code">
            <el-input v-model="form.code" disabled readonly />
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="到货方式" prop="arrivalId">
            <el-select
              v-model="form.arrivalId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in arrivalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="提货车牌" prop="pickUpCarId">
            <el-select
              v-model="form.pickUpCarId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in carOptions"
                :key="item.id"
                :label="item.carNum"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="卸货方式" prop="unloadingId">
            <el-select
              v-model="form.unloadingId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in unloadingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="金额" prop="totalMoney">
            <el-input-number
              v-model="form.totalMoney"
              :readonly="true"
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="8">
          <el-form-item label="数量" prop="totalNum">
            <el-input-number
              v-model="form.totalNum"
              :readonly="true"
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="备注" prop="remark" class="col-span-4">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              :clearable="true"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="0">
          <el-form-item prop="supplierId">
            <el-input v-model="form.supplierId" type="hidden" />
          </el-form-item>
        </el-col>
        
        <el-col :span="0">
          <el-form-item prop="id">
            <el-input v-model="form.id" type="hidden" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getCarList, getSupplierList } from '#/api'

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
const props = defineProps(['visible', 'formData'])

const vis = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = ref({
  supplierId: '',
  supplierName: '',
  code: '',
  arrivalId: undefined,
  pickUpCarId: undefined,
  unloadingId: undefined,
  totalMoney: 0,
  totalNum: 0,
  remark: '',
  id: '',
  statusFlag: undefined
})

// 表单验证规则
const rules = ref<FormRules>({
  supplierId: [
    { required: true, message: '供应商不能为空', trigger: 'change' }
  ]
})

// 到货方式选项
const arrivalOptions = [
  { label: '自提', value: 1 },
  { label: '送货', value: 2 },
  { label: '物流送货', value: 3 }
]

// 卸货方式选项
const unloadingOptions = [
  { label: '机械', value: 1 },
  { label: '人工', value: 2 }
]

// 提货车牌选项
const carOptions = ref<Array<any>>([])
const supplierOptions = ref<Array<any>>([])

// 获取提货车牌选项
const getCarOptions = async () => {
  const res = await getCarList()
  carOptions.value = res.data
}

const getSupplierOptions = async () => {
  const res = await getSupplierList({pageSize:999})
  supplierOptions.value = res.data
}

// 初始化数据
onMounted(() => {
  getCarOptions()
  getSupplierOptions()
})

// 同步外部visible属性到内部vis
watch(() => props.visible, (newVal) => {
  vis.value = newVal
  if (newVal) {
    // 当对话框打开时，初始化表单数据
    if (props.formData) {
      form.value = { ...props.formData }
    } else {
      // 重置表单
      formRef.value?.resetFields()
      form.value = {
        supplierId: '',
        supplierName: '',
        code: '',
        arrivalId: undefined,
        pickUpCarId: undefined,
        unloadingId: undefined,
        totalMoney: 0,
        totalNum: 0,
        remark: '',
        id: '',
        statusFlag: undefined
      }
    }
  }
})

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal)
})

const title = computed(() => {
  return `${form.value?.id ? '修改' : '新增'}入库`
})

const handleClose = () => {
  emit('cancel')
}

const handleCancel = () => {
  vis.value = false
}

const handleConfirm = async () => {
  // 表单验证
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('confirm', form.value)
      vis.value = false
    }
  })
}
</script>
