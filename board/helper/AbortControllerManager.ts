export class AbortControllerManager {
  private static controller: AbortController | null = null;
  private static isFetching: boolean = false;

  static getController(): AbortController {
    if (!this.controller) {
      this.controller = new AbortController();
    }
    this.isFetching = true;
    return this.controller;
  }

  static abort() {
    console.log(this.isFetching, 'call abort')
    if (this.controller && this.isFetching) {
      console.log('do abort')
      this.controller.abort();
      this.controller = null;
      this.isFetching = false;
    }
  }


  static completeFetch() {
    console.log('complete fetch')
    this.isFetching = false; // Resetea el flag cuando la solicitud se completa
  }
}
