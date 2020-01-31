<template>
  <div class="virus">
    <!-- 加载动画 -->
    <div class="loader1" v-if="loading">
    	<div class="circle"></div>
    	<div class="circle"></div>
    </div>
    <div class="mask" v-if="loading"></div>
    <!-- 统计-->
    <div class="info total">
      <header>
        <span class="title">全国疫情动态</span>
        <span class="lasttime">最新更新:{{newData.lasttime}}</span>
      </header>
      <div class="count">
        <div class="hint">
          <p class="all">累计</p>
          <p class="lastday">昨日新增</p>
        </div>
        <div class="data">
          <div
            class="kind"
            v-for="(item,index) in newData.total"
            :key="index"
          >
            <p class="num">{{item.all}}</p>
            <p class="text">{{item.text}}</p>
            <p class="num">{{item.add}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 图表-->
    <div id="map" class="info" :style="'height:'+ height + 'px'"></div>
    <div id="line" class="info" :style="'height:'+ height + 'px'"></div>
    <!-- 各省份详细-->
    <div class="info detail">
      <h2>国内疫情</h2>
      <header>
        <p style="color: #303133;">地区</p>
        <p style="color: #F56C6C;">确诊</p>
        <p style="color: #E6A23C;">疑似</p>
        <p style="color: #909399;">死亡</p>
        <p style="color: #67C23A;">治愈</p>
      </header>
      <div
        class="item"
        v-for="(item,index) in chinaTree.children"
        :key="index"
      >
        <div class="province">
          <p>{{item.name}}</p>
          <p>{{item.total.confirm}}</p>
          <p>{{item.total.suspect}}</p>
          <p>{{item.total.dead}}</p>
          <p>{{item.total.heal}}</p>
          <i
            v-if="item.children.length>1 && !item.open"
            class="iconfont icon-down"
            @click="change(index,true)"
          >
          </i>
          <i
            v-else-if="item.children.length>1"
            class="iconfont icon-upward"
            @click="change(index,false)"
          >
          </i>
        </div>
        <div
          class="all-city"
          :class="item.open ? 'show' : ''"
        >
          <div
            class="city"
            v-for="(city,index0) in item.children"
            :key="index0"
          >
            <p>{{city.name}}</p>
            <p>{{city.total.confirm}}</p>
            <p>{{city.total.suspect}}</p>
            <p>{{city.total.dead}}</p>
            <p>{{city.total.heal}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 国际疫情-->
    <div class="info detail">
      <h2>国外疫情</h2>
      <header>
        <p style="color: #303133;">地区</p>
        <p style="color: #F56C6C;">确诊</p>
        <p style="color: #E6A23C;">疑似</p>
        <p style="color: #909399;">死亡</p>
        <p style="color: #67C23A;">治愈</p>
      </header>
      <div
        class="item"
        v-for="(item,index) in abroadTree"
        :key="index"
      >
        <div class="province">
          <p>{{item.name}}</p>
          <p>{{item.total.confirm}}</p>
          <p>{{item.total.suspect}}</p>
          <p>{{item.total.dead}}</p>
          <p>{{item.total.heal}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from '../../static/echarts.js'
  export default{
    data(){
      return{
        loading : false,
        height : 0,
        newData : {},
        chinaTree : {},
        abroadTree : []
      }
    },
    methods:{
      getData(){
        this.$axios.get('http://49.232.38.113:4000/getData')
          .then(res => {
            console.log(res.data)
            const map = document.getElementById('map')
            const line = document.getElementById('line')
            this.newData = res.data
            this.chinaTree = res.data.areaTree.shift()
            this.abroadTree = res.data.areaTree
            echarts.map(this,map,res.data.mapData)
            echarts.line(this,line,res.data.historyData)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            alert('网络错误')
            console.log(err)
          })
      },
      change(index,status){
        this.chinaTree.children[index].open = status
        this.$forceUpdate()
      }
    },
    mounted() {
      this.loading = true
      const width = map.offsetWidth
      this.height = width * 0.75
      this.getData()
    }
  }
</script>

<style>
  .virus{
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
  }
  .virus #map{
    background-color: #f4f4f4;
  }
  .virus .info{
    width: 95%;
    max-width: 800px;
    margin: 10px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }

  .virus .total{
    padding-bottom: 10px;
  }
  .virus .total header{
    display: flex;
    align-items: center;
  }
  .virus .total header .title{
    font-size: 18px;
    color: #303133;
    padding: 10px;
  }
  .virus .total header .lasttime{
    font-size: 12px;
    color: #909399;
  }
  .virus .total .count{
    display: flex;
  }
  .virus .total .count .hint{
    padding-left: 5px;
    text-align: end;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .virus .total .count .all{
    margin-bottom: 15px;
  }
  .virus .total .count .data{
    padding: 0 5px;
    flex: 1;
    display: flex;
    justify-content: space-around;
  }
  .virus .total .count .data .kind{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .virus .total .count .num{
    font-size: 18px;
    font-weight: 500;
    line-height: 1.4;
  }
  .virus .total .count :nth-child(1) .num{
    color: #F56C6C;
  }
  .virus .total .count :nth-child(2) .num{
    color: #E6A23C;
  }
  .virus .total .count :nth-child(3) .num{
    color: #909399;
  }
  .virus .total .count :nth-child(4) .num{
    color: #67C23A;
  }
  .virus .total .count .text{
    font-size: 16px;
    text-align: center;
  }

  .virus #line{
    padding: 5px;
  }

  .virus .detail{
    padding: 5px;
  }
  .virus .detail h2{
    font-size: 16px;
    color: #303133;
    font-size: 18px;
    padding: 5px;
  }
  .virus .detail header{
    font-size: 16px;
    display: flex;
  }
  .virus .detail header p,.virus .detail .item p{
    width: 25%;
    text-align: center;
    vertical-align: center;
  }
  .virus .detail header p:first-child,.virus .detail .item p:first-child{
    width: 20%;
  }
  .virus .detail .item{
    margin: 10px 0;
    font-size: 16px;
    width: 100%;
  }
  .virus .detail .item .province{
    background-color: rgba(192,196,204,0.3);
    padding: 5px;
    border-radius: 30px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    position: relative;
    transition: all 1s ease-in-out;
  }
  .virus .detail .item .province i{
    position: absolute;
    right: 5px;
  }
  .virus .detail .item .all-city{
    max-height: 0;
    overflow: hidden;
    transition: all .5s;
  }
  .virus .detail .item .show{
    max-height: 100vh;
  }
  .virus .detail .item .all-city .city{
    margin: 10px auto;
    padding-bottom: 5px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    white-space: nowrap;
  }
  .virus .detail .item .all-city .city:last-child{
    border: none;
  }

  /* 加载动画*/
  .loader1{
    z-index: 9999;
  	position: absolute;
  	top: 20%;
  	height: 50px;
  	transform-origin: bottom center;
  	animation: rotate 3s linear infinite;
  }

  .loader1 .circle{
  	background-color: purple;
  	width: 40px;
  	height: 40px;
  	border-radius: 50%;
  	transform: scale(0);
  	animation: grow 1.5s linear infinite;
  	margin: -10px;
  }

  .loader1 .circle:nth-child(2){
  	background-color: palevioletred;
  	animation-delay: 0.75s;
  }

  @keyframes rotate{
  	to{
  		transform: rotate(360deg);
  	}
  }

  @keyframes grow{
  	50%{
  		transform: scale(1);
  	}
  }
</style>
