import { Component } from '@angular/core';

@Component({
  selector: 'app-focus-room',
  templateUrl: './focus-room.component.html',
  styleUrls: ['./focus-room.component.scss']
})
export class FocusRoomComponent {

  sessionStarted = false;

  duration = 25;
  breakTime = 5;
  timeLeft = this.duration * 60;
  interval: any;

  roomName = 'Sala de Foco';

  users = [
    { name: 'Maria Silva', photoUrl: 'assets/images/penguin.png' },
    { name: 'João Santos', photoUrl: 'assets/images/parrot.png' },
    { name: 'Ana Costa', photoUrl: 'assets/images/squirrel.png' }
  ];

  startSession() {
    this.sessionStarted = true;
    this.timeLeft = this.duration * 60;
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  get minutes() {
    return Math.floor(this.timeLeft / 60);
  }

  get seconds() {
    return this.timeLeft % 60;
  }
}