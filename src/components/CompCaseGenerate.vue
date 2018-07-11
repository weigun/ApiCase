<template>
  <div class="CompCaseGenerate"> 
    <el-container style="height:100%;border: 0px solid #eee" direction="vertical">
      <!-- button -->
      <!-- <el-header style="text-align: right; font-size: 1px"></el-header> -->
      <el-row type="flex" justify="start">
        <el-button type="success" @click="shown = true">导入JSON</el-button>
        <!-- <el-button type="primary" @click="generate()" disabled>生成用例</el-button> -->
        <el-button type="success" @click="clipbrd()">复制用例</el-button>
        <!-- <el-button type="primary" v-clipboard:copy="clipbrd()" v-clipboard:success="on_success" v-clipboard:error="on_error">复制用例</el-button> -->
      </el-row>
      <!-- <el-container> -->
        <!-- 用例输入 -->
        <!-- <el-aside width="500px" style="background-color: rgb(238, 241, 246)">
          <el-table :data="items" border style="width: 100%">
            <el-table-column prop="name" label="参数名" width="140">
              <template slot-scope="scoped">
                <el-input  v-model="scoped.row.name" placeholder="参数名"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="120">
              <template slot-scope="scoped">
                <el-select v-model="scoped.row.type" placeholder="请选择">
                  <el-option v-for="item in type_list" :key="item.type" :label="item.type" :value="item.type">
                    <span style="float: left">{{ item.type }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
               <template slot-scope="scoped">
                <el-button size="small" type="primary" @click="on_insert(scoped.$index, scoped.row)">插入</el-button>
                <el-button size="small" type="danger" @click="on_delete(scoped.$index, scoped.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-aside> -->
        <el-main style="border: 1px solid #eee ">
          <!-- 用例显示区域 -->
          <p v-for="item in case_list" :key="item.name">{{item}}</p>
        </el-main>
      <!-- </el-container> -->
    </el-container>
    <template v-if="shown">
      <el-dialog
        title="导入JSON"
        :visible.sync="shown"
        width="50%"
        center>
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入正向参数，包括可选内容"
          v-model="text_json">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="on_cancel">取消</el-button>
          <el-button type="primary" @click="on_import()">导入</el-button>
        </span>
      </el-dialog>
    </template>

  </div>
</template>
<script>
import {utils} from '../utility/utils.js'
export default {
  name: "CompCaseGenerate",
  data() {
    return {
      case_list:[],
      type_list:[
        {type:'int'},
        {type:'string'},
        {type:'object'},
        {type:'float'},
        {type:'boolean'},
        {type:'array'},
        {type:'number'},
      ],
      // item:{
      //   name:'11',
      //   type:'string'
      // },
      items:[],
      shown:false,
      text_json:'',
      base_case: [
        {val:"",desc:"空或者纯空格"},
        {val:"123",desc:"字符串数字"},
        {val:".#$%^/&'",desc:"特殊字符"},
        {val:new Array(256).join(1),desc:"长度上溢"},
        {val:"null",desc:"null"},
        {val:"１２３",desc:"全角"},
        {val:"123 456",desc:"中间带空格"},
      ]
    }
  },
  methods: {
    on_insert(index,row){
      this.items.push({name:'',type:'string'})
    },
    on_delete(index,row){
      if (this.items.length > 1){
        this.items.splice(index,1)
      }
    },
    generate(){
      console.log(this.items)
    },
    clipbrd(){
      // let ret = JSON.stringify(this.items)
      // console.log(ret)
      let result = []
      this.case_list.forEach(element => {
        result.push(JSON.stringify(element))
      });
      this.$copyText(result.join("\n")).then((e)=>{
        this.$message('复制成功');
        }, (e)=>{
        alert('Can not copy')
      })
    },
    on_import(){
      // {"body":{"username":"22222222222","loginType":"0"},"head":{}}
      console.log(utils.name)
      let _items = []
      if (this.text_json){
        console.log("text:",this.text_json)
        let item = JSON.parse(this.text_json)
        if (!utils.is_obj(item)) {
          this.$message("JSON 格式不对")
          return
        }
        console.log("before:",item)
        // _items = this.split_object(item)
        // this.items = _items
        this.case_list = []
        this.handle_json(item)
      }
      this.on_cancel()
    },
    on_cancel(){
      this.shown = false
      // this.text_json = ''
    },
    split_object(obj,parent_key){
      // {"body":{"username":"22222222222","loginType":"0"},"head":{}}
      let list = []
      if (obj.keys().length == 0) {
        let d = {}
        d[parent_key] = typeof(obj)
        list.push(d)
        return list
      }
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = object[key]
          // const data_type = typeof(element)
          if (utils.is_obj(item)) {
            list = this.split_object(element,key)
          }
          else{
            let d = {}
            d[parent_key] = typeof(obj)
            list.push(d)
          }
      }
        }      
    },
    handle_json(obj){
      // {"body":{"username":"22222222222","loginType":"0",redids:[]},"head":{}}
      let _case = {payload :{head : {},body : {}},verify : {code : 200,extra : ""},desc:""}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key]
          console.log("-",key,element)
          if (utils.is_obj(element)) {
            for (const _k in element) {//body
              if (element.hasOwnProperty(_k)) {
                const _e = element[_k]
                console.log("--",_k,_e)
                //最后一层是object
                if (utils.is_obj(_e)) {
                  this.$message("未支持参数含有object的用例,请手动生成")
                  
                }
                // 最后一层是数组
                else if (utils.is_array(_e)){
                  this.$message("obj")
                }
                else{
                  //取值的内容
                  console.log("enter",obj)
                  this.generate_case(obj,key,_k,_e)

                }

                
              }
            }
            
          }
          
        }
      }
      
      
    },
    generate_case(raw_obj,parent_key,k,v){
      console.log('raw:',raw_obj,parent_key,k,v)
      let _type = typeof(v)
      console.log(_type)
      switch (_type) {
        case "int":
          this.build_int_case(raw_obj,parent_key,k,v)
          // console.log(this.case_list)
          break;
        case "string":
          this.build_string_case(raw_obj,parent_key,k,v)
          break
        case "number":
          this.build_number_case(raw_obj,parent_key,k,v)
          break
      
        default:
          console.error(`未支持的数据类型：${_type}`)
          break;
      }
    },
    copy(obj){
      //deep copy object
      return JSON.parse(JSON.stringify(obj))
    },
    build_number_case(raw_obj,parent_key,k,v){
      let vals =[
        {val:456,desc:"正向"},
        {val:1.1,desc:"小数"},
        {val:"-1",desc:"负数"},
        {val:"01",desc:"0开头"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,vals)
    },
    build_int_case(raw_obj,parent_key,k,v){
      let vals =[
        {val:456,desc:"正向"},
        {val:"1.1",desc:"小数"},
        {val:"-1",desc:"负数"},
        {val:"01",desc:"0开头"},
        {val:1.000000000000000000000000009,desc:"精度"},
        {val:"01.1",desc:"0开头"},
        {val:0.0,desc:"0"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,vals)
    },
    build_string_case(raw_obj,parent_key,k,v){
      let vals =[
        {val:"test",desc:"正向"},
        {val:"おはようございま",desc:"编码"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,vals)
    },
    build_float_case(raw_obj,parent_key,k,v){
      let vals =[
        {val:1.1,desc:"正向"},
        {val:1.000000000000000000000000009,desc:"精度"},
        {val:-1.1,desc:"负数"},
        {val:"01.1",desc:"0开头"},
        {val:0.0,desc:"0"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,vals)
    },
    build_object_case(raw_obj,parent_key,k,v){
      this.$message("未实现")
      return 
      let vals =[
        {val:1.1,desc:"正向"},
        {val:1.000000000000000000000000009,desc:"精度"},
        {val:-1.1,desc:"负数"},
        {val:"01.1",desc:"0开头"},
        {val:0.0,desc:"0"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,v)
    },
    build_array_case(raw_obj,parent_key,k,v){
      this.$message("未实现")
      return 
    },
    build_boolean_case(raw_obj,parent_key,k,v){
      // this.$message("未有实现")
      let vals =[
        {val:true,desc:"正向"},
        {val:false,desc:"正向"},
        {val:0,desc:"数字假"},
        {val:1,desc:"数字真"},
      ]
      vals = vals.concat(this.base_case)
      console.log(vals)
      this._build(raw_obj,parent_key,k,vals)
    },
    _build(raw_obj,parent_key,k,vals){
      for (const i in vals) {
        let head = this.copy(raw_obj.head)
        let body = this.copy(raw_obj.body)
        let _case = {"payload" :{"head" : head,"body": body},"verify": {"code" : 200,"extra" : ""},"desc":""}
        console.log("hehe:",_case)
        _case.desc = `${k}-${vals[i].desc}`
        console.log(parent_key,k,vals[i].val)
        _case.payload[parent_key][k] = vals[i].val
        console.log(_case)
        this.case_list.push(_case) 
      }
    },
  },
  mounted(){
    // this.items.push(this.item)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row{
  margin-bottom: 1px;
}
.el-aside{
  border: 10px;
}
.p{
  text-align:left;
  word-wrap: break-word;
  word-break:break-all;
  white-space: pre;
}
.el-main{
  text-align:left;
  /* margin-top: 0px; */
  padding-top: 0px;
  border: 5px;
  height: 840px;
}
</style>
