
class APIFeatures{
    constructor(query,queryString){
           this.query =query;
           this.queryString=queryString;
    }
   
    filter(){
          const queryObj={...this.queryString}
          const excludedFields =['page','sort','limit','fields']
              excludedFields.forEach(element=>delete queryObj[element])
      
              let queryStr = JSON.stringify(queryObj)
                 queryStr=queryStr.replace(/\b(gt|gte|lte|lt)\b/g, match=> `$${match}`)
                 this.query.find(JSON.parse(queryStr))
            return this     
       }
    sort(){
            if(this.queryString.sort){
                const soryBy =this.queryString.sort.split(',').join(' ')
                this.query=this.query.sort(soryBy)
            }else{
            this.query =this.query.sort('price')
            }
            return this
    }
    limitFields(){
            if(this.queryString.fields){
                const fields =this.queryString.fields.split(',').join(' ')
                this.query =this.query.select(fields)
            }else{
                this.query =this.query.select('-__v')
            }
            return this
    }
    Pagination(){
            const page = this.query*1||1
            const limit = this.queryString*1||10
            const skip = (page-1)*1
            this.query = this.query.skip(skip).limit(limit)
            return this
    }
}

module.exports=APIFeatures;