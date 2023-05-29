export class KeyController {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (event) => {
      console.log(event.code, "누름");
      this.keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
      console.log(event.code, "뗌");
      delete this.keys[event.code];
    });
  }
}
