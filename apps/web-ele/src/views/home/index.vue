<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { AnalysisChartCard, AnalysisOverview } from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AnalyticsInStore from './analytics-in-store.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '用户量',
    totalTitle: '总用户量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '访问量',
    totalTitle: '总访问量',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载量',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '使用量',
    totalTitle: '总使用量',
    totalValue: 50_000,
    value: 5000,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <div class="p-5">
    <div
      class="w-full"
      style="
        height: 30px;
        margin-bottom: 10px;
        line-height: 30px;
        color: aliceblue;
        text-align: center;
        background-color: #3e3333de;
        border-radius: 4px;
      "
    >
      <div
        style="
          float: left;
          width: 100px;
          background: #265ed0;
          border-radius: 4px 0 0 4px;
        "
      >
        磐领软件
      </div>
      ******************************************************
      我们销售的不仅是软件
      更是高效率低成本的管理模式******************************************************
    </div>
    <AnalysisOverview :items="overviewItems" />
    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="本公司求购和促销"
      >
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="产品求购和促销"
      >
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
    </div>
    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="显示中的简历"
      >
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="行业相关查询"
      >
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
    </div>
    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="过去一周入库趋势"
      >
        <AnalyticsInStore />
      </AnalysisChartCard>
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="过去一周销售趋势"
      >
        <AnalyticsInStore />
      </AnalysisChartCard>
    </div>
    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="过去一周销售退货趋势"
      >
        <AnalyticsInStore />
      </AnalysisChartCard>
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="过去一周采购退货趋势"
      >
        <AnalyticsInStore />
      </AnalysisChartCard>
    </div>
  </div>
</template>
