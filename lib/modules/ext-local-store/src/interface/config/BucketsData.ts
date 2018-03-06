export interface BucketsData{
    code:number
    message:string
    buckets:BucketInfo[]
}

interface BucketInfo{
    id:number
    public_or_private:string
    name:string
}