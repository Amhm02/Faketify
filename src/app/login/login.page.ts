import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Auth } from '../services/auth';
import { StorageService } from '../storage.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})

export class LoginPage implements OnInit {

  loginForm: FormGroup;

  errorMessage: string = "";

  validation_messages = {

    email: [
      { type: "required", message: "El email es obligatorio." },
      { type: "email", message: "Email inválido." }
    ],

    password: [
      { type: "required", message: "La contraseña es obligatoria." },
      { type: "minlength", message: "La contraseña debe tener al menos 8 caracteres." }
    ]
  }


  constructor(private formBuilder: FormBuilder, private Auth: Auth, private NavCtrl: NavController, private storage: StorageService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.email
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])
      )
    })
  }

  ngOnInit() {
  }

  loginUser(credentials: any) {
    console.log(credentials);

    this.Auth.loginUser(credentials)
      .then(async () => {
        await this.storage.set('login', true);
        this.NavCtrl.navigateForward('/intro');
      })
      .catch((error: string) => {
        this.errorMessage = error;
      });

  }


  goToRegister() {
    this.NavCtrl.navigateForward('/register');
  }

}

