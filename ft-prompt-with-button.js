/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-label/iron-label.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                border: 1px solid #DDD;
                padding:20px;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --ft-prompt-with-button;
            }
            #instructions {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14pt;
                @apply --ft-prompt-with-button-instructions;
            }
            #button {
                height: 32px;
                font-size: 14px;
                background-color: white;
                text-transform: none;
                border: 1px solid #DDD;
                margin-left: 16px;
                @apply --ft-prompt-with-button-button;
            }
        </style>

        <!-- Instructions -->
        <iron-label id="instructions" class="flex">
            [[prompt]]
        </iron-label>

        <!-- Add Connection button -->
        <paper-button id="button" raised="" on-tap="_onCommandButtonClicked">
            [[buttonLabel]]
        </paper-button>
`,

  is: 'ft-prompt-with-button',

  properties: {

      prompt:
      {
          type: String,
          value: "Don't just sit there, do something.",
      },

      buttonLabel:
      {
          type: String,
          value: "Okay",
      },

      command:
      {
          type: String,
          value: "doit",
      },

  },

  _onCommandButtonClicked: function()
  {
      this.fire(this.command);
  }
});
