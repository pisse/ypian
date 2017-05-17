/**
 * Created by Administrator on 2017/4/28.
 */

import Mock from 'mock'

var data = {
    calendarData: Mock.mock({
        "today": "2016-07-25",
        "todayMix": 25,
        "beforeBlankCount": 5,
        "monthDayCount": 31,
        "monthLabel": "2016-07",
        "selectedDate": "",
        "dates": {
            "2016-07-30": {
                "startPrice": 3439,
                "adultPrice": 4039,
                "excludeChildFlag": 0,
                "childPrice": 2049,
                "freeChildPrice": 699,
                "roomGrapFlag": 1,
                "flightTicketType": 1,
                "strategyType": 1,
                "bookCityCode": 2500,
                "departureCityCode": 2500,
                "discount": 600,
                "discountDesc": [{
                    "discountName": "立减优惠",
                    "discountPrice": 600,
                    "tagName": "减",
                    "discountType": 0,
                    "type": 1,
                    "promotionId": 119987
                }],
                "promotionIntro": "活动名称：三亚旅游节立减600/成人再送御泥坊【净透亮颜美丽礼包】1份1、6.13-8.31区间预订该线路指定活动团期（非活动团期不可参加此活动），即可享受立减600/成人，提交订单时，勾选“立减优惠”即可扣减相应金额，保险不含。2、儿童同行不享受优惠政策（儿童标准以途牛旅游网具体产品线路“费用说明”中公布为准）。3、本次活动按双人出行共用一间房核算单人价格，最终成行价格将根据所选出发日期、出行人数、住宿房型、交通以及所选附加服务的不同而有所不同，以客服与您确认需求后核算价格为准。4、本活动名额有限，售完即止，不与途牛旅游网其他任何优惠活动同享（旅游券除外）。5、途牛旅游网在法律允许的范围内保留对本次活动的变更权，包括但不限于参加资格、消费时间及奖励方式、暂停或取消本活动等。6、御泥坊面膜赠品-客户收到途牛发送的兑换码活动信息，扫描二维码进入御泥坊VIP商城，凭借兑换码领取，在御泥坊VIP商城首页的【兑换专区】输入兑换码后，商品自动加入购物车，然后用户下单填写地址即可，用户需自理邮费15元，与其他包邮产品一起购买可免邮。",
                "lowestPriceName": "促销价",
                "mobileOnlyFlag": 0,
                "sharingPromotionId": 0,
                "sharingPreferential": 0,
                "stockInfo": {"stockSign": 1, "stockNum": 3},
                "weekDay": "周六",
                "festival": "",
                "cutPrice": 600
            }, "minPrice": 3439
        },
    }),
    activity_list: Mock.mock({
        "code": 0,
        "message": "success",
        "data": {
            "item|6": [{
                "title|1": ["迷情越南","海岛之旅"],
                "subtitle|1": ["越南越美","吉普赛"],
                "url|1": ["SPU20160920191526257","SPU20160920195828357"],
                "pic_url|1": ['http://qimg5.youxiake.com/app/201607/05/pager/4713f0dc3c323280739886a9c775453b.jpg!p6',
                    'http://qimg5.youxiake.com/app/201607/05/pager/ace38c5e0d6fa326628a31c691209962.jpg!p6',
                    'http://qimg5.youxiake.com/app/201607/14/pager/ba812bd7367c42783104826e6ceeb15d.jpg!p6',
                    'http://qimg5.youxiake.com/app/201606/14/pager/f71a605d21ab952cf72b10cc7601c97a.jpg!p6',
                    'http://qimg5.youxiake.com/app/201607/18/pager/f7072b920972bab999de04f0053f0910.jpg!p6',
                    'http://qimg5.youxiake.com/app/201607/18/pager/d113d5f3cda89a8901963e79af0fb4f3.jpg!p6'
                ],
                "sign_one|1": ["深度游","自由游"],
                "sign_two": "￥200元/天"
            }]
        }
    }),
    detail: Mock.mock({
        "code": 0,
        "message": "success",
    }),
    personinfo: Mock.mock({
        "code": 0,
        "message": "success",
        "data": {
            "item": {
                "userhead": "http://121.40.140.36/backend/web/resource/hq_attachment/active/2016-08-17/active_1471423558.jpg",
                "username": "kevinhong",
                "member_level": "铁杆会员",
                "cash_integral": 0,
                "travel_integral": 0
            }
        }
    }),
    qr: Mock.mock({
        "code": 0,
        "message": "success",
        "data": {
            "url": "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQEn8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xLzVUcUhxSjNsU24wei1reERCaEtrAAIEZ%2FT5VwMEAAAAAA%3D%3D"
        }
    })
}

export default data;



