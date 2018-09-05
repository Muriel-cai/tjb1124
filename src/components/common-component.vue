<template>
    <div class="common-component" @click="stop">
        <div class="maintop">
            <img :src="allData.mianpic" class="mianpic">

            <div class="allthings">
                <!-- 视频 -->
                <div class="videobox" id="videobox" v-show="allData.havevideo" @click.stop="myVedio"></div>
                <!-- 时间轴 -->
                <div class="timeline"></div>
                <!-- 领取优惠券 -->
                <Ticket></Ticket>
                <Goods></Goods>
                <!-- 优惠券 -->
                <!-- <a :href="allData.drumplink" class="quan">
                    <i class="number">{{allData.valuenum}}</i>
                </a> -->
                <!-- <Goods></Goods> -->
            </div>
            <Signup></Signup>

            <!-- 弹窗按钮 -->
            <div class="rulesbtn" @click="rulesshow"></div>
            <!-- 活动规则弹窗 -->
            <Rules :panelShow.sync="panelShow"></Rules>
           

        </div>
    </div>
</template>
<script>
import Ticket from '@/components/get'
import Rules from '@/components/rules'
import Goods from '@/components/goods'
import Signup from '@/components/signup'

export default {
    name: 'common-component',
    data() {
        return {
            allData: data,
            ifauto: true,
            ifplay: null,
            panelShow: false
        };
    },
    components:{
        Ticket,
        Rules,
        Goods,
        Signup
    },
    created() {
        console.log(this.allData.mianpic, 'data')
    },
    mounted() {
        // alert('11')
        var self = this;
        // self.myVedio(self.allData.vid, 'videobox');
        var par = { 'wifiStatus': true };
        window.WindVane.call('WVNetwork', 'getNetworkType', par, function(e) {
            // alert(JSON.stringify(e))
            if (e.type == 'WIFI') {
                self.ifauto = true;
            } else {
                self.ifauto = false;
            }
            self.myVedio(self.allData.vid, 'videobox')
        }, function(e) {
            // alert('22','22')
            // alert(JSON.stringify(e));
        });
        // alert(this.ifauto);
    },
    methods: {
        myVedio(vid, elem) {
            var self = this;
            var config = {
                videoId: vid, //视频id【必传】
                ccode: "0590", //渠道id 【必传】
                client_id: "6b0cc88390551a80", //优酷视频云创建应用的client_id【可选】
                control: {
                    laguange: "", //默认使用的语言类型
                    hd: "mp4hd", //默认使用的码率 【可选】 默认就是这个
                    autoplay: this.ifauto //可选，默认不自动播放，非优酷app内部，慎用，可能会不支持【可选】
                },
                wintype: "", //每端固定的参数，多用于统计，不确定是否还需要【可选】
                events: {
                    onReady: null, //数据已经准备好，可触发播放回调
                    onPlayStart: null, //正片刚开始播放回调
                    onAdPlayStart: null, //前贴广告播放回调
                    onPlay: null, //中途暂停之后，开始播放回调
                    onError: null //播放错误回调
                }
            };
            var uiConfig = {
                dash: { //控制栏按钮隐藏配置
                    play: false, //是否隐藏暂停/播放按钮
                    full: true, //是否隐藏全屏按钮
                    videoInterest: false //是否加载播后推荐
                }, //底部控制栏配置
                event: {
                    showDash: function() { //控制栏显示回调
                        console.log("showDash");
                    },
                    hideDash: function() { //控制栏隐藏回调
                        console.log("hideDash");
                    },
                    startPlay: function(argument) { //播放按钮点击回调
                        console.log("startPlay");
                    },
                    switchFullscreen: function(videoinfo, isFullScreen) {
                        //全屏按钮切换回调videoinfo——当前视频信息 isFullScreen-当前按钮状态
                    }
                },
                hidetitle: true, //是否隐藏标题 默认false
                hidelogo: true, //是否隐藏logo 默认false
                // poster: '//vthumb.ykimg.com/0541020159C1234719C17C7577040256', //自定义预览图
                posterType: 'episode', //base-视频默认截图 episode-剧集封面图
                disablePlayerSlide: true, //禁用播放器滑动快进/快退
                showMutedIcon: true //是否显示静音控制按钮 （备注：1.6.3以后支持
            }
            this.ifplay = YKPlayer.Player(elem, config, uiConfig);
        },
        rulesshow(){
          this.panelShow = true;
        },

        stop(){
            var self = this;
            // alert(77);
            
            self.ifplay.pause();
        }
    }
};

</script>
<style scoped>
h1 {
    font-weight: normal;
    font-size: 20px;
}

</style>
