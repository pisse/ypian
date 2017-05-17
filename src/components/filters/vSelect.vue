<template>
  <div class="search-bar constant-cpt">
    <span class="bar-name">{{opt.name}}:</span>
    <div class="select-wrap">
      <v-select size="small" v-model="formData[opt['key']]" placeholder="请选择">
        <el-option
                v-for="item in opt.items"
                :key="item.val"
                :label="item.label"
                :value="item.val">
        </el-option>
      </v-select>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  .search-bar
    .select-wrap
      display : inline-block
      min-width : 200px
</style>
<script type="text/ecmascript-6">
  import { Select, Option } from 'element-ui'
  export default {
    data () {
      return {
      }
    },
    props: {
      opt: Object,
      formData: Object
    },
    components: {
      vSelect: Select, elOption: Option
    }
  }
</script>
