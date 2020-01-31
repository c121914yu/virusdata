function map(that,dom,data){
  let chart = that.$echarts.init(dom)
  let option = {
    title:{
      text: '疫情地图',
      left: 'center',
      textStyle: {
        color : "#303133",
      }
    },
    tooltip : {
      trigger: 'item',
      formatter: '{b} : {c}'
    },
    visualMap : {
      type : 'piecewise',
      textGap : 5,
      itemGap  : 5,
      itemHeight  : 10,
      pieces: [
        {min: 1000}, // 不指定 max，表示 max 为无限大（Infinity）。
        {min: 499, max: 1000},
        {min: 100, max: 499},
        {min: 10, max: 99},
        {min: 1, max: 9},
      ],
      textStyle : {
        fontSize  : 10
      }
    },
    series: [{
      type: 'map',
      map: 'china',
      zoom: 1.3,
      center: [104.114129, 36],
      scaleLimit : {
        max : 20,
        min : 1
      },
      label : {
        show : true,
        fontSize : 10
      },
      itemStyle : {//区域样式
        borderColor : "#606266",
        emphasis : {//点击样式
          areaColor : "rgba(104,48,213,0.3)",
          shadowColor: 'rgba(104,48,213,1)',
          shadowBlur: 20,
          borderColor:"#f4f4f4",
          label : {
            show : true,
            color : "#ffffff",
          }
        }
      },
      data : data
    }]
  }
  chart.setOption(option);
}

function line(that,dom,data){
  let chart = that.$echarts.init(dom)
  let option = {
    title: {
      text: '疫情趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      bottom : 0,
      data: ['确认', '疑似', '死亡', '治愈']
    },
    xAxis: {
      type: 'category',
      scale : true,
      
      data: data.date
    },
    yAxis: [
      {
        type: 'value',
        show : true,
        name : '死亡/治愈',
        minInterval: 100,
        nameTextStyle : {
          fontSize : 10
        }
      },
      {
        type: 'value',
        show : true,
        name : '确认/疑似',
        scale : true,
        offset : -10,
        maxInterval : 2000,
        nameTextStyle : {
          fontSize : 10
        }
      }
    ],
    series: [
      {
        name: '确认',
        type: 'line',
        yAxisIndex : 1,
        data: data.confirm,
        itemStyle : {
          color : '#F56C6C'
        },
      },
      {
        name: '疑似',
        type: 'line',
        yAxisIndex : 1,
        data: data.suspect,
        itemStyle : {
          color : '#E6A23C'
        },
      },
      {
        name: '死亡',
        type: 'line',
        yAxisIndex : 0,
        data: data.dead,
        itemStyle : {
          color : '#909399'
        },
      },
      {
        name: '治愈',
        type: 'line',
        yAxisIndex : 0,
        data: data.heal,
        itemStyle : {
          color : '#67C23A'
        },
      },
    ]
  };
  chart.setOption(option);
}

export default{
  map,
  line
}
