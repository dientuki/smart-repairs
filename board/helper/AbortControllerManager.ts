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
    if (this.controller && this.isFetching) {
      this.controller.abort();
      this.controller = null;
      this.isFetching = false;
    }
  }

  static completeFetch() {
    this.isFetching = false; // Resetea el flag cuando la solicitud se completa
  }
}
