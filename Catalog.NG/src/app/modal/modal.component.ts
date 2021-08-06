import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalButton, ModalMessage } from './modal.model';
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

          this.modalToShow = modalMessage;
          this.modalDialog.show();
        });
  }

  performAction(button: ModalButton) {
    if(button?.action) { 
      try { 
        button.action();}
      catch(e) { 
        console.debug("Action failed: ", e);
      } 
    }
    this.modalDialog.hide();
  }

  ngOnDestroy() {
      this.modalSubscription!.unsubscribe();
  }

}
