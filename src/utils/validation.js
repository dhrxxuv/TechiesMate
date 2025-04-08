const validateSignupdata = (req)=>{
    const {firstName,lastName,emailId,password} = req.body;
    if(firstName||lastName){
        throw new Error('Name not Valid')
    }
    
}