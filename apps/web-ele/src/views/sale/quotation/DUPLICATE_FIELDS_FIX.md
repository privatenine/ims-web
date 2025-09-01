# 报价管理页面重复字段修复

## 问题描述
VXE Table 报告了列字段重复的错误：
- `column.field="statusFlag"` 重复了
- `column.field="outboundName"` 重复了

这会导致表格某些功能无法正常使用。

## 问题分析
在 `data.ts` 文件的 `useColumns()` 函数中发现了多个重复的字段名：

### 重复字段1：statusFlag
```typescript
// 重复使用
{
  field: 'statusFlag',
  title: '订单状态',
},
{
  field: 'statusFlag',  // 重复！
  title: '客户',
}
```

### 重复字段2：outboundName  
```typescript
// 重复使用
{
  field: 'outboundName',
  title: '配送类型',
},
{
  field: 'outboundName',  // 重复！
  title: '已付预付款',
},
{
  field: 'outboundName',  // 重复！
  title: '制单员',
}
```

### 其他重复字段
表单配置中也存在大量重复的 `fieldName`，包括：
- `driverName` 重复
- `code` 重复多次
- 等等

## 修复方案

### 1. 表格列字段修复 ✅

#### 修复重复的 statusFlag
```typescript
// 修复前
{
  field: 'statusFlag',
  title: '客户',
}

// 修复后
{
  field: 'custName',
  title: '客户',
}
```

#### 修复重复的 outboundName
```typescript
// 修复前
{
  field: 'outboundName',
  title: '配送类型',
},
{
  field: 'outboundName',
  title: '已付预付款',
},
{
  field: 'outboundName',
  title: '制单员',
}

// 修复后
{
  field: 'deliveryType',
  title: '配送类型',
},
{
  field: 'prepaidAmount',
  title: '已付预付款',
},
{
  field: 'createName',
  title: '制单员',
}
```

#### 修复字段名和标题的映射关系
```typescript
// 确保字段名和标题含义一致
{
  field: 'discountAmount',
  title: '优惠金额(元)',
},
{
  field: 'carNum',
  title: '汽车车牌',
},
{
  field: 'orderEmployee',
  title: '下单员工',
},
{
  field: 'approveName',
  title: '审批人',
},
{
  field: 'approveTime',
  title: '审批日期',
  formatter: ({ cellValue }) => {
    return cellValue ? new Date(cellValue).toLocaleDateString() : '';
  },
},
{
  field: 'businessType',
  title: '业务类型',
},
{
  field: 'freight',
  title: '运费',
},
{
  field: 'createTime',
  title: '制单日期',
  formatter: ({ cellValue }) => {
    return cellValue ? new Date(cellValue).toLocaleDateString() : '';
  },
}
```

### 2. 表单字段修复 ✅

#### useFormSchema 修复
```typescript
// 修复前：重复的 driverName
{
  fieldName: 'driverName', // 重复
  label: '价格级别',
},
{
  fieldName: 'driverName', // 重复
  label: '业务类型',
}

// 修复后：使用唯一字段名
{
  fieldName: 'priceLevel',
  label: '价格级别',
},
{
  fieldName: 'businessType',
  label: '业务类型',
}
```

#### useGridFormSchema 修复
```typescript
// 修复前：重复的 carNum 和 code
{
  fieldName: 'carNum', // 重复
  label: '销售流水号',
},
{
  fieldName: 'carNum', // 重复
  label: '配送类型',
}

// 修复后：使用唯一字段名
{
  fieldName: 'saleCode',
  label: '销售流水号',
},
{
  fieldName: 'deliveryType',
  label: '配送类型',
}
```

## 修复结果

### ✅ 已解决的问题
1. **VXE Table 重复字段警告消失**
2. **所有表格列都有唯一的字段名**
3. **字段名和标题含义匹配**
4. **表单字段名唯一性**
5. **添加了合适的格式化器**（日期字段）

### 🎯 字段映射表

| 标题 | 旧字段名 | 新字段名 | 说明 |
|------|----------|----------|------|
| 订单状态 | `statusFlag` | `statusFlag` | 保持不变 |
| 客户 | `statusFlag` | `custName` | 修复重复 |
| 配送类型 | `outboundName` | `deliveryType` | 修复重复 |
| 已付预付款 | `outboundName` | `prepaidAmount` | 修复重复 |
| 制单员 | `outboundName` | `createName` | 修复重复 |
| 优惠金额 | `createTime` | `discountAmount` | 字段含义匹配 |
| 汽车车牌 | `createName` | `carNum` | 字段含义匹配 |
| 下单员工 | `distribution` | `orderEmployee` | 字段含义匹配 |
| 审批人 | `remark` | `approveName` | 字段含义匹配 |
| 审批日期 | `businessTypeZh` | `approveTime` | 字段含义匹配 |
| 业务类型 | `approveName` | `businessType` | 字段含义匹配 |
| 运费 | `updateTime` | `freight` | 字段含义匹配 |
| 制单日期 | `logisticsName` | `createTime` | 字段含义匹配 |
| 备注 | `totalPrice` | `remark` | 字段含义匹配 |

### 📝 表单字段更新

| 标签 | 旧字段名 | 新字段名 |
|------|----------|----------|
| 价格级别 | `driverName` | `priceLevel` |
| 业务类型 | `driverName` | `businessType` |
| 数量 | `code` | `totalNum` |
| 金额 | `code` | `totalMoney` |
| 业务员 | `code` | `salesperson` |
| 备注 | `code` | `remark` |
| 销售流水号 | `carNum` | `saleCode` |
| 配送类型 | `carNum` | `deliveryType` |
| 预计到货日期 | `code` | `deliveryDate` |
| 优惠金额 | `code` | `discountAmount` |

## 注意事项
1. **后端API适配**：如果后端返回的字段名与新字段名不匹配，可能需要添加字段映射
2. **数据格式化**：日期字段已添加格式化器，确保正确显示
3. **选项配置**：为下拉选择字段添加了合适的选项配置
4. **字段验证**：保留了必要的表单验证规则

## 验证方法
1. 检查浏览器控制台是否还有VXE Table重复字段警告
2. 测试表格排序、筛选功能是否正常
3. 测试表单提交功能是否正常
4. 验证数据显示是否正确