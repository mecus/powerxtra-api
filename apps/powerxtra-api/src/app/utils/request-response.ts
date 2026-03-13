


export const ErrorResponse = (err?: any) => {
    let error;
    if(err){
      error = err.message;
    }else{
      const err = new Error("Something went wrong");
      error = err.message;
    }
    return {
        status: "error",
        error,
        responseType: "error"
    }
}
export const SuccessResponse = (data?: any, type?: string) => {
    return {
        status: "success",
        data: data || null,
        responseType: type
    }
}
