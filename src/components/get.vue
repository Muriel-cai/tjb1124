<template>
    <div class="getbox">
        <div class="gettips">
            <div class="leftbox"></div>
            <div class="rightbox" v-show="showget" @click="eligible" :style="{ background: nowget}">立即领取</div>
            <div class="rightbox1" @click="toAward" v-show="checkshow">我的奖品</div>
        </div>

        <!-- 中奖弹窗 -->
        <div class="popbox" v-show="awardshow">
            <div class="toaward" >
                <i class="guan" @click="closeget"></i>
                <i class="money">{{alldata.valuenum}}</i>
                <i class="tomyaward" @click="toAward"></i>
                <i class="torules" @click="torules"></i>
                
                <!-- <a :href="alldata.othervo" class="onevideo"> -->
                <a :href="alldata.othervo" class="onevideo">
                    <div class="morepic">
                        <img :src="morepic">
                    </div>
                    <p>{{moretitle}}</p>
                </a>
                <!-- </div> -->
                <!-- </a> -->
            </div>
            <!-- 弹窗的遮罩层 -->
            <div class="zhe2"></div>
        </div>
        
        <!-- 活动规则弹窗 -->
        <Rules  :panelShow.sync="panelShow"></Rules>

    </div>
</template>
<script>
import Vue from "vue";
import VueDialog from "@ali/vue-dialog";
import Bridge from '@ali/lib-bridge';
import mtop from '@ali/lib-mtop';
import Rules from '@/components/rules';
import bus from '../assets/eventBus';
export default {
    name: 'get',
    data() {
        return {
        	alldata: data,
        	awardshow : false, //中奖弹窗
        	panelShow : false, //规则页显示
        	showget: true, //立即领取的显示
        	checkshow: false,//我的奖品显示
            is:false, //已报名
            moretitle: "",
            morepic: "",
            moreurl: "",
            getit:'',
            nowget:'#999'//领奖的背景颜色
        }
    },
    components:{
        Rules
    },
    created(){
    },
    mounted(){
    	Vue.use(VueDialog, {
	      	componentName: "vue-dialog" // Vue.componont()时的名字（默认为vue-dialog）
	    });
        var self = this;
        bus.$on("singses",function(data){
            // console.log(data,'dddd')
            self.is = data;
            // self.eligible();
            // console.log(self.is,'issss')
        })
        // 更多视频
        var items = this.alldata.morevideo[Math.floor(Math.random() * this.alldata.morevideo.length)];
        let nowDate = new Date(Date.now());
        this.morepic = items.morepic;
        this.moretitle = items.moretitle;
        this.moreurl = items.moreurl;
        // console.log(items, "thisdata");

    },
    methods: {
        // 登录判断,未登录跳转登录页面
        login() {
            try {
                Bridge.showLogin({
                    link: location.href,
                    callback: function(arg) {
                        location.reload(true);
                    }
                });
            } catch (e) {
                window.location.href = 'https://account.youku.com/?callback=' + escape(window.location.href);
                console.log("can`t get Bridge");
            }
            location.reload();
        },
        // 验证登录
        isLogin(){
        	// alert(0)
        	const self = this;
        	lib.mtop.config.prefix = 'acs';
            // lib.mtop.config.prefix = 'pre-acs'
			lib.mtop.config.subDomain = '';
			lib.mtop.config.mainDomain = 'youku.com';
			var promise = lib.mtop.request({
			    api: 'mtop.com.youku.aplatform.weakGet', // 必须
			    v: '1.0', // 必须
			    data: {
			      bizType: 'tool.isLogin'
			    }, // 必须
			    appKey: '23536927', // 必须 (优酷业务请根据上述表格进行选择)
			    ecode: 0 // 必须（登录接口设置为1，非登录接口0）
			});
			promise.then((res) => {
				// alert(1);
				// console.log(res,'resLogin');
				var isLogin = res.data.isLogin; 
				// console.log(isLogin,'isLogin');
				if(isLogin === true || isLogin === 'true') {
					// alert(2);
					self.getid();
					self.getAward();
					// self.toAward(isLogin)
				} else {
					// alert(3);
					// console.log('no')
					self.login();
				}
			},(reject) => {
				// alert(reject);

			})
        },
        //获取ytid
        getid(){
        	// alert(99);
        	var params = {};
			window.WindVane.call('DYKUserJSBridge', 'getUserInfo', params, function(e) {
			    // alert('success: ' + JSON.stringify(e));
			}, function(e) {
			    // alert('failure: ' + JSON.stringify(e));
			});
        },
        // 抽奖接口
        getAward(){
        	// alert(0);
        	var self = this;
        	// lib.mtop.config.prefix = 'acs'; 
            lib.mtop.config.prefix = 'pre-acs'
  			lib.mtop.config.subDomain = '';
  			lib.mtop.config.mainDomain = 'youku.com';
  			var promise = lib.mtop.request({
  				api: 'mtop.youku.mrp.award.doAward',
			    v: '1.0',
			    type: 'POST',
			    ecode: 1,
			    appkey: '23774304',
			    isSec: 1,
			    data: {
			      	extra: "{\"act_ename\":\"2018YoukuKidsActivity\"}",
			      	ename: this.alldata.enameArg,
			      	asac: '1A18427HZZHT2RBLMURHKD'
			    }
  			});
  			promise.then((res) => { //中奖后
  				// alert(1);
  				// alert(JSON.stringify(res));
                if(res.data.sendRightDTO){
                    //self.showget = false; // 中奖后领奖按钮隐藏
                    //self.checkshow = true; //中奖后查看我的奖品按钮出现
                }
  				self.awardshow = true;  //显示礼券弹框 
                

  			},(reject) => {
  				// alert(2);
  				// alert(JSON.stringify(reject));
                self.showget = false; // 中奖后领奖按钮隐藏
                self.checkshow = true; //中奖后查看我的奖品按钮出现
  			})
        },
        // 去领奖页
        toAward(isLogin){
        	var self = this;
        	// 判断ua
        	const youkuapp = /youku/i.test(navigator.userAgent.toLowerCase());
        	if (youkuapp) {
        		if (isLogin) {
        			window.location = '//h5.m.youku.com/app/coupon.html';
        		} else {
        			self.login();
        		}
        	}
        },
        // 资格验证
        eligible(){
            // alert(this.is)
            if(this.is == true || this.is == "true"){
                this.history();
            }
        },
        // 获取少儿的播放记录
        history() { 
        	var self = this;
            lib.mtop.config.prefix = 'acs';
            lib.mtop.config.subDomain = '';
            lib.mtop.config.mainDomain = 'youku.com';
            var promise = lib.mtop.request({
				api: 'mtop.youku.playlog.playlog.kids.get',
		      	v: '1.0',
		      	ecode: 1,
		      	appkey: '24679788',
		      	data: "{\"pg\":\"1\",\"pz\":\"10\",\"sort\":\"1\"}",
		      	dataType: 'json' // 必须
            })
            promise.then((res) => {
            	// alert(JSON.stringify(res.data))
				if (JSON.stringify(res.data) == '{}') { //没有观看记录
					// callBack(getObj([]))
					// alert(2);
					// Vue.toast({text:'先观看视频'});
					// alert('去观看')
				} else {
					// alert('yikan');
                    self.nowget = "#7bb233";
					self.isLogin();
					// callBack(getObj(res.data.list))
				}
            },(reject) => {
            	// alert(1)
            })

        },
        // 关闭查看奖品的弹窗
        closeget(){
        	this.awardshow = false;
        	this.zheshow = false;
        },
        torules(){
        	this.panelShow = true;
        	this.awardshow = false;
        }
    }
}

</script>
