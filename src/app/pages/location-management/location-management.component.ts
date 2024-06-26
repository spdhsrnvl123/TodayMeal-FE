import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.css'],
})
export class LocationManagementComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}
  data: any = [];
  status: any;
  id: any;
  loadingData: any = [];
  voteButtonDel: any = false;
  delItemModalAction = '';
  delId: any;
  registerPageStatus: any = true;

  //초기 등록된 장소 조회
  ngOnInit() {
    this.voteButtonDel = false;
    this.getData();
    this.loadingLocation();

    if (sessionStorage.getItem('accessToken')) {
      console.log('로그인 한 사용자입니다.');
    } else {
      console.log('로그인 하지 않은 사용자입니다.');
      this.router.navigate(['/start/signin']);
    }
  }

  //등록된 장소 조회
  getData() {
    this.apiService.locationGetData().subscribe((data: any) => {
      const result = data?.sort((a: any, b: any): any => {
        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
      });
      this.data = result;
    });
  }

  // 삭제 대기 장소 조회
  loadingLocation() {
    this.apiService.loadingLocation().subscribe((data) => {
      this.loadingData = data;
    });
  }

  //삭제대기 취소
  loadingCancel(id: any) {
    this.apiService.loadingCancel(id).subscribe(() => {
      this.getData();
      this.loadingLocation();
    });
  }

  //모달 열기
  modalRepresetReq(status: any) {
    this.status = status;
  }

  //카드 컴포넌트에서 id값 받기
  idRes(id: any) {
    if (id) {
      this.id = id;
    }
  }

  //모달에서 닫기 버튼을 했을때 상태값 받아오기
  closeHandler(status: any) {
    this.status = status;
    this.delItemModalAction = '';
  }

  locationDelId(id: any) {
    this.delId = id;
  }

  locationDel() {
    this.apiService.locationDeleteData(this.delId).subscribe(() => {
      this.getData();
      this.loadingLocation();
      this.delItemModalAction = '';
    });
  }
  delItemModalActionHandler(delItemModalAction: any) {
    this.delItemModalAction = delItemModalAction;
  }
}
