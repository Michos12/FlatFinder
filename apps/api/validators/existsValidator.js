function existsValidator(value, 
    positiveCallBack = () => {
                res.status(200).json({ success: true })
    }, 
    negativeCallBack = () => {
                res.status(404).json({ error: "Resource not found" })
    }) {
    if(value === null || value === undefined || !value) {
        return negativeCallBack();
    }
    return positiveCallBack();
}
export default existsValidator;