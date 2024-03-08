import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private api: String = '/api';
  private api: String = 'http://localhost:8000';
  private headerOption = {};

  constructor(private http: HttpClient) {
    this.#setInit();
  }

  #setInit = () => {
    this.#setInitToken();
  }

  #setInitToken = () => {
    if(sessionStorage.getItem('accessToken')) {
      this.headerOption = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        }),
      };
    }
  }

  //전달받은 토큰값을 세션스토리지에 저장
  setHeaderOption = (token: string) => {
    sessionStorage.setItem('accessToken', token);
    this.headerOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  };

  //회원가입 유저 정보 저장
  joinReq(userData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token',
      }),
    };
    return this.http.post(`${this.api}/join`, userData, httpOptions);
  }

  //아이디 중복 검사
  duplicationReq(user_id: any) {
    return this.http.get(`${this.api}/duplication/${user_id}`);
  }

  //로그인
  loginReq(userData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        Authorization: 'my-auth-token',
      }),
    };
    return this.http.post(`${this.api}/login`, userData);
  }

  // 등록 요청
  registerData(id: number) {
    return this.http.post(`${this.api}/register`, id, this.headerOption);
  }

  // 등록된 장소 조회
  locationGetData() {
    return this.http.get(`${this.api}/location`, this.headerOption);
  }

  // 삭제 대기 장소 조회
  loadingLocation() {
    return this.http.get(`${this.api}/loading`, this.headerOption);
  }

  // 각 장소 조회
  locationEachData(id: any) {
    return this.http.get(`${this.api}/location/${id}`, this.headerOption);
  }

  // 장소 삭제
  locationDeleteData(id: any) {
    return this.http.get(
      `${this.api}/location/delete/${id}`,
      this.headerOption
    );
  }

  // 각 메뉴 조회
  menuGetData(id: any) {
    return this.http.get(`${this.api}/menu/${id}`, this.headerOption);
  }

  // 장소 삭제 취소
  loadingCancel(id: any) {
    return this.http.get(`${this.api}/loading/cancel/${id}`, this.headerOption);
  }

  // 투표 등록
  vote(data : any) {
    return this.http.post(`${this.api}/vote`, data, this.headerOption);
  }

  // 투표 삭제
  voteDel(user_id:any){
    return this.http.delete(`${this.api}/vote/${user_id}`, this.headerOption)
  }

  // 내가 투표한 장소 가져오기
  voteUserData(user_id : any){
    return this.http.get(`${this.api}/vote/${user_id}`, this.headerOption);
  }

  // 투표한 장소 조회
  voteAllData() {
    return this.http.get(`${this.api}/vote`, this.headerOption);
  }

  // 회원탈퇴
  userLeave(data : any){
    return this.http.post(`${this.api}/user/cancel`,data , this.headerOption)
  }

  // 비밀번호 변경
  userChange(data : any){
    return this.http.post(`${this.api}/user/password`,data , this.headerOption)
  }

  // get(restApi: string, option?: any) {
  //   return this.http.get(restApi, option) ;
  // }

}
