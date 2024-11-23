import {ayncHandler} from '../utils/asyncHandler';
import {apiResponse} from '../utils/apiResponse';

const healthcheck = ayncHandler(async (req,res)=>{
    return res
        .status(200)
        .json(new apiResponse(200, "Ok", "Health Check Successful !!"));
})

export {healthcheck};