
type Query{
    #get url to visit file , you can specify the postprocessing info of image
    one(bucketName:String,name:String,type:String,imagePostProcessInfo:ImagePostProcessInfo):OneData
}

#return data
type OneData{
    #error code
    code:Int
    #error message
    message:String
    #url to visit file with token and postprocessing info if specify
    url:String
} 