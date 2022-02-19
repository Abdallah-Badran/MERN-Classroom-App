const getUniqueErrorMessage = (err) => {
    let output
    try {
        let fieldName = Object.keys(err.keyValue)[0]
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
    } catch (ex) {
        output = 'Unique field already exists'
    }

    return output
}

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = []

    if (err.code) {
        switch (err.code) {
            case 11000: //deuplicate error
            case 11001:
                message.push(getUniqueErrorMessage(err))
                break
            default:
                message.push('Something went wrong')
        }

    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message.push(err.errors[errName].message)
            }
        }
    }

    return message
}

export default { getErrorMessage }


