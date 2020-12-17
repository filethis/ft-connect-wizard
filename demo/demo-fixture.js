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
/* ft-connection-list element demo */
/* Imports */
/**

An element that displays a list of FileThis connection resources

@demo
 */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

import './ft-connect-wizard-settings-editor.js';
import '../ft-connect-wizard.js';
import '../ft-connect-wizard-settings.js';
import 'ft-connection-list-item/ft-connection-list-item-settings.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/polymer/polymer-legacy.js';
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
                width: 700px;
                height: 700px;
            }
        </style>

        <!-- Settings -->
        <ft-connection-list-item-settings
            ft-connection-list-item-allow-manual-fetch=true
        >
        </ft-connection-list-item-settings>

        <ft-connect-wizard-settings
            ft-connect-wizard-show-documents-panel=true
        >
        </ft-connect-wizard-settings>

        <ft-element-demo
            name="ft-connect-wizard"
            style="width:100%; height: 100%; "
            show-config="true"
        >
            <!-- Settings -->
            <ft-connect-wizard-settings-editor
                slot="config"
                style="height:100%; padding:20px; "
                ft-connect-wizard-show-documents-panel="{{ftConnectWizardShowDocumentsPanel}}"
                ft-connect-wizard-show-document-count-badge="{{ftConnectWizardShowDocumentCountBadge}}"
            >
            </ft-connect-wizard-settings-editor>

            <!-- Panel -->
            <ft-connect-wizard
                id="wizard"
                slot="instance"
                style="width:100%; height: 100%; "
                fake-data="true"
                fake-sources="true"
                debug="true"
                ft-connect-wizard-show-documents-panel="{{ftConnectWizardShowDocumentsPanel}}"
                ft-connect-wizard-show-document-count-badge="{{ftConnectWizardShowDocumentCountBadge}}"
            >
            </ft-connect-wizard>

        </ft-element-demo>
`,

        is: 'demo-fixture',

        ready: function () {
            var wizard = this.$.wizard;

            wizard.addEventListener('ft-connect-error', this._onWizardError);
            wizard.addEventListener('wizard-canceled-command', this._onWizardCanceledCommand);
            wizard.addEventListener('wizard-done-command', this._onWizardDoneCommand);

            wizard.getAllData();
        },

        _onWizardError: function (event)
        {
            alert(event.detail);
        },

        _onWizardCanceledCommand: function (event) {
            alert("When the user clicks the \"Cancel\" button, your \"wizard-canceled-command\" event handler should do the appropriate thing in your workflow.");
        },

        _onWizardDoneCommand: function (event) {
            alert("When the user clicks the \"Done\" button, your \"wizard-done-command\" event handler should do the appropriate thing in your workflow.");
        }
    });
