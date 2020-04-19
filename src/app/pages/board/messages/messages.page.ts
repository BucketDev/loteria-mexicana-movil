import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from "../../../services/messages.service";
import {Message} from "../../../models/message.class";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FireAuthService} from "../../../services/security/fire-auth.service";
import {IonContent, IonInfiniteScroll} from "@ionic/angular";
import {QueryDocumentSnapshot} from "@angular/fire/firestore";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages: Message[];
  messagesDoc: QueryDocumentSnapshot<Message>[];
  loading = true;
  formMessageGroup: FormGroup;
  userUid: string;
  boardUid: string;
  @ViewChild(IonContent, { static: false }) messagesList: IonContent;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  constructor(private messagesService: MessagesService,
              private router: Router,
              public fireAuth: FireAuthService) {
    this.formMessageGroup = new FormGroup({
      message: new FormControl('', Validators.required)
    });
    if (router.getCurrentNavigation() && router.getCurrentNavigation().extras) {
      const {boardUid, userUid} = router.getCurrentNavigation().extras.state;
      this.userUid = userUid;
      this.boardUid = boardUid;
      this.messagesService.getLastMessagesByBoard(userUid, boardUid).subscribe((messagesDoc: QueryDocumentSnapshot<Message>[]) => {
        this.messagesDoc = messagesDoc;
        this.messages = messagesDoc.map((messageDoc) => {
          const message: Message = messageDoc.data();
          return {...message, uid: messageDoc.id};
        })
        this.loading = false;
      })
    }
  }

  getNext = (event) => {
    const lastMessage = this.messagesDoc[0];
    this.messagesService.getNext(this.userUid, this.boardUid, lastMessage).toPromise()
      .then((messagesDoc: QueryDocumentSnapshot<Message>[]) => {
        event.target.complete();
        if (messagesDoc.length === 0) {
          this.infiniteScroll.disabled = true;
        } else {
          this.messagesDoc = messagesDoc;
          this.messages.unshift(...messagesDoc.map((messageDoc: QueryDocumentSnapshot<Message>) => {
            const message: Message = messageDoc.data();
            return {...message, uid: messageDoc.id};
          }));
        }
        this.loading = false;
      })
  }

  ngOnInit() {

  }

  addMessage = () => {
    const {message} = this.formMessageGroup.value;
    this.messagesService.addMessage(this.userUid, this.boardUid, message)
      .then(() => {
        this.formMessageGroup.reset();
        this.messagesList.scrollToBottom();
      });
  }

}
