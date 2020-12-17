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
import '@polymer/polymer/polymer-legacy.js';
import { IronMeta } from '@polymer/iron-meta/iron-meta.js';

// Make sure the "FileThis" namespace exists
window.FileThis = window.FileThis || {};

/**
 * `<ft-connect-wizard-settings-behavior>`
 *
 * Mixin to get connection list item settings properties.
 *
 * @demo
 * @polymerBehavior FileThis.ConnectWizardSettingsBehavior
 */
FileThis.ConnectWizardSettingsBehavior = {

    observers:[
        '_onInternalSettingsChanged(ftConnectWizardShowDocumentsPanel)',
        '_onInternalSettingsChanged(ftConnectWizardShowDocumentCountBadge)',
    ],

    properties: {

        /**
         * Whether to include the "Documents" panel in the wizard, or not.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftConnectWizardShowDocumentsPanel: {
            type: Object,
            value: true,
            notify: true,
            observer: "_onFtConnectWizardShowDocumentsPanelChanged"
        },

        /**
         * Whether to show the document count badge in the tabs of the wizard, or not.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftConnectWizardShowDocumentCountBadge: {
            type: Object,
            value: true,
            notify: true,
            observer: "_onFtConnectWizardShowCountBadgeChanged"
        },

    },

    attached: function()
    {
        this.async(function()
        {
            this._applySettingToProperty("ft-connect-wizard-show-documents-panel", "ftConnectWizardShowDocumentsPanel");
            this._applySettingToProperty("ft-connect-wizard-show-document-count-badge", "ftConnectWizardShowDocumentCountBadge");
        });
    },

    _applySettingToProperty: function(settingName, propertyName)
    {
        var meta = new IronMeta({type: "setting", key: settingName});
        var value = meta.value;
        if (value !== undefined)
            this.set(propertyName, value);
    },

    _onFtConnectWizardShowDocumentsPanelChanged: function(to, from)
    {
        this.dispatchEvent(new CustomEvent('ft-connect-wizard-show-documents-panel-changed-in-behavior', {detail: {to: to, from: from}}));
    },

    _onFtConnectWizardShowCountBadgeChanged: function(to, from)
    {
        this.dispatchEvent(new CustomEvent('ft-connect-wizard-show-document-count-badge-changed-in-behavior', {detail: {to: to, from: from}}));
    },

    _onInternalSettingsChanged: function(to)
    {
        this.fire("internal-settings-changed");
    },

    generateSettingsImport: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var theImport = indent + "<link rel=\"import\" href=\"https://connect.filethis.com/{{RELEASE_VERSION}}/ft-connect-wizard/ft-connect-wizard.html\">\n";

        return theImport;
    },

    generateSettingsElement: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var settings = indent + "<ft-connect-wizard-settings";

        // Keep alphabetized
        if (this.ftConnectWizardShowDocumentsPanel !== true)
            settings += "        " + this._buildSettingAttribute("ft-connect-wizard-show-documents-panel", "false", indent);
        if (this.ftConnectWizardShowDocumentCountBadge !== true)
            settings += "        " + this._buildSettingAttribute("ft-connect-wizard-show-document-count-badge", "false", indent);

        settings += ">\n" + indent + "</ft-connect-wizard-settings>\n";

        return settings;
    },

    // TODO: Factor out from here and copies in other classes
    _buildSettingAttribute: function(propertyName, propertyValue, indent)
    {
        return '\n' + indent + '    ' + propertyName + '="' + propertyValue + '"';
    },

    hasSettings: function()
    {
        if (this.ftConnectWizardShowDocumentsPanel !== true)
            return true;
        if (this.ftConnectWizardShowDocumentCountBadge !== true)
            return true;
        return false;
    },

    revertToDefaults: function()
    {
        this.ftConnectWizardShowDocumentsPanel = true;
        this.ftConnectWizardShowDocumentCountBadge = true;
    },
}
