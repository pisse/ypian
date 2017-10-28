/**
 * Created by Administrator on 2017/5/7.
 */
const Domain = 'http://sms.q1069.com/'

let Services = {
  // 控制台
  controlTodayData: Domain + 'data/home',
  // 用户
  userLogin: Domain + 'user/login-new',
  checkVcode: Domain + 'user/ver-captcha',
  getVcode: Domain + 'user/send-captcha',
  userLoginOut: Domain + 'user/login-out',
  userInfo: Domain + 'user/get-info',

  // 通讯录组
  contactGroupAdd: Domain + 'phone/group-add',
  contactGroupList: Domain + 'phone/group-list',
  contactGroupDelete: Domain + 'phone/group-delete',
  contactGroupEdit: Domain + 'phone/group-modify',
  contactGroupCopy: Domain + 'phone/copy-group',

  // 通讯录
  contactAdd: Domain + 'phone/list-add',
  contactList: Domain + 'phone/list',
  contactDelete: Domain + 'phone/list-delete',
  contactEdit: Domain + 'phone/list-modify',
  contactSearch: Domain + 'phone/list-search',
  contactDownload: Domain + 'phone/list-out',
  contactUpload: Domain + 'phone/list-input',
  newContactUpload: Domain + 'phone/list-input-new',
  contactUploadSub: Domain + 'phone/subtraction',
  uploadListTask: Domain + 'phone/mail-list-task',
  contactTotalNum: Domain + 'phone/group-count',

  // 文件上传
  fileTaskUp: Domain + 'file/task-up',
  fileUpload: Domain + 'file/up',
  fileCheckPhone: Domain + 'message/file-check-phone',
  manualCheckPhone: Domain + 'message/manual-check-phone',
  contactCheckPhone: Domain + 'file/list-up',

  // 群发
  messageSignInfo: Domain + 'message/get-info',
  messageContentCheck: Domain + 'message/manual-check-msg',
  messageCreateShort: Domain + 'short-link/create-activity',
  messageSend: Domain + 'message/send-msg',
  messageRecord: Domain + 'message/record-list',
  downloadMessageRecord: Domain + 'output/record-list-out',
  messageRecordReply: Domain + 'message/reply-list',
  messageRecordDetail: Domain + 'message/record-detail',
  downloadRecordDetail: Domain + 'output/record-detail-out',
  downloadList: Domain + 'output/output-list',

  // 发送任务
  messageList: Domain + 'message/list',

  // 营销
  clickStatList: Domain + 'click-data/list',
  clickStatDetail: Domain + 'click-data/detail',
  clickStatDetailNew: Domain + 'click-data/detail-new',
  deviceStatistic: Domain + 'click-data/device-statistics',

  // 数据统计
  dataRealtimeSend: Domain + 'data/send-amount-actual',
  dataHistoryeSend: Domain + 'data/send-amount-offline',

  dataRealtimeArrive: Domain + 'data/send-amount-actual-rate',
  dataHistoryeArrive: Domain + 'data/send-amount-rate-offline',

  dataRealtimeFail: Domain + 'data/send-fail-actual',
  dataHistoryeFail: Domain + 'data/send-fail-offline',

  dataRealtimeDelay: Domain + 'data/send-consume-actual',
  dataHistoryeDelay: Domain + 'data/send-consume-offline',
  dataFee: Domain + 'data/fee'
}

export default Services
