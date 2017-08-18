<template>
    <div class="upload-list">
        <br>
        <br>

        <v-title text="通讯录上传任务列表"></v-title>

        <!--<el-alert
                title="每2秒自动刷新"
                type="info"
                :closable="false">
        </el-alert>-->
        <div class="new-btn">
            <el-button @click="refresh" type="primary" >刷新</el-button>
        </div>
        <br>

        <el-table
                class="list-table"
                v-loading="isLoading"
                :data="tableData"
                stripe
                style="width: 100%">

            <el-table-column v-for="(column, idx) in columns" :key="idx"
                             :col="column"
                             :prop="column.key"
                             :label="column.title"
                             :width="column.width"
            >
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作">
                <template scope="scope" >
                    <el-button v-if="scope.row.down_url" size="small" @click="download(scope.$index, scope.row)">下载</el-button>
                </template>
            </el-table-column>


        </el-table>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">

</style>
<script type="text/ecmascript-6">
  import vTitle from 'components/filters/vTitle'
  import Services from 'common/js/services.js'
  import _request from '../mixin/request'
  import _pagination from '../mixin/pagination'

  export default {
    mixins: [_request, _pagination],
    data () {
      return {
        timer: null,
        tableData: [],
        columns: [
          {key: 'group_name', title: '通讯录组'},
          {key: 'type', title: '类型'}, {key: 'status', title: '状态'},
          {key: 'created_at', title: '创建时间', width: '180px'}
        ]
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.$emit('routeChange', vm.$route.name)
      })
    },
    created () {
      this.refresh()
    },
    methods: {
      refresh () {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.getList()
        this.timer = setTimeout(() => {
          this.refresh()
        }, 1000 * 60)
      },
      getList () {
        this.request(Services.uploadListTask, {}, (remoteData) => {
          this.tableData = remoteData.data
          // this.pageSize = remoteData.page_size
          // this.total = parseInt(remoteData.data.total)
        })
      },
      download (index, rowData) {
        location.href = rowData.down_url.slice(1)
      }
    },
    components: {
      vTitle
    }
  }
</script>
