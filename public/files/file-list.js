import {PolymerElement, html} from '../assets/@polymer/polymer/polymer-element.js';
import '../assets/@polymer/iron-ajax/iron-ajax.js';
import '../assets/@polymer/paper-button/paper-button.js';
// import './res.js';

export class FileList extends PolymerElement {
  constructor() {
    super();
  }

  ready() {
    super.ready();
    this.$.backButton.addEventListener('click', e => {
    this.selectedFile = null;
    this.pop('route');
    });

    this.$.forwardButton.addEventListener('click', e=> {
      console.log("forward");
    })
  }

  static get headerTemplate() {
    return html`<h1 id="headingText"></h1>
    <div id="buttons">
    <paper-button id="backButton"></paper-button>
    <paper-button id="forwardButton"></paper-button>
    </div>`;
  }

  static get footerTemplate() {
    return html`<div>-----------------------------------------------------------------------------------</div>
      <form action="/files/upload" method="post" enctype="multipart/form-data">
      <input id="uploadPath" type="hidden" name="path">
      <input type="file" name="file">
      <input type="submit">
      </form>`;
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
      #footerTemplate {
        flex: none;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      #headerTemplate {
        flex: none;
        width: 100%;
      }
      #outerDiv {
        flex: 1;
        width: 99%;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
        overflow: auto;
        border: 1px solid grey;
        border-radius: 5px;
      }
      .list:nth-child(odd) {
        background: #EEEEEE;
      }
      .list:nth-child(even) {
        background: white;
      }
      #buttons {
        text-align: center;
      }
      h1 {
        text-align: center;
        margin-bottom: 0;
      }
      #backButton {
        background: url('../images/back_black.png') no-repeat center center;
        margin-right: 40px;
      }
      #forwardButton {
        background: url('../images/forward_black.png') no-repeat center center;
        margin-left: 40px;
        visibility: hidden;
      }
    </style>
    <div id='headerTemplate'>${this.headerTemplate}</div>
    <div id='outerDiv'></div>
    <div id='footerTemplate'>${this.footerTemplate}</div>

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
        type: Array,
        value: []
      }
    }
  }

  static get observers() {
    return [
      '_routeChanged(route.splices)'
    ]
  }

  _fileSelected() {
    if (this.selectedFile && this.selectedFile.name) {
      this.push('route', this.selectedFile.name);
    }
  }

  _routeChanged() {
    this.$.headingText.innerText = this.route[this.route.length-1] || '/';
    var xhr = null;
    if (this.selectedFile && this.selectedFile.isFile) {
      xhr = this.$.file;
    } else {
      xhr = this.$.fileList;
    }

    const url = this._resources.getUrlFromRoute(this.route);
    this.$.uploadPath.value = url;
    xhr.url = this._resources.urls.GET_BASE_FILE_URL+ url;
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
    div.classList.add('list')
    div.append(t);
    div.addEventListener('click', function(e){
      this.set('selectedFile', obj);
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
    const mimeType = data.detail.response;
    console.log(mimeType.mime);
    var outerDiv = this.$.outerDiv;

    outerDiv.innerHTML = "";

    if (mimeType === null || mimeType.mime === null || mimeType.mime === false) {
      console.log('invalid');
      return;
    }

    switch (mimeType.mime.split('/')[0]) {
      case 'video':
        var src = document.createElement('source');
        src.setAttribute('src', this._resources.urls.GET_VIDEO_FILE);
        src.setAttribute('controls', '');
        src.setAttribute('type', mimeType.mime);

        var player = document.createElement('video');
        player.setAttribute('controls', '');
        player.append(src);

        outerDiv.append(player);
        break;
      default:
        var embed = document.createElement('embed');
        embed.setAttribute('src', this._resources.urls.GET_FILE);
        embed.setAttribute('width', this.$.headerTemplate.clientWidth-50);
        embed.setAttribute('height', window.innerHeight -
            this.$.headerTemplate.clientHeight - this.$.footerTemplate.clientHeight);
        outerDiv.append(embed);
    }

    // outerDiv.innerHTML = data.detail.response;
  }
}
customElements.define('file-list', FileList)
