import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

export class FileList extends PolymerElement {
  constructor() {
    super();

    console.log("Initialized");
  }

  // ready() {
  //   super.ready();
  //
  //   this.$.fileList.generateRequest();
  // }

  static get headerTemplate() {
    return html`<h1>{{basePath}}</h1>`;
  }

  static get footerTemplate() {
    return html`<div>-----------------------------------------------------------------------------------</div>`;
  }

  static get template() {
    return html`
    <div>${this.headerTemplate}</div>
    <span id="fileList"></span>
    <div>${this.footerTemplate}</div>

    <iron-ajax id="fileList"
        url=[[_resources.GET_FILE_LIST]]
        on-response="handleResponse"
        on-error="handleError">
        </iron-ajax>`;

  }

  static get properties() {
    return {
      basePath: {
        type: String,
        value: "/"
      },
      _resources: {
        type: Object,
        value: URLs
      }
    }
  }

  handleResponse(data) {
    console.log(data);
  }

  handleError(err) {
    console.log(err);
  }
}
customElements.define('file-list', FileList)
