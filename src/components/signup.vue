<template>
    <div>
        <div class="signup" @click="getsign">
            <p class="ljbm">{{mes}}</p>
        </div>
        <div class="opcit" v-show="isshow" ref="opcit" @click="close()"> </div>
        <div class="fillIn" v-show="ifbm">
            <span class="close" @click="close()" v-show="hasbm"></span>
            <div v-show="allbm">
                <h2 v-show="btitle"></h2>
                <div class="submit">
                    <ul>
                        <li>
                            <input name="name" type="text" placeholder="宝贝名称" class="name" maxlength="10" v-model='name' v-on:change="changeCount(value)" @click="changeCount" ref="inputs">
                        </li>
                        <li class="genbox">
                            <div class="gender" @click="toggle(index,gli.type)" v-for="(gli,index) in gender" :class="{actives:selected==index, }" :data="gli.type">{{gli.name}}</div>
                        </li>
                        <li class="birbox">
                            <input type="date" v-model="birthday" class="birthday" :max="maxdate" :min="mindate" v-on:blur="changeCount(value)" >
                        </li>
                        <li>
                            <input type="tel" name="tel" v-model='tel' placeholder="电话号码" class="tel" v-on:blur="changeCount(value)">
                        </li>
                    </ul>
                </div>
                <div class="submits">
                    <div class="submits-top">
                        <div class="quxiao subbox" @click="close($event)">取消</div>
                        <div class="tijiao subbox" @click="tijiao()">提交</div>
                    </div>
                    <div class="submits-bottom">
                        {{remacks}}
                    </div>
                </div>
            </div>
            <div class="hasbm" v-show="hasbm">
                <h3 class="cmbmcg">报名成功</h3>
                <div class="onevideo">
                    <div class="opcaity"></div>
                    <a :href="moreurl" class="videobox">
                        <p>观看以下视频1min</p>
                        <p>还能获得{{money}}优惠券哦</p>
                        <div class="morepic">
                            <img :src="morepic">
                        </div>
                        <p>{{moretitle}}</p>
                    </a>
                </div>
                <a :href="othervo" class="othervo">看其他视频>></a>
            </div>
        </div>
    </div>
</template>
<script>
import mtop from '@ali/lib-mtop';
import Bridge from "@ali/lib-bridge";
import Vue from "vue";
import VueDialog from "@ali/vue-dialog";
import bus from '../assets/eventBus';
export default {
    data() {
        return {
            data: data,
            state: true,
            isLogin: false,
            mes: "立即报名",
            allbm: true,
            hasbm: false,
            isshow: false,
            ifbm: false,
            btitle: true,
            issess: false,
            remacks: data.remarks,
            othervo: data.othervo,
            money: data.money,
            moretitle: "",
            morepic: "",
            moreurl: "",
            selected: 0, //单选性别初始
            name: "", //宝贝名称
            gende: "2", //单选性别默认值 1-女，2-男
            birthday: "", //生日
            tel: "", //电话
            maxdate: "",
            mindate: "2000-01-01",
            gender: [
                //单选性别
                {
                    name: "男",
                    type: 2
                },
                {
                    name: "女",
                    type: 1
                }
            ]
        };
    },
    mounted() {
        var self = this;
        //进入页面查询用户是否登录状态
        lib.mtop.config.prefix = "acs";
        lib.mtop.config.subDomain = "";
        lib.mtop.config.mainDomain = "youku.com";
        var promise = lib.mtop.request({
            api: "mtop.com.youku.aplatform.weakGet", //api
            v: "1.0", //版本
            data: {
                //参数
                bizType: "tool.isLogin"
            },
            appKey: '24679788', //业务id
            H5Request: true,
            dataType: 'jsonp',
            ecode: 0 //是否需登录 0：非需登录 ，1必须登录
        });
        promise.then(
            res => {
                if (res.data.e.code == "SUCCESS") {
                    console.log(res);
                    self.isLogin = res.data.isLogin; //判断是否登录
                    //console.log(isLogin, self.ytid);
                    if (self.isLogin === false || self.isLogin === "false") {
                        console.log("未登录");
                    } else {
                        self.isLogin = true;
                        console.log("已登录");
                        // this.getsign()
                        self.signupState().then(() => {
                            self.fuzhi().then(() => {
                                if (self.issess == true) {
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
                                            // self.nowget = "#7bb233";
                                            document.querySelector('.rightbox').style.background = '#7bb233';
                                            // callBack(getObj(res.data.list))
                                        }
                                    }, (reject) => {
                                        // alert(1)
                                    })

                                }
                            })


                        });

                    }
                }
            },
            reject => {
                console.log(reject, "login err");
            }
        );
        var items = this.data.morevideo[Math.floor(Math.random() * this.data.morevideo.length)];
        let nowDate = new Date(Date.now());
        this.morepic = items.morepic;
        this.moretitle = items.moretitle;
        this.moreurl = items.moreurl;
        console.log(items, "thisdata");
        this.birthday = `${nowDate.getFullYear()}-${nowDate.getMonth() +
        1}-${nowDate.getDate()}`;
        this.maxdate = `${nowDate.getFullYear()}-${nowDate.getMonth() +
        1}-${nowDate.getDate()}`;
        console.log(this.maxdate, "lkkk")
        this.mindate = '2000-01-01';
        Vue.use(VueDialog, {
            componentName: "vue-dialog" // Vue.componont()时的名字（默认为vue-dialog）
        });
    },
    methods: {
        signupState() {
            //查询是否已经报名状态

            return new Promise((resolve, reject) => {
                lib.mtop.config.prefix = "acs";
                lib.mtop.config.subDomain = "";
                lib.mtop.config.mainDomain = "youku.com";
                var upquery = lib.mtop.request({
                    api: "mtop.youku.my.kids.babyinfo.get", //api
                    v: "1.0",
                    dataType: "jsonp",
                    ecode: 1,
                    appKey: "23536927",
                    data: {
                        system_info: "{}"
                    }
                });
                upquery.then(res => {
                    console.log(res, "的角度讲");
                    if (res && res.data && res.data.name == null) {
                        console.log(11, "显示我要报名");
                    } else {
                        this.mes = "报名成功";
                        this.issess = true;
                        this.state = false;
                        resolve('chenggong');
                    }

                    // alert(JSON.stringify(res))
                });
            })

        },
        changeCount(){
            console.log(this.$refs.inputs);
            this.$refs.inputs.focus();
            event.currentTarget.style.color="#333";
        },
        //点击报名事件
        getsign() {
            var self = this;
            if (this.isLogin == true || this.isLogin == "true") {
                if (this.issess == true) {
                    Vue.toast({ text: "您已报名成功！" });
                } else {
                    this.isshow = true;
                    this.ifbm = true;
                }
            } else {
                //点击报名时再次判断用户是否登录
                lib.mtop.config.prefix = "acs";
                lib.mtop.config.subDomain = "";
                lib.mtop.config.mainDomain = "youku.com";
                var promise = lib.mtop.request({
                    api: "mtop.com.youku.aplatform.weakGet", //api
                    v: "1.0", //版本
                    data: {
                        //参数
                        bizType: "tool.isLogin"
                    },
                    appKey: "23536927", //业务id
                    ecode: 0 //是否需登录 0：非需登录 ，1必须登录
                });
                promise.then(
                    res => {
                        if (res.data.e.code == "SUCCESS") {
                            self.isLogin = res.data.isLogin; //判断是否登录
                            if (self.isLogin === false || self.isLogin === "false") {
                                // alert("未登录")

                                if (/youku/i.test(navigator.userAgent)) {
                                    //在app中打开
                                    self.login();
                                } else {
                                    //没在app里打开

                                    window.location.href =
                                        "//hudong.vip.youku.com/act/tingthrow.html#/";
                                }
                            }
                        }
                    },
                    reject => {
                        console.log(reject, "login err");
                    }
                );
            }

            // this.$refs.opcit.style.display = 'block';
            // this.$refs.fillIn.style.display = 'block';
        },
        //登录判断,未登录跳转登录页面
        login() {
            //app内唤起登录
            return new Promise((resolve, reject) => {
                try {
                    Bridge.showLogin({
                        link: location.href,
                        callback: function(arg) {
                            location.reload(true);
                        }
                    });
                } catch (e) {
                    window.location.href =
                        handData.loginlink + "?callback=" + escape(window.location.href);
                }
                location.reload();
                resolve('chenggong');

            })
        },
        fuzhi() {
            return new Promise((resolve, reject) => {
                bus.$emit("singses", this.issess);
                resolve('wc')
            })

        },
        close() {
            var self = this;
            // console.log(e.target.parentNode.parentNode.parentNode.parentNode)
            // e.target.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            // this.$refs.opcit.style.display = 'none';
            // this.$refs.fillIn.style.display = 'none';
            console.log(1455, self.isshow)
            this.hasbm = false;
            this.isshow = false;
            this.ifbm = false;
            this.allbm = true;
            console.log(this.isshow)
        },
        toggle(index, gender) {
            //单选男女
            this.selected = index;
            this.gende = gender;
            console.log(this.gende)
        },
        total: function(value, time) {
            let self = this;
            Vue.toast({
                text: value,
                time: time
            });
        },

        tijiao() {
            //提交更新宝贝信息
            var name = this.name;
            var gende = this.gende;
            var birthday = this.birthday;
            var tel = this.tel;
            var data = {
                name: name,
                gender: parseInt(gende),
                birthday: birthday,
                phone: tel,
                system_info: "{}"
            };
            this.tdata = data;
            //console.log(this.tdata);
            let dangtime = new Date(Date.now());
            let dangtime1 = `${dangtime.getFullYear()}-${dangtime.getMonth() +
        1}-${dangtime.getDate()}`;
            this.dqtime = Date.parse(dangtime1);
            this.xztime = Date.parse(this.birthday);
            console.log(dangtime1)
            if (!(/^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/g.test(this.name))) {
                this.texts = "亲，宝贝名称不能为空哦！";
                this.total(this.texts, this.times);
                return false;
            } else if (/^\s*$/g.test(this.birthday)) {
                this.texts = "亲，生日不能为空哦！";
                this.total(this.texts, this.times);
            } else if (this.dqtime <= this.xztime) {
                console.log(this.dqtime,this.xztime)
                this.texts = "亲，日期不能选择今天或大于今天哦！";
                this.total(this.texts, this.times);
            } else if (/^\s*$/g.test(this.tel)) {
                this.texts = "亲，电话号码不能为空哦！";
                this.total(this.texts, this.times);
                return false;
            } else if (!(
                    /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(
                        this.tel
                    ) ||
                    /^(([0\+]\d{2,3}-)?(0\d{2,3}))(\d{7,8})(-(\d{3,}))?$/.test(
                        this.tel
                    ) ||
                    /^[1][3,4,5,7,8][0-9]{9}$/.test(this.tel)
                )) {
                this.texts = "手机号码或座机号码有误，请重新填写!";
                this.total(this.texts, this.times);
                return false;
            } else {
                console.log(data);
                this.suretj(data);
            }
        },
        suretj(data) {
            console.log(data, "data");
            lib.mtop.config.prefix = "acs";
            lib.mtop.config.subDomain = "";
            lib.mtop.config.mainDomain = "youku.com";
            var submits = lib.mtop.request({
                //提交宝贝信息
                api: "mtop.youku.my.kids.babyinfo.update.v2", //api
                v: "1.0", //版本
                dataType: "jsonp",
                ecode: 1,
                appKey: "23536927",
                data: data
            });
            submits.then(
                res => {
                    console.log(res, "kgkgk");                   
                    this.allbm = false;
                    this.hasbm = true;
                    this.issess = true;
                    this.signupState();
                    this.mes = "报名成功";
                },
                err => {
                    console.log(err);
                }
            );
        },
        signup() {
            //点击报名事件
            this.login();
        },

    },
    created() {
        console.log(data)
    }
};

</script>
<style scoped lang="less">
@sz: 75rem;
.signup {
    width: 750/@sz;
    height: 96/@sz;
    position: fixed;
    padding-top: 20/@sz;
    bottom: 0/@sz;
    left: 0;
    z-index: 5;
    background: url("https://gw.alicdn.com/tfs/TB1F3RGpv1TBuNjy0FjXXajyXXa-750-116.png")no-repeat top center;
    background-size: 750/@sz 116/@sz;
}

.close {
    position: absolute;
    right: 40/@sz;
    top: 70/@sz;
    display: block;
    width: 46/@sz;
    height: 67/@sz;
    background: url("https://gw.alicdn.com/tfs/TB1u04soH9YBuNjy0FgXXcxcXXa-46-67.png") no-repeat top center;
    background-size: 46/@sz 67/@sz;
}

.ljbm {
    width: 9.3rem;
    padding-left: 0.7rem;
    font-size: 36/@sz;
    color: #fff;
    height: 100/@sz;
    line-height: 100/@sz;
    text-align: center;
    font-weight: bold;
}

.opcit {
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
}

.fillIn {
    position: fixed;
    z-index: 100;
    width: 636/@sz;
    height: 619/@sz;
    padding-top: 205/@sz;
    top: 50%;
    left: 50%;
    margin-left: -318/@sz;
    margin-top: -412/@sz;
    background: url("https://gw.alicdn.com/tfs/TB1EOVAowmTBuNjy1XbXXaMrVXa-636-824.png") no-repeat top center;
    background-size: 636/@sz 824/@sz;
}

h2 {
    position: absolute;
    right: 110/@sz;
    top: 72/@sz;
    width: 216/@sz;
    height: 63/@sz;
    background: url("https://gw.alicdn.com/tfs/TB1WVQIoDtYBeNjy1XdXXXXyVXa-216-63.png")no-repeat top center;
    background-size: 216/@sz 63/@sz;
}

li {
    display: block;
    width: 306/@sz;
    height: 60/@sz;
    margin: 0/@sz auto 24/@sz;
}

.name,
.birthday,
.tel {
    width: 304/@sz;
    height: 58/@sz;
    border-radius: 30/@sz;
    border: 1px solid #bf9129;
    margin: 0 auto;
    text-align: center;
    line-height: 58/@sz;
    font-size: 26/@sz;
    color: #d1cfc6;
}

.genbox {
    width: 300/@sz;
    margin: 0/@sz auto 24/@sz;
}

.gender {
    width: 100/@sz;
    height: 60/@sz;
    float: left;
    border-radius: 30/@sz;
    border: 1px solid #bf9129;
    text-align: center;
    line-height: 58/@sz;
    font-size: 30/@sz;
    color: #c59a2b;
    margin-right: 90/@sz;
}

.actives {
    background: #06bbfe;
    color: #fff;
}

.gender:last-child {
    margin-right: 0;
}

.birbox {
    clear: both;
    margin: 0/@sz auto 24/@sz;
}

.birthday {}

.submits-top {
    width: 380/@sz;
    height: 60/@sz;
    margin: 0 auto;
}

// input[type="date"]::-webkit-calendar-picker-indicator {
//    display: none;
// }
input[type="date"]:-webkit-autofill { background:#fff;}

input{
    outline: none;
}
.subbox {
    width: 160/@sz;
    height: 58/@sz;
    border-radius: 30/@sz;
    border: 1px solid #bf9129;
    text-align: center;
    line-height: 58/@sz;
    font-size: 30/@sz;
    color: #c59a2b;
    float: left;
}

.quxiao {
    margin-right: 50/@sz;
}

.tijiao {
    margin-right: 0;
    background: #ff4e00;
    color: #fff;
}

.submits-bottom {
    clear: both;
    width: 360/@sz;
    border-top: 2px solid #e5d33c;
    margin: 24/@sz auto;
    padding: 20/@sz 80/@sz;
    line-height: 30/@sz;
    font-size: 20/@sz;
    color: #000;
}

.hasbm {
    position: relative;
}

.cmbmcg {
    height: 80/@sz;
    font-size: 50/@sz;
    color: #e16b03;
    text-align: center;
    line-height: 80/@sz;
    font-weight: bold;
}

.onevideo {
    position: relative;
    z-index: 1;
    width: 466/@sz;
    height: 370/@sz;
    margin: 20/@sz auto 40/@sz;
    border-radius: 30/@sz;
    overflow: hidden;
}

.opcaity {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 30/@sz;
}

.videobox {
    position: relative;
    display: block;
    padding: 10/@sz 40/@sz;
    width: 380/@sz;
    height: 350/@sz;
    z-index: 3;
}

.morepic {
    width: 388/@sz;
    height: 218/@sz;
    margin: 12/@sz 0;
    img {
        width: 100%;
        height: 100%;
        display: block;
    }
}

p {
    color: #7a4e08;
    font-size: 22/@sz;
    text-align: center;
    line-height: 36/@sz;
}

.othervo {
    font-size: 30/@sz;
    color: #7a4e08;
}

</style>
