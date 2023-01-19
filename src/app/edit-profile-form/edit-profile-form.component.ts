import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CustomValidationMessage } from '../CustomValidationMessage';
import { CustomValidators } from '../CustomValidator';
import { FormErrors } from '../FormErrors';
import { ProfileService } from '../servics/profile.service';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss']
})
export class EditProfileFormComponent implements OnInit, OnChanges {
  @Input('user') user;

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

  ngOnChanges(changes) {
    if (changes.user.currentValue) {
      this.form.patchValue({
        name: this.user.name,
        email: this.user.email,
        contact: this.user.contact,
      })
    }
  }

  initializeForm()  {
    this.form = this.fb.group({
      name: [this.user, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.emailValidator]],
      contact: [null, [Validators.required, CustomValidators.phoneValidator]],
    });
  }

  save() {
    this.form.markAllAsTouched();
    this.logValidationErrors();

    if (this.form.invalid) return;

    const params = {id: this.user._id,}
    const data = {
      ...this.form.value
    };
    this._profileService
      .edit(params, data)
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
