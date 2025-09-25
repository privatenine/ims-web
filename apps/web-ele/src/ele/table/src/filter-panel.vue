<template>
  <ElTooltip
    ref="tooltip"
    :visible="tooltipVisible"
    :offset="0"
    :placement="placement"
    :show-arrow="false"
    :stop-popper-mouse-event="false"
    teleported
    effect="light"
    pure
    :popper-class="filterClassName"
    persistent
    :append-to="appendTo"
  >
    <template #content>
      <div v-if="multiple">
        <div :class="ns.e('content')">
          <ElScrollbar :wrap-class="ns.e('wrap')">
            <ElCheckboxGroup
              v-model="filteredValue"
              :class="ns.e('checkbox-group')"
            >
              <ElCheckbox
                v-for="filter in filters"
                :key="filter.value"
                :value="filter.value"
              >
                {{ filter.text }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </ElScrollbar>
        </div>
        <div :class="ns.e('bottom')">
          <button
            :class="{ [ns.is('disabled')]: filteredValue.length === 0 }"
            :disabled="filteredValue.length === 0"
            type="button"
            @click="handleConfirm"
          >
            {{ t('el.table.confirmFilter') }}
          </button>
          <button type="button" @click="handleReset">
            {{ t('el.table.resetFilter') }}
          </button>
        </div>
      </div>
      <ul v-else :class="ns.e('list')">
        <li
          :class="[
            ns.e('list-item'),
            {
              [ns.is('active')]: isPropAbsent(filterValue),
            },
          ]"
          @click="handleSelect(null)"
        >
          {{ t('el.table.clearFilter') }}
        </li>
        <li
          v-for="filter in filters"
          :key="filter.value"
          :class="[ns.e('list-item'), ns.is('active', isActive(filter))]"
          :label="filter.value"
          @click="handleSelect(filter.value)"
        >
          {{ filter.text }}
        </li>
      </ul>
    </template>
    <template #default>
      <span
        v-click-outside:[popperPaneRef]="hideFilterPanel"
        :class="[
          `${ns.namespace.value}-table__column-filter-trigger`,
          `${ns.namespace.value}-none-outline`,
        ]"
        @click="showFilterPanel"
      >
        <ElIcon>
          <slot name="filter-icon">
            <ArrowUp v-if="column?.filterOpened" />
            <ArrowDown v-else />
          </slot>
        </ElIcon>
      </span>
    </template>
  </ElTooltip>
</template>

<script lang="ts">
import type { Placement } from 'element-plus/es/components/popper/index.mjs';
import type { TooltipInstance } from 'element-plus/es/components/tooltip/index.mjs';

import type { PropType, WritableComputedRef } from 'vue';

import type { Store } from './store';
import type { TableColumnCtx } from './table-column/defaults';
import type { TableHeader } from './table-header';
import type { DefaultRow } from './table/defaults';

import { computed, defineComponent, getCurrentInstance, ref, watch } from 'vue';

import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import ElCheckbox from 'element-plus/es/components/checkbox/index.mjs';
import { ElIcon } from 'element-plus/es/components/icon/index.mjs';
import ElScrollbar from 'element-plus/es/components/scrollbar/index.mjs';
import ElTooltip, {
  useTooltipContentProps,
} from 'element-plus/es/components/tooltip/index.mjs';
import { ClickOutside } from 'element-plus/es/directives/index.mjs';
import { useLocale } from 'element-plus/es/hooks/use-locale/index.mjs';
import { useNamespace } from 'element-plus/es/hooks/use-namespace/index.mjs';
import { isPropAbsent } from 'element-plus/es/utils/index.mjs';

const { CheckboxGroup: ElCheckboxGroup } = ElCheckbox;

export default defineComponent({
  name: 'ElTableFilterPanel',
  components: {
    ElCheckbox,
    ElCheckboxGroup,
    ElScrollbar,
    ElTooltip,
    ElIcon,
    ArrowDown,
    ArrowUp,
  },
  directives: { ClickOutside },
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
    },
    store: {
      type: Object as PropType<Store<DefaultRow>>,
    },
    column: {
      type: Object as PropType<TableColumnCtx<DefaultRow>>,
    },
    upDataColumn: {
      type: Function,
    },
    appendTo: useTooltipContentProps.appendTo,
  },
  setup(props) {
    const instance = getCurrentInstance();
    const { t } = useLocale();
    const ns = useNamespace('table-filter');
    const parent = instance?.parent as TableHeader;
    if (props.column && !parent.filterPanels.value[props.column.id]) {
      parent.filterPanels.value[props.column.id] = instance;
    }
    const tooltipVisible = ref(false);
    const tooltip = ref<null | TooltipInstance>(null);
    const filters = computed(() => {
      return props.column && props.column.filters;
    });
    const filterClassName = computed(() => {
      if (props.column && props.column.filterClassName) {
        return `${ns.b()} ${props.column.filterClassName}`;
      }
      return ns.b();
    });
    const filterValue = computed({
      get: () => (props.column?.filteredValue || [])[0],
      set: (value?: null | string) => {
        if (filteredValue.value) {
          if (isPropAbsent(value)) {
            filteredValue.value.splice(0, 1);
          } else {
            filteredValue.value.splice(0, 1, value);
          }
        }
      },
    });
    const filteredValue: WritableComputedRef<string[]> = computed({
      get() {
        if (props.column) {
          return props.column.filteredValue || [];
        }
        return [];
      },
      set(value: string[]) {
        if (props.column) {
          props.upDataColumn?.('filteredValue', value);
        }
      },
    });
    const multiple = computed(() => {
      if (props.column) {
        return props.column.filterMultiple;
      }
      return true;
    });
    const isActive = (filter: { text: string; value: string }) => {
      return filter.value === filterValue.value;
    };
    const hidden = () => {
      tooltipVisible.value = false;
    };
    const showFilterPanel = (e: MouseEvent) => {
      e.stopPropagation();
      tooltipVisible.value = !tooltipVisible.value;
    };
    const hideFilterPanel = () => {
      tooltipVisible.value = false;
    };
    const handleConfirm = () => {
      confirmFilter(filteredValue.value);
      hidden();
    };
    const handleReset = () => {
      filteredValue.value = [];
      confirmFilter(filteredValue.value);
      hidden();
    };
    const handleSelect = (_filterValue?: null | string) => {
      filterValue.value = _filterValue!;
      if (isPropAbsent(_filterValue)) {
        confirmFilter([]);
      } else {
        confirmFilter(filteredValue.value);
      }
      hidden();
    };
    const confirmFilter = (filteredValue: unknown[]) => {
      props.store?.commit('filterChange', {
        column: props.column,
        values: filteredValue,
      });
      props.store?.updateAllSelected();
    };
    watch(
      tooltipVisible,
      (value) => {
        if (props.column) {
          props.upDataColumn?.('filterOpened', value);
        }
      },
      {
        immediate: true,
      },
    );

    const popperPaneRef = computed(() => {
      return tooltip.value?.popperRef?.contentRef;
    });

    return {
      tooltipVisible,
      multiple,
      filterClassName,
      filteredValue,
      filterValue,
      filters,
      handleConfirm,
      handleReset,
      handleSelect,
      isPropAbsent,
      isActive,
      t,
      ns,
      showFilterPanel,
      hideFilterPanel,
      popperPaneRef,
      tooltip,
    };
  },
});
</script>
