import {Component, ViewChild} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorStatus : any = false;
  @ViewChild('f') signInForm: NgForm | undefined;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    if (this.signInForm) {
      const singData = {
        user_id: this.signInForm.form.value.id,
        password: this.signInForm.form.value.password
      };

      // FormData 객체 생성
      const formData = new FormData();
      formData.append('user_id', singData.user_id);
      formData.append('password', singData.password);

      // FormData를 API 서비스로 전달
      this.apiService.loginReq(formData).subscribe((response: any) => {
        if (response) {
          sessionStorage.setItem('userId', response.username);
          sessionStorage.setItem('username',response.name);
          //headerOption에 서버에 응답받은 accessToken을 전달
          this.apiService.setHeaderOption(response.accessToken);
          if(sessionStorage.getItem('accessToken')){
            this.router.navigate(["/home"]);
          }
        } else {
          console.error('accessToken not found in response.');
        }

      },error => this.errorStatus = true);
    }
  }
}
