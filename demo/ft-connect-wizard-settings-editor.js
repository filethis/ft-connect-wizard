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
/* Imports */
/**

This element defines a source grid example that allows experimentation with configuration.

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/polymer/polymer-legacy.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import '../ft-connect-wizard-settings-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer
({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                @apply --layout-vertical;
                @apply --ft-connect-wizard-settings-editor;
            }
        </style>

        <custom-style>
            <style>
                paper-checkbox {
                    width: 200px;
                    margin-bottom: 16px;
                }
            </style>
        </custom-style>

        <!-- Settings -->

        <paper-checkbox checked="{{ftConnectWizardShowDocumentsPanel}}">
            Show Documents Panel
        </paper-checkbox>
        <paper-checkbox checked="{{ftConnectWizardShowDocumentCountBadge}}">
            Show Document Count
        </paper-checkbox>
`,

  is: 'ft-connect-wizard-settings-editor',
  behaviors: [FileThis.ConnectWizardSettingsBehavior]
});
