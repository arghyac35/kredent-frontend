import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonValidators } from '@shared/validators/validators';
import { AuthService, CustomSnackbarService } from '@core/services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  signUpForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _customSnackbarService: CustomSnackbarService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Create the form
    this.signUpForm = this._formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: CommonValidators.mustMatch('password', 'passwordConfirm'),
      }
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  signUp(): void {
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    // Disable the form
    this.signUpForm.disable();

    const { passwordConfirm, ...newObj } = this.signUpForm.value;

    // Sign up
    this._authService.signUp(newObj).subscribe(
      (response) => {
        // Navigate to the confirmation required page
        this._router.navigateByUrl('/sign-in').then(() => {
          this._customSnackbarService.open(response.message, 'info', 'Ok');
        });
      },
      (response) => {
        console.log(response);

        // Re-enable the form
        this.signUpForm.enable();

        this._customSnackbarService.open(response, 'error', 'Ok');
      }
    );
  }
}
