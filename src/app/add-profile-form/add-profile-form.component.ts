import { CustomValidators } from './../CustomValidator';
import { CustomValidationMessage } from './../CustomValidationMessage';
import { FormErrors } from './../FormErrors';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProfileService } from '../servics/profile.service';

@Component({
  selector: 'app-add-profile-form',
  templateUrl: './add-profile-form.component.html',
  styleUrls: ['./add-profile-form.component.scss']
})
export class AddProfileFormComponent implements OnInit {
  @Output('onFormSubmit') onFormSubmit = new EventEmitter();

  public  form: FormGroup;
  public formErrors = FormErrors;
  public validationMessages = CustomValidationMessage.validationMessages;
  
  constructor(
    private fb: FormBuilder,
    private _profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm()  {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.emailValidator]],
      contact: [null, [Validators.required, CustomValidators.phoneValidator]],
    });
  }

  save() {
    this.form.markAllAsTouched();
    this.logValidationErrors();

    if (this.form.invalid) return;

    const data = {...this.form.value};

    this._profileService
      .add(data)
      .subscribe(
        res => {
          this.onFormSubmit.emit(res.payload);
        },
        err => console.log(err)
      );
  }

  logValidationErrors(group: FormGroup = this.form): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl: AbstractControl = group.get(key);

      this.formErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const msg = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) this.formErrors[key] = msg[errorKey] + " ";
        }
      }

      if (abstractControl instanceof FormGroup)
        this.logValidationErrors(abstractControl);
    });
  }
}
