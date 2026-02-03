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
    successMessage: string = "";

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
        ],
        password_confirmation: [
            { type: 'required', message: 'Debe confirmar la contraseña.' }
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
            ])),
            password_confirmation: new FormControl('', Validators.required)
        });
    }

    ngOnInit() { }

    async registerUser(formData: any) {
        this.errorMessage = "";
        this.successMessage = "";

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.password_confirmation) {
            this.errorMessage = "Las contraseñas no coinciden";
            return;
        }

        // Mapear los datos al formato esperado por la API
        const userData = {
            name: formData.nombre,
            last_name: formData.apellido,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation
        };

        console.log('Enviando datos de registro:', userData);

        this.auth.registerUser(userData)
            .then((message) => {
                this.successMessage = message;
                console.log('Registro exitoso, redirigiendo a login...');
                // Esperar un momento para que el usuario vea el mensaje de éxito
                setTimeout(() => {
                    this.navCtrl.navigateBack('/login');
                }, 1500);
            })
            .catch(error => {
                this.errorMessage = error;
                console.error('Error en registro:', error);
            });
    }

    goToLogin() {
        this.navCtrl.navigateBack('/login');
    }
}
