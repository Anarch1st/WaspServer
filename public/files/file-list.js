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
    <div id='outerDiv'></div>
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
        value: "/"
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
    var outerDiv = this.$.outerDiv;

    outerDiv.innerHTML = "";

    for (var val of this.fileList) {
      outerDiv.append(this._getHTMLElement(val));
    }
  }

  _getHTMLElement(name) {
    var div = document.createElement("div");
    var t = document.createTextNode(name);
    div.append(t);
    div.addEventListener('click', function(e){
      const newPath = this.basePath+e.srcElement.innerText+'/';
      this.set('basePath', newPath);
    }.bind(this));
    return div;
  }

  handleResponse(data) {
    this.set('fileList', this._resources.func.parseResponse(data.detail.response));
  }

  handleError(err) {
    console.log(err);
  }

  populateFileList() {

  }
}
customElements.define('file-list', FileList)
