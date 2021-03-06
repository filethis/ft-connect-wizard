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
/**
`<ft-connect-wizard>`

An element that implements a FileThis user workflow as a set of tabbed panels. As the user progresses, they navigate to the next tab in the sequence.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@filethis/ft-confirmation-dialog/ft-confirmation-dialog.js';

import '@filethis/ft-connect-behavior/ft-connect-behavior.js';
import '@filethis/ft-connection-panel/ft-connection-panel.js';
import '@filethis/ft-connection-panel/ft-connection-panel-settings.js';
import '@filethis/ft-connection-panel/ft-connection-panel-settings-behavior.js';
import '@filethis/ft-connection-list-item/ft-connection-list-item-settings.js';
import '@filethis/ft-connection-list-item/ft-connection-list-item-settings-behavior.js';
import './ft-prompt-with-button.js';
import './ft-wizard-finish-panel.js';
import './ft-wizard-tab.js';
import './ft-wizard-tab-bar.js';
import './ft-connect-wizard-settings-behavior.js';
import './ft-connect-wizard-settings.js';
import '@filethis/ft-document-panel/ft-document-panel.js';
import '@filethis/ft-document-panel/ft-document-panel-settings.js';
import '@filethis/ft-document-panel/ft-document-panel-settings-behavior.js';
import '@filethis/ft-labeled-icon-button/ft-labeled-icon-button.js';
import '@filethis/ft-source-grid-item/ft-source-grid-item-settings.js';
import '@filethis/ft-source-grid-item/ft-source-grid-item-settings-behavior.js';
import '@filethis/ft-source-panel/ft-source-panel.js';
import '@filethis/ft-source-panel/ft-source-identifier.js';
import '@filethis/ft-source-panel/ft-source-panel-settings.js';
import '@filethis/ft-source-panel/ft-source-panel-settings-behavior.js';
import '@filethis/ft-user-interaction-form/ft-user-interaction-form.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
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
                @apply --layout-vertical;
                @apply --ft-connect-wizard;
            }
            #cancelButton {
                width: 90px;
                height: 32px;
                font-size: 14px;
                background-color: white;
                text-transform: none;
                border: 1px solid #DDD;
                @apply --ft-connect-wizard-cancel-button;
            }
            #panels {
                border-top: 1px solid #DDD;
                @apply --ft-connect-wizard-panels;
            }
            #connectionPanelOrPrompt {
                @apply --ft-connect-wizard-connection-panel-or-prompt;
            }
            #connectionPrompt {
                @apply --ft-connect-wizard-connection-prompt;
            }
            #documentPanelOrPrompt {
                @apply --ft-connect-wizard-document-panel-or-prompt;
            }
            #documentPrompt {
                @apply --ft-connect-wizard-document-prompt;
            }
            #finishPanel {
                @apply --ft-connect-wizard-finish-panel;
            }
            #modalInteractionDialog {
                padding-left: 20px;
                padding-top: 8px;
                padding-right: 20px;
                padding-bottom: 5px;
                @apply --ft-connect-wizard-user-interaction-dialog;
            }
            .tabNormal
            {
                fill:#DDDDDD;
                @apply --ft-connect-wizard-tab-normal;
            }
            .tabSelected
            {
                fill:#6B81AC;
                @apply --ft-connect-wizard-tab-selected;
            }
        </style>

        <!-- Header -->
        <div class="layout horizontal center" style="height:50px; background-color: #DDD; padding-right: 10px; ">
            <!-- Tabs -->
            <ft-wizard-tab-bar id="tabBar" items="[[_tabs]]" class="flex" style="height:50px; " selected="{{selectedPanelName}}">
            </ft-wizard-tab-bar>

            <!-- Cancel button -->
            <paper-button raised="" id="cancelButton" hidden\$="[[!showCancelButton]]" on-tap="_onCancelButtonClicked">
                Cancel
            </paper-button>

            <!--&lt;!&ndash; Navigation buttons &ndash;&gt;-->
            <!--<paper-icon-button-->
                <!--on-tap="_onBackButtonTapped"-->
                <!--icon="arrow-back"-->
                <!--alt="back"-->
                <!--title="back"-->
            <!--&gt;-->
            <!--</paper-icon-button>-->
            <!--<paper-icon-button-->
                <!--on-tap="_onNextButtonTapped"-->
                <!--icon="arrow-forward"-->
                <!--alt="next"-->
                <!--title="next"-->
            <!--&gt;-->
            <!--</paper-icon-button>-->
        </div>

        <!-- Instructions -->
        <!--<div class="layout horizontal center">-->

            <!--<div-->
                <!--class="flex"-->
                <!--style="border:1px solid #DDD; margin:20px; background-color: white; "-->
            <!--&gt;-->
                <!--[[_instructions]]-->
            <!--</div>-->

        <!--</div>-->

        <!-- Panels -->
        <iron-pages id="panels" class="flex layout vertical" attr-for-selected="name" selected="[[selectedPanelName]]">
            <!-- Source panel -->
            <ft-source-panel id="sourcesPanel" name="sources" class="flex" selected-filter-id="{{selectedFilterId}}" sources="[[sources]]" ft-source-panel-filters="{{ftSourcePanelFilters}}" ft-source-panel-show-filters="{{ftSourcePanelShowFilters}}" ft-source-panel-heading="{{ftSourcePanelHeading}}" ft-source-panel-show-heading="{{ftSourcePanelShowHeading}}" ft-source-panel-show-search-field="{{ftSourcePanelShowSearchField}}" ft-source-grid-item-show-identify-button="{{ftSourceGridItemShowIdentifyButton}}">
            </ft-source-panel>

            <!-- Connection panel or prompt -->
            <div name="connections" id="connectionPanelOrPrompt" class="flex layout horizontal">
                <!-- Connection panel -->
                <ft-connection-panel id="connectionsPanel" hidden\$="[[_showConnectionPrompt]]" class="flex" connections="[[connections]]" sources="[[sources]]" ft-connection-panel-show-heading="{{ftConnectionPanelShowHeading}}" ft-connection-panel-heading="{{ftConnectionPanelHeading}}" ft-connection-panel-show-delete-button="{{ftConnectionPanelShowDeleteButton}}" ft-connection-list-item-allow-manual-fetch="{{ftConnectionListItemAllowManualFetch}}" ft-connection-list-item-show-document-count="{{ftConnectionListItemShowDocumentCount}}">
                </ft-connection-panel>

                <!-- Prompt user to create connections -->
                <div id="connectionPrompt" hidden\$="[[!_showConnectionPrompt]]" class="flex layout vertical center">
                    <ft-prompt-with-button style="max-width:550px; margin:30px; " prompt="Once you've created connections to your sites, they will appear here." button-label="Connect Site" command="wizard-add-connection-command">
                    </ft-prompt-with-button>
                </div>
            </div>

            <!-- Document panel or prompt -->
            <div id="documentPanelOrPrompt" hidden\$="[[!showDocumentsPanel]]" name="documents" class="flex layout horizontal">
                <!-- Document panel -->
                <ft-document-panel id="documentsPanel" hidden\$="[[_showDocumentPrompt]]" class="flex" documents="[[documents]]" ft-document-panel-show-heading="{{ftDocumentPanelShowHeading}}" ft-document-panel-heading="{{ftDocumentPanelHeading}}" ft-document-panel-show-grid-button="{{ftDocumentPanelShowGridButton}}" ft-document-panel-show-list-button="{{ftDocumentPanelShowListButton}}" ft-document-panel-show-preview-button="{{ftDocumentPanelShowPreviewButton}}" ft-document-panel-show-upload-button="{{ftDocumentPanelShowUploadButton}}" ft-document-panel-show-download-button="{{ftDocumentPanelShowDownloadButton}}" ft-document-panel-show-delete-button="{{ftDocumentPanelShowDeleteButton}}" ft-document-panel-show-document-count="{{ftDocumentPanelShowDocumentCount}}">
                </ft-document-panel>

                <!-- Prompt user to create connections -->
                <div id="documentPrompt" hidden\$="[[!_showDocumentPrompt]]" class="flex layout vertical center">
                    <ft-prompt-with-button style="max-width:550px; margin:30px; " prompt="Once you've created connections to your sites, and we have fetched documents from them, they will appear here." button-label="Connect Site" command="wizard-add-connection-command">
                    </ft-prompt-with-button>
                </div>
            </div>

            <!-- Finish panel -->
            <ft-wizard-finish-panel id="finishPanel" name="finish" class="flex" connections="[[connections]]" documents="[[documents]]">
            </ft-wizard-finish-panel>

        </iron-pages>

        <!-- User interaction dialog -->
        <paper-dialog modal="" id="modalInteractionDialog">
            <ft-user-interaction-form id="interactionForm" version="[[interactionVersion]]" request="[[_interactionRequest]]" response="{{_interactionResponse}}" on-submit-response-command="_onSubmitInteractionResponseCommand" on-button-clicked="_onInteractionFormButtonClicked" style="background:white; border: 1px solid #DDD;">
            </ft-user-interaction-form>

        </paper-dialog>

        <!-- Uploader -->
        <input id="uploader" hidden="" type="file" on-change="_onUploaderFilesChanged" multiple="true" accept="[[_uploadableFileTypes]]">

        <!-- Downloader -->
        <a id="downloader" hidden="" href\$="[[_downloadUrl]]" download\$="[[_downloadFilename]]">
        </a>

        <!-- Confirmation dialog -->
        <ft-confirmation-dialog id="confirmationDialog"></ft-confirmation-dialog>

        <!-- Source identifier dialog -->
        <ft-source-identifier id="sourceIdentifier">
        </ft-source-identifier>
`,

  is: 'ft-connect-wizard',

  /**
   * Fired when the "Cancel" button is clicked.
   *
   * @event wizard-canceled-command
   */

  /**
   * Fired when the "Done" button is clicked on the final page.
   *
   * @event wizard-done-command
   */

  behaviors: [
      FileThis.ErrorBehavior,
      FileThis.HttpBehavior, // TODO: Why do we have to include these when ConnectBehavior aready does?
      FileThis.ConnectBehavior,
      FileThis.ConnectionPanelSettingsBehavior,
      FileThis.ConnectWizardSettingsBehavior,
      FileThis.ConnectionListItemSettingsBehavior,
      FileThis.DocumentPanelSettingsBehavior,
      FileThis.SourceGridItemSettingsBehavior,
      FileThis.SourcePanelSettingsBehavior,
  ],

  listeners:
  {
      'create-connection-command': '_onCreateConnectionCommand',
      'wizard-add-connection-command': '_onWizardAddConnectionCommand',
      'wizard-view-connections-command': '_onWizardViewConnectionsCommand',
      'identify-source-command': '_onIdentifySourceCommand',
  },

  observers:[
      '_onWizardConnectionsChanged(connections)',
      '_onWizardConnectionsChanged(connections.splices)',
      '_onWizardConnectionsChanged(connections.*)',
      '_onWizardDocumentsChanged(documents)',
      '_onWizardDocumentsChanged(documents.splices)',
  ],

  properties: {

      /**
       * Show a "Cancel" button in the navigation bar.
       *
       * Note that you can provide the strings "true" and "false" as attribute values .
       *
       * @type {boolean}
       */
      showCancelButton:
      {
          type: Object,
          value: true
      },

      /**
       * Show the "Documents" panel, or not.
       *
       * Note that you can provide the strings "true" and "false" as attribute values .
       *
       * @type {boolean}
       */
      showDocumentsPanel:
      {
          type: Object,
          value: true,
      },

      /** Name of the selected panel. One of: "sources", "connections", "documents", or "finish". */
      selectedPanelName:
      {
          type: String,
          notify: true,
          value: "sources",
          observer: "_onSelectedPanelNameChanged"
      },

      _instructions:
      {
          type: String,
          notify: true,
          value: "Instructions"
      },

      _showConnectionPrompt:
      {
          type: Boolean,
          value: false
      },

      _showDocumentPrompt:
      {
          type: Boolean,
          value: false
      },

      _tabs:
          {
              type: Array,
              notify: true,
          },

      _tabsWithDocuments:
          {
              type: Array,
              value: [
                  {
                      "id": "stepSources",
                      "name": "sources",
                      "heading": "Step 1",
                      "subheading": "Sites"
                  },
                  {
                      "id": "stepConnections",
                      "name": "connections",
                      "heading": "Step 2",
                      "subheading": "Connections"
                  },
                  {
                      "id": "stepDocuments",
                      "name": "documents",
                      "heading": "Step 3",
                      "subheading": "Documents"
                  },
                  {
                      "id": "stepFinish",
                      "name": "finish",
                      "heading": "Step 4",
                      "subheading": "Finish"
                  }
              ]
          },

      _tabsWithoutDocuments:
          {
              type: Array,
              value: [
                  {
                      "id": "stepSources",
                      "name": "sources",
                      "heading": "Step 1",
                      "subheading": "Sites"
                  },
                  {
                      "id": "stepConnections",
                      "name": "connections",
                      "heading": "Step 2",
                      "subheading": "Connections"
                  },
                  {
                      "id": "stepFinish",
                      "name": "finish",
                      "heading": "Step 3",
                      "subheading": "Finish"
                  }
              ]
          },
  },

  ready: function()
  {
      if (this.showDocumentsPanel)
          this._tabs = this._tabsWithDocuments;
      else
          this._tabs = this._tabsWithoutDocuments;

      this.addEventListener('ft-connect-wizard-show-documents-panel-changed-in-behavior', this._onFtConnectWizardShowDocumentsPanelChangedInBehavior);
      this.addEventListener('ft-connect-wizard-show-document-count-badge-changed-in-behavior', this._onFtConnectWizardShowDocumentCountBadgeChangedInBehavior);
  },

  _onFtConnectWizardShowDocumentsPanelChangedInBehavior: function(event)
  {
      var showDocumentsPanel = event.detail.to;

      // Show or hide the panel and adjust the selection
      var oldSelectedPanelName = this.selectedPanelName;
      var newSelectedPanelName = oldSelectedPanelName;
      this.selectedPanelName = null;
      if (showDocumentsPanel)
      {
          this._tabs = this._tabsWithDocuments;
      }
      else // hide "Documents" panel
      {
          this._tabs = this._tabsWithoutDocuments;
          switch (oldSelectedPanelName)
          {
              case "documents":
                  newSelectedPanelName = "finish";
                  break;
          }
      }
      this.async(function()
      {
          this.selectedPanelName = newSelectedPanelName;

          // HACK: Don't know why we have to do this...
          var finishTab = this._findTabWithId("stepFinish");
          if (finishTab)
              finishTab.showBadge = false;
          var documentsTab = this._findTabWithId("stepDocuments");
          if (documentsTab)
              documentsTab.showBadge = this.ftConnectWizardShowDocumentCountBadge;
      });

      // TODO: Suppress the retrieval of thumbnails to save time?
  },

  _onFtConnectWizardShowDocumentCountBadgeChangedInBehavior: function(event)
  {
      var showBadge = event.detail.to;

      var tab = this._findTabWithId("stepDocuments");
      if (!tab)
          return;

      tab.showBadge = showBadge;
  },

  _onIdentifySourceCommand: function(event)
  {
      var source = event.detail;
      this.$.sourceIdentifier.pose(this.server, source);
  },

  _onAddConnectionButtonClicked: function()
  {
      this.fire('wizard-add-connection-command');
  },

  _onWizardConnectionsChanged: function()
  {
      var tab = this._findTabWithId("stepConnections");
      if (!tab)
          return;

      var showConnectionPrompt = false;
      var showSpinner = false;
      var showBadge = false;
      var badgeLabel = "";
      var badgePulsate = false;

      var connectionCount = this.connections.length;

      var noConnectionsYet = (connectionCount === 0);
      if (noConnectionsYet)
      {
          showConnectionPrompt = true;
      }
      else if (this.someConnectionStillRunning())
      {
          showSpinner = true;
      }
      else if (this.someConnectionHasPendingInteraction())
      {
          showBadge = true;
          badgeLabel = "?";
          badgePulsate = true;
      }
      else if (connectionCount > 0)
      {
          showBadge = true;
          badgeLabel = connectionCount.toString();
      }

      this._showConnectionPrompt = showConnectionPrompt;

      tab.showSpinner = showSpinner;
      tab.showBadge = showBadge;
      tab.badgeLabel = badgeLabel;
      tab.badgePulsate = badgePulsate;
  },

  _onWizardDocumentsChanged: function()
  {
      var tab = this._findTabWithId("stepDocuments");
      if (!tab)
          return;

      var showDocumentPrompt = false;
      var showBadge = false;
      var badgeLabel = "";
      var badgeFlashOnLabelChange = false;

      var documentCount = this.documents.length;

      var noDocumentsYet = (documentCount === 0);
      if (noDocumentsYet)
      {
          showDocumentPrompt = true;
      }
      else
      {
          showBadge = true;
          badgeFlashOnLabelChange = true;
          badgeLabel = documentCount.toString();
      }

      if (!this.ftConnectWizardShowDocumentCountBadge)
          showBadge = false;

      this._showDocumentPrompt = showDocumentPrompt;

      tab.showBadge = showBadge;
      tab.badgeLabel = badgeLabel;
      tab.badgeFlashOnLabelChange = badgeFlashOnLabelChange;
  },

  _findTabWithId: function(id)
  {
      return this.$.tabBar.findTabWithId(id);
  },

  _onCancelButtonClicked: function()
  {
      this.fire('wizard-canceled-command');
  },

  _onWizardAddConnectionCommand: function()
  {
      this.selectedPanelName = "sources";
  },

  _onWizardViewConnectionsCommand: function()
  {
      this.selectedPanelName = "connections";
  },

  _onSelectedPanelNameChanged: function(to, from)
  {
      this._instructions = this._getInstructions();

      // TODO: Temporary hack until we get the model updates working
      if (to === "finish")
          this.$.finishPanel.wasShown();
  },

  _getInstructions: function()
  {
      switch (this.selectedPanelName)
      {
          case "sources":
              return this._getInstructionsForSourcePanel();
          case "connections":
              return this._getInstructionsForConnectionPanel();
          case "documents":
              return this._getInstructionsForDocumentPanel();
          case "finish":
              return this._getInstructionsForFinishPanel();
          default:
              return "";
      }
  },

  _getInstructionsForSourcePanel: function()
  {
      return "Click on a source to connect to it.";
  },

  _getInstructionsForConnectionPanel: function()
  {
      return "Observe that you have connections.";
  },

  _getInstructionsForDocumentPanel: function()
  {
      return "Observe that you have documents.";
  },

  _getInstructionsForFinishPanel: function()
  {
  },

  // User action event handling --------------------------------------------------------------------------

  _onInteractionFormButtonClicked: function(event)
  {
      var detail = event.detail;
      if (detail.action === "defer")
          this.$.modalInteractionDialog.close();
  },

  _onSubmitInteractionResponseCommand: function(event)
  {
      var interactionRequest = this._interactionRequest;
      var interactionResponse = this._interactionResponse;

      var connectionId = interactionRequest.connectionId;
      var interactionId = interactionRequest.id;
      var url = this.server + this.apiPath +
          "/accounts/" + this.account.id +
          "/connections/" + connectionId +
          "/interactions/" + interactionId +
          "/response";
      var options = this._buildHttpOptions();

      return this.httpPut(url, interactionResponse, options)
          .then(function()
          {
              this.$.modalInteractionDialog.close();
          }.bind(this))
          .catch(function(reason)
          {
              this._handleError(reason);
              this.$.modalInteractionDialog.close();
          }.bind(this));
  },

  _onBackButtonTapped: function(event)
  {
      this.$.tabBar.selectPrevious();
  },

  _onNextButtonTapped: function(event)
  {
      this.$.tabBar.selectNext();
  },

  //            _onSubmitInteractionResponseNew: function(event)
  //            {
  //                var interactionRequest = this._interactionRequest;
  //                var interactionResponse = this._interactionResponse;
  //
  //                var connectionId = interactionRequest.connectionId;
  //                var interactionId = interactionRequest.id;
  //                var url = this.server + this.apiPath +
  //                    "/accounts/" + this.account.id +
  //                    "/connections/" + connectionId +
  //                    "/interactions/" + interactionId +
  //                    "/response";
  //            var options = this._buildHttpOptions();
  //
  //                return this.httpPost(url, interactionResponse, options)
  //                    .then(function()
  //                    {
  //                        this.$.modalInteractionDialog.close();
  //                    }.bind(this))
  //                    .catch(function(reason)
  //                    {
  //                        this._handleError(reason);
  //                        this.$.modalInteractionDialog.close();
  //                    }.bind(this));
  //            },

  _onCreateConnectionCommand: function(event)
  {
      this.selectedPanelName = "connections";
  },

  pageCode:
      "<!doctype html>\n" +
      "<html lang=\"en\">\n" +
      "\n" +
      "<head>\n" +
      "    <meta charset=\"utf-8\">\n" +
      "    <meta name=\"viewport\" content=\"width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes\">\n" +
      "\n" +
      "    <script type=\"module\" src=\"https://connect.filethis.com/ft-connect-wizard/{{RELEASE_VERSION}}/ft-connect-wizard.js\"></script>\n" +
      "</head>\n" +
      "\n" +
      "<body>\n" +
      "\n" +
      "    <script type=\"module\">\n" +
      "        import { PolymerElement, html } from 'https://connect.filethis.com/ft-connect-wizard/{{RELEASE_VERSION}}/node_modules/@polymer/polymer/polymer-element.js';\n" +
      "\n" +
      "        // Wrap wizard with parent element that lets us customize it\n" +
      "        class CustomizedWizard extends PolymerElement {\n" +
      "            static get template() {\n" +
      "                return html`\n" +
      "                    <style>\n" +
      "                        /* Styling for this component itself */\n" +
      "                        :host {\n" +
      "                            display: block;\n" +
      "                        }\n" +
      "\n" +
      "                        /* Style configuration for its sub-components */\n" +
      "                        :root {\n" +
      "{{STYLING}}" +
      "                        }\n" +
      "                    </style>\n" +
      "\n" +
      "                    <!-- Settings configuration for sub-components -->\n" +
      "{{SETTINGS_ELEMENTS}}" +
      "\n" +
      "                    <ft-connect-wizard\n" +
      "                        style=\"width: 100%; height: 100%; \"\n" +
      "                        live=\"[[live]]\"\n" +
      "                        user-account-id=\"[[userAccountId]]\"\n" +
      "                        token=\"[[token]]\"\n" +
      "                        debug=\"[[debug]]\"\n" +
      "                        >\n" +
      "                    </ft-connect-wizard>\n" +
      "                `;\n" +
      "            }\n" +
      "\n" +
      "            static get properties() {\n" +
      "                return {\n" +
      "                    live: { type: Object, value: true },\n" +
      "                    userAccountId: { type: String },\n" +
      "                    token: { type: String },\n" +
      "                    debug: { type: Object, value: false },\n" +
      "                    fakeSources: { type: Object, value: false }\n" +
      "                };\n" +
      "            }\n" +
      "\n" +
      "            ready() {\n" +
      "                super.ready();\n" +
      "                var wizard = document.getElementById(\"wizard\");\n" +
      "                wizard.addEventListener('ft-connect-error', this.onWizardError);\n" +
      "                wizard.addEventListener('wizard-canceled-command', this.onWizardCanceledCommand);\n" +
      "                wizard.addEventListener('wizard-done-command', this.onWizardDoneCommand);\n" +
      "            }\n" +
      "\n" +
      "            onWizardError(event) { alert(this.getErrorMessage(event)); }\n" +
      "\n" +
      "            onWizardCanceledCommand(event) { alert(\"Wizard canceled\"); }\n" +
      "            \n" +
      "            onWizardDoneCommand(event) { alert(\"Wizard done\"); }\n" +
      "            \n" +
      "            getErrorMessage(event) {\n" +
      "                if (!event.detail) return \"Wizard error\";\n" +
      "                if (event.detail.message) return event.detail.message;\n" +
      "                if (!event.detail.response) return \"Wizard error\";\n" +
      "                if (event.detail.response.message) return event.detail.response.message; return \"Wizard error\";\n" +
      "            }\n" +
      "        }\n" +
      "        \n" +
      "        window.customElements.define('customized-wizard', CustomizedWizard);\n" +
      "    </script>\n" +
      "\n" +
      "    <!-- Customized wizard instance -->\n" +
      "    <customized-wizard\n" +
      "        id=\"wizard\" \n" +
      "        style=\"width: 800px; height: 500px; margin: 20px; border: 1px solid black; box-shadow: 5px 5px 4px #BBB; \"\n" +
      "        user-account-id=\"{{ACCOUNT_ID}}\"\n" +
      "        token=\"{{TOKEN}}\"\n" +
      "        live=\"true\"\n" +
      "    >\n" +
      "    </customized-wizard>\n" +
      "\n" +
      "</body>\n" +
      "\n" +
      "</html>",

  getPageCodeTemplate: function(isDropIn, hasSettingsImports, hasSettingsElements)
  {
      var code = this.pageCode;

      return code;
  }
});
