/**
 * Created by Administrator on 2017/5/7.
 */
const Domain = 'http://client.q1069.com/frontend/web/'

let Services = {
  // 控制台
  controlTodayData: Domain + 'data/home',
  // 用户
  userLogin: Domain + 'user/login',
  userLoginOut: Domain + 'user/login-out',

  // 通讯录组
  contactGroupAdd: Domain + 'phone/group-add',
  contactGroupList: Domain + 'phone/group-list',
  contactGroupDelete: Domain + 'phone/group-delete',
  contactGroupEdit: Domain + 'phone/group-modify',

  // 通讯录
  contactAdd: Domain + 'phone/list-add',
  contactList: Domain + 'phone/list',
  contactDelete: Domain + 'phone/list-delete',
  contactEdit: Domain + 'phone/list-modify',
  contactSearch: Domain + 'phone/list-search',
  contactDownload: Domain + 'phone/list-out',

  // 文件上传
  fileUpload: Domain + 'file/up',
  fileCheckPhone: Domain + 'message/file-check-phone',
  manualCheckPhone: Domain + 'message/manual-check-phone',
  contactCheckPhone: Domain + 'file/list-up',

  // 群发
  messageSignInfo: Domain + 'message/get-info',
  messageContentCheck: Domain + 'message/manual-check-msg',
  messageCreateShort: Domain + 'short-link/create-activity',
  messageSend: Domain + 'message/send-msg',

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
