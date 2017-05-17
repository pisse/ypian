<template>
  <div class="sendrecord-wrap">
    <div class="tab-content">
      <el-alert
              title="成功提示的文案"
              type="info"
              show-icon>
      </el-alert>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

</style>
<script type="text/ecmascript-6">
  import { Alert } from 'element-ui'

  export default {
    data () {
      return {}
    },
    components: {
      elAlert: Alert
    }
  }
</script>
