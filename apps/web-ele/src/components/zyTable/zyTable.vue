<template>
  <div>
    <el-table
      ref="elTable"
      :height="tableHeight"
      :stripe="stripe"
      :border="border"
      v-bind="$attrs"
    >
      <slot name="default"></slot>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: [String, Number],
      default: undefined,
    },
    autoFitHeight: {
      type: Boolean,
      default: false,
    },
    queryFormContainerName: {
      type: String,
      default: 'query-form-container',
    },
    queryFormContainerHeight: {
      type: [String, Number],
      default: null,
    },
    tableBtnContainerHeight: {
      type: [String, Number],
      default: 36,
    },
    extraCalcHeight: {
      type: [String, Number],
      default: 0,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tableHeight: null,
      resizeHandler: null,
    };
  },
  watch: {
    height(v) {
      this.getTableHeight();
    },
    tableBtnContainerHeight(v) {
      this.getTableHeight();
    },
    queryFormContainerHeight(v) {
      this.getTableHeight();
    },
  },
  activated() {
    this.getTableHeight();
  },
  mounted() {
    this.resizeHandler = () => {
      this.getTableHeight();
    };
    window.addEventListener('resize', this.resizeHandler);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    getRef() {
      return this.$refs.elTable;
    },
    getTableHeight() {
      const h = this.height;
      if (!h && this.autoFitHeight) {
        if (
          this.queryFormContainerHeight ||
          this.queryFormContainerHeight === 0
        ) {
          this.tableHeight = 0;
          this.$nextTick(() => {
            this.tableHeight =
              document.body.clientHeight -
              86 -
              10 -
              +this.queryFormContainerHeight -
              +this.tableBtnContainerHeight -
              +this.extraCalcHeight -
              60 -
              12;
          });
        } else {
          this.getQueryHeight().then((height) => {
            this.tableHeight = 0;
            this.$nextTick(() => {
              this.tableHeight =
                document.body.clientHeight -
                86 -
                10 -
                (height + 10) -
                +this.tableBtnContainerHeight -
                +this.extraCalcHeight -
                60 -
                12;
            });
          });
        }
      } else {
        this.tableHeight = h;
      }
    },
    getQueryHeight() {
      return new Promise((resolve, reject) => {
        let count = 20;
        const itv = setInterval(() => {
          if (count < 0) {
            clearInterval(itv);
            resolve(0);
          }
          const queryDom = document.querySelector(
            `.${this.queryFormContainerName}`,
          );
          if (queryDom && queryDom.clientHeight) {
            clearInterval(itv);
            resolve(queryDom.clientHeight);
          }
          count--;
        }, 100);
      });
    },
  },
};
</script>
