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
`<ft-wizard-tab-bar>`

An element that implements a tab bar with arrow-shaped tabs.

@demo
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import './ft-wizard-tab.js';

import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/polymer/polymer-legacy.js';
import '@webcomponents/shadycss/entrypoints/apply-shim.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-positioning"></style>

        <style>
            :host {
                display: block;
                overflow: hidden;
                background-color: #DDDDDD;
                @apply --layout-horizontal;
                @apply --ft-wizard-tab-bar;
            }
        </style>

        <div id="base" class="layout horizontal">
            <template is="dom-repeat" items="[[items]]" as="item">

                <ft-wizard-tab id="[[item.id]]" name="[[item.name]]" style="width:120px; " heading="[[item.heading]]" subheading="[[item.subheading]]">
                </ft-wizard-tab>

            </template>
        </div>
`,

  is: 'ft-wizard-tab-bar',

  listeners:
  {
      'wizard-tab-body-clicked': '_onTabBodyClicked',
      'wizard-tab-tail-clicked': '_onTabTailClicked'
  },

  properties: {

      selected:
      {
          type: String,
          notify: true,
          observer: "_onSelectedChanged",
      },

      items:
      {
          type: Array,
          notify: true,
          value: [],
      }
  },

  attached: function()
  {
      setTimeout(function()
      {
          // Make sure the tab is selected.
          // It may not be, if the items list was not defined when the selection was initialized.
          var selected = this.selected;
          if (!!selected)
              this._selectTab(selected);
      }.bind(this), 1);
      // this.async(function()
      // {
      //     // Make sure the tab is selected.
      //     // It may not be, if the items list was not defined when the selection was initialized.
      //     var selected = this.selected;
      //     if (!!selected)
      //         this._selectTab(selected);
      // });
  },

  findTabWithId: function(id)
  {
      var tab = this.$$("#" + id);
      return tab;
  },

  _onTabBodyClicked: function(event)
  {
      var tabName = event.detail;
      this.selected = tabName;
  },

  _onTabTailClicked: function(event)
  {
      var tabName = event.detail;
      var nextTab = this._getNextTab(tabName);
      if (!nextTab)
          return;
      this.selected = nextTab.name;
  },

  _onSelectedChanged: function(toName, fromName)
  {
      // Don't do anything until both the items list and the selected item are defined
      if (!this.selected || !this.items)
          return;

      if (fromName)
          this._deselectTab(fromName);
      if (toName)
          this._selectTab(toName);
  },

  _selectTab: function(name)
  {
      // Select this tab
      var tab = this._findTabWithName(name);
      if (!!tab)
          tab.selected = true;

      // Select the tail in the tab before this one
      var previousTab = this._getPreviousTab(name);
      if (!!previousTab)
          previousTab.nextSelected = true;
  },

  _deselectTab: function(name)
  {
      // Deselect this tab
      var tab = this._findTabWithName(name);
      if (!!tab)
          tab.selected = false;

      // Deselect the tail in the tab before this one
      var previousTab = this._getPreviousTab(name);
      if (!!previousTab)
          previousTab.nextSelected = false;
  },

  _findTabWithName: function(name)
  {
      var index = this._findIndexOfTabWithName(name);
      if (index === null)
          return null;
      var tab = this._getTabAt(index);
      return tab;
  },

  _findIndexOfTabWithName: function(name)
  {
      // TODO: There must be a better way to do this...
      var base = this.$.base;
      var children = dom(base).querySelectorAll('ft-wizard-tab');
      var count = children.length;
      for (var index = 0;
           index < count;
           index++)
      {
          var child = children[index];
          if (child.name === name)
              return index;
      }
      return null;
  },

  selectPrevious: function()
  {
      var previousTab = this._getPreviousTab(this.selected);
      if (!previousTab)
          return;
      this.selected = previousTab.name;
  },

  selectNext: function()
  {
      var nextTab = this._getNextTab(this.selected);
      if (!nextTab)
          return;
      this.selected = nextTab.name;
  },

  _getNextTab: function(name)
  {
      var index = this._findIndexOfTabWithName(name);
      if (index === null)
          return null;
      var items = this.items;
      var lastIndex = items.length - 1;
      var nextTabIndex = index + 1;
      if (nextTabIndex > lastIndex)
          return null;
      var nextTab = this._getTabAt(nextTabIndex);
      return nextTab;
  },

  _getPreviousTab: function(name)
  {
      var index = this._findIndexOfTabWithName(name);
      if (index === null)
          return null;
      var previousTabIndex = index - 1;
      if (previousTabIndex < 0)
          return null;
      var previousTab = this._getTabAt(previousTabIndex);
      return previousTab;
  },

  _getTabAt: function(index)
  {
      var base = this.$.base;
      var children = dom(base).querySelectorAll('ft-wizard-tab');
      return children[index];
  }
});
