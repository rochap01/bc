import {Inject, Injectable} from '@angular/core';
import {NOTYF} from '../util/notyf.token';
import {Notyf} from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  notificacao = new Notyf({
    types: [
      {
        type: 'info',
        icon: false,
        backgroundColor: '#2a8fbd'
      },
      {
        type: 'success',
        backgroundColor: '#34BE74'
      }
    ]
  });

  constructor(@Inject(NOTYF) private notyf: Notyf
  ) {
  }


  showInfo(msg: string) {
    this.notificacao.open({
      type: 'info',
      message: `<i class="fa fa-info-circle" style="color: #ffffff"></i>  ` + msg
    });
  }

  showSuccess(msg: string) {
    this.notificacao.open({
      type: 'success',
      message: msg
    });
  }

  showErro(msg: string) {
    this.notificacao.open({
      type: 'error',
      message: msg
    });
  }
}
