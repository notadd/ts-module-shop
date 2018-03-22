
type Query{
  #download pretreatment 
  downloadProcess(bucketName:String,name:String,type:String):DownloadProcessData
}

#return data 
type DownloadProcessData{
   #error code 
   code:Int
   #error message
   message:String
   #download request method
   method:String
   #download request url
   url:String
   #download request headers
   headers:DownloadHeaders
}

#download header type
type DownloadHeaders{
    #bucket name 
    bucketName:String
    #file name
    fileName:String
}