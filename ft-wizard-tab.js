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
`<ft-wizard-tab>`

An element that implements an arrow-shaped tab for a tab bar.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
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
                position:relative;
                cursor:pointer;
                @apply --ft-wizard-tab;
            }

            .pulsate {
                animation-name: pulsate;
                animation-duration: 0.5s;
                animation-iteration-count: infinite;
                animation-timing-function: ease-in;
                animation-direction: alternate;
                @apply --ft-wizard-tab-pulsate;
            }

            @keyframes pulsate {
                from { r:40px; }
                to { r:50px; }
            }

        </style>

        <!-- Background body -->
        <svg viewBox="0 0 100 100" style="position:absolute; z-index:1; width: 100%; height: 100%; " preserveAspectRatio="none" on-tap="_onTabBodyTapped">
            <polygon style="fill:[[_bodyFill]]; " points="0,0 80,0 100,50 80,100 0,100 0,0">
            </polygon>
        </svg>

        <!-- Background tail -->
        <svg viewBox="0 0 100 100" style="
                position:absolute;
                z-index:2;
                width: 100%; height: 100%;
                " preserveAspectRatio="none" on-click="_onTabTailClicked">
            <polygon id="main" style="fill:[[_nextTailFill]]; " points="80,0 100,0 100,100 80,100 100,50 80,0">
            </polygon>
            <path id="divider" fill="transparent" style="stroke:white; stroke-width:2; " d="M 80 0  L 100 50  L 80 100">
            </path>
        </svg>

        <!-- Label -->
        <div id="mainDiv" style="position:absolute; z-index:3; left:0px; right:20px; height: 100%; " class="layout vertical center center-justified" on-tap="_onTabBodyTapped">
            <div class="layout vertical">
                <!-- Heading -->
                <iron-label id="heading" style="font-family:Arial; font-size: 12pt;  ">
                    [[heading]]
                </iron-label>

                <!-- Subheading -->
                <iron-label id="subheading" style="font-family:Arial; font-size: 9pt; margin-top: 1px; ">
                    [[subheading]]
                </iron-label>
            </div>
        </div>

        <!-- Spinner -->
        <paper-spinner-lite id="spinner" active="[[showSpinner]]" hidden\$="[[!showSpinner]]" style="position:absolute; z-index:4; width: 17px; height: 17px; right:14px; top:16px; --paper-spinner-stroke-width:2px; " on-tap="_onTabBodyTapped">
        </paper-spinner-lite>

        <!-- Badge Background -->
        <svg id="badge" hidden\$="[[!showBadge]]" viewBox="0 0 100 100" style="position:absolute; z-index:5; width: 25px; height: 25px; right:13px; top:13px; " preserveAspectRatio="none" on-tap="_onTabBodyTapped">
            <circle id="badgeCircle" cx="50" cy="50" r="40" stroke="none" fill="#AAA"></circle>
        </svg>

        <!-- Badge Label -->
        <iron-label id="badgeLabel" hidden\$="[[!showBadge]]" style="position:absolute; z-index:6; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; width: 25px; height: 25px; right:13px; top:13px; text-align:center; margin-top: 6px; " on-tap="_onTabBodyTapped">
            [[badgeLabel]]
        </iron-label>
`,

  is: 'ft-wizard-tab',

  properties: {

      isFirst:
      {
          type: Boolean,
          value: false
      },

      name:
      {
          type: String
      },

      heading:
      {
          type: String
      },

      subheading:
      {
          type: String
      },

      showSpinner:
      {
          type: Object,
          value: false,
      },

      showBadge:
      {
          type: Object,
          value: false,
      },

      badgeLabel:
      {
          type: String,
          value: "?",
          observer: "_onBadgeLabelChanged"
      },

      badgeIcon:
      {
          type: String,
          value: ""
      },

      badgePulsate:
      {
          type: Object,
          value: false,
          observer: "_onBadgePulsateChanged"
      },

      badgeFlashOnLabelChange:
      {
          type: Object,
          value: true,
      },

      selected:
      {
          type: Object,
          value: false,
          observer: "_onSelectedChanged"
      },

      nextSelected:
      {
          type: Object,
          value: false,
          observer: "_onNextSelectedChanged"
      },

      _bodyFill:
      {
          type: String
      },

      _nextTailFill:
      {
          type: String
      },

  },

  _onTabBodyTapped: function(event)
  {
      this.fire('wizard-tab-body-clicked', this.name);
  },

  _onTabTailClicked: function(event)
  {
      switch (event.target.id)
      {
          case "main":
              this.fire('wizard-tab-tail-clicked', this.name);
              break;

          case "divider":
          default:
              this.fire('wizard-tab-body-clicked', this.name);
              break;
      }
  },

  _onBadgeLabelChanged: function()
  {
      if (!this.showBadge)
          return;
      if (!this.badgeFlashOnLabelChange)
          return;
      if (!this.badgeLabel)
          return;

      // TODO: Add one-shot animation here
  },

  _onBadgePulsateChanged: function(to, from)
  {
      var circle = this.$.badgeCircle;
      if (to) // pulsate
      {
          if (!circle.classList.contains('pulsate'))
              circle.classList.add("pulsate");
      }
      else // don't pulsate
      {
          if (circle.classList.contains('pulsate'))
              circle.classList.remove("pulsate");
      }
  },

  _onSelectedChanged: function(to, from)
  {
      if (to)  // selected
      {
          this._bodyFill = "#6B81AC";
          this.$.heading.style.color = "white";
          this.$.subheading.style.color = "white";

          // Set badge styles
//                    this.$.badge.updateStyles({
//                        '--paper-badge-background': "#AAA",
//                        '--paper-badge-text-color': "black"
//                    });

          // Set spinner styles
          this.$.spinner.updateStyles({
              '--paper-spinner-color': "#DDD"
          });
      }
      else  // unselected
      {
          this._bodyFill = "#DDDDDD";
          this.$.heading.style.color = "black";
          this.$.subheading.style.color = "black";

          // Set badge styles
//                    this.$.badge.updateStyles({
//                        '--paper-badge-background': "#AAA",
//                        '--paper-badge-text-color': "black"
//                    });

          // Set spinner styles
          this.$.spinner.updateStyles({
              '--paper-spinner-color': "#AAA"
          });
      }
  },

  _onNextSelectedChanged: function(to, from)
  {
      if (to)
          this._nextTailFill = "#6B81AC";
      else
          this._nextTailFill = "#DDDDDD";
  }
});
