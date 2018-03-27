type Query{
    #get information of bucket,return id、public_or_private、name
    buckets:BucketsData
}

#information of bucket
type Bucket{
    #id
    id:Int
    #public bucket or private bucket
    public_or_private:String
    #bucket name
    name:String
}

#return data
type BucketsData{
    #error code
    code:Int
    #error message
    message:String
    #array of bucket information
    buckets:[Bucket]
}