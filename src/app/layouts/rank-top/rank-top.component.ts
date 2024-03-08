import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-rank-top',
  templateUrl: './rank-top.component.html',
  styleUrls: ['./rank-top.component.css']
})
export class RankTopComponent implements OnChanges, OnInit{
  @Input() voteData : any;
  highestVoteItem : any
  @Output() page = new EventEmitter<string>();

  ngOnInit() {
    // this.page.emit("투표종료")
    console.log(this.voteData)
  }

  ngOnChanges(changes: SimpleChanges) {
    // vote_count가 가장 높은 항목 찾기
    if(this.voteData.length > 0){
      let highestVoteItem = this.voteData.reduce((prev:any, current:any) => {
        if(prev.vote_count > current.vote_count){
          return prev
        }else if(prev.vote_count == current.vote_count){
          if(Math.random()<0.5){
            return prev;
          }else{
            return current;
          }
        }else{
          return current
        }
        // return (prev.vote_count > current.vote_count) ? prev : current;
      });
      this.highestVoteItem = highestVoteItem;
      console.log(this.highestVoteItem)
    }

  }
}
