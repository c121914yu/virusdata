const express = require('express')
const app = express()
const axios = require('axios')

app.all('*', (req, res, next)=>{//给请求添加请求头，实现跨域
    res.header("Access-Control-Allow-Credentials", true)//允许跨域
    res.header("Access-Control-Allow-Origin", "http://www.jinlongyuchitang.cn")//请求服务器的地址
    // res.header("Access-Control-Allow-Origin", "http://localhost:3001")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers",  " Origin, Methods, Content-Type");//允许添加请求头
    res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    next();
})

app.use(express.static(__dirname+'/dist'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

var lasttime = ''
var total = []
var mapData = []
var historyData = {}
var areaTree = []
app.get('/getData',(req,res) => {
	res.send({
		lasttime,
		total,
		mapData,
		historyData,
		areaTree
	})
})

app.listen(4000,(err) => {
	if(err) throw err
	console.log('server is running 4000')
})

getData()
setInterval(() => {
	console.log("更新数据")
	getData()
},60000 * 10)

function getData(){
	total = []
	mapData = []
	historyData = {}
	areaTree = []
	
	let date = new Date() * 1
	axios.get('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5&callback=&_='+date)
		.then(res => {
			const data = JSON.parse(res.data.data)
			lasttime = data.lastUpdateTime
			/* 统计 */
			const DayList = data.chinaDayList
			const  lastday = DayList[DayList.length-2]
			const  today = DayList[DayList.length-1]
			total[0] = {text:'确诊',all:data.chinaTotal.confirm,add:today.confirm-lastday.confirm}
			total[1] = {text:'疑似',all:data.chinaTotal.suspect,add:today.suspect-lastday.suspect}
			total[2] = {text:'死亡',all:data.chinaTotal.dead,add:today.dead-lastday.dead}
			total[3] = {text:'治愈',all:data.chinaTotal.heal,add:today.heal-lastday.heal}
			/* 地图数据 */
			data.areaTree[0].children.forEach((item,index) => {
				mapData[index] = {
					name : item.name,
					value : item.total.confirm
				} 
			})
			/* 历史趋势 */
			historyData.date = new Array()
			historyData.confirm = new Array()
			historyData.dead = new Array()
			historyData.heal = new Array()
			historyData.suspect = new Array()
			data.chinaDayList.forEach(item => {
				historyData.date.push(item.date)
				historyData.confirm.push(item.confirm)
				historyData.dead.push(item.dead)
				historyData.heal.push(item.heal)
				historyData.suspect.push(item.suspect)
			})
			/* 区域信息 */
			areaTree = data.areaTree
		})
		.catch(err => console.log(err))
}