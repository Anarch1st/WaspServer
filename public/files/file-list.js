import {PolymerElement, html} from '../assets/@polymer/polymer/polymer-element.js';
import '../assets/@polymer/iron-ajax/iron-ajax.js';
// import './res.js';

export class FileList extends PolymerElement {
  constructor() {
    super();
  }

  static get headerTemplate() {
    return html`<h1>{{basePath}}</h1>`;
  }

  static get footerTemplate() {
    return html`<div>-----------------------------------------------------------------------------------</div>`;
  }

  static get template() {
    return html`
    <div>${this.headerTemplate}</div>
    <span id="list"></span>
    <div>${this.footerTemplate}</div>

    <iron-ajax id="fileList"
        on-response="handleResponse"
        on-error="handleError">
        </iron-ajax>`;

  }

  static get properties() {
    return {
      basePath: {
        type: String,
        value: ""
      },
      _resources: {
        type: Object,
        value: URLs
      },
      fileURL: {
        type: String,
        computed: '_fileUrlChanged(basePath)',
        observer: '_fetchFileList'
      },
      fileList: {
        type: Array,
        observer: '_fileListUpdated'
      }
    }
  }

  _fileUrlChanged(path) {
    return this._resources.urls.GET_BASE_FILE_URL+this.basePath;
  }

  _fetchFileList() {
    this.$.fileList.url = this.fileURL;
    this.$.fileList.generateRequest();
  }

  _fileListUpdated() {
    var htmlElements = [];
    for (var val of this.fileList) {
      htmlElements.push('')
    }
    string = string.substring(5, string.length-1);

    this.$.list.innerText = string;
  }

  _getHTMLElement(name) {
    return '<div>'+name+'</div>';
  }

  handleResponse(data) {
    console.log(data.detail.response);
    this.set('fileList', data.detail.response);
  }

  handleError(err) {
    console.log(err);
  }

  populateFileList() {

  }
}
customElements.define('file-list', FileList)
