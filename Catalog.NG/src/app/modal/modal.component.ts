import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalMessage } from './modal.model';
import { ModalService } from './modal.service';
declare var bootstrap: any;

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent implements OnInit {

  modalSubscription?: Subscription;
  modalToShow: ModalMessage = { title: "", buttons: [], message: ""};
  modalDialog?: any;

  constructor(private modalService: ModalService) { }

  ngOnInit() {

    console.debug(document.getElementById('modal'));
    this.modalDialog = new bootstrap.Modal(document.getElementById('modal'), {});
    console.debug("modal dialog:", this.modalDialog);

    // subscribe to new alert notifications
    this.modalSubscription = this.modalService.onChange()
        .subscribe((modalMessage : ModalMessage) => {

          console.debug("Caught event from modal service!!");
          console.debug("Asking confirmation for: ", modalMessage.message);

          this.modalToShow = modalMessage;
          this.modalDialog.show();
          // if(window.confirm(modalMessage.message))
          // {
          //     //second button is: YES
          //     console.debug("Confirmed!");
          //     if(modalMessage!.buttons![1]!.action!) { modalMessage!.buttons![1]!.action!(); }
          // }
          // else
          // {
          //   //FIRST IS NO
          //     console.debug("NOT Confirmed!");
          //     if(modalMessage!.buttons![0]!.action!) { modalMessage!.buttons![0]!.action!(); }
          // }

          //TODO: catch events in click and also terminate the window, now caught in click but should be wrapped
        });
  }

  ngOnDestroy() {
      this.modalSubscription!.unsubscribe();
  }

}
