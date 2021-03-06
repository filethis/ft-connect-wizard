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
`<ft-wizard-finish-panel>`

This element displays a finish of where the user stands in the process of completing the ft-connect-wizard workflow.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-label/iron-label.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import './ft-prompt-with-button.js';
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
                @apply --layout-center;
                @apply --ft-wizard-finish-panel;
            }
            #doneButton {
                width: 90px; height: 32px;
                font-size: 14px;
                background-color: white;
                text-transform: none;
                border: 1px solid #DDD;
                @apply --ft-wizard-finish-panel-button;
            }
        </style>

        <div class="layout vertical" style="
                max-width:550px;
                margin:30px;
            ">
            <!-- Instructions for no connections -->
            <ft-prompt-with-button style="margin-bottom:20px; " hidden\$="[[!_showInstructionsNoConnections]]" prompt="[[instructionsNoConnections]]" button-label="Connect Site" command="wizard-add-connection-command">
            </ft-prompt-with-button>

            <!-- Instructions for connections still running -->
            <ft-prompt-with-button style="margin-bottom:20px; " hidden\$="[[!_showInstructionsConnectionsRunning]]" prompt="[[instructionsConnectionsRunning]]" button-label="Show Connections" command="wizard-view-connections-command">
            </ft-prompt-with-button>

            <!-- Instructions for pending interactions -->
            <ft-prompt-with-button style="margin-bottom:20px; " hidden\$="[[!_showInstructionsPendingInteractions]]" prompt="[[instructionsPendingInteractions]]" button-label="Show Connections" command="wizard-view-connections-command">
            </ft-prompt-with-button>

            <!-- Instructions for adding more connections -->
            <ft-prompt-with-button style="margin-bottom:20px; " hidden\$="[[!_showInstructionsAddMoreConnections]]" prompt="[[instructionsAddMoreConnections]]" button-label="Connect Site" command="wizard-add-connection-command">
            </ft-prompt-with-button>

            <!-- Done -->
            <div class="layout horizontal center">

                <!-- Spacer -->
                <div class="flex"></div>

                <!-- Done button -->
                <paper-button id="doneButton" raised="" hidden\$="[[!showDoneButton]]" on-tap="_onDoneButtonClicked">
                    Done
                </paper-button>
            </div>

        </div>
`,

  is: 'ft-wizard-finish-panel',

  //            observers: [
  //                '_onSituationChanged(connections, documents)'
  //            ],

  properties: {

      connections:
      {
          type: Array,
          value: []
      },

      documents:
      {
          type: Array,
          value: []
      },

      /**
       * Show a "Done" button.
       *
       * Note that you can provide the strings "true" and "false" as attribute values .
       *
       * @type {boolean}
       */
      showDoneButton:
      {
          type: Object,
          value: true
      },

      instructionsNoConnections:
      {
          type: String
      },
      _showInstructionsNoConnections:
      {
          type: Boolean,
          value: false
      },

      instructionsConnectionsRunning:
      {
          type: String
      },
      _showInstructionsConnectionsRunning:
      {
          type: Boolean,
          value: false
      },

      instructionsPendingInteractions:
      {
          type: String
      },
      _showInstructionsPendingInteractions:
      {
          type: Boolean,
          value: false
      },

      instructionsAddMoreConnections:
      {
          type: String
      },
      _showInstructionsAddMoreConnections:
      {
          type: Boolean,
          value: false
      },
  },

  ready: function()
  {
      // TODO: Is this the best place for this?

      this.instructionsNoConnections =
          "Please connect to a site to collect your documents.";
      this.instructionsConnectionsRunning =
          "One or more of your connections is still running.";
      this.instructionsPendingInteractions =
          "One or more of your connections needs your help to complete.";
      this.instructionsAddMoreConnections =
          "Would you like to add more connections?";
  },

  _onDoneButtonClicked: function()
  {
      this.fire('wizard-done-command');
  },

  //            _onSituationChanged: function()
  //            {
  //                this._updateInstructions();
  //            },

  // TODO: Temporary hack until we get the model updates working
  wasShown: function()
  {
      this._updateInstructions();
  },

  _updateInstructions: function()
  {
      var instructions = "";

      if (!this._haveConnections())
      {
          this._showInstructionsNoConnections = true;
          this._showInstructionsAddMoreConnections = false;
          this._showInstructionsConnectionsRunning = false;
          this._showInstructionsPendingInteractions = false;
      }
      else // have at least one connection
      {
          var someConnectionStillRunning = this._someConnectionStillRunning();
          var someConnectionHasPendingInteraction = this._someConnectionHasPendingInteraction();
          this._showInstructionsNoConnections = false;
          this._showInstructionsAddMoreConnections = true;
          this._showInstructionsConnectionsRunning = someConnectionStillRunning && !someConnectionHasPendingInteraction;
          this._showInstructionsPendingInteractions = someConnectionHasPendingInteraction;
      }

      this._instructions = instructions;
  },

  _haveConnections: function()
  {
      return (this.connections.length > 0);
  },

  _someConnectionStillRunning: function()
  {
      var count = this.connections.length;
      for (var index = 0; index < count; index++)
      {
          var connection = this.connections[index];
          if (this._connectionStillRunning(connection))
              return true;
      }
      return false;
  },

  _someConnectionHasPendingInteraction: function()
  {
      var count = this.connections.length;
      for (var index = 0; index < count; index++)
      {
          var connection = this.connections[index];
          if (this._connectionHasPendingInteraction(connection))
              return true;
      }
      return false;
  },

  _connectionStillRunning: function(connection)
  {
      switch (connection.state)
      {
          case "waiting":
          case "error":
          case "question":
              return false;
          default:
              return true;
      }
  },

  _connectionHasPendingInteraction: function(connection)
  {
      return (connection.state === "question");
  }
});
