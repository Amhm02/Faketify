import { Injectable } from '@angular/core';
import { accessibilitySharp } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(){}

  loginUser(credentials: any){
    return new Promise ((accept, reject) =>{
      if (
        credentials.email == "andy.hm02@gmail.com" &&
        credentials.password == "876543210"
      ){
        accept ("Login correcto")
      } else {
        reject ("Login incorrecto")
      }
    })
  }  
}
