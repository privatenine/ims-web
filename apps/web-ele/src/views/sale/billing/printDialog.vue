<template>
  <el-dialog
    v-model="vis"
    :title="title"
    width="1000"
    append-to-body
    @close="handleClose"
  >
    <div v-if="mode === 'whole'" id="printArea" class="print-container">
      <div class="whole-labels">
        <div
          v-for="index in skipNum"
          :key="`placeholder-${index}`"
          class="label-item placeholder"
        >
          <!-- 添加与正常标签相同的内容结构以确保高度一致 -->
          <div class="customer-name">&nbsp;</div>
          <div class="product-name">&nbsp;</div>
          <div class="divider"></div>
          <div class="details-row">
            <span class="detail-item">&nbsp;</span>
          </div>
          <div class="details-row">
            <span class="detail-item">&nbsp;</span>
            <span class="detail-item">&nbsp;</span>
          </div>
          <div class="details-row">
            <span class="detail-item">&nbsp;</span>
          </div>
        </div>
        <div v-for="(item, index) in tableData" :key="index" class="label-item">
          <div class="customer-name">{{ item.customerName || '' }}</div>
          <div class="product-name">{{ item.productName }}</div>
          <div class="divider"></div>
          <div class="details-row">
            <span class="detail-item">单号: {{ item.code || '' }}</span>
          </div>
          <div class="details-row">
            <span class="detail-item">仓库: {{ item.warehouse }}</span>
            <span class="detail-item">产地: {{ item.origin }}</span>
          </div>
          <div class="details-row">
            <span class="detail-item">日期: {{ formatDate(item.date) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else id="printArea" class="print-container">
      <!-- 标题区域 -->
      <div class="header">
        <h2 class="title">磐领软件产品销售单</h2>
        <div class="print-count">第 12 次打印</div>
      </div>

      <!-- 信息展示区域 -->
      <div class="info-section">
        <div class="qr-section">
          <div class="qr-code">
            <img src="" alt="二维码" class="qr-image" />
          </div>
          <div class="qr-code">
            <img src="" alt="二维码" class="qr-image" />
          </div>
        </div>

        <div class="info-content">
          <div class="info-row">
            <div class="info-left">
              <p><span class="label">日期：</span>2025 - 09 - 16</p>
              <p><span class="label">电话：</span></p>
              <p><span class="label">车牌：</span></p>
              <p><span class="label">备注：</span></p>
            </div>
            <div class="info-right">
              <p><span class="label">单号：</span>XSD1250916000002</p>
              <p><span class="label">客户：</span>长期应收</p>
              <p><span class="label">类别：</span>自提</p>
              <p><span class="label">地址：</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <table class="custom-table" border="1">
          <thead>
            <tr>
              <th style="width: 5%">序号</th>
              <th style="width: 25%">产品名称</th>
              <th style="width: 10%">附件</th>
              <th style="width: 10%">产地</th>
              <th style="width: 10%">数量</th>
              <th style="width: 10%">仓库</th>
              <th style="width: 10%">货位</th>
              <th style="width: 10%">单价</th>
              <th style="width: 10%">金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.index }}</td>
              <td>{{ item.productName }}</td>
              <td>{{ item.attachment }}</td>
              <td>{{ item.origin }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.warehouse }}</td>
              <td>{{ item.location }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.amount }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="4" class="text-right">合计数量：</td>
              <td>1</td>
              <td colspan="3" class="text-right">合计金额：</td>
              <td>100</td>
            </tr>
            <tr class="total-row">
              <td colspan="9" class="text-bold text-center">
                客户合计欠款：人民币贰万贰仟伍佰陆拾柒元整
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 提示信息 -->
      <div class="tip-section">
        <p>
          ***1、请收货当面清点数量检验有无外观缺陷。2、请确认产品有我公司的识别标签，逾期损失客户自负！***
        </p>
      </div>

      <!-- 底部字段 -->
      <div class="footer-section">
        <div class="signature-fields">
          <span>业务：</span>
          <span>拣货人：</span>
          <span>库管：</span>
          <span>打包：</span>
          <span>配送人：</span>
          <span>签收人：</span>
          <span> </span>
        </div>
      </div>
    </div>

    <div class="print-button text-center">
      <el-button type="primary" v-print="printObj">打印</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(['visible', 'formData', 'mode', 'skipNum']);

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const vis = ref(false);

const printObj = ref({
  id: 'printArea',
  popTitle: '&nbsp;',
  extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
});

// 同步外部visible属性到内部vis
watch(
  () => props.visible,
  (newVal) => {
    vis.value = newVal;
  },
);

// 同步内部vis到外部visible
watch(vis, (newVal) => {
  emit('update:visible', newVal);
});

const title = computed(() => {
  return `打印预览`;
});

const handleClose = () => {
  emit('cancel');
};

// 表格数据
const tableData = ref([
  {
    index: 1,
    productName: '长安 UNI - Z (24 - Q) 右前门_夹层',
    attachment: '',
    origin: '山西李虎',
    quantity: 1,
    warehouse: '临时库',
    location: '#1',
    price: '222.00',
    amount: '222.00',
    customerName: '长期应收',
    code: 'XSD1250916000002',
    date: new Date(),
  },
]);

// 生成50条数据
const generateTableData = () => {
  const baseData = tableData.value[0];
  const newData = [];
  for (let i = 1; i <= 50; i++) {
    newData.push({
      ...baseData,
      index: i,
    });
  }
  tableData.value = newData;
};

// 组件挂载时生成50条数据
generateTableData();

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// 获取跳过数量
const skipNum = computed(() => {
  return props.skipNum || 0;
});
</script>

<style scoped lang="scss">
@media print {
  .print-container {
    max-height: unset !important;
    height: auto !important;
  }
  table {
    table-layout: fixed !important;
  }
  .custom-table {
    border: 1px solid #000 !important;
  }
  .custom-table th,
  .custom-table td {
    border: 1px solid #000 !important;
  }

  /* 整单标签打印样式 */
  .whole-labels {
    display: flex;
    flex-wrap: wrap;
  }

  .label-item {
    width: 25%; /* 一行四个 */
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #000;
    page-break-inside: avoid;
  }

  .placeholder {
    visibility: hidden;
  }
}
.a4 {
  width: 800px;
}
.print-container {
  color: #000;
  font-size: 13px;
  margin-bottom: 20px;

  .header {
    text-align: center;
    position: relative;
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }

    .print-count {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 14px;
    }
  }

  .info-section {
    display: flex;
    margin-bottom: 30px;

    .qr-section {
      flex: 0 0 240px;
      display: flex;
      gap: 20px;
      margin-right: 20px;

      .qr-code {
        flex: 1;
        height: 120px;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;

        .qr-image {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    .info-content {
      flex: 1;

      .info-row {
        display: flex;

        .info-left,
        .info-right {
          flex: 1;

          p {
            margin: 0 0 10px 0;

            .label {
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .table-section {
    margin-bottom: 20px;

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;

      th,
      td {
        border: 1px solid #000;
        padding: 4px 0px;
        text-align: center;
      }

      th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
    }

    .table-summary {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding: 0 10px;
    }
  }

  .tip-section {
    margin-bottom: 30px;

    p {
      margin: 0;
    }
  }

  .footer-section {
    .signature-fields {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .print-button {
      text-align: center;
    }
  }

  /* 整单标签样式 */
  .whole-labels {
    display: flex;
    flex-wrap: wrap;
  }

  .label-item {
    width: 25%; /* 一行四个 */
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #000;
    page-break-inside: avoid;
    display: flex;
    flex-direction: column;

    .customer-name {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .product-name {
      margin-bottom: 5px;
    }

    .divider {
      border-top: 1px solid #000;
      margin: 5px 0;
    }

    .details-row {
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;

      .detail-item {
        flex: 1;
        min-width: 50%;
      }
    }
  }

  .placeholder {
    visibility: hidden;
  }
}
</style>
