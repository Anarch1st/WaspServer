import {PolymerElement, html} from '../assets/@polymer/polymer/polymer-element.js';
import '../assets/@polymer/iron-ajax/iron-ajax.js';
// import './res.js';

export class FileList extends PolymerElement {
  constructor() {
    super();
  }

  static get headerTemplate() {
    return html`<h1>{{selectedFile.name}}</h1>`;
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
        handle-as = "text"
        on-error="handleError">
        </iron-ajax>`;
  }

  static get properties() {
    return {
      _resources: {
        type: Object,
        value: URLs
      },
      fileList: {
        type: Array,
        observer: '_fileListUpdated'
      },
      selectedFile: {
        type: Object,
        value: {'isFile': false},
        observer: '_fileSelected'
      },
      route: {
        type: Array
      }
    }
  }

  _fileSelected() {
    if (this.selectedFile && this.selectedFile.name) {
      this.route.push(this.selectedFile.name);
    } else {
      this.route = [];
    }

    var xhr = null;
    if (this.selectedFile.isFile) {
      xhr = this.$.file;
    } else {
      xhr = this.$.fileList;
    }
    xhr.url = this._resources.urls.GET_BASE_FILE_URL+
    this._resources.getUrlFromRoute(this.route);
    console.log(xhr.url);
    xhr.generateRequest();
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
      this.set('selectedFile', obj);
      console.log(this.selectedFile);
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
