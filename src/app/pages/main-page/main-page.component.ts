import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit, AfterViewInit {
  constructor(private apiService: ApiService, private router: Router) {
  }

  data: any = [];
  status: any;
  id: any;
  modalContent: any;
  modalContent2: any
  locationChangeInfo: any = false;
  currentTime: any = 'Loading...'
  date: any;
  voteStatus: boolean = true //투표진행중 유무
  reviewCardId: any;
  myVoteId: any;
  myVoteLocationData: any; //세션에서 투표한 장소 id값과 전체데이터값에서 일치하는 데이터를 추출한 값
  myVoteStatus: any; //투표 유무

  voteData : any = []; //투표한 장소, 회원 정보 데이터
  pageStatus : any;

  //초기 등록된 장소 조회
  ngOnInit() {
    this.startTimer()
    if (sessionStorage.getItem('voteLocation')) {
      this.myVoteStatus = true;
    }

    //로그인 유무 검사
    if (sessionStorage.getItem('accessToken')) {
      console.log("로그인 한 사용자입니다.")
    } else {
      console.log("로그인 하지 않은 사용자입니다.")
      this.router.navigate(["/start/signin"]);
    }

    // 내가 투표한 장소 요청
    this.myVoteReq();
    // 전체 투표한 장소, 회원 정보 요청
    this.voteGetData();

  }

  ngAfterViewInit() {
    this.locationGetDataHandler();
  }

  //내가 투표한 장소 가져오기
  myVoteReq(){
    this.apiService.voteUserData(sessionStorage.getItem('userId')).subscribe((data: any) => {
      this.myVoteLocationData = data;
    });
  }

  pageStatusHandler(status : any){
    this.pageStatus = status;
  }

  //투표한 장소, 회원 정보 가져오기
  voteGetData(){
    this.apiService.voteAllData().subscribe((data: any) => {
      this.voteData = data;
    });
  }

  //등록된 장소 조회
  locationGetDataHandler(id?: any) {
    this.apiService.locationGetData().subscribe((data: any) => {
      //등록된 장소 가나다순으로 정렬
      const result = data?.sort((a: any, b: any): any => {
        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1
      });
      this.data = result;

      // 내가 투표한 장소 요청
      this.myVoteReq();
      // 전체 투표한 장소, 회원 정보 요청
      this.voteGetData();
    });
  }

  myVoteLocationDetailHander(id: any) {
    this.id = id;
    this.status = true;
    this.modalContent = "modalDetail"
  }

  //투표 장소 상세보기 모달 열기
  modalRepresetReq(status: any) {
    this.status = status;
    this.modalContent = "modalDetail"
  }

  //투표 장소 변경 모달 열기
  modalRepresetReq2(status: any) {
    this.status = status;
    this.modalContent2 = "modalVoteChange"

    //1초 뒤 종료
    setTimeout(()=>{
      // @ts-ignore
      this.closeHandler()
    },1200)
  }

  //리뷰 등록 모달 열기
  reviewRegisterModal(reviewCardInfo: any) {
    this.status = reviewCardInfo.status;
    this.reviewCardId = reviewCardInfo.id;
    this.modalContent = "modalReviewRegister";
  }

  //카드 컴포넌트에서 id값 받기
  idRes(id: any) {
    if (id) {
      this.id = id;
      this.locationGetDataHandler();
    }
  }

  //모달에서 닫기 버튼을 했을때 상태값 받아오기
  closeHandler(status: any) {
    this.status = status;
    this.locationChangeInfo = false;
    this.modalContent = '';
    this.modalContent2 = '';
  }

  modalVoteCancelOpen(status: any) {
    this.modalContent = 'modalVoteCancel'
    this.status = status;

  }

  startTimer() {
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000)
  }

  //실시간 타이머 로직
  updateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    const seconds = this.padZero(now.getSeconds());

    this.currentTime = `${hours}:${minutes}:${seconds}`;
    this.date = `${year}.${month}.${date}`;

    // @ts-ignore
    if (hours >= 9 && hours < 11) {
      this.voteStatus = true;
    } else {
      this.voteStatus = false;
    }
  }

  transform() {
    this.voteStatus = !this.voteStatus
  }

  // 0:0:0을 방지 -> 00:00:00 표현 함수
  padZero(num: number) {
    return num < 10 ? '0' + num : num;
  }

  //투표 상황
  voteStatusHandler(voteStatus: boolean) {
    this.voteStatus = voteStatus
  }

  voteCancel() {
    sessionStorage.removeItem('voteLocation');
    this.status = false; //모달창 닫기
    this.myVoteStatus = false; // 현재 투표한 장소 없는 컴포넌트 표시
    this.modalContent = ""
    this.locationGetDataHandler();

    this.apiService.voteDel(sessionStorage.getItem('userId'))
      .subscribe((data) => {
        this.voteGetData();
      });
    // 내가 투표한 장소 요청
    this.myVoteReq();
    this.myVoteLocationData = null;
  }

  myVoteIdHandler(id: any) {
    this.myVoteId = id;
    this.myVoteStatus = true;
    // this.locationGetDataHandler(this.myVoteId);
    console.log(this.myVoteId);

    let voteData = {
      "user_id": sessionStorage.getItem('userId'),
      "location_id": id
    }

    //데이터 보내주기(투표하기)
    this.apiService.vote(voteData).subscribe(data => {
      // 내가 투표한 장소 요청
      this.myVoteReq();
      // 전체 투표한 장소, 회원 정보 요청
      this.voteGetData();
    })
  }
}
