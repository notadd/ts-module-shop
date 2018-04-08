#resize data
input ResizeData{
    #the scaling of equal scale 
    scale:Int
    #the scaling of width
    wscale:Int
    #the scaling of height
    hscale:Int
    #width
    width:Int
    #height
    height:Int
    #pixel
    pixel:Int
}

#enum of resize mode
enum ResizeMode{
    #equal scale
    scale
    #only scale width
    wscale
    #only scale height
    hscale
    #specify width and height
    both
    #specify width and equal scale
    fw
    #specify height and equal scale
    fh
    #specify pixel and equal scale
    fp
    #specify the max value of width and height 
    fwfh
    #specify the min value of width and height 
    fwfh2
}

#resize info
input Resize{
    mode:ResizeMode
    data:ResizeData
}

#tailor info 
input Tailor{
    #whether tailor before resize
    isBefore:Boolean
    #width of tailor image 
    width:Int
    #height of tailor image 
    height:Int
    #horizontal shift of tailor image , positive number towards the right
    x:Int
    #vertical shift of tailor image  , positive number towards the down
    y:Int
    #tailor image orientation
    gravity:Gravity
}

#blur info 
input Blur{
    #blur radius
    redius:Int
    #standard deviation
    sigma:Int
}


#image pretreatment info , used by uploading image 
input ImagePreProcessInfo{
    #resize info 
    resize:Resize
    #tailor info
    tailor:Tailor
    #whether watermark on image
    watermark:Boolean
    #rotation angle
    rotate:Int
}

#image postprocessing info
input ImagePostProcessInfo{
    #resize info 
    resize:Resize
    #tailor info
    tailor:Tailor
    #whether watermark on image
    watermark:Boolean
    #rotation angle
    rotate:Int
    #blur info
    blur:Blur
    #whether sharpen
    sharpen:Boolean
    #output format
    format:String
    #thether output as lossless , only supported by webp
    lossless:Boolean
    #quality of image
    quality:Int
    #progressive display 
    progressive:Boolean
    #Remove meta information
    strip:Boolean
}