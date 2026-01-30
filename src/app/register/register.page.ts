import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Auth } from '../services/auth';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

    registerForm: FormGroup;
    errorMessage: string = "";

    validation_messages = {
        nombre: [
            { type: 'required', message: 'El nombre es obligatorio.' }
        ],
        apellido: [
            { type: 'required', message: 'El apellido es obligatorio.' }
        ],
        email: [
            { type: 'required', message: 'El email es obligatorio.' },
            { type: 'email', message: 'Email inválido.' }
        ],
        password: [
            { type: 'required', message: 'La contraseña es obligatoria.' },
            { type: 'minlength', message: 'La contraseña debe tener al menos 8 caracteres.' }
        ]
    };

    constructor(
        private formBuilder: FormBuilder,
        private auth: Auth,
        private navCtrl: NavController,
        private storage: StorageService
    ) {
        this.registerForm = this.formBuilder.group({
            nombre: new FormControl('', Validators.required),
            apellido: new FormControl('', Validators.required),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.email
            ])),
            password: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(8)
            ]))
        });
    }

    ngOnInit() { }

    async registerUser(userData: any) {
        this.auth.registerUser(userData)
            .then(() => {
                this.navCtrl.navigateBack('/login');
            })
            .catch(error => {
                this.errorMessage = error;
            });
    }

    goToLogin() {
        this.navCtrl.navigateBack('/login');
    }
}
