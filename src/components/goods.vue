<template>
  <div class="goods">
   <div v-for="one in goods" class="one">
       <a class="goodsbox" :href="one.oneurl">
           <img :src="one.onepic">
           <p>{{one.text}}</p>
       </a>
   </div>
  </div>
</template>

<script>
export default {
    name: 'goods',
    data () {
        return {
            config: data,   //mt数据
            goods:data.pic
        };
    }
};
</script>

<style scoped lang="less">
 @sz:75rem;
 a{
      text-decoration: none;
      outline: none;
      border:none;
      &:hover{  
        cursor:pointer;
        cursor:pointer;
        text-decoration: none;
        outline: none;
        border:none;
      
      }
    }
    ul li{
        list-style: none;
    } 
    img{
        width:100%;
        height:100%;
        display:block;
    }  
 .goods{
    position: relative;
    overflow: hidden;
    display: block;
    width:630/@sz;
    height: auto;
    padding: 20/@sz 25/@sz 0;
    margin:0 auto;
    background-color: #b0dbe1;
 }
 .one{
    width: 300/@sz;
    height:220/@sz;
    float:left;
    margin-right: 24/@sz;
 }
 .one:nth-child(2n){
    margin-right: 0;
 }
 .goodsbox{
    display:block;
    width: 300/@sz;
    height:220/@sz;
 }
 img{
    width: 300/@sz;
    height:168/@sz;
    display:block;
 }
 p{
    padding:10/@sz ;
    width: 280/@sz;
    overflow:hidden;
    height:40/@sz;
    font-size: 26/@sz;
    color:#00788a;
    text-align: center;
    line-height: 40/@sz;
    font-weight: bold;
 }
</style>
