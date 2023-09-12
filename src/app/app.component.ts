import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { atLeastOneHobbyValidator, emailExistsValidator } from './utils';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe],
})
export class AppComponent implements OnInit {
  emailValidationPending = false;
  technologies = ['angular', 'react', 'vue'];
  versions: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };
  developerForm: FormGroup;

  get firstNameControl(): FormControl {
    return this.developerForm.get('firstName') as FormControl;
  }
  get lastNameControl(): FormControl {
    return this.developerForm.get('lastName') as FormControl;
  }
  get dateOfBirthControl(): FormControl {
    return this.developerForm.get('dateOfBirth') as FormControl;
  }
  get frameworkControl(): FormControl {
    return this.developerForm.get('framework') as FormControl;
  }
  get frameworkVersionControl(): FormControl {
    return this.developerForm.get('frameworkVersion') as FormControl;
  }
  get hobbiesArrayControl(): FormArray {
    return this.developerForm.get('hobbies') as FormArray;
  }
  get emailControl(): FormControl {
    return this.developerForm.get('email') as FormControl;
  }
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {}
  ngOnInit(): void {
    this.developerForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [emailExistsValidator],
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      framework: ['', Validators.required],
      frameworkVersion: [{ value: '', disabled: true }, Validators.required],
      hobbies: this.formBuilder.array(
        [this.createHobby()],
        [atLeastOneHobbyValidator]
      ),
    });

    this.developerForm.valueChanges.subscribe(() => {
      console.log(this.hobbiesArrayControl.hasError('atLeastOneHobby'));
    });
  }

  onTechnologyChange() {
    if (this.developerForm) {
      const selectedTech = this.frameworkControl.value;
      this.frameworkVersionControl.setValue('');
      if (selectedTech) {
        this.frameworkVersionControl.enable();
      } else {
        this.frameworkVersionControl.disable();
      }
    }
  }

  createHobby(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  addHobby() {
    this.hobbiesArrayControl.push(this.createHobby());
  }

  removeHobby(index: number) {
    this.hobbiesArrayControl.removeAt(index);
  }
  formatDate(date: any): string {
    const dateObject = new Date(date);
    const formattedDate = this.datePipe.transform(dateObject, 'dd-MM-yyyy');

    return formattedDate || '';
  }
  submitForm() {
    if (this.developerForm.valid) {
      const formValue = this.developerForm.value;
      formValue.dateOfBirth = this.formatDate(formValue.dateOfBirth);
      console.log(formValue);
      this.developerForm.reset();
    }
  }
}
