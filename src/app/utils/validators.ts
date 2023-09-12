import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormArray,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, timer, map, take } from 'rxjs';

export const atLeastOneHobbyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const hobbiesArray = control as FormArray;

  if (hobbiesArray.controls.length > 0) {
    return null;
  }

  return { atLeastOneHobby: true };
};

export const emailExistsValidator: AsyncValidatorFn = (
  control: AbstractControl
): Observable<{ [key: string]: any } | null> => {
  const email = control.value;

  return timer(2000).pipe(
    take(1),
    map(() => {
      const emailExists = email === 'test@test.test';

      if (emailExists) {
        return { emailExists: true };
      }
      return null;
    })
  );
};
