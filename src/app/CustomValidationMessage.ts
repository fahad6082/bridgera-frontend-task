export class CustomValidationMessage {
    private static _validationMessage = {
        name: {
            required: 'Name is required',
            minlength: 'Name must be greater than 3 characters'
        },
        email: {
            required: 'Email is required',
            invalid: 'Email is invalid'
        },
        contact: {
            required: 'Phone number is required',
            digits: 'Only digits allowed',
            length: 'Phone number must be only 10 digits long'
        }
    }

    static get validationMessages() {
        return this._validationMessage;
    }
}