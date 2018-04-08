type Mutation{
    #bucket configuration
    bucket(
        isPublic:Boolean,
        name:String,
        token_expire:Int,
        token_secret_key:String):ConfigData
}

#config return data
type ConfigData{
    #error code
    code:Int
    #code message
    message:String
}