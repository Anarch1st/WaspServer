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
    <style>
      .file {
        color: blue;
      }
      .dir {
        color: red;
      }
    </style>
    <div>${this.headerTemplate}</div>
    <div id='outerDiv'></div>
    <div>${this.footerTemplate}</div>

    <iron-ajax id="fileList"
        on-response="handleFilesList"
        on-error="handleError">
        </iron-ajax>
    <iron-ajax id="file"
        on-response="handleFile"
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
        observer: '_fetch'
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

  _fetch() {
    console.log(this.fileList);
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

  _getHTMLElement(obj) {
    var div = document.createElement("div");
    var t = document.createTextNode(obj.name);
    div.classList.add(obj.isFile?'file':'dir');
    div.append(t);
    div.addEventListener('click', function(e){
      const newPath = this.basePath+e.srcElement.innerText+'/';
      obj.isSelected = true;
      this.set('basePath', newPath);
    }.bind(this));
    return div;
  }

  handleFilesList(data) {
    this.set('fileList', this._resources.parseResponse(data.detail.response));
  }

  handleError(err) {
    console.log(err);
  }

  handleFile(data) {
    var outerDiv = this.$.outerDiv;

    outerDiv.innerHTML = data.detail.response;
  }
}
customElements.define('file-list', FileList)
